"""Base workflow classes and utilities for LangGraph workflows."""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, TypedDict, Annotated
from datetime import datetime

import structlog
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.base import BaseCheckpointSaver

logger = structlog.get_logger(__name__)


class WorkflowState(TypedDict):
    """Base state structure for all workflows."""
    # Core workflow metadata
    workflow_id: str
    org_id: str
    entity_id: str
    entity_type: str
    current_step: str
    
    # Execution metadata
    started_at: datetime
    updated_at: datetime
    retry_count: int
    error_message: Optional[str]
    
    # Workflow-specific data (to be extended by subclasses)
    data: Dict[str, Any]
    
    # Messages for debugging and audit trail
    messages: Annotated[list, add_messages]


class BaseWorkflow(ABC):
    """Abstract base class for all LangGraph workflows."""
    
    def __init__(self):
        self.logger = structlog.get_logger(self.__class__.__name__)
        self.graph_builder = StateGraph(WorkflowState)
        self._setup_graph()
    
    @abstractmethod
    def _setup_graph(self) -> None:
        """Setup the workflow graph structure. Must be implemented by subclasses."""
        pass
    
    def compile(self, checkpointer: Optional[BaseCheckpointSaver] = None) -> Any:
        """Compile the workflow graph."""
        return self.graph_builder.compile(checkpointer=checkpointer)
    
    async def log_step(self, state: WorkflowState, step_name: str, message: str) -> WorkflowState:
        """Log a workflow step and update state."""
        self.logger.info(
            f"📋 {step_name}",
            workflow_id=state["workflow_id"],
            entity_id=state["entity_id"],
            message=message,
        )
        
        # Update state
        state["current_step"] = step_name
        state["updated_at"] = datetime.now()
        state["messages"].append({
            "role": "system",
            "content": f"[{step_name}] {message}",
            "timestamp": datetime.now().isoformat(),
        })
        
        return state
    
    async def handle_error(self, state: WorkflowState, error: Exception, step_name: str) -> WorkflowState:
        """Handle workflow errors with retry logic."""
        error_message = str(error)
        
        self.logger.error(
            f"❌ Error in {step_name}",
            workflow_id=state["workflow_id"],
            entity_id=state["entity_id"],
            error=error_message,
            retry_count=state["retry_count"],
        )
        
        state["retry_count"] += 1
        state["error_message"] = error_message
        state["updated_at"] = datetime.now()
        state["messages"].append({
            "role": "system",
            "content": f"[ERROR] {step_name}: {error_message}",
            "timestamp": datetime.now().isoformat(),
        })
        
        return state
    
    def should_retry(self, state: WorkflowState, max_retries: int = 3) -> bool:
        """Determine if a workflow should retry after an error."""
        return state["retry_count"] < max_retries
    
    def create_initial_state(
        self,
        workflow_id: str,
        org_id: str,
        entity_id: str,
        entity_type: str,
        data: Dict[str, Any],
    ) -> WorkflowState:
        """Create initial workflow state."""
        return WorkflowState(
            workflow_id=workflow_id,
            org_id=org_id,
            entity_id=entity_id,
            entity_type=entity_type,
            current_step="START",
            started_at=datetime.now(),
            updated_at=datetime.now(),
            retry_count=0,
            error_message=None,
            data=data,
            messages=[{
                "role": "system",
                "content": f"Workflow started for {entity_type} {entity_id}",
                "timestamp": datetime.now().isoformat(),
            }],
        )


class ConditionalRouter:
    """Utility class for conditional routing in workflows."""
    
    @staticmethod
    def route_by_status(state: WorkflowState, status_field: str = "status") -> str:
        """Route based on a status field in the workflow data."""
        status = state["data"].get(status_field, "unknown")
        return status.lower()
    
    @staticmethod
    def route_by_condition(state: WorkflowState, condition_func) -> str:
        """Route based on a custom condition function."""
        try:
            result = condition_func(state)
            return "success" if result else "failure"
        except Exception:
            return "error"
    
    @staticmethod
    def route_with_retry(state: WorkflowState, max_retries: int = 3) -> str:
        """Route with retry logic."""
        if state.get("error_message") and state["retry_count"] < max_retries:
            return "retry"
        elif state.get("error_message"):
            return "failed"
        else:
            return "success"