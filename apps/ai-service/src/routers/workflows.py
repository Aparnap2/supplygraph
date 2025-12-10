"""Workflow management endpoints."""

from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel

from ..workflows import WorkflowManager
from ..config import get_settings

router = APIRouter()


class StartWorkflowRequest(BaseModel):
    workflow_type: str
    entity_id: str
    entity_type: str
    initial_state: Dict[str, Any]
    thread_id: Optional[str] = None


class WorkflowResponse(BaseModel):
    execution_id: str
    status: str
    message: str


def get_tenant_id(x_tenant_id: str = Header(...)) -> str:
    """Extract tenant ID from header."""
    return x_tenant_id


def get_workflow_manager() -> WorkflowManager:
    """Get workflow manager instance."""
    # This would typically be injected from the app state
    return WorkflowManager()


@router.post("/start", response_model=WorkflowResponse)
async def start_workflow(
    request: StartWorkflowRequest,
    org_id: str = Depends(get_tenant_id),
    workflow_manager: WorkflowManager = Depends(get_workflow_manager),
):
    """Start a new workflow execution."""
    try:
        execution_id = await workflow_manager.start_workflow(
            workflow_type=request.workflow_type,
            org_id=org_id,
            entity_id=request.entity_id,
            entity_type=request.entity_type,
            initial_state=request.initial_state,
            thread_id=request.thread_id,
        )
        
        return WorkflowResponse(
            execution_id=execution_id,
            status="started",
            message=f"Workflow {request.workflow_type} started successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{execution_id}/status")
async def get_workflow_status(
    execution_id: str,
    org_id: str = Depends(get_tenant_id),
    workflow_manager: WorkflowManager = Depends(get_workflow_manager),
):
    """Get the status of a workflow execution."""
    try:
        status = await workflow_manager.get_workflow_status(execution_id, org_id)
        return status
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{execution_id}/resume", response_model=WorkflowResponse)
async def resume_workflow(
    execution_id: str,
    org_id: str = Depends(get_tenant_id),
    workflow_manager: WorkflowManager = Depends(get_workflow_manager),
):
    """Resume a paused or failed workflow."""
    try:
        await workflow_manager.resume_workflow(execution_id, org_id)
        
        return WorkflowResponse(
            execution_id=execution_id,
            status="resumed",
            message="Workflow resumed successfully"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{execution_id}/cancel", response_model=WorkflowResponse)
async def cancel_workflow(
    execution_id: str,
    org_id: str = Depends(get_tenant_id),
    workflow_manager: WorkflowManager = Depends(get_workflow_manager),
):
    """Cancel a running workflow."""
    try:
        await workflow_manager.cancel_workflow(execution_id, org_id)
        
        return WorkflowResponse(
            execution_id=execution_id,
            status="cancelled",
            message="Workflow cancelled successfully"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))