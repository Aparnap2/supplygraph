"""Gmail API service for email integration."""

import base64
import email
from typing import Dict, Any, List, Optional
from datetime import datetime

import structlog
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from ..config import get_settings

logger = structlog.get_logger(__name__)


class GmailService:
    """Service for Gmail API integration."""
    
    def __init__(self):
        self.settings = get_settings()
        self.service = None
        self._credentials = None
    
    async def authenticate(self, credentials_data: Optional[Dict[str, Any]] = None) -> str:
        """Authenticate with Gmail API and return authorization URL if needed."""
        if credentials_data:
            self._credentials = Credentials.from_authorized_user_info(credentials_data)
        
        if not self._credentials or not self._credentials.valid:
            if self._credentials and self._credentials.expired and self._credentials.refresh_token:
                self._credentials.refresh(Request())
            else:
                # Need to get new credentials
                flow = Flow.from_client_config(
                    {
                        "web": {
                            "client_id": self.settings.gmail_client_id,
                            "client_secret": self.settings.gmail_client_secret,
                            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                            "token_uri": "https://oauth2.googleapis.com/token",
                            "redirect_uris": [self.settings.gmail_redirect_uri],
                        }
                    },
                    scopes=["https://www.googleapis.com/auth/gmail.readonly", 
                           "https://www.googleapis.com/auth/gmail.send"],
                )
                flow.redirect_uri = self.settings.gmail_redirect_uri
                
                auth_url, _ = flow.authorization_url(prompt="consent")
                return auth_url
        
        self.service = build("gmail", "v1", credentials=self._credentials)
        return "authenticated"
    
    async def handle_oauth_callback(self, authorization_code: str) -> Dict[str, Any]:
        """Handle OAuth callback and return credentials."""
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": self.settings.gmail_client_id,
                    "client_secret": self.settings.gmail_client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [self.settings.gmail_redirect_uri],
                }
            },
            scopes=["https://www.googleapis.com/auth/gmail.readonly", 
                   "https://www.googleapis.com/auth/gmail.send"],
        )
        flow.redirect_uri = self.settings.gmail_redirect_uri
        
        flow.fetch_token(code=authorization_code)
        self._credentials = flow.credentials
        self.service = build("gmail", "v1", credentials=self._credentials)
        
        return {
            "token": self._credentials.token,
            "refresh_token": self._credentials.refresh_token,
            "token_uri": self._credentials.token_uri,
            "client_id": self._credentials.client_id,
            "client_secret": self._credentials.client_secret,
            "scopes": self._credentials.scopes,
        }
    
    async def search_emails(self, query: str, max_results: int = 100) -> List[str]:
        """Search for emails matching the query."""
        if not self.service:
            raise ValueError("Gmail service not authenticated")
        
        try:
            result = self.service.users().messages().list(
                userId="me",
                q=query,
                maxResults=max_results
            ).execute()
            
            messages = result.get("messages", [])
            return [msg["id"] for msg in messages]
            
        except HttpError as e:
            logger.error("Failed to search emails", error=str(e))
            raise
    
    async def get_email_details(self, message_id: str) -> Dict[str, Any]:
        """Get detailed information about an email."""
        if not self.service:
            raise ValueError("Gmail service not authenticated")
        
        try:
            message = self.service.users().messages().get(
                userId="me",
                id=message_id,
                format="full"
            ).execute()
            
            return self._parse_email_message(message)
            
        except HttpError as e:
            logger.error("Failed to get email details", message_id=message_id, error=str(e))
            raise
    
    async def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        from_email: Optional[str] = None,
        attachments: Optional[List[Dict[str, Any]]] = None,
    ) -> str:
        """Send an email via Gmail API."""
        if not self.service:
            raise ValueError("Gmail service not authenticated")
        
        try:
            message = self._create_email_message(
                to=to,
                subject=subject,
                body=body,
                from_email=from_email,
                attachments=attachments,
            )
            
            result = self.service.users().messages().send(
                userId="me",
                body=message
            ).execute()
            
            logger.info("Email sent successfully", message_id=result["id"], to=to)
            return result["id"]
            
        except HttpError as e:
            logger.error("Failed to send email", to=to, error=str(e))
            raise
    
    async def send_rfq_email(
        self,
        vendor_email: str,
        vendor_name: str,
        subject: str,
        content: str,
        request_id: str,
    ) -> str:
        """Send an RFQ email to a vendor."""
        # Add request ID to subject for tracking
        full_subject = f"{subject} [REQ:{request_id}]"
        
        # Add footer with request tracking
        full_content = f"""{content}

---
Request ID: {request_id}
This is an automated request from SupplyGraph.
Please reply to this email with your quote.
"""
        
        return await self.send_email(
            to=vendor_email,
            subject=full_subject,
            body=full_content,
        )
    
    def _parse_email_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Parse Gmail API message into standardized format."""
        headers = {h["name"]: h["value"] for h in message["payload"].get("headers", [])}
        
        # Extract basic info
        email_data = {
            "id": message["id"],
            "thread_id": message["threadId"],
            "subject": headers.get("Subject", ""),
            "from": headers.get("From", ""),
            "to": self._parse_recipients(headers.get("To", "")),
            "cc": self._parse_recipients(headers.get("Cc", "")),
            "date": headers.get("Date", ""),
            "received_at": datetime.fromtimestamp(int(message["internalDate"]) / 1000),
            "participants": self._extract_participants(headers),
        }
        
        # Extract body and attachments
        body, attachments = self._extract_body_and_attachments(message["payload"])
        email_data["body"] = body
        email_data["attachments"] = attachments
        
        return email_data
    
    def _parse_recipients(self, recipients_str: str) -> List[str]:
        """Parse recipient string into list of email addresses."""
        if not recipients_str:
            return []
        
        # Simple parsing - can be enhanced for complex formats
        recipients = [r.strip() for r in recipients_str.split(",")]
        return [r for r in recipients if "@" in r]
    
    def _extract_participants(self, headers: Dict[str, str]) -> List[str]:
        """Extract all email participants."""
        participants = set()
        
        for field in ["From", "To", "Cc", "Bcc"]:
            if field in headers:
                participants.update(self._parse_recipients(headers[field]))
        
        return list(participants)
    
    def _extract_body_and_attachments(self, payload: Dict[str, Any]) -> tuple[str, List[Dict[str, Any]]]:
        """Extract email body and attachments from payload."""
        body = ""
        attachments = []
        
        def process_part(part):
            nonlocal body, attachments
            
            mime_type = part.get("mimeType", "")
            
            if mime_type == "text/plain":
                if "data" in part.get("body", {}):
                    body_data = part["body"]["data"]
                    decoded_body = base64.urlsafe_b64decode(body_data).decode("utf-8")
                    body += decoded_body
            
            elif mime_type == "text/html" and not body:
                # Use HTML as fallback if no plain text
                if "data" in part.get("body", {}):
                    body_data = part["body"]["data"]
                    decoded_body = base64.urlsafe_b64decode(body_data).decode("utf-8")
                    # Simple HTML to text conversion
                    import re
                    body = re.sub(r'<[^>]+>', '', decoded_body)
            
            elif mime_type.startswith("multipart/"):
                # Process multipart recursively
                for subpart in part.get("parts", []):
                    process_part(subpart)
            
            else:
                # Check if it's an attachment
                filename = None
                for header in part.get("headers", []):
                    if header["name"] == "Content-Disposition":
                        if "filename=" in header["value"]:
                            filename = header["value"].split("filename=")[1].strip('"')
                            break
                
                if filename or part.get("body", {}).get("attachmentId"):
                    attachment = {
                        "filename": filename or "attachment",
                        "mime_type": mime_type,
                        "size": part.get("body", {}).get("size", 0),
                        "attachment_id": part.get("body", {}).get("attachmentId"),
                    }
                    attachments.append(attachment)
        
        process_part(payload)
        return body.strip(), attachments
    
    def _create_email_message(
        self,
        to: str,
        subject: str,
        body: str,
        from_email: Optional[str] = None,
        attachments: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Create email message for Gmail API."""
        import email.mime.text
        import email.mime.multipart
        
        if attachments:
            message = email.mime.multipart.MIMEMultipart()
            message.attach(email.mime.text.MIMEText(body, "plain"))
            
            # TODO: Add attachment support
        else:
            message = email.mime.text.MIMEText(body, "plain")
        
        message["to"] = to
        message["subject"] = subject
        if from_email:
            message["from"] = from_email
        
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")
        return {"raw": raw_message}