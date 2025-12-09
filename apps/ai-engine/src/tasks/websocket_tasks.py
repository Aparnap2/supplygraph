"""
Real-time WebSocket tasks for AGUI interactions using Valkey
"""
import asyncio
import json
import time
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from ..celery_config import realtime_task
from ..utils.valkey_manager import get_websocket_redis, get_broadcast_redis
from ..services.websocket_manager_prod import ProductionWebSocketManager

logger = logging.getLogger(__name__)

@realtime_task
async def broadcast_websocket_event(self, event_data: Dict[str, Any]):
    """
    Broadcast real-time event to WebSocket clients
    Optimized for AGUI workloads with Valkey pub/sub
    """
    try:
        # Get Valkey connections optimized for WebSocket
        websocket_redis = await get_websocket_redis()
        broadcast_redis = await get_broadcast_redis()

        # Validate event data
        required_fields = ['event_type', 'thread_id', 'user_id']
        for field in required_fields:
            if field not in event_data:
                raise ValueError(f"Missing required field: {field}")

        # Add timestamp
        event_data['timestamp'] = datetime.utcnow().isoformat()
        event_data['task_id'] = self.request.id

        # Publish to specific thread channel
        channel = f"websocket:thread:{event_data['thread_id']}"
        await broadcast_redis.publish(channel, json.dumps(event_data))

        # Publish to user-specific channel for cross-tab sync
        user_channel = f"websocket:user:{event_data['user_id']}"
        await broadcast_redis.publish(user_channel, json.dumps(event_data))

        # Track event in WebSocket manager connection pool
        await websocket_redis.lpush(
            f"recent_events:{event_data['thread_id']}",
            json.dumps(event_data)
        )
        await websocket_redis.expire(
            f"recent_events:{event_data['thread_id']}",
            300  # Keep 5 minutes of recent events
        )

        logger.info(f"Broadcasted WebSocket event {event_data['event_type']} "
                   f"to thread {event_data['thread_id']}")

        return {
            'success': True,
            'event_type': event_data['event_type'],
            'channels': [channel, user_channel],
            'timestamp': event_data['timestamp']
        }

    except Exception as e:
        logger.error(f"Failed to broadcast WebSocket event: {e}")
        raise self.retry(exc=e, countdown=5)

@realtime_task
async def send_heartbeat_check(self, connection_id: str):
    """
    Send heartbeat check to WebSocket connection
    Ensures connection health for AGUI responsiveness
    """
    try:
        websocket_redis = await get_websocket_redis()

        # Check if connection exists
        connection_key = f"websocket:connection:{connection_id}"
        connection_data = await websocket_redis.hgetall(connection_key)

        if not connection_data:
            logger.warning(f"WebSocket connection {connection_id} not found")
            return {'success': False, 'reason': 'connection_not_found'}

        # Update heartbeat timestamp
        await websocket_redis.hset(
            connection_key,
            'last_heartbeat',
            datetime.utcnow().isoformat()
        )

        # Check if connection is stale (no heartbeat for 2 minutes)
        last_heartbeat_str = connection_data.get('last_heartbeat')
        if last_heartbeat_str:
            try:
                last_heartbeat = datetime.fromisoformat(last_heartbeat_str)
                if datetime.utcnow() - last_heartbeat > timedelta(minutes=2):
                    # Mark as stale for cleanup
                    await websocket_redis.hset(connection_key, 'status', 'stale')
                    logger.info(f"Marked connection {connection_id} as stale")
                    return {'success': True, 'status': 'stale'}
            except ValueError:
                pass  # Invalid timestamp

        return {
            'success': True,
            'connection_id': connection_id,
            'status': connection_data.get('status', 'unknown')
        }

    except Exception as e:
        logger.error(f"Failed to send heartbeat check: {e}")
        raise self.retry(exc=e, countdown=10)

@realtime_task
async def update_connection_state(self, connection_id: str, state_data: Dict[str, Any]):
    """
    Update WebSocket connection state in real-time
    Used for AGUI component state synchronization
    """
    try:
        websocket_redis = await get_websocket_redis()

        # Validate connection exists
        connection_key = f"websocket:connection:{connection_id}"
        exists = await websocket_redis.exists(connection_key)

        if not exists:
            logger.warning(f"Attempting to update state for non-existent connection: {connection_id}")
            return {'success': False, 'reason': 'connection_not_found'}

        # Update connection state
        await websocket_redis.hset(connection_key, 'state_data', json.dumps(state_data))
        await websocket_redis.hset(connection_key, 'last_state_update', datetime.utcnow().isoformat())

        # Broadcast state change to thread if applicable
        if 'thread_id' in state_data:
            state_update = {
                'event_type': 'connection_state_update',
                'connection_id': connection_id,
                'state_data': state_data,
                'timestamp': datetime.utcnow().isoformat()
            }
            channel = f"websocket:thread:{state_data['thread_id']}"
            broadcast_redis = await get_broadcast_redis()
            await broadcast_redis.publish(channel, json.dumps(state_update))

        logger.info(f"Updated state for connection {connection_id}")

        return {
            'success': True,
            'connection_id': connection_id,
            'updated_fields': list(state_data.keys())
        }

    except Exception as e:
        logger.error(f"Failed to update connection state: {e}")
        raise self.retry(exc=e, countdown=5)

@realtime_task
async def cleanup_stale_connections(self):
    """
    Cleanup stale WebSocket connections to free resources
    Runs every minute to maintain AGUI performance
    """
    try:
        websocket_redis = await get_websocket_redis()

        # Find all connection keys
        connection_keys = await websocket_redis.keys("websocket:connection:*")
        if not connection_keys:
            return {'cleaned': 0, 'total': 0}

        cleaned_count = 0
        total_connections = len(connection_keys)

        for connection_key in connection_keys:
            try:
                connection_id = connection_key.decode().split(':')[-1]
                connection_data = await websocket_redis.hgetall(connection_key)

                if not connection_data:
                    # Remove empty connection entries
                    await websocket_redis.delete(connection_key)
                    cleaned_count += 1
                    continue

                # Check last heartbeat
                last_heartbeat_str = connection_data.get('last_heartbeat')
                if last_heartbeat_str:
                    try:
                        last_heartbeat = datetime.fromisoformat(last_heartbeat_str)
                        if datetime.utcnow() - last_heartbeat > timedelta(minutes=5):
                            # Clean up stale connections (5 minutes threshold)
                            await websocket_redis.delete(connection_key)
                            cleaned_count += 1
                            logger.info(f"Cleaned up stale connection: {connection_id}")
                    except ValueError:
                        # Invalid timestamp, clean up
                        await websocket_redis.delete(connection_key)
                        cleaned_count += 1
                else:
                    # No heartbeat, clean up
                    await websocket_redis.delete(connection_key)
                    cleaned_count += 1

            except Exception as e:
                logger.warning(f"Error processing connection {connection_key}: {e}")

        logger.info(f"WebSocket cleanup: {cleaned_count}/{total_connections} connections cleaned")

        return {
            'cleaned': cleaned_count,
            'total': total_connections,
            'active': total_connections - cleaned_count
        }

    except Exception as e:
        logger.error(f"Failed to cleanup stale connections: {e}")
        raise self.retry(exc=e, countdown=30)

@realtime_task
async def aggregate_connection_metrics(self):
    """
    Aggregate WebSocket connection metrics for AGUI monitoring
    """
    try:
        websocket_redis = await get_websocket_redis()

        # Count active connections by status
        connection_keys = await websocket_redis.keys("websocket:connection:*")
        metrics = {
            'total_connections': len(connection_keys),
            'connected': 0,
            'connecting': 0,
            'disconnected': 0,
            'error': 0,
            'stale': 0,
            'by_thread': {},
            'by_user': {}
        }

        for connection_key in connection_keys:
            try:
                connection_data = await websocket_redis.hgetall(connection_key)
                if not connection_data:
                    continue

                # Count by status
                status = connection_data.get('status', 'unknown')
                if status in metrics:
                    metrics[status] += 1

                # Count by thread
                thread_id = connection_data.get('thread_id')
                if thread_id:
                    thread_id_str = thread_id.decode() if isinstance(thread_id, bytes) else thread_id
                    metrics['by_thread'][thread_id_str] = metrics['by_thread'].get(thread_id_str, 0) + 1

                # Count by user
                user_id = connection_data.get('user_id')
                if user_id:
                    user_id_str = user_id.decode() if isinstance(user_id, bytes) else user_id
                    metrics['by_user'][user_id_str] = metrics['by_user'].get(user_id_str, 0) + 1

            except Exception as e:
                logger.warning(f"Error processing connection metrics for {connection_key}: {e}")

        # Store metrics for monitoring
        await websocket_redis.setex(
            "websocket:metrics:current",
            300,  # 5 minutes TTL
            json.dumps({
                **metrics,
                'timestamp': datetime.utcnow().isoformat()
            })
        )

        logger.info(f"WebSocket metrics: {metrics['total_connections']} total connections")

        return metrics

    except Exception as e:
        logger.error(f"Failed to aggregate connection metrics: {e}")
        raise self.retry(exc=e, countdown=15)