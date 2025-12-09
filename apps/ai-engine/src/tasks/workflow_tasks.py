"""
AI workflow tasks for SupplyGraph procurement automation using Valkey
"""
import asyncio
import json
import time
import logging
from typing import Dict, Any, List, Optional, Union
from datetime import datetime, timedelta

from ..celery_config import workflow_task
from ..utils.valkey_manager import get_state_redis
from ..utils.state_manager import RedisCheckpointSaver, ConcurrentWorkflowManager
from ..workflows.procurement import ProcurementWorkflow

logger = logging.getLogger(__name__)

@workflow_task
async def execute_workflow_step(self, thread_id: str, step_data: Dict[str, Any]):
    """
    Execute a single step in the AI procurement workflow
    """
    try:
        state_redis = await get_state_redis()

        # Load current workflow state
        checkpoint_key = f"workflow:state:{thread_id}"
        state_data = await state_redis.hgetall(checkpoint_key)

        if not state_data:
            # Initialize new workflow
            workflow = ProcurementWorkflow(
                openai_api_key=step_data.get('openai_api_key'),
                db_connection_string=step_data.get('db_connection_string')
            )
            current_state = {
                'messages': [],
                'step': 0,
                'status': 'initialized',
                'created_at': datetime.utcnow().isoformat()
            }
        else:
            # Resume existing workflow
            state_json = state_data.get('state', '{}')
            current_state = json.loads(state_json)
            workflow = ProcurementWorkflow(
                openai_api_key=current_state.get('openai_api_key'),
                db_connection_string=current_state.get('db_connection_string')
            )

        # Execute the step
        step_start = time.time()
        result = await workflow.execute_step(
            thread_id=thread_id,
            step_input=step_data.get('input', ''),
            current_state=current_state
        )
        step_duration = time.time() - step_start

        # Update state
        current_state.update({
            'step': current_state.get('step', 0) + 1,
            'status': result.get('status', 'completed'),
            'last_step_result': result,
            'last_step_at': datetime.utcnow().isoformat(),
            'last_step_duration': step_duration,
            'updated_at': datetime.utcnow().isoformat()
        })

        # Save updated state to Valkey
        await state_redis.hset(
            checkpoint_key,
            mapping={
                'state': json.dumps(current_state),
                'thread_id': thread_id,
                'updated_at': datetime.utcnow().isoformat(),
                'step': str(current_state.get('step', 0))
            }
        )

        # Set expiration for workflow state
        await state_redis.expire(checkpoint_key, 3600)  # 1 hour

        logger.info(f"Executed workflow step for thread {thread_id} in {step_duration:.2f}s")

        return {
            'success': True,
            'thread_id': thread_id,
            'step': current_state.get('step'),
            'status': result.get('status'),
            'result': result,
            'step_duration': step_duration
        }

    except Exception as e:
        logger.error(f"Failed to execute workflow step for thread {thread_id}: {e}")
        raise self.retry(exc=e, countdown=60)

@workflow_task
async def process_workflow_event(self, event_data: Dict[str, Any]):
    """
    Process workflow events (pause, resume, cancel, etc.)
    """
    try:
        state_redis = await get_state_redis()

        thread_id = event_data.get('thread_id')
        event_type = event_data.get('event_type')

        if not thread_id or not event_type:
            raise ValueError("Missing thread_id or event_type")

        checkpoint_key = f"workflow:state:{thread_id}"
        state_data = await state_redis.hgetall(checkpoint_key)

        if not state_data:
            raise ValueError(f"No workflow state found for thread {thread_id}")

        current_state = json.loads(state_data.get('state', '{}'))

        # Process event
        result = {'event_type': event_type, 'processed_at': datetime.utcnow().isoformat()}

        if event_type == 'pause':
            current_state['status'] = 'paused'
            current_state['paused_at'] = datetime.utcnow().isoformat()
            result['status'] = 'paused'

        elif event_type == 'resume':
            current_state['status'] = 'running'
            current_state['resumed_at'] = datetime.utcnow().isoformat()
            result['status'] = 'running'

        elif event_type == 'cancel':
            current_state['status'] = 'cancelled'
            current_state['cancelled_at'] = datetime.utcnow().isoformat()
            result['status'] = 'cancelled'

        elif event_type == 'complete':
            current_state['status'] = 'completed'
            current_state['completed_at'] = datetime.utcnow().isoformat()
            result['status'] = 'completed'

        else:
            raise ValueError(f"Unknown event type: {event_type}")

        # Save updated state
        await state_redis.hset(
            checkpoint_key,
            mapping={
                'state': json.dumps(current_state),
                'thread_id': thread_id,
                'updated_at': datetime.utcnow().isoformat(),
                'last_event': json.dumps(result)
            }
        )

        logger.info(f"Processed {event_type} event for workflow thread {thread_id}")

        return {
            'success': True,
            'thread_id': thread_id,
            'event_type': event_type,
            'result': result
        }

    except Exception as e:
        logger.error(f"Failed to process workflow event: {e}")
        raise self.retry(exc=e, countdown=30)

@workflow_task
async def cleanup_expired_workflows(self):
    """
    Cleanup expired workflow states to free Valkey memory
    Runs every 15 minutes
    """
    try:
        state_redis = await get_state_redis()

        # Find all workflow state keys
        workflow_keys = await state_redis.keys("workflow:state:*")
        if not workflow_keys:
            return {'cleaned': 0, 'total': 0}

        cleaned_count = 0
        total_workflows = len(workflow_keys)
        current_time = datetime.utcnow()

        for workflow_key in workflow_keys:
            try:
                state_data = await state_redis.hgetall(workflow_key)
                if not state_data:
                    await state_redis.delete(workflow_key)
                    cleaned_count += 1
                    continue

                # Check last update time
                last_update_str = state_data.get('updated_at')
                if last_update_str:
                    try:
                        last_update = datetime.fromisoformat(last_update_str)
                        # Clean up workflows older than 24 hours
                        if current_time - last_update > timedelta(hours=24):
                            await state_redis.delete(workflow_key)
                            cleaned_count += 1
                    except ValueError:
                        # Invalid timestamp, clean up
                        await state_redis.delete(workflow_key)
                        cleaned_count += 1
                else:
                    # No update time, clean up
                    await state_redis.delete(workflow_key)
                    cleaned_count += 1

            except Exception as e:
                logger.warning(f"Error processing workflow {workflow_key}: {e}")

        logger.info(f"Workflow cleanup: {cleaned_count}/{total_workflows} workflows cleaned")

        return {
            'cleaned': cleaned_count,
            'total': total_workflows,
            'active': total_workflows - cleaned_count
        }

    except Exception as e:
        logger.error(f"Failed to cleanup expired workflows: {e}")
        raise self.retry(exc=e, countdown=300)

@workflow_task
async def generate_workflow_report(self, thread_id: str, report_type: str = 'summary'):
    """
    Generate reports for workflow execution and performance
    """
    try:
        state_redis = await get_state_redis()

        checkpoint_key = f"workflow:state:{thread_id}"
        state_data = await state_redis.hgetall(checkpoint_key)

        if not state_data:
            return {'error': f"No workflow state found for thread {thread_id}"}

        current_state = json.loads(state_data.get('state', '{}'))

        # Generate report based on type
        if report_type == 'summary':
            report = {
                'thread_id': thread_id,
                'status': current_state.get('status', 'unknown'),
                'step_count': current_state.get('step', 0),
                'created_at': current_state.get('created_at'),
                'updated_at': current_state.get('updated_at'),
                'duration': None
            }

            # Calculate duration if available
            if current_state.get('created_at'):
                try:
                    created = datetime.fromisoformat(current_state['created_at'])
                    updated = datetime.fromisoformat(current_state.get('updated_at', current_state['created_at']))
                    report['duration'] = str(updated - created)
                except ValueError:
                    pass

        elif report_type == 'performance':
            report = {
                'thread_id': thread_id,
                'steps': [],
                'total_duration': 0,
                'avg_step_duration': 0,
                'step_count': current_state.get('step', 0)
            }

            # Collect step performance data
            if 'step_history' in current_state:
                for step in current_state['step_history']:
                    if 'duration' in step:
                        report['steps'].append({
                            'step': step.get('step'),
                            'duration': step.get('duration'),
                            'status': step.get('status')
                        })
                        report['total_duration'] += step.get('duration', 0)

                if report['steps']:
                    report['avg_step_duration'] = report['total_duration'] / len(report['steps'])

        elif report_type == 'detailed':
            report = {
                'thread_id': thread_id,
                'full_state': current_state,
                'metadata': {
                    'checkpoint_key': checkpoint_key,
                    'generated_at': datetime.utcnow().isoformat(),
                    'report_type': 'detailed'
                }
            }

        else:
            raise ValueError(f"Unknown report type: {report_type}")

        logger.info(f"Generated {report_type} report for workflow thread {thread_id}")

        return {
            'success': True,
            'thread_id': thread_id,
            'report_type': report_type,
            'report': report
        }

    except Exception as e:
        logger.error(f"Failed to generate workflow report for thread {thread_id}: {e}")
        raise self.retry(exc=e, countdown=60)

@workflow_task
async def validate_workflow_state(self, thread_id: str):
    """
    Validate workflow state consistency and integrity
    """
    try:
        state_redis = await get_state_redis()

        checkpoint_key = f"workflow:state:{thread_id}"
        state_data = await state_redis.hgetall(checkpoint_key)

        if not state_data:
            return {'valid': False, 'error': 'No workflow state found'}

        current_state = json.loads(state_data.get('state', '{}'))
        validation_result = {
            'thread_id': thread_id,
            'valid': True,
            'errors': [],
            'warnings': []
        }

        # Check required fields
        required_fields = ['status', 'step', 'created_at']
        for field in required_fields:
            if field not in current_state:
                validation_result['valid'] = False
                validation_result['errors'].append(f"Missing required field: {field}")

        # Validate status
        valid_statuses = ['initialized', 'running', 'paused', 'completed', 'cancelled', 'error']
        status = current_state.get('status')
        if status not in valid_statuses:
            validation_result['valid'] = False
            validation_result['errors'].append(f"Invalid status: {status}")

        # Validate timestamps
        for timestamp_field in ['created_at', 'updated_at', 'last_step_at']:
            timestamp_value = current_state.get(timestamp_field)
            if timestamp_value:
                try:
                    datetime.fromisoformat(timestamp_value)
                except ValueError:
                    validation_result['valid'] = False
                    validation_result['errors'].append(f"Invalid timestamp format: {timestamp_field}")

        # Check for orphaned workflows (running but no recent updates)
        if status == 'running':
            last_update_str = current_state.get('updated_at')
            if last_update_str:
                try:
                    last_update = datetime.fromisoformat(last_update_str)
                    if datetime.utcnow() - last_update > timedelta(hours=1):
                        validation_result['warnings'].append("Running workflow appears orphaned")
                except ValueError:
                    validation_result['warnings'].append("Cannot determine if workflow is orphaned")

        logger.info(f"Workflow state validation for thread {thread_id}: "
                   f"{'VALID' if validation_result['valid'] else 'INVALID'}")

        return validation_result

    except Exception as e:
        logger.error(f"Failed to validate workflow state for thread {thread_id}: {e}")
        raise self.retry(exc=e, countdown=30)