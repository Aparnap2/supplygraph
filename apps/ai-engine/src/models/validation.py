"""
Production-ready Pydantic models with comprehensive validation and security
"""
import re
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Union, Literal, Set
from enum import Enum
import secrets

from pydantic import (
    BaseModel, Field, EmailStr, HttpUrl, validator, root_validator,
    constr, ValidationError, Extra, parse_obj_as
)
from pydantic.fields import Field
import phonenumbers
from bleach import clean
import html
import hashlib

# Configure secure defaults
MAX_MESSAGE_LENGTH = 10000
MAX_ORG_ID_LENGTH = 100
MAX_USER_ID_LENGTH = 100
MAX_THREAD_ID_LENGTH = 200
MAX_ACTION_DATA_SIZE = 1024 * 1024  # 1MB

class SecurityLevel(Enum):
    """Security validation levels"""
    STRICT = "strict"
    MODERATE = "moderate"
    PERMISSIVE = "permissive"

class MessageRole(Enum):
    """Message role types"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    TOOL = "tool"

class WorkflowStatus(Enum):
    """Workflow status types"""
    PENDING = "pending"
    ANALYZING = "analyzing"
    PROCESSING = "processing"
    APPROVAL_PENDING = "approval_pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    ERROR = "error"
    TIMEOUT = "timeout"

class SanitizedString(str):
    """Custom string type with HTML sanitization"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, values=None, config=None):
        if not isinstance(v, str):
            raise TypeError('string required')

        # Remove HTML tags and dangerous content
        cleaned = clean(
            v,
            tags=[],  # Remove all HTML tags
            attributes={},
            strip=True
        )

        # URL decode any encoded content
        cleaned = html.unescape(cleaned)

        # Trim whitespace
        cleaned = cleaned.strip()

        return cleaned

class SecureID(str):
    """Secure ID validation"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, values=None, config=None):
        if not isinstance(v, str):
            raise TypeError('string required')

        # Allow UUID format or secure random string
        try:
            uuid.UUID(v)
            return v
        except ValueError:
            # Check if it's a hex string (random generated ID)
            if re.match(r'^[a-f0-9]{16,64}$', v.lower()):
                return v
            raise ValueError('Invalid ID format. Must be UUID or secure hex string')

class BaseSecureModel(BaseModel):
    """Base model with security configurations"""

    class Config:
        # Use strict validation
        strict = True
        # Extra fields are forbidden
        extra = Extra.forbid
        # Validate assignment
        validate_assignment = True
        # Use enum values instead of names
        use_enum_values = True

class SecureChatMessage(BaseSecureModel):
    """Secure chat message model with comprehensive validation"""

    message: SanitizedString = Field(
        ...,
        min_length=1,
        max_length=MAX_MESSAGE_LENGTH,
        description="Sanitized user message content"
    )

    org_id: SecureID = Field(
        ...,
        min_length=1,
        max_length=MAX_ORG_ID_LENGTH,
        description="Secure organization ID"
    )

    user_id: SecureID = Field(
        ...,
        min_length=1,
        max_length=MAX_USER_ID_LENGTH,
        description="Secure user ID"
    )

    session_id: Optional[SecureID] = Field(
        None,
        description="Optional session ID for tracking"
    )

    metadata: Optional[Dict[str, Any]] = Field(
        None,
        description="Optional metadata (size limited)"
    )

    security_level: SecurityLevel = Field(
        SecurityLevel.STRICT,
        description="Security validation level"
    )

    timestamp: Optional[datetime] = Field(
        None,
        description="Message timestamp (server-side if not provided)"
    )

    ip_address: Optional[str] = Field(
        None,
        description="Client IP address for rate limiting"
    )

    user_agent: Optional[str] = Field(
        None,
        max_length=500,
        description="Client user agent"
    )

    @validator('message')
    def validate_message_content(cls, v, values, **kwargs):
        """Additional message content validation"""
        security_level = values.get('security_level', SecurityLevel.STRICT)

        # Check for common injection patterns
        dangerous_patterns = [
            r'<script[^>]*>.*?</script>',  # Script tags
            r'javascript:',  # JavaScript protocol
            r'on\w+\s*=',  # Event handlers
            r'data:text/html',  # Data protocol
            r'vbscript:',  # VBScript protocol
        ]

        for pattern in dangerous_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError('Message contains potentially dangerous content')

        # Additional checks for strict security
        if security_level == SecurityLevel.STRICT:
            # Check for SQL injection patterns
            sql_patterns = [
                r'\b(union|select|insert|update|delete|drop|create|alter)\b',
                r"'|;|\\|/\*|\*/|\-\-|\#",
                r'\b(or|and)\s+\d+\s*=\s*\d+',
            ]

            for pattern in sql_patterns:
                if re.search(pattern, v, re.IGNORECASE):
                    raise ValueError('Message contains potentially dangerous SQL patterns')

        return v

    @validator('org_id')
    def validate_org_id(cls, v):
        """Validate organization ID"""
        # Check for valid format
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Organization ID contains invalid characters')

        return v

    @validator('user_id')
    def validate_user_id(cls, v):
        """Validate user ID"""
        # Check for valid format
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('User ID contains invalid characters')

        return v

    @validator('metadata')
    def validate_metadata(cls, v):
        """Validate metadata size and content"""
        if v is None:
            return v

        # Check metadata size
        import json
        metadata_size = len(json.dumps(v, default=str))
        if metadata_size > 10240:  # 10KB limit
            raise ValueError('Metadata size exceeds 10KB limit')

        return v

    @validator('ip_address')
    def validate_ip_address(cls, v):
        """Validate IP address format"""
        if v is None:
            return v

        import ipaddress
        try:
            ipaddress.ip_address(v)
            return v
        except ValueError:
            raise ValueError('Invalid IP address format')

    @root_validator
    def validate_timestamp(cls, values):
        """Ensure timestamp is set"""
        if not values.get('timestamp'):
            values['timestamp'] = datetime.utcnow()
        return values

class SecureWorkflowResumeRequest(BaseSecureModel):
    """Secure workflow resume request with validation"""

    thread_id: SecureID = Field(
        ...,
        min_length=1,
        max_length=MAX_THREAD_ID_LENGTH,
        description="LangGraph thread ID"
    )

    action: constr(regex=r'^(approve|reject|cancel|modify|retry)$') = Field(
        ...,
        description="Action to take on workflow"
    )

    data: Optional[Dict[str, Any]] = Field(
        None,
        description="Additional action data"
    )

    org_id: Optional[SecureID] = Field(
        None,
        description="Organization ID for authorization"
    )

    user_id: Optional[SecureID] = Field(
        None,
        description="User ID for authorization"
    )

    approval_note: Optional[SanitizedString] = Field(
        None,
        max_length=1000,
        description="Optional approval/rejection note"
    )

    signature: Optional[str] = Field(
        None,
        max_length=500,
        description="Optional request signature for verification"
    )

    @validator('data')
    def validate_action_data(cls, v):
        """Validate action data size"""
        if v is None:
            return v

        # Check data size
        import json
        data_size = len(json.dumps(v, default=str))
        if data_size > MAX_ACTION_DATA_SIZE:
            raise ValueError(f'Action data size exceeds {MAX_ACTION_DATA_SIZE} byte limit')

        return v

    @validator('action')
    def validate_action_with_data(cls, v, values, **kwargs):
        """Validate action consistency with data"""
        data = values.get('data')

        if v == 'modify' and not data:
            raise ValueError('Modify action requires additional data')

        if v == 'approve' and not values.get('approval_note'):
            # Approval notes are optional but recommended for auditing
            pass

        return v

    @root_validator
    def validate_authorization_fields(cls, values):
        """Ensure authorization fields are provided"""
        if not values.get('org_id') or not values.get('user_id'):
            raise ValueError('Organization ID and User ID are required for authorization')

        return values

class SecureWorkflowResponse(BaseSecureModel):
    """Secure workflow response model"""

    success: bool = Field(..., description="Workflow execution success status")
    message: str = Field(..., max_length=500, description="Response message")
    thread_id: SecureID = Field(..., description="Workflow thread ID")
    status: WorkflowStatus = Field(..., description="Workflow status")
    data: Optional[Dict[str, Any]] = Field(None, description="Response data")
    ui_components: Optional[List[Dict[str, Any]]] = Field(
        None,
        description="UI components to render"
    )
    errors: Optional[List[str]] = Field(
        None,
        description="Error messages if failed"
    )
    warnings: Optional[List[str]] = Field(
        None,
        description="Warning messages"
    )
    execution_time: Optional[float] = Field(
        None,
        ge=0,
        description="Workflow execution time in seconds"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Response timestamp"
    )

    @validator('data')
    def sanitize_response_data(cls, v):
        """Sanitize response data"""
        if v is None:
            return v

        # Remove sensitive keys
        sensitive_keys = [
            'password', 'token', 'secret', 'key', 'credential',
            'api_key', 'private_key', 'auth_token'
        ]

        def sanitize_dict(data):
            if isinstance(data, dict):
                return {
                    k: sanitize_dict(v) if not any(sensitive in k.lower() for sensitive in sensitive_keys) else '***'
                    for k, v in data.items()
                }
            elif isinstance(data, list):
                return [sanitize_dict(item) for item in data]
            else:
                return data

        return sanitize_dict(v)

    @validator('errors', 'warnings')
    def validate_message_lists(cls, v):
        """Validate error and warning message lists"""
        if v is None:
            return v

        if not isinstance(v, list):
            raise ValueError('Must be a list')

        if len(v) > 50:  # Limit number of messages
            raise ValueError('Too many messages in list')

        for msg in v:
            if not isinstance(msg, str) or len(msg) > 500:
                raise ValueError('All messages must be strings under 500 characters')

        return v

    @validator('ui_components')
    def validate_ui_components(cls, v):
        """Validate UI components"""
        if v is None:
            return v

        if not isinstance(v, list):
            raise ValueError('UI components must be a list')

        if len(v) > 100:  # Limit number of UI components
            raise ValueError('Too many UI components')

        # Validate each component
        for component in v:
            if not isinstance(component, dict):
                raise ValueError('Each UI component must be a dictionary')

            if 'type' not in component:
                raise ValueError('UI component must have a type')

            # Check component size
            import json
            component_size = len(json.dumps(component, default=str))
            if component_size > 100000:  # 100KB per component
                raise ValueError('UI component is too large')

        return v

class SecurityAuditLog(BaseSecureModel):
    """Security audit log model"""

    event_type: str = Field(..., description="Type of security event")
    user_id: Optional[SecureID] = Field(None, description="User ID if applicable")
    org_id: Optional[SecureID] = Field(None, description="Organization ID if applicable")
    ip_address: Optional[str] = Field(None, description="Client IP address")
    user_agent: Optional[str] = Field(None, max_length=500, description="User agent")
    event_data: Dict[str, Any] = Field(..., description="Event data")
    severity: Literal['low', 'medium', 'high', 'critical'] = Field(..., description="Event severity")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Event timestamp")

    @validator('event_type')
    def validate_event_type(cls, v):
        """Validate event type"""
        allowed_types = [
            'login_attempt', 'login_success', 'login_failure',
            'websocket_connect', 'websocket_disconnect',
            'workflow_start', 'workflow_complete', 'workflow_error',
            'rate_limit_violation', 'security_violation',
            'authorization_success', 'authorization_failure'
        ]

        if v not in allowed_types:
            raise ValueError(f'Event type must be one of: {allowed_types}')

        return v

    @validator('event_data')
    def sanitize_event_data(cls, v):
        """Sanitize event data"""
        # Remove sensitive information
        sensitive_patterns = [
            'password', 'token', 'secret', 'key',
            'credential', 'auth', 'private'
        ]

        def remove_sensitive(data):
            if isinstance(data, dict):
                return {
                    k: remove_sensitive(v)
                    for k, v in data.items()
                    if not any(pattern in k.lower() for pattern in sensitive_patterns)
                }
            elif isinstance(data, list):
                return [remove_sensitive(item) for item in data]
            else:
                return data

        return remove_sensitive(v)

class RateLimitInfo(BaseSecureModel):
    """Rate limiting information model"""

    requests_remaining: int = Field(..., ge=0, description="Requests remaining in window")
    window_reset: datetime = Field(..., description="Window reset time")
    retry_after: int = Field(..., ge=0, description="Seconds to wait before retry")
    limit_type: str = Field(..., description="Type of limit exceeded")
    limit_value: int = Field(..., gt=0, description="Limit value")

    @validator('limit_type')
    def validate_limit_type(cls, v):
        """Validate limit type"""
        allowed_types = ['requests_per_minute', 'connections_per_user', 'messages_per_minute']

        if v not in allowed_types:
            raise ValueError(f'Limit type must be one of: {allowed_types}')

        return v

class ErrorResponse(BaseSecureModel):
    """Standardized error response model"""

    error: str = Field(..., description="Error identifier")
    message: str = Field(..., max_length=500, description="Error message")
    error_code: str = Field(..., description="Application-specific error code")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    request_id: Optional[str] = Field(None, description="Request ID for tracking")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")

    @validator('error')
    def validate_error_identifier(cls, v):
        """Validate error identifier format"""
        if not re.match(r'^[A-Z][A-Z0-9_]*$', v):
            raise ValueError('Error identifier must be uppercase letters, numbers, and underscores')

        return v

    @validator('error_code')
    def validate_error_code(cls, v):
        """Validate error code format"""
        if not re.match(r'^[A-Z0-9_-]+$', v):
            raise ValueError('Error code must contain only uppercase letters, numbers, hyphens, and underscores')

        return v

# Utility functions for validation

def validate_email_address(email: str) -> bool:
    """Validate email address with comprehensive checks"""
    try:
        from email_validator import validate_email, EmailNotValidError
        validate_email(email)
        return True
    except (ImportError, EmailNotValidError):
        # Fallback to basic validation
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

def validate_phone_number(phone: str) -> bool:
    """Validate phone number using phonenumbers"""
    try:
        parsed_number = phonenumbers.parse(phone, None)
        return phonenumbers.is_valid_number(parsed_number)
    except Exception:
        return False

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal"""
    # Remove directory separators
    filename = filename.replace('/', '').replace('\\', '')

    # Remove dangerous characters
    filename = re.sub(r'[<>:"|?*]', '', filename)

    # Limit length
    if len(filename) > 255:
        filename = filename[:255]

    # Ensure it's not empty
    if not filename:
        filename = 'untitled'

    return filename

def generate_secure_token(length: int = 32) -> str:
    """Generate cryptographically secure token"""
    return secrets.token_urlsafe(length)

def hash_sensitive_data(data: str, salt: str = '') -> str:
    """Hash sensitive data for logging/auditing"""
    return hashlib.sha256((data + salt).encode()).hexdigest()[:16]

# Validation schemas for API endpoints

class HealthCheckResponse(BaseSecureModel):
    """Health check response model"""

    status: Literal['healthy', 'unhealthy', 'degraded'] = Field(..., description="Service status")
    version: str = Field(..., description="Service version")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Check timestamp")
    checks: Dict[str, Literal['healthy', 'unhealthy']] = Field(..., description="Individual service checks")
    uptime_seconds: Optional[float] = Field(None, description="Service uptime in seconds")

    @validator('version')
    def validate_version(cls, v):
        """Validate version format"""
        pattern = r'^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?$'
        if not re.match(pattern, v):
            raise ValueError('Version must follow semantic versioning (e.g., 1.0.0)')

        return v

class WebSocketMessage(BaseSecureModel):
    """WebSocket message model"""

    type: str = Field(..., description="Message type")
    data: Dict[str, Any] = Field(..., description="Message data")
    thread_id: Optional[SecureID] = Field(None, description="Thread ID if applicable")
    connection_id: Optional[SecureID] = Field(None, description="Connection ID if applicable")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Message timestamp")

    @validator('type')
    def validate_message_type(cls, v):
        """Validate message type"""
        allowed_types = [
            'connection_established', 'heartbeat', 'workflow_event',
            'ui_component', 'error', 'rate_limit', 'disconnect'
        ]

        if v not in allowed_types:
            raise ValueError(f'Message type must be one of: {allowed_types}')

        return v

# Custom validation error classes

class SecurityValidationError(ValidationError):
    """Security-specific validation error"""
    def __init__(self, message: str, security_level: str = "HIGH"):
        self.security_level = security_level
        super().__init__(message)

class RateLimitExceededError(ValidationError):
    """Rate limit exceeded error"""
    def __init__(self, retry_after: int = 60):
        self.retry_after = retry_after
        super().__init__(f"Rate limit exceeded. Retry after {retry_after} seconds.")

class DataSizeExceededError(ValidationError):
    """Data size exceeded error"""
    def __init__(self, size_limit: int, actual_size: int):
        self.size_limit = size_limit
        self.actual_size = actual_size
        super().__init__(f"Data size {actual_size} bytes exceeds limit of {size_limit} bytes.")