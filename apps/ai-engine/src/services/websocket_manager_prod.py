"""
Production-ready WebSocket manager with comprehensive error handling and scaling support
"""
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional, Set, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
import time
import uuid

from fastapi import WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
import redis.asyncio as redis
from pydantic import BaseModel, Field, ValidationError
from ..utils.valkey_manager import get_websocket_redis, get_broadcast_redis

# Configure structured logging
logger = logging.getLogger(__name__)

class ConnectionStatus(Enum):
    """WebSocket connection status"""
    CONNECTING = "connecting"
    CONNECTED = "connected"
    DISCONNECTING = "disconnecting"
    DISCONNECTED = "disconnected"
    ERROR = "error"

class MessageType(Enum):
    """WebSocket message types"""
    CONNECTION_ESTABLISHED = "connection_established"
    HEARTBEAT = "heartbeat"
    WORKFLOW_EVENT = "workflow_event"
    UI_COMPONENT = "ui_component"
    ERROR = "error"
    RATE_LIMIT = "rate_limit"
    DISCONNECT = "disconnect"

@dataclass
class ConnectionMetadata:
    """Metadata for WebSocket connections"""
    websocket: WebSocket
    thread_id: str
    user_id: Optional[str] = None
    org_id: Optional[str] = None
    connected_at: datetime = field(default_factory=datetime.utcnow)
    last_heartbeat: datetime = field(default_factory=datetime.utcnow)
    message_count: int = 0
    status: ConnectionStatus = ConnectionStatus.CONNECTING
    rate_limit_tokens: int = 100  # Rate limiting tokens
    rate_limit_reset: datetime = field(default_factory=lambda: datetime.utcnow() + timedelta(minutes=1))

@dataclass
class ConnectionPoolConfig:
    """Configuration for connection pooling with Valkey optimization"""
    max_connections_per_thread: int = 10
    max_total_connections: int = 1000
    heartbeat_interval: int = 30  # seconds
    connection_timeout: int = 300  # seconds
    rate_limit_requests: int = 60  # per minute
    rate_limit_window: int = 60  # seconds
    cleanup_interval: int = 60  # seconds
    redis_connection_string: str = "valkey://localhost:6379"  # Updated for Valkey
    redis_url: Optional[str] = None  # Alternative way to specify Valkey URL

class WebSocketError(Exception):
    """Custom WebSocket error with structured data"""
    def __init__(self, message: str, error_code: str = "WEBSOCKET_ERROR", details: Dict[str, Any] = None):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(message)

class RateLimitError(WebSocketError):
    """Rate limiting specific error"""
    def __init__(self, message: str = "Rate limit exceeded", retry_after: int = 60):
        super().__init__(message, "RATE_LIMIT_EXCEEDED", {"retry_after": retry_after})
        self.retry_after = retry_after

class ConnectionPoolFullError(WebSocketError):
    """Connection pool full error"""
    def __init__(self, message: str = "Connection pool is full"):
        super().__init__(message, "CONNECTION_POOL_FULL")

class ProductionWebSocketManager:
    """
    Production-ready WebSocket manager with Valkey integration:
    - Connection pooling and limits
    - Rate limiting
    - Heartbeat/ping-pong
    - Graceful error handling
    - Valkey-backed state
    - Circuit breaker patterns
    - Comprehensive monitoring
    - Optimized for AGUI workloads
    """

    def __init__(self, config: ConnectionPoolConfig):
        self.config = config
        self.connections: Dict[str, ConnectionMetadata] = {}  # connection_id -> metadata
        self.thread_connections: Dict[str, Set[str]] = {}  # thread_id -> set of connection_ids
        self.user_connections: Dict[str, Set[str]] = {}  # user_id -> set of connection_ids
        self.org_connections: Dict[str, Set[str]] = {}  # org_id -> set of connection_ids

        # Monitoring and metrics
        self.connection_metrics = {
            "total_connections": 0,
            "active_connections": 0,
            "connections_per_minute": 0,
            "messages_per_minute": 0,
            "error_count": 0,
            "rate_limit_violations": 0
        }

        # Background tasks
        self._cleanup_task: Optional[asyncio.Task] = None
        self._heartbeat_task: Optional[asyncio.Task] = None
        self._metrics_task: Optional[asyncio.Task] = None

        # Valkey for distributed state (using optimized pools)
        self._websocket_redis_client: Optional[redis.Redis] = None
        self._broadcast_redis_client: Optional[redis.Redis] = None
        self._redis_lock: Optional[redis.Redis] = None

        # Circuit breaker state
        self._circuit_breaker_state = {
            "failure_count": 0,
            "last_failure_time": None,
            "state": "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        }

        self._shutdown = False
        self._initialized = False

    async def initialize(self):
        """Initialize the WebSocket manager"""
        try:
            # Use optimized Valkey connections from manager
            self._websocket_redis_client = await get_websocket_redis()
            self._broadcast_redis_client = await get_broadcast_redis()
            self._redis_lock = self._websocket_redis_client  # Reuse for locking

            # Test Valkey connections
            await self._websocket_redis_client.ping()
            await self._broadcast_redis_client.ping()

            # Start background tasks
            self._cleanup_task = asyncio.create_task(self._cleanup_connections())
            self._heartbeat_task = asyncio.create_task(self._heartbeat_monitor())
            self._metrics_task = asyncio.create_task(self._update_metrics())

            self._initialized = True
            logger.info("Production WebSocket Manager initialized successfully with Valkey")

        except Exception as e:
            logger.error(f"Failed to initialize WebSocket Manager with Valkey: {e}")
            raise WebSocketError(f"WebSocket manager initialization failed: {e}")

    async def connect(self, websocket: WebSocket, thread_id: str,
                     user_id: Optional[str] = None, org_id: Optional[str] = None) -> str:
        """
        Accept and manage WebSocket connection with comprehensive error handling
        """
        connection_id = str(uuid.uuid4())

        try:
            # Check circuit breaker
            if not await self._check_circuit_breaker():
                raise WebSocketError("Service temporarily unavailable", "CIRCUIT_BREAKER_OPEN")

            # Check connection limits
            await self._check_connection_limits(thread_id, user_id, org_id)

            # Accept the WebSocket connection
            await websocket.accept()

            # Create connection metadata
            metadata = ConnectionMetadata(
                websocket=websocket,
                thread_id=thread_id,
                user_id=user_id,
                org_id=org_id,
                status=ConnectionStatus.CONNECTED
            )

            # Store connection
            self.connections[connection_id] = metadata

            # Update indices
            if thread_id not in self.thread_connections:
                self.thread_connections[thread_id] = set()
            self.thread_connections[thread_id].add(connection_id)

            if user_id:
                if user_id not in self.user_connections:
                    self.user_connections[user_id] = set()
                self.user_connections[user_id].add(connection_id)

            if org_id:
                if org_id not in self.org_connections:
                    self.org_connections[org_id] = set()
                self.org_connections[org_id].add(connection_id)

            # Update metrics
            self.connection_metrics["total_connections"] += 1
            self.connection_metrics["active_connections"] = len(self.connections)

            # Store in Redis for distributed state
            await self._store_connection_in_redis(connection_id, metadata)

            # Send connection confirmation
            await self._send_to_websocket_safe(websocket, {
                "type": MessageType.CONNECTION_ESTABLISHED.value,
                "connection_id": connection_id,
                "thread_id": thread_id,
                "timestamp": datetime.utcnow().isoformat(),
                "server_time": time.time()
            })

            logger.info(f"WebSocket connection established: {connection_id} for thread {thread_id}")
            return connection_id

        except Exception as e:
            # Cleanup on failure
            if connection_id in self.connections:
                await self.disconnect(connection_id)

            self.connection_metrics["error_count"] += 1
            logger.error(f"Failed to establish WebSocket connection: {e}")
            raise

    async def disconnect(self, connection_id: str, reason: str = "normal_disconnect"):
        """Cleanly disconnect and cleanup WebSocket connection"""
        if connection_id not in self.connections:
            return

        metadata = self.connections[connection_id]
        metadata.status = ConnectionStatus.DISCONNECTING

        try:
            # Remove from indices
            if metadata.thread_id in self.thread_connections:
                self.thread_connections[metadata.thread_id].discard(connection_id)
                if not self.thread_connections[metadata.thread_id]:
                    del self.thread_connections[metadata.thread_id]

            if metadata.user_id and metadata.user_id in self.user_connections:
                self.user_connections[metadata.user_id].discard(connection_id)
                if not self.user_connections[metadata.user_id]:
                    del self.user_connections[metadata.user_id]

            if metadata.org_id and metadata.org_id in self.org_connections:
                self.org_connections[metadata.org_id].discard(connection_id)
                if not self.org_connections[metadata.org_id]:
                    del self.org_connections[metadata.org_id]

            # Remove from Redis
            await self._remove_connection_from_redis(connection_id)

            # Remove from memory
            del self.connections[connection_id]

            # Update metrics
            self.connection_metrics["active_connections"] = len(self.connections)

            logger.info(f"WebSocket connection disconnected: {connection_id} ({reason})")

        except Exception as e:
            logger.error(f"Error during WebSocket disconnect for {connection_id}: {e}")

    async def broadcast_to_thread(self, thread_id: str, data: Dict[str, Any],
                                 exclude_connection_id: Optional[str] = None):
        """
        Broadcast message to all connections in a thread with error handling and rate limiting
        """
        if thread_id not in self.thread_connections:
            logger.debug(f"No connections for thread {thread_id}")
            return

        connection_ids = self.thread_connections[thread_id].copy()
        if exclude_connection_id:
            connection_ids.discard(exclude_connection_id)

        if not connection_ids:
            return

        # Add broadcast metadata
        message = {
            **data,
            "thread_id": thread_id,
            "broadcast_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "server_time": time.time()
        }

        # Send to all connections in thread
        failed_connections = []
        rate_limited_connections = []

        for connection_id in connection_ids:
            if connection_id not in self.connections:
                failed_connections.append(connection_id)
                continue

            metadata = self.connections[connection_id]

            try:
                # Check rate limiting
                if not await self._check_rate_limit(connection_id):
                    rate_limited_connections.append(connection_id)
                    await self._send_rate_limit_warning(metadata.websocket)
                    continue

                # Send message
                await self._send_to_websocket_safe(metadata.websocket, message)
                metadata.message_count += 1

            except Exception as e:
                logger.warning(f"Failed to send message to connection {connection_id}: {e}")
                failed_connections.append(connection_id)

        # Cleanup failed connections
        for connection_id in failed_connections:
            await self.disconnect(connection_id, "send_error")

        # Update metrics
        self.connection_metrics["messages_per_minute"] += len(connection_ids)

        logger.debug(f"Broadcast to thread {thread_id}: {len(connection_ids)} connections, "
                    f"{len(failed_connections)} failed, {len(rate_limited_connections)} rate limited")

    async def get_connection_info(self, connection_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed connection information"""
        if connection_id not in self.connections:
            return None

        metadata = self.connections[connection_id]
        return {
            "connection_id": connection_id,
            "thread_id": metadata.thread_id,
            "user_id": metadata.user_id,
            "org_id": metadata.org_id,
            "status": metadata.status.value,
            "connected_at": metadata.connected_at.isoformat(),
            "last_heartbeat": metadata.last_heartbeat.isoformat(),
            "message_count": metadata.message_count,
            "connection_duration": (datetime.utcnow() - metadata.connected_at).total_seconds()
        }

    async def get_thread_info(self, thread_id: str) -> Dict[str, Any]:
        """Get information about a thread's connections"""
        if thread_id not in self.thread_connections:
            return {"thread_id": thread_id, "connection_count": 0, "connections": []}

        connection_ids = self.thread_connections[thread_id]
        connections = []

        for connection_id in connection_ids:
            if connection_id in self.connections:
                info = await self.get_connection_info(connection_id)
                if info:
                    connections.append(info)

        return {
            "thread_id": thread_id,
            "connection_count": len(connections),
            "connections": connections
        }

    async def get_metrics(self) -> Dict[str, Any]:
        """Get comprehensive WebSocket metrics"""
        return {
            **self.connection_metrics,
            "total_threads": len(self.thread_connections),
            "total_users": len(self.user_connections),
            "total_orgs": len(self.org_connections),
            "circuit_breaker_state": self._circuit_breaker_state["state"],
            "active_connections_per_thread": {
                thread_id: len(connections)
                for thread_id, connections in self.thread_connections.items()
            }
        }

    async def shutdown(self):
        """Gracefully shutdown the WebSocket manager"""
        logger.info("Shutting down WebSocket Manager...")
        self._shutdown = True

        # Cancel background tasks
        for task in [self._cleanup_task, self._heartbeat_task, self._metrics_task]:
            if task and not task.done():
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass

        # Close all connections
        connection_ids = list(self.connections.keys())
        for connection_id in connection_ids:
            await self.disconnect(connection_id, "server_shutdown")

        # Close Redis connections
        if self._redis_client:
            await self._redis_client.close()
        if self._redis_lock:
            await self._redis_lock.close()

        logger.info("WebSocket Manager shutdown complete")

    # Private methods for internal functionality

    async def _check_connection_limits(self, thread_id: str, user_id: Optional[str],
                                     org_id: Optional[str]):
        """Check various connection limits"""
        # Check total connections
        if len(self.connections) >= self.config.max_total_connections:
            raise ConnectionPoolFullError(f"Total connections limit ({self.config.max_total_connections}) reached")

        # Check thread connections
        thread_connections = len(self.thread_connections.get(thread_id, set()))
        if thread_connections >= self.config.max_connections_per_thread:
            raise ConnectionPoolFullError(f"Thread connections limit ({self.config.max_connections_per_thread}) reached")

        # Check user connections (optional limit)
        if user_id:
            user_connections = len(self.user_connections.get(user_id, set()))
            if user_connections >= 20:  # Configurable limit per user
                raise ConnectionPoolFullError(f"User connections limit (20) reached")

    async def _check_rate_limit(self, connection_id: str) -> bool:
        """Check if connection is rate limited"""
        if connection_id not in self.connections:
            return False

        metadata = self.connections[connection_id]
        now = datetime.utcnow()

        # Reset rate limit if window expired
        if now >= metadata.rate_limit_reset:
            metadata.rate_limit_tokens = self.config.rate_limit_requests
            metadata.rate_limit_reset = now + timedelta(seconds=self.config.rate_limit_window)

        # Check if tokens available
        if metadata.rate_limit_tokens <= 0:
            self.connection_metrics["rate_limit_violations"] += 1
            return False

        # Consume token
        metadata.rate_limit_tokens -= 1
        return True

    async def _send_rate_limit_warning(self, websocket: WebSocket):
        """Send rate limit warning to client"""
        try:
            await self._send_to_websocket_safe(websocket, {
                "type": MessageType.RATE_LIMIT.value,
                "message": "Rate limit exceeded. Please slow down your requests.",
                "retry_after": self.config.rate_limit_window,
                "timestamp": datetime.utcnow().isoformat()
            })
        except Exception:
            pass  # Ignore errors when sending rate limit warnings

    async def _send_to_websocket_safe(self, websocket: WebSocket, data: Dict[str, Any]):
        """Safely send data to WebSocket with error handling"""
        try:
            message = json.dumps(data, default=str)
            await websocket.send_text(message)
        except Exception as e:
            logger.warning(f"WebSocket send error: {e}")
            raise WebSocketError(f"Failed to send WebSocket message: {e}")

    async def _cleanup_connections(self):
        """Background task to cleanup stale connections"""
        while not self._shutdown:
            try:
                now = datetime.utcnow()
                stale_connections = []

                for connection_id, metadata in self.connections.items():
                    # Check for stale connections
                    if (now - metadata.last_heartbeat).total_seconds() > self.config.connection_timeout:
                        stale_connections.append(connection_id)
                    # Check for connections in error state
                    elif metadata.status == ConnectionStatus.ERROR:
                        stale_connections.append(connection_id)

                # Cleanup stale connections
                for connection_id in stale_connections:
                    await self.disconnect(connection_id, "stale_connection")

                if stale_connections:
                    logger.info(f"Cleaned up {len(stale_connections)} stale WebSocket connections")

            except Exception as e:
                logger.error(f"Error in connection cleanup task: {e}")

            await asyncio.sleep(self.config.cleanup_interval)

    async def _heartbeat_monitor(self):
        """Background task to monitor connection health with ping-pong"""
        while not self._shutdown:
            try:
                now = datetime.utcnow()
                dead_connections = []

                for connection_id, metadata in self.connections.items():
                    if metadata.status != ConnectionStatus.CONNECTED:
                        continue

                    # Send heartbeat if interval passed
                    if (now - metadata.last_heartbeat).total_seconds() >= self.config.heartbeat_interval:
                        try:
                            await self._send_to_websocket_safe(metadata.websocket, {
                                "type": MessageType.HEARTBEAT.value,
                                "timestamp": now.isoformat(),
                                "server_time": time.time()
                            })
                            metadata.last_heartbeat = now
                        except Exception:
                            dead_connections.append(connection_id)

                # Cleanup dead connections
                for connection_id in dead_connections:
                    await self.disconnect(connection_id, "heartbeat_failed")

                if dead_connections:
                    logger.debug(f"Removed {len(dead_connections)} dead WebSocket connections")

            except Exception as e:
                logger.error(f"Error in heartbeat monitor task: {e}")

            await asyncio.sleep(self.config.heartbeat_interval)

    async def _update_metrics(self):
        """Background task to update metrics"""
        while not self._shutdown:
            try:
                # Reset per-minute counters
                self.connection_metrics["connections_per_minute"] = 0
                self.connection_metrics["messages_per_minute"] = 0

                # Store metrics in Redis for monitoring
                if self._redis_client:
                    await self._redis_client.hset(
                        "websocket_metrics",
                        mapping={k: str(v) for k, v in self.connection_metrics.items()}
                    )

            except Exception as e:
                logger.error(f"Error in metrics update task: {e}")

            await asyncio.sleep(60)  # Update every minute

    async def _check_circuit_breaker(self) -> bool:
        """Check circuit breaker state"""
        now = datetime.utcnow()

        if self._circuit_breaker_state["state"] == "OPEN":
            # Check if we should try half-open
            if (now - self._circuit_breaker_state["last_failure_time"]).total_seconds() > 60:
                self._circuit_breaker_state["state"] = "HALF_OPEN"
                return True
            return False

        return True

    async def _record_circuit_breaker_failure(self):
        """Record a failure for circuit breaker"""
        self._circuit_breaker_state["failure_count"] += 1
        self._circuit_breaker_state["last_failure_time"] = datetime.utcnow()

        # Open circuit if too many failures
        if self._circuit_breaker_state["failure_count"] >= 5:
            self._circuit_breaker_state["state"] = "OPEN"

    async def _record_circuit_breaker_success(self):
        """Record a success for circuit breaker"""
        if self._circuit_breaker_state["state"] == "HALF_OPEN":
            self._circuit_breaker_state["failure_count"] = 0
            self._circuit_breaker_state["state"] = "CLOSED"

    async def _store_connection_in_redis(self, connection_id: str, metadata: ConnectionMetadata):
        """Store connection metadata in Redis for distributed state"""
        if not self._redis_client:
            return

        try:
            connection_data = {
                "connection_id": connection_id,
                "thread_id": metadata.thread_id,
                "user_id": metadata.user_id or "",
                "org_id": metadata.org_id or "",
                "connected_at": metadata.connected_at.isoformat(),
                "last_heartbeat": metadata.last_heartbeat.isoformat(),
                "message_count": str(metadata.message_count),
                "status": metadata.status.value,
                "server_id": "server_1"  # Add server identification
            }

            await self._redis_client.hset(
                f"websocket_connection:{connection_id}",
                mapping=connection_data
            )

            # Set expiration
            await self._redis_client.expire(
                f"websocket_connection:{connection_id}",
                self.config.connection_timeout + 60
            )

        except Exception as e:
            logger.warning(f"Failed to store connection in Redis: {e}")

    async def _remove_connection_from_redis(self, connection_id: str):
        """Remove connection metadata from Redis"""
        if not self._redis_client:
            return

        try:
            await self._redis_client.delete(f"websocket_connection:{connection_id}")
        except Exception as e:
            logger.warning(f"Failed to remove connection from Redis: {e}")