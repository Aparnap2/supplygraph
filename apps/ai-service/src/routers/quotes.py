"""Quote processing endpoints."""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, Header, UploadFile, File
from pydantic import BaseModel

from ..workflows import WorkflowManager
from ..services import DoclingService, LLMService
from ..database import with_tenant

router = APIRouter()


class ProcessQuoteRequest(BaseModel):
    email_data: Dict[str, Any]
    request_id: str


class QuoteResponse(BaseModel):
    quote_id: str
    status: str
    message: str


def get_tenant_id(x_tenant_id: str = Header(...)) -> str:
    """Extract tenant ID from header."""
    return x_tenant_id


def get_workflow_manager() -> WorkflowManager:
    """Get workflow manager instance."""
    return WorkflowManager()


@router.post("/process-email", response_model=QuoteResponse)
async def process_quote_email(
    request: ProcessQuoteRequest,
    org_id: str = Depends(get_tenant_id),
    workflow_manager: WorkflowManager = Depends(get_workflow_manager),
):
    """Process a quote from email data."""
    try:
        # Verify the procurement request exists
        async with with_tenant(org_id) as db:
            procurement_request = await db.procurementrequest.find_unique(
                where={"id": request.request_id}
            )
            
            if not procurement_request or procurement_request.orgId != org_id:
                raise HTTPException(status_code=404, detail="Procurement request not found")
        
        # Start quote processing workflow
        initial_state = {
            "email_data": request.email_data,
            "request_id": request.request_id,
        }
        
        execution_id = await workflow_manager.start_workflow(
            workflow_type="quote_processing",
            org_id=org_id,
            entity_id=request.email_data.get("id", "unknown"),
            entity_type="email",
            initial_state=initial_state,
        )
        
        return QuoteResponse(
            quote_id=execution_id,  # Will be updated with actual quote ID when processed
            status="processing",
            message="Quote processing started"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/process-document", response_model=QuoteResponse)
async def process_quote_document(
    request_id: str,
    file: UploadFile = File(...),
    org_id: str = Depends(get_tenant_id),
    workflow_manager: WorkflowManager = Depends(get_workflow_manager),
):
    """Process a quote from uploaded document."""
    try:
        # Verify the procurement request exists
        async with with_tenant(org_id) as db:
            procurement_request = await db.procurementrequest.find_unique(
                where={"id": request_id}
            )
            
            if not procurement_request or procurement_request.orgId != org_id:
                raise HTTPException(status_code=404, detail="Procurement request not found")
        
        # Read file content
        file_content = await file.read()
        
        # Create mock email data for document processing
        email_data = {
            "id": f"doc_{file.filename}",
            "subject": f"Quote Document: {file.filename}",
            "from": "document_upload",
            "body": "",
            "attachments": [
                {
                    "filename": file.filename,
                    "content_type": file.content_type,
                    "content": file_content,
                }
            ]
        }
        
        # Start quote processing workflow
        initial_state = {
            "email_data": email_data,
            "request_id": request_id,
        }
        
        execution_id = await workflow_manager.start_workflow(
            workflow_type="quote_processing",
            org_id=org_id,
            entity_id=email_data["id"],
            entity_type="document",
            initial_state=initial_state,
        )
        
        return QuoteResponse(
            quote_id=execution_id,
            status="processing",
            message=f"Document {file.filename} processing started"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{quote_id}")
async def get_quote_details(
    quote_id: str,
    org_id: str = Depends(get_tenant_id),
):
    """Get detailed information about a quote."""
    try:
        async with with_tenant(org_id) as db:
            quote = await db.quote.find_unique(
                where={"id": quote_id},
                include={
                    "vendor": True,
                    "request": True,
                }
            )
            
            if not quote or quote.orgId != org_id:
                raise HTTPException(status_code=404, detail="Quote not found")
        
        return {
            "id": quote.id,
            "request_id": quote.requestId,
            "request_title": quote.request.title,
            "vendor": {
                "id": quote.vendor.id,
                "name": quote.vendor.name,
                "email": quote.vendor.email,
            },
            "items": quote.items,
            "total_amount": float(quote.totalAmount),
            "currency": quote.currency,
            "delivery_days": quote.deliveryDays,
            "valid_until": quote.validUntil,
            "terms": quote.terms,
            "source": quote.source,
            "confidence": quote.confidence,
            "status": quote.status,
            "created_at": quote.createdAt,
            "updated_at": quote.updatedAt,
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/request/{request_id}")
async def get_quotes_for_request(
    request_id: str,
    org_id: str = Depends(get_tenant_id),
):
    """Get all quotes for a procurement request."""
    try:
        async with with_tenant(org_id) as db:
            # Verify request exists and belongs to org
            request = await db.procurementrequest.find_unique(
                where={"id": request_id}
            )
            
            if not request or request.orgId != org_id:
                raise HTTPException(status_code=404, detail="Procurement request not found")
            
            # Get quotes for the request
            quotes = await db.quote.find_many(
                where={"requestId": request_id},
                include={"vendor": True},
                order_by={"totalAmount": "asc"}  # Sort by price, lowest first
            )
        
        return {
            "request_id": request_id,
            "request_title": request.title,
            "quotes_count": len(quotes),
            "quotes": [
                {
                    "id": quote.id,
                    "vendor": {
                        "id": quote.vendor.id,
                        "name": quote.vendor.name,
                        "email": quote.vendor.email,
                    },
                    "total_amount": float(quote.totalAmount),
                    "currency": quote.currency,
                    "delivery_days": quote.deliveryDays,
                    "confidence": quote.confidence,
                    "status": quote.status,
                    "created_at": quote.createdAt,
                }
                for quote in quotes
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{quote_id}/validate")
async def validate_quote(
    quote_id: str,
    org_id: str = Depends(get_tenant_id),
):
    """Manually validate and re-process a quote."""
    try:
        async with with_tenant(org_id) as db:
            quote = await db.quote.find_unique(
                where={"id": quote_id},
                include={"request": True}
            )
            
            if not quote or quote.orgId != org_id:
                raise HTTPException(status_code=404, detail="Quote not found")
        
        # Use LLM service to re-validate the quote
        llm_service = LLMService()
        
        # Get original extracted data
        raw_data = quote.rawData or {}
        extracted_data = raw_data.get("extracted_data", {})
        
        if extracted_data:
            # Re-normalize the quote data
            normalized_data = await llm_service.normalize_quote_data(
                extracted_data,
                quote.request.items
            )
            
            # Update quote with validation results
            validation = normalized_data.get("validation", {})
            
            await db.quote.update(
                where={"id": quote_id},
                data={
                    "confidence": validation.get("confidence_score", quote.confidence),
                    "status": "REVIEWED" if validation.get("is_valid") else "PENDING",
                }
            )
            
            return {
                "quote_id": quote_id,
                "validation": validation,
                "status": "validated",
                "message": "Quote validation completed"
            }
        else:
            raise HTTPException(status_code=400, detail="No extracted data available for validation")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))