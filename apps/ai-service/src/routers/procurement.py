"""Procurement workflow endpoints."""

from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel

from ..workflows import WorkflowManager
from ..database import with_tenant

router = APIRouter()


class StartProcurementRequest(BaseModel):
    request_id: str
    vendor_ids: List[str] = []


class ProcurementResponse(BaseModel):
    execution_id: str
    request_id: str
    status: str
    message: str


def get_tenant_id(x_tenant_id: str = Header(...)) -> str:
    """Extract tenant ID from header."""
    return x_tenant_id


def get_workflow_manager() -> WorkflowManager:
    """Get workflow manager instance."""
    return WorkflowManager()


@router.post("/start", response_model=ProcurementResponse)
async def start_procurement_workflow(
    request: StartProcurementRequest,
    org_id: str = Depends(get_tenant_id),
    workflow_manager: WorkflowManager = Depends(get_workflow_manager),
):
    """Start a procurement workflow for a request."""
    try:
        # Get the procurement request details
        async with with_tenant(org_id) as db:
            procurement_request = await db.procurementrequest.find_unique(
                where={"id": request.request_id}
            )
            
            if not procurement_request:
                raise HTTPException(status_code=404, detail="Procurement request not found")
            
            if procurement_request.orgId != org_id:
                raise HTTPException(status_code=403, detail="Access denied")
        
        # Prepare initial state
        initial_state = {
            "title": procurement_request.title,
            "description": procurement_request.description,
            "items": procurement_request.items,
            "orgId": org_id,
            "createdBy": procurement_request.createdBy,
            "selected_vendor_ids": request.vendor_ids,
        }
        
        # Start the workflow
        execution_id = await workflow_manager.start_workflow(
            workflow_type="procurement",
            org_id=org_id,
            entity_id=request.request_id,
            entity_type="ProcurementRequest",
            initial_state=initial_state,
        )
        
        return ProcurementResponse(
            execution_id=execution_id,
            request_id=request.request_id,
            status="started",
            message="Procurement workflow started successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{request_id}/approve")
async def approve_quote(
    request_id: str,
    quote_id: str,
    org_id: str = Depends(get_tenant_id),
):
    """Approve a quote for a procurement request."""
    try:
        async with with_tenant(org_id) as db:
            # Verify the request and quote exist
            request = await db.procurementrequest.find_unique(
                where={"id": request_id}
            )
            
            if not request or request.orgId != org_id:
                raise HTTPException(status_code=404, detail="Procurement request not found")
            
            quote = await db.quote.find_unique(
                where={"id": quote_id}
            )
            
            if not quote or quote.requestId != request_id:
                raise HTTPException(status_code=404, detail="Quote not found")
            
            # Update the request with approved quote
            await db.procurementrequest.update(
                where={"id": request_id},
                data={
                    "approvedQuoteId": quote_id,
                    "approvedVendorId": quote.vendorId,
                    "status": "APPROVED",
                    "approvedAt": "now()",
                }
            )
            
            # Update quote status
            await db.quote.update(
                where={"id": quote_id},
                data={"status": "APPROVED"}
            )
        
        return {
            "request_id": request_id,
            "quote_id": quote_id,
            "status": "approved",
            "message": "Quote approved successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{request_id}/status")
async def get_procurement_status(
    request_id: str,
    org_id: str = Depends(get_tenant_id),
):
    """Get the current status of a procurement request."""
    try:
        async with with_tenant(org_id) as db:
            request = await db.procurementrequest.find_unique(
                where={"id": request_id},
                include={
                    "quotes": {
                        "include": {"vendor": True}
                    }
                }
            )
            
            if not request or request.orgId != org_id:
                raise HTTPException(status_code=404, detail="Procurement request not found")
            
            # Get workflow executions for this request
            executions = await db.workflowexecution.find_many(
                where={
                    "entityId": request_id,
                    "entityType": "ProcurementRequest"
                },
                order_by={"startedAt": "desc"}
            )
        
        return {
            "request_id": request_id,
            "status": request.status,
            "title": request.title,
            "created_at": request.createdAt,
            "updated_at": request.updatedAt,
            "approved_at": request.approvedAt,
            "completed_at": request.completedAt,
            "quotes_count": len(request.quotes),
            "quotes": [
                {
                    "id": quote.id,
                    "vendor_name": quote.vendor.name,
                    "total_amount": float(quote.totalAmount),
                    "currency": quote.currency,
                    "status": quote.status,
                    "created_at": quote.createdAt,
                }
                for quote in request.quotes
            ],
            "workflow_executions": [
                {
                    "id": execution.id,
                    "workflow_type": execution.workflowType,
                    "status": execution.status,
                    "current_state": execution.currentState,
                    "started_at": execution.startedAt,
                    "completed_at": execution.completedAt,
                }
                for execution in executions
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))