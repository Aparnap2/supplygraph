"""Quote Processing Workflow - LangGraph implementation for intelligent quote extraction and normalization."""

import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime

import structlog
from langgraph.graph import START, END

from .base import BaseWorkflow, WorkflowState
from ..database import with_tenant
from ..services.docling_service import DoclingService
from ..services.llm_service import LLMService

logger = structlog.get_logger(__name__)


class QuoteProcessingWorkflow(BaseWorkflow):
    """
    LangGraph workflow for processing vendor quotes from emails and documents.
    
    Flow: RECEIVED → EXTRACTED → NORMALIZED → VALIDATED → STORED
    """
    
    def _setup_graph(self) -> None:
        """Setup the quote processing workflow graph."""
        
        # Add workflow nodes
        self.graph_builder.add_node("extract_quote_data", self.extract_quote_data)
        self.graph_builder.add_node("normalize_quote", self.normalize_quote)
        self.graph_builder.add_node("validate_quote", self.validate_quote)
        self.graph_builder.add_node("store_quote", self.store_quote)
        self.graph_builder.add_node("handle_extraction_error", self.handle_extraction_error)
        
        # Define workflow edges
        self.graph_builder.add_edge(START, "extract_quote_data")
        
        # Conditional routing from extract_quote_data
        self.graph_builder.add_conditional_edges(
            "extract_quote_data",
            self.route_after_extraction,
            {
                "success": "normalize_quote",
                "retry": "extract_quote_data",
                "failed": "handle_extraction_error",
            }
        )
        
        self.graph_builder.add_edge("normalize_quote", "validate_quote")
        
        # Conditional routing from validate_quote
        self.graph_builder.add_conditional_edges(
            "validate_quote",
            self.route_after_validation,
            {
                "valid": "store_quote",
                "invalid": "handle_extraction_error",
                "retry": "normalize_quote",
            }
        )
        
        self.graph_builder.add_edge("store_quote", END)
        self.graph_builder.add_edge("handle_extraction_error", END)
    
    async def extract_quote_data(self, state: WorkflowState) -> WorkflowState:
        """Extract quote data from email content and attachments using Docling."""
        try:
            state = await self.log_step(state, "extract_quote_data", "Extracting quote data from email")
            
            email_data = state["data"]["email_data"]
            docling_service = DoclingService()
            llm_service = LLMService()
            
            extracted_data = {
                "vendor_info": {},
                "items": [],
                "pricing": {},
                "terms": {},
                "confidence_score": 0.0,
            }
            
            # Extract from email body
            email_body = email_data.get("body", "")
            if email_body:
                body_extraction = await llm_service.extract_quote_from_text(email_body)
                extracted_data.update(body_extraction)
            
            # Process attachments if any
            attachments = email_data.get("attachments", [])
            for attachment in attachments:
                try:
                    # Use Docling to process document attachments
                    if attachment.get("content_type") in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
                        doc_data = await docling_service.process_document(
                            attachment["content"],
                            attachment["filename"]
                        )
                        
                        # Extract quote information from document
                        doc_extraction = await llm_service.extract_quote_from_document(doc_data)
                        
                        # Merge with existing data (document data takes precedence)
                        extracted_data = self._merge_extraction_data(extracted_data, doc_extraction)
                        
                except Exception as e:
                    logger.warning(
                        "Failed to process attachment",
                        filename=attachment.get("filename"),
                        error=str(e)
                    )
            
            # Calculate overall confidence score
            confidence_score = self._calculate_confidence_score(extracted_data)
            extracted_data["confidence_score"] = confidence_score
            
            state["data"]["extracted_quote"] = extracted_data
            state["data"]["extraction_status"] = "success" if confidence_score > 0.5 else "low_confidence"
            
            state = await self.log_step(
                state,
                "extract_quote_data",
                f"✅ Quote extraction completed (confidence: {confidence_score:.2f})"
            )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "extract_quote_data")
    
    async def normalize_quote(self, state: WorkflowState) -> WorkflowState:
        """Normalize extracted quote data to standard format."""
        try:
            state = await self.log_step(state, "normalize_quote", "Normalizing quote data")
            
            extracted_quote = state["data"]["extracted_quote"]
            request_id = state["data"]["request_id"]
            
            # Get original request for context
            async with with_tenant(state["org_id"]) as db:
                request = await db.procurementrequest.find_unique(
                    where={"id": request_id},
                )
            
            if not request:
                raise ValueError(f"Request not found: {request_id}")
            
            # Normalize the quote data
            normalized_quote = {
                "vendor_info": self._normalize_vendor_info(extracted_quote.get("vendor_info", {})),
                "items": self._normalize_items(
                    extracted_quote.get("items", []),
                    request.items
                ),
                "pricing": self._normalize_pricing(extracted_quote.get("pricing", {})),
                "terms": self._normalize_terms(extracted_quote.get("terms", {})),
                "delivery": self._normalize_delivery(extracted_quote.get("delivery", {})),
                "confidence_score": extracted_quote.get("confidence_score", 0.0),
            }
            
            # Calculate total amount
            total_amount = self._calculate_total_amount(normalized_quote["items"])
            normalized_quote["total_amount"] = total_amount
            
            state["data"]["normalized_quote"] = normalized_quote
            state = await self.log_step(
                state,
                "normalize_quote",
                f"✅ Quote normalized (total: ${total_amount:.2f})"
            )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "normalize_quote")
    
    async def validate_quote(self, state: WorkflowState) -> WorkflowState:
        """Validate normalized quote data."""
        try:
            state = await self.log_step(state, "validate_quote", "Validating quote data")
            
            normalized_quote = state["data"]["normalized_quote"]
            validation_errors = []
            
            # Validate required fields
            if not normalized_quote.get("vendor_info", {}).get("name"):
                validation_errors.append("Missing vendor name")
            
            if not normalized_quote.get("items"):
                validation_errors.append("No items found in quote")
            
            if normalized_quote.get("total_amount", 0) <= 0:
                validation_errors.append("Invalid total amount")
            
            # Validate items
            for i, item in enumerate(normalized_quote.get("items", [])):
                if not item.get("name"):
                    validation_errors.append(f"Item {i+1}: Missing name")
                if not item.get("unit_price") or item["unit_price"] <= 0:
                    validation_errors.append(f"Item {i+1}: Invalid unit price")
                if not item.get("quantity") or item["quantity"] <= 0:
                    validation_errors.append(f"Item {i+1}: Invalid quantity")
            
            # Check confidence score
            confidence_score = normalized_quote.get("confidence_score", 0.0)
            if confidence_score < 0.3:
                validation_errors.append("Low confidence score in extraction")
            
            # Determine validation status
            if not validation_errors:
                validation_status = "valid"
            elif confidence_score > 0.7 and len(validation_errors) <= 2:
                validation_status = "valid_with_warnings"
                logger.warning("Quote validation warnings", errors=validation_errors)
            else:
                validation_status = "invalid"
            
            state["data"]["validation_status"] = validation_status
            state["data"]["validation_errors"] = validation_errors
            
            if validation_status in ["valid", "valid_with_warnings"]:
                state = await self.log_step(
                    state,
                    "validate_quote",
                    f"✅ Quote validation passed ({validation_status})"
                )
            else:
                state = await self.log_step(
                    state,
                    "validate_quote",
                    f"❌ Quote validation failed: {', '.join(validation_errors)}"
                )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "validate_quote")
    
    async def store_quote(self, state: WorkflowState) -> WorkflowState:
        """Store the validated quote in the database."""
        try:
            state = await self.log_step(state, "store_quote", "Storing quote in database")
            
            normalized_quote = state["data"]["normalized_quote"]
            email_data = state["data"]["email_data"]
            request_id = state["data"]["request_id"]
            
            # Find or create vendor
            vendor_info = normalized_quote["vendor_info"]
            async with with_tenant(state["org_id"]) as db:
                vendor = await db.vendor.find_first(
                    where={
                        "orgId": state["org_id"],
                        "email": vendor_info.get("email", ""),
                    }
                )
                
                if not vendor and vendor_info.get("email"):
                    # Create new vendor
                    vendor = await db.vendor.create(
                        data={
                            "orgId": state["org_id"],
                            "name": vendor_info.get("name", "Unknown Vendor"),
                            "email": vendor_info.get("email"),
                            "phone": vendor_info.get("phone"),
                            "website": vendor_info.get("website"),
                            "metadata": {
                                "source": "quote_processing",
                                "auto_created": True,
                            }
                        }
                    )
                
                if not vendor:
                    raise ValueError("Could not identify or create vendor")
                
                # Create quote record
                quote = await db.quote.create(
                    data={
                        "orgId": state["org_id"],
                        "requestId": request_id,
                        "vendorId": vendor.id,
                        "items": normalized_quote["items"],
                        "totalAmount": normalized_quote["total_amount"],
                        "currency": normalized_quote["pricing"].get("currency", "USD"),
                        "deliveryDays": normalized_quote["delivery"].get("days"),
                        "validUntil": normalized_quote["terms"].get("valid_until"),
                        "terms": normalized_quote["terms"],
                        "source": "EMAIL",
                        "rawData": {
                            "email_data": email_data,
                            "extracted_data": state["data"]["extracted_quote"],
                        },
                        "confidence": normalized_quote["confidence_score"],
                        "status": "PENDING",
                    }
                )
            
            state["data"]["quote_id"] = quote.id
            state["data"]["vendor_id"] = vendor.id
            state = await self.log_step(
                state,
                "store_quote",
                f"✅ Quote stored successfully (ID: {quote.id})"
            )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "store_quote")
    
    async def handle_extraction_error(self, state: WorkflowState) -> WorkflowState:
        """Handle quote extraction/processing errors."""
        state = await self.log_step(
            state,
            "handle_extraction_error",
            f"❌ Quote processing failed: {state.get('error_message', 'Unknown error')}"
        )
        
        # Log the failed processing attempt
        try:
            email_data = state["data"]["email_data"]
            async with with_tenant(state["org_id"]) as db:
                # Could store failed processing attempts for manual review
                pass
        except Exception as e:
            logger.error("Failed to log extraction error", error=str(e))
        
        return state
    
    # Routing functions
    def route_after_extraction(self, state: WorkflowState) -> str:
        """Route after quote extraction."""
        extraction_status = state["data"].get("extraction_status")
        if extraction_status == "success":
            return "success"
        elif extraction_status == "low_confidence" and self.should_retry(state):
            return "retry"
        else:
            return "failed"
    
    def route_after_validation(self, state: WorkflowState) -> str:
        """Route after quote validation."""
        validation_status = state["data"].get("validation_status")
        if validation_status in ["valid", "valid_with_warnings"]:
            return "valid"
        elif self.should_retry(state):
            return "retry"
        else:
            return "invalid"
    
    # Helper methods
    def _merge_extraction_data(self, base_data: Dict[str, Any], new_data: Dict[str, Any]) -> Dict[str, Any]:
        """Merge extraction data, giving precedence to new_data."""
        merged = base_data.copy()
        
        for key, value in new_data.items():
            if value and (not merged.get(key) or len(str(value)) > len(str(merged.get(key, "")))):
                merged[key] = value
        
        return merged
    
    def _calculate_confidence_score(self, extracted_data: Dict[str, Any]) -> float:
        """Calculate confidence score based on extracted data completeness."""
        score = 0.0
        
        # Vendor info (20%)
        vendor_info = extracted_data.get("vendor_info", {})
        if vendor_info.get("name"):
            score += 0.1
        if vendor_info.get("email"):
            score += 0.1
        
        # Items (40%)
        items = extracted_data.get("items", [])
        if items:
            score += 0.2
            # Check item completeness
            complete_items = sum(1 for item in items if item.get("name") and item.get("unit_price"))
            if complete_items == len(items):
                score += 0.2
        
        # Pricing (30%)
        pricing = extracted_data.get("pricing", {})
        if pricing.get("total_amount"):
            score += 0.2
        if pricing.get("currency"):
            score += 0.1
        
        # Terms (10%)
        terms = extracted_data.get("terms", {})
        if terms.get("delivery_time") or terms.get("valid_until"):
            score += 0.1
        
        return min(score, 1.0)
    
    def _normalize_vendor_info(self, vendor_info: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize vendor information."""
        return {
            "name": vendor_info.get("name", "").strip(),
            "email": vendor_info.get("email", "").lower().strip(),
            "phone": vendor_info.get("phone", "").strip(),
            "website": vendor_info.get("website", "").strip(),
            "address": vendor_info.get("address", {}),
        }
    
    def _normalize_items(self, extracted_items: List[Dict[str, Any]], request_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Normalize item data and match with request items."""
        normalized_items = []
        
        for item in extracted_items:
            normalized_item = {
                "name": item.get("name", "").strip(),
                "description": item.get("description", "").strip(),
                "quantity": self._parse_number(item.get("quantity", 0)),
                "unit_price": self._parse_currency(item.get("unit_price", 0)),
                "total_price": self._parse_currency(item.get("total_price", 0)),
                "unit": item.get("unit", "each").strip(),
                "specifications": item.get("specifications", {}),
            }
            
            # Calculate total_price if not provided
            if not normalized_item["total_price"] and normalized_item["unit_price"] and normalized_item["quantity"]:
                normalized_item["total_price"] = normalized_item["unit_price"] * normalized_item["quantity"]
            
            normalized_items.append(normalized_item)
        
        return normalized_items
    
    def _normalize_pricing(self, pricing: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize pricing information."""
        return {
            "subtotal": self._parse_currency(pricing.get("subtotal", 0)),
            "tax": self._parse_currency(pricing.get("tax", 0)),
            "shipping": self._parse_currency(pricing.get("shipping", 0)),
            "total_amount": self._parse_currency(pricing.get("total_amount", 0)),
            "currency": pricing.get("currency", "USD").upper(),
        }
    
    def _normalize_terms(self, terms: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize terms and conditions."""
        return {
            "payment_terms": terms.get("payment_terms", "").strip(),
            "delivery_time": terms.get("delivery_time", "").strip(),
            "valid_until": self._parse_date(terms.get("valid_until")),
            "warranty": terms.get("warranty", "").strip(),
            "conditions": terms.get("conditions", []),
        }
    
    def _normalize_delivery(self, delivery: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize delivery information."""
        return {
            "days": self._parse_number(delivery.get("days", 0)),
            "method": delivery.get("method", "").strip(),
            "cost": self._parse_currency(delivery.get("cost", 0)),
            "address": delivery.get("address", "").strip(),
        }
    
    def _calculate_total_amount(self, items: List[Dict[str, Any]]) -> float:
        """Calculate total amount from items."""
        return sum(item.get("total_price", 0) for item in items)
    
    def _parse_number(self, value: Any) -> int:
        """Parse a number from various formats."""
        if isinstance(value, (int, float)):
            return int(value)
        if isinstance(value, str):
            # Remove common non-numeric characters
            cleaned = ''.join(c for c in value if c.isdigit() or c == '.')
            try:
                return int(float(cleaned))
            except ValueError:
                return 0
        return 0
    
    def _parse_currency(self, value: Any) -> float:
        """Parse currency amount from various formats."""
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            # Remove currency symbols and common formatting
            cleaned = ''.join(c for c in value if c.isdigit() or c in '.,')
            cleaned = cleaned.replace(',', '')
            try:
                return float(cleaned)
            except ValueError:
                return 0.0
        return 0.0
    
    def _parse_date(self, value: Any) -> Optional[datetime]:
        """Parse date from various formats."""
        if isinstance(value, datetime):
            return value
        if isinstance(value, str) and value.strip():
            # TODO: Implement robust date parsing
            try:
                return datetime.fromisoformat(value.strip())
            except ValueError:
                return None
        return None