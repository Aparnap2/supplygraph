"""Email service for sending RFQs and managing email communications."""

from typing import Dict, Any, List, Optional

import structlog

from .gmail_service import GmailService

logger = structlog.get_logger(__name__)


class EmailService:
    """High-level email service for procurement communications."""
    
    def __init__(self):
        self.gmail_service = GmailService()
    
    async def send_rfq_email(
        self,
        vendor_email: str,
        vendor_name: str,
        subject: str,
        content: str,
        request_id: str,
    ) -> str:
        """Send an RFQ email to a vendor."""
        return await self.gmail_service.send_rfq_email(
            vendor_email=vendor_email,
            vendor_name=vendor_name,
            subject=subject,
            content=content,
            request_id=request_id,
        )
    
    async def send_notification_email(
        self,
        to: str,
        subject: str,
        content: str,
    ) -> str:
        """Send a notification email."""
        return await self.gmail_service.send_email(
            to=to,
            subject=subject,
            body=content,
        )