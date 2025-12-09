"""
Session management and rate limiting using Valkey
Optimized for AGUI workloads with high-performance storage and retrieval
"""
import asyncio
import json
import time
import logging
from typing import Dict, Any, Optional, List, Union, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
import uuid
import hashlib

from .valkey_manager import get_session_redis

# Configure logging
logger = logging.getLogger(__name__)

class SessionStatus(Enum):
    """Session status values"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    EXPIRED = "expired"
    SUSPENDED = "suspended"

class RateLimitType(Enum):
    """Rate limiting types"""
    API_REQUESTS = "api_requests"
    WEBHOOK_EVENTS = "webhook_events"
    WORKFLOW_EXECUTIONS = "workflow_executions"
    FILE_UPLOADS = "file_uploads"
    MESSAGE_SENT = "message_sent"

@dataclass
class SessionData:
    """Session data structure"""
    session_id: str
    user_id: str
    org_id: Optional[str] = None
    thread_id: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_accessed: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    status: SessionStatus = SessionStatus.ACTIVE

    # Session metadata
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    websocket_connection_ids: List[str] = field(default_factory=list)

    # Usage tracking
    api_requests: int = 0
    messages_sent: int = 0
    workflows_executed: int = 0
    files_uploaded: int = 0

    # Security metadata
    security_flags: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for storage"""
        data = {
            'session_id': self.session_id,
            'user_id': self.user_id,
            'org_id': self.org_id,
            'thread_id': self.thread_id,
            'created_at': self.created_at.isoformat(),
            'last_accessed': self.last_accessed.isoformat(),
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'status': self.status.value,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'websocket_connection_ids': self.websocket_connection_ids,
            'api_requests': self.api_requests,
            'messages_sent': self.messages_sent,
            'workflows_executed': self.workflows_executed,
            'files_uploaded': self.files_uploaded,
            'security_flags': self.security_flags
        }
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'SessionData':
        """Create from dictionary"""
        # Convert string dates back to datetime objects
        for date_field in ['created_at', 'last_accessed']:
            if data.get(date_field):
                data[date_field] = datetime.fromisoformat(data[date_field])

        if data.get('expires_at'):
            data['expires_at'] = datetime.fromisoformat(data['expires_at'])

        # Convert status string to enum
        if isinstance(data.get('status'), str):
            data['status'] = SessionStatus(data['status'])

        return cls(**data)

@dataclass
class RateLimitConfig:
    """Rate limiting configuration"""
    max_requests: int
    window_seconds: int
    penalty_seconds: int = 300  # 5 minutes default penalty
    burst_allowance: int = 0  # Additional requests for burst traffic

    def to_dict(self) -> Dict[str, Any]:
        return {
            'max_requests': self.max_requests,
            'window_seconds': self.window_seconds,
            'penalty_seconds': self.penalty_seconds,
            'burst_allowance': self.burst_allowance
        }

class SessionManager:
    """
    High-performance session management with Valkey backend
    Optimized for AGUI workloads with concurrent access patterns
    """

    def __init__(self, default_ttl: int = 3600):  # 1 hour default TTL
        self.default_ttl = default_ttl
        self._redis_client = None
        self._initialized = False

        # Default rate limits for different AGUI operations
        self.rate_limits = {
            RateLimitType.API_REQUESTS: RateLimitConfig(100, 60),      # 100 requests/minute
            RateLimitType.WEBHOOK_EVENTS: RateLimitConfig(50, 60),     # 50 webhooks/minute
            RateLimitType.WORKFLOW_EXECUTIONS: RateLimitConfig(10, 60),  # 10 workflows/minute
            RateLimitType.FILE_UPLOADS: RateLimitConfig(5, 60),         # 5 uploads/minute
            RateLimitType.MESSAGE_SENT: RateLimitConfig(30, 60),        # 30 messages/minute
        }

    async def initialize(self):
        """Initialize session manager with Valkey connection"""
        if self._initialized:
            return

        self._redis_client = await get_session_redis()
        await self._redis_client.ping()
        self._initialized = True

        logger.info("Session manager initialized with Valkey")

    async def create_session(self, user_id: str, org_id: Optional[str] = None,
                          thread_id: Optional[str] = None, ip_address: Optional[str] = None,
                          user_agent: Optional[str] = None, ttl: Optional[int] = None) -> str:
        """
        Create a new session with Valkey storage
        """
        if not self._initialized:
            await self.initialize()

        session_id = str(uuid.uuid4())
        now = datetime.utcnow()

        session_data = SessionData(
            session_id=session_id,
            user_id=user_id,
            org_id=org_id,
            thread_id=thread_id,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=now + timedelta(seconds=ttl or self.default_ttl)
        )

        # Store session in Valkey
        session_key = f"session:{session_id}"
        await self._redis_client.hset(session_key, mapping=session_data.to_dict())
        await self._redis_client.expire(session_key, ttl or self.default_ttl)

        # Add to user's active sessions
        user_sessions_key = f"user_sessions:{user_id}"
        await self._redis_client.sadd(user_sessions_key, session_id)
        await self._redis_client.expire(user_sessions_key, ttl or self.default_ttl)

        # Add to organization sessions if applicable
        if org_id:
            org_sessions_key = f"org_sessions:{org_id}"
            await self._redis_client.sadd(org_sessions_key, session_id)
            await self._redis_client.expire(org_sessions_key, ttl or self.default_ttl)

        logger.info(f"Created session {session_id} for user {user_id}")
        return session_id

    async def get_session(self, session_id: str) -> Optional[SessionData]:
        """
        Retrieve session data from Valkey
        """
        if not self._initialized:
            await self.initialize()

        session_key = f"session:{session_id}"
        session_data = await self._redis_client.hgetall(session_key)

        if not session_data:
            return None

        try:
            session = SessionData.from_dict(session_data)

            # Update last accessed time
            await self._redis_client.hset(session_key, 'last_accessed', datetime.utcnow().isoformat())

            return session

        except Exception as e:
            logger.error(f"Failed to parse session data for {session_id}: {e}")
            return None

    async def update_session(self, session_id: str, **kwargs) -> bool:
        """
        Update session data in Valkey
        """
        if not self._initialized:
            await self.initialize()

        session_key = f"session:{session_id}"

        # Check if session exists
        if not await self._redis_client.exists(session_key):
            return False

        # Update only provided fields
        update_data = {}

        for field, value in kwargs.items():
            if field == 'last_accessed' and isinstance(value, datetime):
                update_data[field] = value.isoformat()
            elif field == 'expires_at' and isinstance(value, datetime):
                update_data[field] = value.isoformat()
            elif field in ['websocket_connection_ids']:
                # For list fields, convert to JSON
                update_data[field] = json.dumps(value)
            else:
                update_data[field] = str(value)

        if update_data:
            await self._redis_client.hset(session_key, mapping=update_data)
            await self._redis_client.hset(session_key, 'last_accessed', datetime.utcnow().isoformat())

        return True

    async def delete_session(self, session_id: str) -> bool:
        """
        Delete session from Valkey
        """
        if not self._initialized:
            await self.initialize()

        session_key = f"session:{session_id}"
        session_data = await self._redis_client.hgetall(session_key)

        if not session_data:
            return False

        # Remove from user's active sessions
        user_id = session_data.get('user_id')
        if user_id:
            user_sessions_key = f"user_sessions:{user_id}"
            await self._redis_client.srem(user_sessions_key, session_id)

        # Remove from organization sessions
        org_id = session_data.get('org_id')
        if org_id:
            org_sessions_key = f"org_sessions:{org_id}"
            await self._redis_client.srem(org_sessions_key, session_id)

        # Delete session data
        await self._redis_client.delete(session_key)

        logger.info(f"Deleted session {session_id}")
        return True

    async def check_rate_limit(self, identifier: str, rate_type: RateLimitType,
                            increment: int = 1) -> Tuple[bool, Dict[str, Any]]:
        """
        Check and update rate limits using Valkey sliding window
        Returns (allowed, rate_limit_info)
        """
        if not self._initialized:
            await self.initialize()

        config = self.rate_limits.get(rate_type)
        if not config:
            return True, {'error': 'No rate limit configuration'}

        now = int(time.time())
        window_start = now - config.window_seconds

        # Redis key for this rate limit
        rate_key = f"rate_limit:{rate_type.value}:{identifier}"

        # Use a Redis pipeline for atomic operations
        pipe = self._redis_client.pipeline()

        # Remove expired entries
        pipe.zremrangebyscore(rate_key, 0, window_start)

        # Count current requests
        pipe.zcard(rate_key)

        # Add current request
        pipe.zadd(rate_key, {str(now): now})

        # Set expiration
        pipe.expire(rate_key, config.window_seconds)

        results = await pipe.execute()

        current_requests = results[1]
        max_requests = config.max_requests + config.burst_allowance

        allowed = current_requests <= max_requests

        rate_info = {
            'allowed': allowed,
            'current': current_requests,
            'max': max_requests,
            'window_seconds': config.window_seconds,
            'reset_time': now + config.window_seconds,
            'retry_after': None
        }

        if not allowed:
            # Calculate penalty and retry after
            penalty = config.penalty_seconds
            retry_after = now + penalty

            # Add penalty entry
            await self._redis_client.zadd(rate_key, {f"penalty:{now}": retry_after})
            await self._redis_client.expire(rate_key, max(config.window_seconds, penalty))

            rate_info['retry_after'] = penalty
            logger.warning(f"Rate limit exceeded for {identifier} - {rate_type.value}")

        return allowed, rate_info

    async def increment_session_counter(self, session_id: str, counter_name: str,
                                    increment: int = 1) -> bool:
        """
        Increment session-specific counters (api_requests, messages_sent, etc.)
        """
        if not self._initialized:
            await self.initialize()

        session_key = f"session:{session_id}"

        # Check if session exists
        if not await self._redis_client.exists(session_key):
            return False

        # Increment counter
        current_value = await self._redis_client.hincrby(session_key, counter_name, increment)

        # Also update global counter for monitoring
        global_counter_key = f"global_counter:{counter_name}"
        await self._redis_client.incrby(global_counter_key, increment)
        await self._redis_client.expire(global_counter_key, 86400)  # 24 hours TTL

        return True

    async def get_user_sessions(self, user_id: str) -> List[SessionData]:
        """
        Get all active sessions for a user
        """
        if not self._initialized:
            await self.initialize()

        user_sessions_key = f"user_sessions:{user_id}"
        session_ids = await self._redis_client.smembers(user_sessions_key)

        sessions = []
        for session_id in session_ids:
            session = await self.get_session(session_id)
            if session and session.status == SessionStatus.ACTIVE:
                sessions.append(session)

        return sessions

    async def cleanup_expired_sessions(self) -> int:
        """
        Clean up expired sessions
        """
        if not self._initialized:
            await self.initialize()

        # Find all session keys
        session_keys = await self._redis_client.keys("session:*")
        if not session_keys:
            return 0

        cleaned_count = 0
        now = datetime.utcnow()

        for session_key in session_keys:
            try:
                session_data = await self._redis_client.hgetall(session_key)
                if not session_data:
                    await self._redis_client.delete(session_key)
                    cleaned_count += 1
                    continue

                # Check expiration
                expires_at_str = session_data.get('expires_at')
                if expires_at_str:
                    try:
                        expires_at = datetime.fromisoformat(expires_at_str)
                        if now > expires_at:
                            session_id = session_data.get('session_id')
                            if session_id:
                                await self.delete_session(session_id.decode() if isinstance(session_id, bytes) else session_id)
                            cleaned_count += 1
                    except ValueError:
                        # Invalid expiration, clean up
                        await self._redis_client.delete(session_key)
                        cleaned_count += 1

            except Exception as e:
                logger.warning(f"Error processing session {session_key}: {e}")

        logger.info(f"Session cleanup: {cleaned_count} expired sessions removed")
        return cleaned_count

    async def get_session_metrics(self) -> Dict[str, Any]:
        """
        Get session and rate limiting metrics
        """
        if not self._initialized:
            await self.initialize()

        metrics = {
            'total_sessions': 0,
            'active_sessions': 0,
            'expired_sessions': 0,
            'rate_limit_violations': 0,
            'global_counters': {}
        }

        # Count sessions
        session_keys = await self._redis_client.keys("session:*")
        metrics['total_sessions'] = len(session_keys)

        now = datetime.utcnow()
        for session_key in session_keys:
            try:
                session_data = await self._redis_client.hgetall(session_key)
                if not session_data:
                    continue

                expires_at_str = session_data.get('expires_at')
                if expires_at_str:
                    try:
                        expires_at = datetime.fromisoformat(expires_at_str)
                        if now <= expires_at:
                            metrics['active_sessions'] += 1
                        else:
                            metrics['expired_sessions'] += 1
                    except ValueError:
                        metrics['expired_sessions'] += 1
                else:
                    metrics['active_sessions'] += 1

            except Exception as e:
                logger.warning(f"Error counting session {session_key}: {e}")

        # Get global counters
        counter_keys = await self._redis_client.keys("global_counter:*")
        for counter_key in counter_keys:
            try:
                counter_name = counter_key.decode().replace("global_counter:", "")
                counter_value = await self._redis_client.get(counter_key)
                if counter_value:
                    metrics['global_counters'][counter_name] = int(counter_value)
            except Exception as e:
                logger.warning(f"Error getting counter {counter_key}: {e}")

        return metrics

# Global session manager instance
_session_manager: Optional[SessionManager] = None

async def get_session_manager() -> SessionManager:
    """Get or create global session manager"""
    global _session_manager

    if _session_manager is None:
        _session_manager = SessionManager()
        await _session_manager.initialize()

    return _session_manager

# Utility functions for common session operations

async def create_user_session(user_id: str, **kwargs) -> str:
    """Create a session for a user"""
    manager = await get_session_manager()
    return await manager.create_session(user_id, **kwargs)

async def validate_session(session_id: str) -> Optional[SessionData]:
    """Validate and return session data"""
    manager = await get_session_manager()
    return await manager.get_session(session_id)

async def check_api_rate_limit(identifier: str) -> Tuple[bool, Dict[str, Any]]:
    """Check API rate limit"""
    manager = await get_session_manager()
    return await manager.check_rate_limit(identifier, RateLimitType.API_REQUESTS)

async def check_workflow_rate_limit(identifier: str) -> Tuple[bool, Dict[str, Any]]:
    """Check workflow execution rate limit"""
    manager = await get_session_manager()
    return await manager.check_rate_limit(identifier, RateLimitType.WORKFLOW_EXECUTIONS)