"""Procurement Request Workflow - LangGraph implementation for procurement lifecycle."""

import asyncio
from typing import Dict, Any, List
from datetime import datetime, timedelta

import structlog
from langgraph.graph import START, END

from .base import BaseWorkflow, WorkflowState, ConditionalRouter
from ..database import with_tenant
from ..services.email_service import EmailService
from ..services.vendor_service import VendorService

logger = structlog.get_logger(__name__)


class ProcurementWorkflow(BaseWorkflow):
    """
    LangGraph workflow for managing procurement request lifecycle.
    
    States: CREATED → QUOTES_REQUESTED → QUOTES_RECEIVED → UNDER_REVIEW → APPROVED → PAID → COMPLETED
    """
    
    def _setup_graph(self) -> None:
        """Setup the procurement workflow graph."""
        
        # Add workflow nodes
        self.graph_builder.add_node("validate_request", self.validate_request)
        self.graph_builder.add_node("select_vendors", self.select_vendors)
        self.graph_builder.add_node("send_rfqs", self.send_rfqs)
        self.graph_builder.add_node("monitor_responses", self.monitor_responses)
        self.graph_builder.add_node("process_quotes", self.process_quotes)
        self.graph_builder.add_node("await_approval", self.await_approval)
        self.graph_builder.add_node("process_payment", self.process_payment)
        self.graph_builder.add_node("complete_request", self.complete_request)
        self.graph_builder.add_node("handle_error", self.handle_workflow_error)
        
        # Define workflow edges
        self.graph_builder.add_edge(START, "validate_request")
        
        # Conditional routing from validate_request
        self.graph_builder.add_conditional_edges(
            "validate_request",
            self.route_after_validation,
            {
                "valid": "select_vendors",
                "invalid": "handle_error",
                "retry": "validate_request",
            }
        )
        
        self.graph_builder.add_edge("select_vendors", "send_rfqs")
        
        # Conditional routing from send_rfqs
        self.graph_builder.add_conditional_edges(
            "send_rfqs",
            self.route_after_rfq_send,
            {
                "sent": "monitor_responses",
                "failed": "handle_error",
                "retry": "send_rfqs",
            }
        )
        
        self.graph_builder.add_conditional_edges(
            "monitor_responses",
            self.route_after_monitoring,
            {
                "quotes_received": "process_quotes",
                "waiting": "monitor_responses",
                "timeout": "process_quotes",  # Process whatever we have
            }
        )
        
        self.graph_builder.add_edge("process_quotes", "await_approval")
        
        self.graph_builder.add_conditional_edges(
            "await_approval",
            self.route_after_approval,
            {
                "approved": "process_payment",
                "rejected": END,
                "waiting": "await_approval",
            }
        )
        
        self.graph_builder.add_conditional_edges(
            "process_payment",
            self.route_after_payment,
            {
                "paid": "complete_request",
                "failed": "handle_error",
                "retry": "process_payment",
            }
        )
        
        self.graph_builder.add_edge("complete_request", END)
        self.graph_builder.add_edge("handle_error", END)
    
    async def validate_request(self, state: WorkflowState) -> WorkflowState:
        """Validate the procurement request data."""
        try:
            state = await self.log_step(state, "validate_request", "Validating procurement request")
            
            request_data = state["data"]
            
            # Validation checks
            required_fields = ["title", "items", "orgId", "createdBy"]
            missing_fields = [field for field in required_fields if not request_data.get(field)]
            
            if missing_fields:
                raise ValueError(f"Missing required fields: {missing_fields}")
            
            # Validate items structure
            items = request_data.get("items", [])
            if not items or not isinstance(items, list):
                raise ValueError("Items must be a non-empty list")
            
            for i, item in enumerate(items):
                if not item.get("name") or not item.get("quantity"):
                    raise ValueError(f"Item {i} missing name or quantity")
            
            # Update request status in database
            async with with_tenant(state["org_id"]) as db:
                await db.procurementrequest.update(
                    where={"id": state["entity_id"]},
                    data={"status": "CREATED"}
                )
            
            state["data"]["validation_status"] = "valid"
            state = await self.log_step(state, "validate_request", "✅ Request validation successful")
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "validate_request")
    
    async def select_vendors(self, state: WorkflowState) -> WorkflowState:
        """Select appropriate vendors for the procurement request."""
        try:
            state = await self.log_step(state, "select_vendors", "Selecting vendors for RFQ")
            
            vendor_service = VendorService()
            
            # Get vendors for the organization
            async with with_tenant(state["org_id"]) as db:
                vendors = await db.vendor.find_many(
                    where={
                        "orgId": state["org_id"],
                        "isActive": True,
                    }
                )
            
            if not vendors:
                raise ValueError("No active vendors found for organization")
            
            # For MVP, select all active vendors
            # TODO: Implement intelligent vendor selection based on items, history, etc.
            selected_vendors = [
                {
                    "id": vendor.id,
                    "name": vendor.name,
                    "email": vendor.email,
                }
                for vendor in vendors
            ]
            
            state["data"]["selected_vendors"] = selected_vendors
            state = await self.log_step(
                state, 
                "select_vendors", 
                f"✅ Selected {len(selected_vendors)} vendors"
            )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "select_vendors")
    
    async def send_rfqs(self, state: WorkflowState) -> WorkflowState:
        """Send RFQ emails to selected vendors."""
        try:
            state = await self.log_step(state, "send_rfqs", "Sending RFQ emails to vendors")
            
            email_service = EmailService()
            selected_vendors = state["data"]["selected_vendors"]
            request_data = state["data"]
            
            sent_count = 0
            failed_vendors = []
            
            for vendor in selected_vendors:
                try:
                    # Generate RFQ email content
                    email_content = await self._generate_rfq_email(request_data, vendor)
                    
                    # Send email
                    await email_service.send_rfq_email(
                        vendor_email=vendor["email"],
                        vendor_name=vendor["name"],
                        subject=f"RFQ: {request_data['title']}",
                        content=email_content,
                        request_id=state["entity_id"],
                    )
                    
                    sent_count += 1
                    
                except Exception as e:
                    logger.error(
                        "Failed to send RFQ to vendor",
                        vendor_id=vendor["id"],
                        vendor_email=vendor["email"],
                        error=str(e),
                    )
                    failed_vendors.append(vendor)
            
            if sent_count == 0:
                raise ValueError("Failed to send RFQ to any vendors")
            
            # Update request status
            async with with_tenant(state["org_id"]) as db:
                await db.procurementrequest.update(
                    where={"id": state["entity_id"]},
                    data={"status": "QUOTES_REQUESTED"}
                )
            
            state["data"]["rfq_sent_count"] = sent_count
            state["data"]["rfq_failed_vendors"] = failed_vendors
            state["data"]["rfq_sent_at"] = datetime.now().isoformat()
            
            state = await self.log_step(
                state,
                "send_rfqs",
                f"✅ Sent RFQ to {sent_count} vendors"
            )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "send_rfqs")
    
    async def monitor_responses(self, state: WorkflowState) -> WorkflowState:
        """Monitor for vendor quote responses."""
        try:
            state = await self.log_step(state, "monitor_responses", "Monitoring vendor responses")
            
            # Check for quotes received
            async with with_tenant(state["org_id"]) as db:
                quotes = await db.quote.find_many(
                    where={"requestId": state["entity_id"]}
                )
            
            quote_count = len(quotes)
            expected_count = state["data"]["rfq_sent_count"]
            
            # Check if we have received quotes or if timeout has passed
            rfq_sent_at = datetime.fromisoformat(state["data"]["rfq_sent_at"])
            timeout_hours = 48  # 48 hour timeout for quotes
            is_timeout = datetime.now() > rfq_sent_at + timedelta(hours=timeout_hours)
            
            state["data"]["quotes_received_count"] = quote_count
            state["data"]["quotes_expected_count"] = expected_count
            state["data"]["is_timeout"] = is_timeout
            
            if quote_count > 0:
                state["data"]["monitoring_status"] = "quotes_received"
                state = await self.log_step(
                    state,
                    "monitor_responses",
                    f"✅ Received {quote_count} quotes"
                )
            elif is_timeout:
                state["data"]["monitoring_status"] = "timeout"
                state = await self.log_step(
                    state,
                    "monitor_responses",
                    f"⏰ Timeout reached, processing {quote_count} quotes"
                )
            else:
                state["data"]["monitoring_status"] = "waiting"
                state = await self.log_step(
                    state,
                    "monitor_responses",
                    f"⏳ Waiting for quotes ({quote_count}/{expected_count})"
                )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "monitor_responses")
    
    async def process_quotes(self, state: WorkflowState) -> WorkflowState:
        """Process and normalize received quotes."""
        try:
            state = await self.log_step(state, "process_quotes", "Processing received quotes")
            
            # Get quotes from database
            async with with_tenant(state["org_id"]) as db:
                quotes = await db.quote.find_many(
                    where={"requestId": state["entity_id"]},
                    include={"vendor": True}
                )
                
                # Update request status
                await db.procurementrequest.update(
                    where={"id": state["entity_id"]},
                    data={"status": "QUOTES_RECEIVED"}
                )
            
            if not quotes:
                raise ValueError("No quotes received to process")
            
            # Process and normalize quotes
            processed_quotes = []
            for quote in quotes:
                processed_quote = {
                    "id": quote.id,
                    "vendor_id": quote.vendorId,
                    "vendor_name": quote.vendor.name,
                    "total_amount": float(quote.totalAmount),
                    "currency": quote.currency,
                    "delivery_days": quote.deliveryDays,
                    "valid_until": quote.validUntil.isoformat() if quote.validUntil else None,
                    "items": quote.items,
                    "terms": quote.terms,
                    "confidence": quote.confidence,
                    "created_at": quote.createdAt.isoformat(),
                }
                processed_quotes.append(processed_quote)
            
            # Sort by total amount (lowest first)
            processed_quotes.sort(key=lambda x: x["total_amount"])
            
            state["data"]["processed_quotes"] = processed_quotes
            state = await self.log_step(
                state,
                "process_quotes",
                f"✅ Processed {len(processed_quotes)} quotes"
            )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "process_quotes")
    
    async def await_approval(self, state: WorkflowState) -> WorkflowState:
        """Wait for human approval of selected quote."""
        try:
            state = await self.log_step(state, "await_approval", "Awaiting approval decision")
            
            # Update request status to under review
            async with with_tenant(state["org_id"]) as db:
                await db.procurementrequest.update(
                    where={"id": state["entity_id"]},
                    data={"status": "UNDER_REVIEW"}
                )
            
            # Check if approval has been made
            async with with_tenant(state["org_id"]) as db:
                request = await db.procurementrequest.find_unique(
                    where={"id": state["entity_id"]}
                )
            
            if request.approvedQuoteId:
                state["data"]["approval_status"] = "approved"
                state["data"]["approved_quote_id"] = request.approvedQuoteId
                state = await self.log_step(
                    state,
                    "await_approval",
                    f"✅ Quote {request.approvedQuoteId} approved"
                )
            else:
                state["data"]["approval_status"] = "waiting"
                state = await self.log_step(
                    state,
                    "await_approval",
                    "⏳ Waiting for approval decision"
                )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "await_approval")
    
    async def process_payment(self, state: WorkflowState) -> WorkflowState:
        """Process payment for approved quote."""
        try:
            state = await self.log_step(state, "process_payment", "Processing payment")

            approved_quote_id = state["data"]["approved_quote_id"]

            # Get approved quote details
            async with with_tenant(state["org_id"]) as db:
                quote = await db.quote.find_unique(
                    where={"id": approved_quote_id},
                    include={"vendor": True}
                )

            if not quote:
                raise ValueError(f"Approved quote not found: {approved_quote_id}")

            # Create payment record
            async with with_tenant(state["org_id"]) as db:
                payment = await db.payment.create(
                    data={
                        "orgId": state["org_id"],
                        "requestId": state["entity_id"],
                        "quoteId": approved_quote_id,
                        "amount": quote.totalAmount,
                        "currency": quote.currency,
                        "status": "PENDING",
                    }
                )

                # Update request status
                await db.procurementrequest.update(
                    where={"id": state["entity_id"]},
                    data={
                        "status": "PAYMENT_PENDING",
                        "approvedVendorId": quote.vendorId,
                        "approvedQuoteId": approved_quote_id,
                    }
                )

            # Integrate with Stripe for actual payment processing
            from src.services.payment_service import PaymentService
            payment_service = PaymentService()

            # Create a payment intent for the transaction
            try:
                payment_intent = await payment_service.create_payment_intent(
                    amount=int(quote.totalAmount * 100),  # Convert to cents
                    currency=quote.currency.lower(),
                    description=f"Payment for procurement request {state['entity_id']}",
                    request_id=state["entity_id"],
                    org_id=state["org_id"],
                    quote_id=approved_quote_id,
                    vendor_id=quote.vendorId
                )

                # Confirm the payment intent (this is where real payment would happen)
                # In a real implementation, you'd want to handle the payment confirmation properly
                # For now, we'll just confirm with a test payment method
                confirmed_payment = await payment_service.confirm_payment(
                    payment_intent_id=payment_intent["id"],
                    payment_method_id="pm_card_visa"  # Test payment method
                )

                # Verify payment succeeded
                if confirmed_payment.get("status") == "succeeded":
                    payment_status = "SUCCEEDED"
                elif confirmed_payment.get("status") == "processing":
                    payment_status = "PROCESSING"
                else:
                    payment_status = "FAILED"

            except Exception as payment_error:
                # If payment processing fails, mark as failed
                payment_status = "FAILED"
                await self.log_step(state, "process_payment", f"Payment failed: {str(payment_error)}")

            # Update payment status in database
            async with with_tenant(state["org_id"]) as db:
                await db.payment.update(
                    where={"id": payment.id},
                    data={
                        "status": payment_status,
                        "paidAt": datetime.now() if payment_status == "SUCCEEDED" else None,
                        "stripePaymentIntentId": payment_intent.get("id") if 'payment_intent' in locals() else None,
                        "stripeChargeId": confirmed_payment.get("charges", {}).get("data", [{}])[0].get("id") if payment_status != "FAILED" and 'confirmed_payment' in locals() else None,
                    }
                )

                # Update procurement request status based on payment result
                new_request_status = "PAID" if payment_status == "SUCCEEDED" else "PAYMENT_FAILED"
                await db.procurementrequest.update(
                    where={"id": state["entity_id"]},
                    data={"status": new_request_status}
                )

            state["data"]["payment_id"] = payment.id
            state["data"]["payment_status"] = payment_status
            state = await self.log_step(
                state,
                "process_payment",
                f"✅ Payment processed with status: {payment_status}"
            )

            return state

        except Exception as e:
            return await self.handle_error(state, e, "process_payment")
    
    async def complete_request(self, state: WorkflowState) -> WorkflowState:
        """Complete the procurement request."""
        try:
            state = await self.log_step(state, "complete_request", "Completing procurement request")
            
            # Update request status to completed
            async with with_tenant(state["org_id"]) as db:
                await db.procurementrequest.update(
                    where={"id": state["entity_id"]},
                    data={
                        "status": "COMPLETED",
                        "completedAt": datetime.now(),
                    }
                )
            
            state["data"]["completion_status"] = "completed"
            state = await self.log_step(
                state,
                "complete_request",
                "🎉 Procurement request completed successfully"
            )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "complete_request")
    
    async def handle_workflow_error(self, state: WorkflowState) -> WorkflowState:
        """Handle workflow errors and cleanup."""
        state = await self.log_step(
            state,
            "handle_error",
            f"❌ Workflow failed: {state.get('error_message', 'Unknown error')}"
        )
        
        # Update request status to indicate error
        try:
            async with with_tenant(state["org_id"]) as db:
                await db.procurementrequest.update(
                    where={"id": state["entity_id"]},
                    data={"status": "CANCELLED"}
                )
        except Exception as e:
            logger.error("Failed to update request status on error", error=str(e))
        
        return state
    
    # Routing functions
    def route_after_validation(self, state: WorkflowState) -> str:
        """Route after request validation."""
        validation_status = state["data"].get("validation_status")
        if validation_status == "valid":
            return "valid"
        elif self.should_retry(state):
            return "retry"
        else:
            return "invalid"
    
    def route_after_rfq_send(self, state: WorkflowState) -> str:
        """Route after RFQ sending."""
        sent_count = state["data"].get("rfq_sent_count", 0)
        if sent_count > 0:
            return "sent"
        elif self.should_retry(state):
            return "retry"
        else:
            return "failed"
    
    def route_after_monitoring(self, state: WorkflowState) -> str:
        """Route after response monitoring."""
        return state["data"].get("monitoring_status", "waiting")
    
    def route_after_approval(self, state: WorkflowState) -> str:
        """Route after approval check."""
        return state["data"].get("approval_status", "waiting")
    
    def route_after_payment(self, state: WorkflowState) -> str:
        """Route after payment processing."""
        payment_status = state["data"].get("payment_status")
        if payment_status == "paid":
            return "paid"
        elif self.should_retry(state):
            return "retry"
        else:
            return "failed"
    
    async def _generate_rfq_email(self, request_data: Dict[str, Any], vendor: Dict[str, Any]) -> str:
        """Generate RFQ email content."""
        items_text = "\n".join([
            f"- {item['name']} (Quantity: {item['quantity']})"
            for item in request_data["items"]
        ])
        
        return f"""
Dear {vendor['name']},

We are requesting a quote for the following items:

{items_text}

Request Details:
- Title: {request_data['title']}
- Description: {request_data.get('description', 'N/A')}
- Requested By: {request_data.get('requestedBy', 'As soon as possible')}

Please provide your quote including:
- Unit prices and total cost
- Delivery timeframe
- Payment terms
- Any additional conditions

Please reply to this email with your quote.

Best regards,
SupplyGraph Procurement Team
        """.strip()