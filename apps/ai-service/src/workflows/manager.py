"""Workflow Manager - Central orchestrator for all LangGraph workflows."""

import asyncio
from typing import Dict, Any, Optional, Type
from uuid import uuid4

import structlog
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.base import BaseCheckpointSaver

from ..config import get_settings
from ..database import get_db_client, with_tenant
from .base import BaseWorkflow, WorkflowState
from .procurement import ProcurementWorkflow
from .quote_processing import QuoteProcessingWorkflow
from .email_processing import EmailProcessingWorkflow

logger = structlog.get_logger(__name__)


class WorkflowManager:
    """Central manager for all LangGraph workflows in SupplyGraph."""
    
    def __init__(self):
        self.settings = get_settings()
        self.checkpointer = MemorySaver()  # TODO: Replace with Redis checkpointer
        self.workflows: Dict[str, Type[BaseWorkflow]] = {
            "procurement": ProcurementWorkflow,
            "quote_processing": QuoteProcessingWorkflow,
            "email_processing": EmailProcessingWorkflow,
        }
        self._compiled_workflows: Dict[str, Any] = {}
        
        logger.info("🔄 Workflow Manager initialized", workflows=list(self.workflows.keys()))
    
    async def get_workflow(self, workflow_type: str) -> Any:
        """Get a compiled workflow by type."""
        if workflow_type not in self._compiled_workflows:
            if workflow_type not in self.workflows:
                raise ValueError(f"Unknown workflow type: {workflow_type}")
            
            workflow_class = self.workflows[workflow_type]
            workflow_instance = workflow_class()
            compiled_workflow = workflow_instance.compile(checkpointer=self.checkpointer)
            
            self._compiled_workflows[workflow_type] = compiled_workflow
            
            logger.info("✅ Compiled workflow", workflow_type=workflow_type)
        
        return self._compiled_workflows[workflow_type]
    
    async def start_workflow(
        self,
        workflow_type: str,
        org_id: str,
        entity_id: str,
        entity_type: str,
        initial_state: Dict[str, Any],
        thread_id: Optional[str] = None,
    ) -> str:
        """Start a new workflow execution."""
        if thread_id is None:
            thread_id = f"{workflow_type}_{entity_id}_{uuid4().hex[:8]}"
        
        workflow = await self.get_workflow(workflow_type)
        
        # Create workflow execution record
        async with with_tenant(org_id) as db:
            execution = await db.workflowexecution.create(
                data={
                    "orgId": org_id,
                    "workflowType": workflow_type,
                    "entityId": entity_id,
                    "entityType": entity_type,
                    "currentState": "START",
                    "stateData": initial_state,
                    "status": "RUNNING",
                }
            )
        
        # Start workflow execution
        config = {"configurable": {"thread_id": thread_id}}
        
        try:
            # Run workflow asynchronously
            asyncio.create_task(
                self._execute_workflow(workflow, initial_state, config, execution.id, org_id)
            )
            
            logger.info(
                "🚀 Started workflow",
                workflow_type=workflow_type,
                thread_id=thread_id,
                entity_id=entity_id,
                execution_id=execution.id,
            )
            
            return execution.id
            
        except Exception as e:
            # Update execution status to failed
            async with with_tenant(org_id) as db:
                await db.workflowexecution.update(
                    where={"id": execution.id},
                    data={
                        "status": "FAILED",
                        "errorMessage": str(e),
                        "completedAt": "now()",
                    }
                )
            
            logger.error(
                "❌ Failed to start workflow",
                workflow_type=workflow_type,
                error=str(e),
                execution_id=execution.id,
            )
            raise
    
    async def _execute_workflow(
        self,
        workflow: Any,
        initial_state: Dict[str, Any],
        config: Dict[str, Any],
        execution_id: str,
        org_id: str,
    ) -> None:
        """Execute a workflow and update its status."""
        try:
            # Execute the workflow
            final_state = None
            async for state in workflow.astream(initial_state, config):
                final_state = state
                
                # Update current state in database
                async with with_tenant(org_id) as db:
                    await db.workflowexecution.update(
                        where={"id": execution_id},
                        data={
                            "stateData": final_state,
                            "currentState": final_state.get("current_step", "UNKNOWN"),
                        }
                    )
            
            # Mark as completed
            async with with_tenant(org_id) as db:
                await db.workflowexecution.update(
                    where={"id": execution_id},
                    data={
                        "status": "COMPLETED",
                        "completedAt": "now()",
                        "stateData": final_state,
                    }
                )
            
            logger.info("✅ Workflow completed", execution_id=execution_id)
            
        except Exception as e:
            # Mark as failed
            async with with_tenant(org_id) as db:
                await db.workflowexecution.update(
                    where={"id": execution_id},
                    data={
                        "status": "FAILED",
                        "errorMessage": str(e),
                        "completedAt": "now()",
                    }
                )
            
            logger.error("❌ Workflow failed", execution_id=execution_id, error=str(e))
    
    async def get_workflow_status(self, execution_id: str, org_id: str) -> Dict[str, Any]:
        """Get the current status of a workflow execution."""
        async with with_tenant(org_id) as db:
            execution = await db.workflowexecution.find_unique(
                where={"id": execution_id}
            )
            
            if not execution:
                raise ValueError(f"Workflow execution not found: {execution_id}")
            
            return {
                "id": execution.id,
                "workflow_type": execution.workflowType,
                "entity_id": execution.entityId,
                "entity_type": execution.entityType,
                "current_state": execution.currentState,
                "status": execution.status,
                "started_at": execution.startedAt,
                "completed_at": execution.completedAt,
                "error_message": execution.errorMessage,
                "state_data": execution.stateData,
            }
    
    async def resume_workflow(self, execution_id: str, org_id: str) -> None:
        """Resume a paused or failed workflow."""
        execution = await self.get_workflow_status(execution_id, org_id)
        
        if execution["status"] not in ["FAILED", "PENDING"]:
            raise ValueError(f"Cannot resume workflow in status: {execution['status']}")
        
        workflow = await self.get_workflow(execution["workflow_type"])
        config = {"configurable": {"thread_id": execution_id}}
        
        # Resume from last checkpoint
        await self._execute_workflow(
            workflow,
            execution["state_data"],
            config,
            execution_id,
            org_id,
        )
    
    async def cancel_workflow(self, execution_id: str, org_id: str) -> None:
        """Cancel a running workflow."""
        async with with_tenant(org_id) as db:
            await db.workflowexecution.update(
                where={"id": execution_id},
                data={
                    "status": "CANCELLED",
                    "completedAt": "now()",
                }
            )
        
        logger.info("🛑 Workflow cancelled", execution_id=execution_id)