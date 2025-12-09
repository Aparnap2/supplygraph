"""
Vendor email service for agentic procurement negotiation
"""
import asyncio
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class VendorQuoteRequest:
    """Request for vendor quote"""
    vendor_id: str
    vendor_name: str
    vendor_email: str
    items: List[Dict[str, Any]]
    organization_id: str
    procurement_id: str
    deadline: datetime
    special_instructions: Optional[str] = None

@dataclass
class VendorQuoteResponse:
    """Response from vendor"""
    vendor_id: str
    quote_id: str
    items: List[Dict[str, Any]]
    total_amount: float
    delivery_time: str
    valid_until: datetime
    notes: Optional[str] = None

class VendorEmailService:
    """Service for managing vendor email communications"""

    def __init__(self, smtp_config: Dict[str, Any]):
        self.smtp_config = smtp_config
        self.pending_requests = {}  # Track pending quote requests

    async def send_quote_requests(self, quote_requests: List[VendorQuoteRequest]) -> Dict[str, Any]:
        """
        Send quote requests to multiple vendors asynchronously
        """
        results = {
            'sent': [],
            'failed': [],
            'total_vendors': len(quote_requests)
        }

        # Send emails concurrently
        tasks = [
            self._send_single_quote_request(request) 
            for request in quote_requests
        ]
        
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        for i, response in enumerate(responses):
            request = quote_requests[i]
            if isinstance(response, Exception):
                logger.error(f"Failed to send quote request to {request.vendor_name}: {response}")
                results['failed'].append({
                    'vendor_id': request.vendor_id,
                    'vendor_name': request.vendor_name,
                    'error': str(response)
                })
            else:
                logger.info(f"Successfully sent quote request to {request.vendor_name}")
                results['sent'].append(response)
                # Track pending request
                self.pending_requests[request.vendor_id] = {
                    'request': request,
                    'sent_at': datetime.utcnow(),
                    'status': 'pending'
                }

        return {
            'success': len(results['failed']) == 0,
            'sent_count': len(results['sent']),
            'failed_count': len(results['failed']),
            'details': results
        }

    async def _send_single_quote_request(self, request: VendorQuoteRequest) -> Dict[str, Any]:
        """
        Send quote request to a single vendor
        """
        try:
            # Generate professional email content
            email_content = self._generate_quote_request_email(request)
            
            # Simulate email sending (in production, use actual SMTP)
            await asyncio.sleep(0.1)  # Simulate network latency
            
            # In production, this would be actual SMTP send
            # For now, simulate successful delivery
            delivery_id = f"email_{request.vendor_id}_{datetime.utcnow().timestamp()}"
            
            return {
                'vendor_id': request.vendor_id,
                'vendor_name': request.vendor_name,
                'delivery_id': delivery_id,
                'sent_at': datetime.utcnow().isoformat(),
                'status': 'sent',
                'deadline': request.deadline.isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error sending quote request to {request.vendor_name}: {e}")
            raise e

    def _generate_quote_request_email(self, request: VendorQuoteRequest) -> str:
        """
        Generate professional email content for quote request
        """
        items_list = "\n".join([
            f"• {item.get('name', 'Unknown')} - Quantity: {item.get('quantity', 0)} {item.get('unit', 'units')}"
            f"  Specifications: {item.get('specifications', 'N/A')}"
            for item in request.items
        ])

        deadline_str = request.deadline.strftime("%B %d, %Y at %I:%M %p")
        
        email_content = f"""
Subject: Request for Quote - {request.organization_id} - Procurement {request.procurement_id}

Dear {request.vendor_name} Procurement Team,

We hope this email finds you well.

{request.organization_id} is requesting quotes for the following items:

{items_list}

Special Instructions:
{request.special_instructions or 'None'}

Requirements:
• Please provide itemized pricing
• Include delivery timeline
• Specify payment terms
• Quote valid until: {deadline_str}
• Reference: Procurement ID {request.procurement_id}

Next Steps:
1. Prepare your detailed quote
2. Respond by the deadline above
3. Include your quote reference number
4. Send any questions about specifications

We value your partnership and look forward to receiving your competitive quote.

Best regards,
Procurement Team
{request.organization_id}

---
This is an automated request from SupplyGraph AI Procurement System
For questions, please reply to this email or contact our procurement team.
"""

        return email_content.strip()

    async def process_vendor_response(self, vendor_id: str, response_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process incoming vendor quote response
        """
        try:
            # Validate response format
            required_fields = ['quote_id', 'items', 'total_amount', 'delivery_time']
            for field in required_fields:
                if field not in response_data:
                    raise ValueError(f"Missing required field: {field}")

            # Create quote response object
            quote_response = VendorQuoteResponse(
                vendor_id=vendor_id,
                quote_id=response_data['quote_id'],
                items=response_data['items'],
                total_amount=float(response_data['total_amount']),
                delivery_time=response_data['delivery_time'],
                valid_until=datetime.utcnow() + timedelta(days=7),  # Quotes valid for 7 days
                notes=response_data.get('notes')
            )

            # Update pending request status
            if vendor_id in self.pending_requests:
                self.pending_requests[vendor_id]['status'] = 'responded'
                self.pending_requests[vendor_id]['response'] = quote_response
                self.pending_requests[vendor_id]['responded_at'] = datetime.utcnow()

            logger.info(f"Processed quote response from vendor {vendor_id}")
            
            return {
                'success': True,
                'vendor_id': vendor_id,
                'quote_id': quote_response.quote_id,
                'total_amount': quote_response.total_amount,
                'processed_at': datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Error processing vendor response from {vendor_id}: {e}")
            return {
                'success': False,
                'vendor_id': vendor_id,
                'error': str(e),
                'processed_at': datetime.utcnow().isoformat()
            }

    def get_pending_requests(self) -> Dict[str, Any]:
        """
        Get status of all pending quote requests
        """
        return {
            'total_pending': len(self.pending_requests),
            'requests': {
                vendor_id: {
                    'vendor_name': data['request'].vendor_name,
                    'sent_at': data['sent_at'].isoformat(),
                    'status': data['status'],
                    'deadline': data['request'].deadline.isoformat(),
                    'responded_at': data.get('responded_at', {}).isoformat() if data.get('responded_at') else None
                }
                for vendor_id, data in self.pending_requests.items()
            }
        }

    async def send_follow_up_reminders(self) -> Dict[str, Any]:
        """
        Send follow-up reminders for vendors who haven't responded
        """
        now = datetime.utcnow()
        reminders_sent = 0
        
        for vendor_id, data in self.pending_requests.items():
            if data['status'] == 'pending':
                # Check if 24 hours have passed since initial request
                time_since_sent = now - data['sent_at']
                if time_since_sent > timedelta(hours=24):
                    try:
                        # Send follow-up email
                        follow_up_content = self._generate_follow_up_email(data['request'])
                        
                        # Simulate sending
                        await asyncio.sleep(0.05)
                        
                        reminders_sent += 1
                        logger.info(f"Sent follow-up reminder to {data['request'].vendor_name}")
                        
                    except Exception as e:
                        logger.error(f"Failed to send follow-up to {data['request'].vendor_name}: {e}")

        return {
            'reminders_sent': reminders_sent,
            'total_pending': len(self.pending_requests),
            'timestamp': now.isoformat()
        }

    def _generate_follow_up_email(self, request: VendorQuoteRequest) -> str:
        """
        Generate follow-up email content
        """
        return f"""
Subject: Follow-up: Quote Request - {request.organization_id} - Procurement {request.procurement_id}

Dear {request.vendor_name} Procurement Team,

Following up on our quote request sent on {request.sent_at.strftime("%B %d, %Y")}.

We haven't yet received your quote for the following items:
{self._generate_items_summary(request.items)}

This is a friendly reminder that the deadline for submissions is {request.deadline.strftime("%B %d, %Y at %I:%M %p")}.

If you've already sent your quote, please accept our apologies and disregard this message.
If you need any clarification on the specifications, please let us know.

We value your business and look forward to your response.

Best regards,
Procurement Team
{request.organization_id}

---
SupplyGraph AI Procurement System | Automated Follow-up
"""

    def _generate_items_summary(self, items: List[Dict[str, Any]]) -> str:
        """Generate summary of items for follow-up emails"""
        return "\n".join([
            f"• {item.get('name', 'Unknown')} (Qty: {item.get('quantity', 0)})"
            for item in items
        ])