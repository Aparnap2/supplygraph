"""Email Processing Workflow - LangGraph implementation for Gmail integration and email monitoring."""

import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

import structlog
from langgraph.graph import START, END

from .base import BaseWorkflow, WorkflowState
from ..database import with_tenant
from ..services.gmail_service import GmailService
from .quote_processing import QuoteProcessingWorkflow

logger = structlog.get_logger(__name__)


class EmailProcessingWorkflow(BaseWorkflow):
    """
    LangGraph workflow for processing emails and extracting quotes.
    
    Flow: MONITOR → FETCH → CLASSIFY → PROCESS_QUOTES → STORE
    """
    
    def _setup_graph(self) -> None:
        """Setup the email processing workflow graph."""
        
        # Add workflow nodes
        self.graph_builder.add_node("monitor_emails", self.monitor_emails)
        self.graph_builder.add_node("fetch_new_emails", self.fetch_new_emails)
        self.graph_builder.add_node("classify_emails", self.classify_emails)
        self.graph_builder.add_node("process_quote_emails", self.process_quote_emails)
        self.graph_builder.add_node("store_email_data", self.store_email_data)
        self.graph_builder.add_node("handle_processing_error", self.handle_processing_error)
        
        # Define workflow edges
        self.graph_builder.add_edge(START, "monitor_emails")
        
        # Conditional routing from monitor_emails
        self.graph_builder.add_conditional_edges(
            "monitor_emails",
            self.route_after_monitoring,
            {
                "new_emails": "fetch_new_emails",
                "no_emails": END,
                "error": "handle_processing_error",
            }
        )
        
        self.graph_builder.add_edge("fetch_new_emails", "classify_emails")
        
        # Conditional routing from classify_emails
        self.graph_builder.add_conditional_edges(
            "classify_emails",
            self.route_after_classification,
            {
                "has_quotes": "process_quote_emails",
                "no_quotes": "store_email_data",
                "error": "handle_processing_error",
            }
        )
        
        self.graph_builder.add_edge("process_quote_emails", "store_email_data")
        self.graph_builder.add_edge("store_email_data", END)
        self.graph_builder.add_edge("handle_processing_error", END)
    
    async def monitor_emails(self, state: WorkflowState) -> WorkflowState:
        """Monitor Gmail for new emails related to procurement."""
        try:
            state = await self.log_step(state, "monitor_emails", "Monitoring Gmail for new emails")
            
            gmail_service = GmailService()
            org_id = state["org_id"]
            
            # Get the last processed timestamp
            last_processed = state["data"].get("last_processed_at")
            if not last_processed:
                # Default to 24 hours ago for first run
                last_processed = datetime.now() - timedelta(hours=24)
            else:
                last_processed = datetime.fromisoformat(last_processed)
            
            # Search for new emails
            search_query = self._build_email_search_query(org_id, last_processed)
            new_email_ids = await gmail_service.search_emails(search_query)
            
            state["data"]["new_email_ids"] = new_email_ids
            state["data"]["email_count"] = len(new_email_ids)
            
            if new_email_ids:
                state["data"]["monitoring_status"] = "new_emails"
                state = await self.log_step(
                    state,
                    "monitor_emails",
                    f"✅ Found {len(new_email_ids)} new emails"
                )
            else:
                state["data"]["monitoring_status"] = "no_emails"
                state = await self.log_step(
                    state,
                    "monitor_emails",
                    "📭 No new emails found"
                )
            
            return state
            
        except Exception as e:
            state["data"]["monitoring_status"] = "error"
            return await self.handle_error(state, e, "monitor_emails")
    
    async def fetch_new_emails(self, state: WorkflowState) -> WorkflowState:
        """Fetch detailed email data for new emails."""
        try:
            state = await self.log_step(state, "fetch_new_emails", "Fetching email details")
            
            gmail_service = GmailService()
            email_ids = state["data"]["new_email_ids"]
            
            fetched_emails = []
            failed_emails = []
            
            for email_id in email_ids:
                try:
                    email_data = await gmail_service.get_email_details(email_id)
                    fetched_emails.append(email_data)
                except Exception as e:
                    logger.warning(
                        "Failed to fetch email",
                        email_id=email_id,
                        error=str(e)
                    )
                    failed_emails.append(email_id)
            
            state["data"]["fetched_emails"] = fetched_emails
            state["data"]["failed_email_ids"] = failed_emails
            
            state = await self.log_step(
                state,
                "fetch_new_emails",
                f"✅ Fetched {len(fetched_emails)} emails ({len(failed_emails)} failed)"
            )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "fetch_new_emails")
    
    async def classify_emails(self, state: WorkflowState) -> WorkflowState:
        """Classify emails to identify quote responses."""
        try:
            state = await self.log_step(state, "classify_emails", "Classifying emails")
            
            fetched_emails = state["data"]["fetched_emails"]
            quote_emails = []
            other_emails = []
            
            for email in fetched_emails:
                classification = await self._classify_email(email)
                
                if classification["is_quote"]:
                    email["classification"] = classification
                    quote_emails.append(email)
                else:
                    other_emails.append(email)
            
            state["data"]["quote_emails"] = quote_emails
            state["data"]["other_emails"] = other_emails
            
            if quote_emails:
                state["data"]["classification_status"] = "has_quotes"
                state = await self.log_step(
                    state,
                    "classify_emails",
                    f"✅ Identified {len(quote_emails)} quote emails"
                )
            else:
                state["data"]["classification_status"] = "no_quotes"
                state = await self.log_step(
                    state,
                    "classify_emails",
                    "📄 No quote emails identified"
                )
            
            return state
            
        except Exception as e:
            state["data"]["classification_status"] = "error"
            return await self.handle_error(state, e, "classify_emails")
    
    async def process_quote_emails(self, state: WorkflowState) -> WorkflowState:
        """Process quote emails using the quote processing workflow."""
        try:
            state = await self.log_step(state, "process_quote_emails", "Processing quote emails")
            
            quote_emails = state["data"]["quote_emails"]
            processed_quotes = []
            failed_quotes = []
            
            # Initialize quote processing workflow
            quote_workflow = QuoteProcessingWorkflow()
            compiled_quote_workflow = quote_workflow.compile()
            
            for email in quote_emails:
                try:
                    # Determine which procurement request this quote is for
                    request_id = await self._match_email_to_request(email, state["org_id"])
                    
                    if not request_id:
                        logger.warning(
                            "Could not match email to procurement request",
                            email_id=email["id"],
                            subject=email["subject"]
                        )
                        failed_quotes.append({
                            "email": email,
                            "error": "Could not match to procurement request"
                        })
                        continue
                    
                    # Create quote processing state
                    quote_state = quote_workflow.create_initial_state(
                        workflow_id=f"quote_processing_{email['id']}",
                        org_id=state["org_id"],
                        entity_id=email["id"],
                        entity_type="email",
                        data={
                            "email_data": email,
                            "request_id": request_id,
                        }
                    )
                    
                    # Process the quote
                    final_quote_state = None
                    async for quote_state_update in compiled_quote_workflow.astream(quote_state):
                        final_quote_state = quote_state_update
                    
                    if final_quote_state and final_quote_state["data"].get("quote_id"):
                        processed_quotes.append({
                            "email_id": email["id"],
                            "quote_id": final_quote_state["data"]["quote_id"],
                            "request_id": request_id,
                        })
                    else:
                        failed_quotes.append({
                            "email": email,
                            "error": final_quote_state.get("error_message", "Unknown processing error")
                        })
                
                except Exception as e:
                    logger.error(
                        "Failed to process quote email",
                        email_id=email["id"],
                        error=str(e)
                    )
                    failed_quotes.append({
                        "email": email,
                        "error": str(e)
                    })
            
            state["data"]["processed_quotes"] = processed_quotes
            state["data"]["failed_quotes"] = failed_quotes
            
            state = await self.log_step(
                state,
                "process_quote_emails",
                f"✅ Processed {len(processed_quotes)} quotes ({len(failed_quotes)} failed)"
            )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "process_quote_emails")
    
    async def store_email_data(self, state: WorkflowState) -> WorkflowState:
        """Store email processing results and update tracking."""
        try:
            state = await self.log_step(state, "store_email_data", "Storing email processing results")
            
            fetched_emails = state["data"]["fetched_emails"]
            processed_quotes = state["data"].get("processed_quotes", [])
            
            # Store email threads and messages
            async with with_tenant(state["org_id"]) as db:
                for email in fetched_emails:
                    # Create or update email thread
                    thread = await db.emailthread.upsert(
                        where={"gmailThreadId": email["thread_id"]},
                        update={
                            "lastMessageAt": email["received_at"],
                            "messageCount": {"increment": 1},
                        },
                        create={
                            "orgId": state["org_id"],
                            "gmailThreadId": email["thread_id"],
                            "subject": email["subject"],
                            "participants": email["participants"],
                            "lastMessageAt": email["received_at"],
                            "messageCount": 1,
                            "requestId": self._extract_request_id_from_email(email),
                        }
                    )
                    
                    # Create email message record
                    await db.emailmessage.upsert(
                        where={"gmailMessageId": email["id"]},
                        update={
                            "isProcessed": True,
                            "extractedData": email.get("classification", {}),
                        },
                        create={
                            "threadId": thread.id,
                            "gmailMessageId": email["id"],
                            "from": email["from"],
                            "to": email["to"],
                            "subject": email["subject"],
                            "body": email["body"],
                            "attachments": email.get("attachments", []),
                            "isProcessed": True,
                            "extractedData": email.get("classification", {}),
                            "receivedAt": email["received_at"],
                        }
                    )
            
            # Update last processed timestamp
            state["data"]["last_processed_at"] = datetime.now().isoformat()
            
            state = await self.log_step(
                state,
                "store_email_data",
                f"✅ Stored {len(fetched_emails)} email records"
            )
            
            return state
            
        except Exception as e:
            return await self.handle_error(state, e, "store_email_data")
    
    async def handle_processing_error(self, state: WorkflowState) -> WorkflowState:
        """Handle email processing errors."""
        state = await self.log_step(
            state,
            "handle_processing_error",
            f"❌ Email processing failed: {state.get('error_message', 'Unknown error')}"
        )
        
        # Log error for monitoring
        try:
            logger.error(
                "Email processing workflow failed",
                org_id=state["org_id"],
                error=state.get("error_message"),
                step=state.get("current_step"),
            )
        except Exception:
            pass
        
        return state
    
    # Routing functions
    def route_after_monitoring(self, state: WorkflowState) -> str:
        """Route after email monitoring."""
        return state["data"].get("monitoring_status", "error")
    
    def route_after_classification(self, state: WorkflowState) -> str:
        """Route after email classification."""
        return state["data"].get("classification_status", "error")
    
    # Helper methods
    def _build_email_search_query(self, org_id: str, since: datetime) -> str:
        """Build Gmail search query for procurement-related emails."""
        # Format date for Gmail search (YYYY/MM/DD)
        since_str = since.strftime("%Y/%m/%d")
        
        # Search for emails that might contain quotes
        # This is a basic implementation - can be enhanced with more sophisticated filtering
        query_parts = [
            f"after:{since_str}",
            "has:attachment OR (quote OR quotation OR proposal OR estimate OR pricing)",
            "in:inbox",
        ]
        
        return " ".join(query_parts)
    
    async def _classify_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Classify an email to determine if it contains a quote."""
        subject = email.get("subject", "").lower()
        body = email.get("body", "").lower()
        
        # Keywords that indicate a quote
        quote_keywords = [
            "quote", "quotation", "proposal", "estimate", "pricing",
            "price list", "cost", "total", "amount", "invoice",
            "rfq", "request for quote", "bid", "tender"
        ]
        
        # Check for quote indicators
        has_quote_keywords = any(keyword in subject or keyword in body for keyword in quote_keywords)
        has_attachments = bool(email.get("attachments"))
        has_pricing_patterns = self._has_pricing_patterns(body)
        
        # Calculate confidence score
        confidence = 0.0
        if has_quote_keywords:
            confidence += 0.4
        if has_attachments:
            confidence += 0.3
        if has_pricing_patterns:
            confidence += 0.3
        
        is_quote = confidence > 0.5
        
        return {
            "is_quote": is_quote,
            "confidence": confidence,
            "indicators": {
                "has_quote_keywords": has_quote_keywords,
                "has_attachments": has_attachments,
                "has_pricing_patterns": has_pricing_patterns,
            }
        }
    
    def _has_pricing_patterns(self, text: str) -> bool:
        """Check if text contains pricing patterns."""
        import re
        
        # Look for currency patterns
        currency_patterns = [
            r'\$\d+(?:,\d{3})*(?:\.\d{2})?',  # $1,234.56
            r'\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:USD|usd|\$)',  # 1234.56 USD
            r'(?:total|amount|price|cost):\s*\$?\d+',  # total: $123
        ]
        
        for pattern in currency_patterns:
            if re.search(pattern, text):
                return True
        
        return False
    
    async def _match_email_to_request(self, email: Dict[str, Any], org_id: str) -> Optional[str]:
        """Match an email to a procurement request."""
        # Try to extract request ID from email subject or body
        request_id = self._extract_request_id_from_email(email)
        
        if request_id:
            # Verify the request exists
            async with with_tenant(org_id) as db:
                request = await db.procurementrequest.find_unique(
                    where={"id": request_id}
                )
                if request:
                    return request_id
        
        # If no direct match, try to match by vendor and timing
        vendor_email = email.get("from", "").lower()
        
        async with with_tenant(org_id) as db:
            # Find vendor by email
            vendor = await db.vendor.find_first(
                where={
                    "orgId": org_id,
                    "email": vendor_email,
                }
            )
            
            if vendor:
                # Find recent requests that might match
                recent_requests = await db.procurementrequest.find_many(
                    where={
                        "orgId": org_id,
                        "status": {"in": ["QUOTES_REQUESTED", "QUOTES_RECEIVED"]},
                        "createdAt": {"gte": datetime.now() - timedelta(days=30)},
                    },
                    order_by={"createdAt": "desc"},
                    take=5,
                )
                
                # For now, return the most recent request
                # TODO: Implement more sophisticated matching logic
                if recent_requests:
                    return recent_requests[0].id
        
        return None
    
    def _extract_request_id_from_email(self, email: Dict[str, Any]) -> Optional[str]:
        """Extract procurement request ID from email content."""
        import re
        
        # Look for request ID patterns in subject and body
        text = f"{email.get('subject', '')} {email.get('body', '')}"
        
        # Common patterns for request IDs
        patterns = [
            r'request[:\s]+([a-zA-Z0-9_-]+)',
            r'rfq[:\s]+([a-zA-Z0-9_-]+)',
            r'req[:\s]*#?([a-zA-Z0-9_-]+)',
            r'id[:\s]+([a-zA-Z0-9_-]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return None