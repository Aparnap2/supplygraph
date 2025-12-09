"""
Production-ready Valkey connection manager with optimized pooling
for AGUI workloads and concurrent access patterns.
"""
import asyncio
import os
import time
import logging
from typing import Dict, Any, Optional, Union, List
from dataclasses import dataclass, field
from contextlib import asynccontextmanager
import json

from redis.asyncio import ConnectionPool, Redis
from redis.asyncio.retry import Retry
from redis.backoff import ExponentialBackoff
from redis.exceptions import (
    ConnectionError, TimeoutError, ResponseError,
    RedisError, AuthenticationError
)

# Configure structured logging
logger = logging.getLogger(__name__)

@dataclass
class ValkeyConnectionConfig:
    """Configuration for Valkey connections optimized for AGUI workloads"""

    # Connection settings
    host: str = "localhost"
    port: int = 6379
    db: int = 0
    password: Optional[str] = None
    ssl: bool = False
    ssl_cert_reqs: Optional[str] = None

    # Pool settings optimized for concurrent AGUI access
    max_connections: int = 50  # High concurrency for AGUI
    min_connections: int = 5   # Base connections
    retry_on_timeout: bool = True
    retry_on_error: List[type] = field(default_factory=lambda: [ConnectionError, TimeoutError])

    # Performance optimizations
    socket_timeout: float = 5.0
    socket_connect_timeout: float = 2.0
    health_check_interval: float = 30.0
    socket_keepalive: bool = True
    socket_keepalive_options: Dict[int, Union[int, str]] = field(default_factory=dict)

    # Retry strategy
    max_retry_delay: float = 1.0
    exponential_base: float = 2.0
    max_retries: int = 3

    # Connection pooling for different use cases
    websocket_pool_size: int = 20  # WebSocket connection pooling
    state_pool_size: int = 10     # LangGraph state management
    session_pool_size: int = 15   # Rate limiting and sessions
    broadcast_pool_size: int = 25 # AGUI event broadcasting

    @classmethod
    def from_url(cls, url: str, **kwargs) -> 'ValkeyConnectionConfig':
        """Create config from URL with overrides"""
        # Parse URL to extract connection details
        from urllib.parse import urlparse
        parsed = urlparse(url)

        config = cls(
            host=parsed.hostname or "localhost",
            port=parsed.port or 6379,
            db=int(parsed.path.lstrip('/') or 0),
            password=parsed.password,
            ssl=parsed.scheme in ['rediss', 'valkeys'],
            **kwargs
        )

        return config

@dataclass
class ValkeyPoolStats:
    """Statistics for connection pool monitoring"""
    pool_name: str
    total_connections: int
    available_connections: int
    in_use_connections: int
    created_connections: int
    errors: int = 0
    last_error: Optional[str] = None
    avg_response_time: float = 0.0
    total_requests: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "pool_name": self.pool_name,
            "total_connections": self.total_connections,
            "available_connections": self.available_connections,
            "in_use_connections": self.in_use_connections,
            "created_connections": self.created_connections,
            "errors": self.errors,
            "last_error": self.last_error,
            "avg_response_time": self.avg_response_time,
            "total_requests": self.total_requests,
        }

class ValkeyConnectionManager:
    """
    Advanced Valkey connection manager with optimized pooling for different use cases:
    - WebSocket connection pooling (high frequency, low latency)
    - LangGraph state management (reliable, transactional)
    - Rate limiting and session storage (fast reads/writes)
    - AGUI event broadcasting (pub/sub optimized)
    """

    def __init__(self, config: ValkeyConnectionConfig):
        self.config = config
        self.pools: Dict[str, ConnectionPool] = {}
        self.stats: Dict[str, ValkeyPoolStats] = {}
        self._lock = asyncio.Lock()
        self._initialized = False

        # Performance metrics
        self.global_metrics = {
            "total_connections": 0,
            "total_requests": 0,
            "total_errors": 0,
            "avg_response_time": 0.0,
            "uptime": time.time()
        }

    async def initialize(self):
        """Initialize all connection pools"""
        if self._initialized:
            return

        async with self._lock:
            if self._initialized:
                return

            logger.info("Initializing Valkey connection manager with optimized pools")

            # Create specialized pools for different workloads
            await self._create_pool("websocket", self.config.websocket_pool_size)
            await self._create_pool("state", self.config.state_pool_size)
            await self._create_pool("session", self.config.session_pool_size)
            await self._create_pool("broadcast", self.config.broadcast_pool_size)

            # Create default pool
            await self._create_pool("default", self.config.max_connections)

            self._initialized = True
            logger.info("Valkey connection manager initialized successfully")

    async def _create_pool(self, name: str, max_connections: int) -> ConnectionPool:
        """Create a specialized connection pool"""
        try:
            # Configure retry strategy
            retry = Retry(
                ExponentialBackoff(
                    base=self.config.exponential_base,
                    max_delay=self.config.max_retry_delay
                ),
                retries=self.config.max_retries,
                supported_errors=self.config.retry_on_error
            )

            pool = ConnectionPool.from_url(
                f"redis://{self.config.host}:{self.config.port}/{self.config.db}",
                password=self.config.password,
                ssl=self.config.ssl,
                max_connections=max_connections,
                min_connections=1,
                retry_on_timeout=self.config.retry_on_timeout,
                retry_on_error=self.config.retry_on_error,
                socket_timeout=self.config.socket_timeout,
                socket_connect_timeout=self.config.socket_connect_timeout,
                health_check_interval=self.config.health_check_interval,
                socket_keepalive=self.config.socket_keepalive,
                socket_keepalive_options=self.config.socket_keepalive_options,
                retry=retry
            )

            self.pools[name] = pool
            self.stats[name] = ValkeyPoolStats(
                pool_name=name,
                total_connections=0,
                available_connections=0,
                in_use_connections=0,
                created_connections=0
            )

            logger.info(f"Created {name} pool with max_connections={max_connections}")
            return pool

        except Exception as e:
            logger.error(f"Failed to create {name} pool: {e}")
            raise

    def get_redis_client(self, pool_name: str = "default") -> Redis:
        """Get Redis client from specified pool"""
        if not self._initialized:
            raise RuntimeError("ValkeyConnectionManager not initialized. Call initialize() first.")

        if pool_name not in self.pools:
            raise ValueError(f"Pool '{pool_name}' not found. Available pools: {list(self.pools.keys())}")

        return Redis(connection_pool=self.pools[pool_name])

    @asynccontextmanager
    async def get_connection(self, pool_name: str = "default"):
        """Get connection from pool with automatic cleanup and metrics"""
        if not self._initialized:
            raise RuntimeError("ValkeyConnectionManager not initialized")

        client = self.get_redis_client(pool_name)
        start_time = time.time()

        try:
            yield client

            # Update metrics
            response_time = time.time() - start_time
            await self._update_stats(pool_name, response_time)

        except Exception as e:
            # Update error metrics
            await self._update_error_stats(pool_name, str(e))
            raise
        finally:
            # Connection is automatically returned to pool when client is GC'd
            # For explicit cleanup, we can call close() if needed
            pass

    async def _update_stats(self, pool_name: str, response_time: float):
        """Update pool statistics"""
        async with self._lock:
            if pool_name in self.stats:
                stats = self.stats[pool_name]
                stats.total_requests += 1

                # Update average response time
                if stats.total_requests == 1:
                    stats.avg_response_time = response_time
                else:
                    stats.avg_response_time = (
                        (stats.avg_response_time * (stats.total_requests - 1) + response_time) /
                        stats.total_requests
                    )

                # Update pool info
                if pool_name in self.pools:
                    pool = self.pools[pool_name]
                    pool_stats = pool.get_connection_pool_stats()
                    stats.total_connections = pool_stats.get('created_connections', 0)
                    stats.available_connections = pool_stats.get('available_connections', 0)
                    stats.in_use_connections = pool_stats.get('in_use_connections', 0)

            # Update global metrics
            self.global_metrics["total_requests"] += 1
            total_requests = self.global_metrics["total_requests"]
            if total_requests == 1:
                self.global_metrics["avg_response_time"] = response_time
            else:
                current_avg = self.global_metrics["avg_response_time"]
                self.global_metrics["avg_response_time"] = (
                    (current_avg * (total_requests - 1) + response_time) / total_requests
                )

    async def _update_error_stats(self, pool_name: str, error_message: str):
        """Update error statistics"""
        async with self._lock:
            if pool_name in self.stats:
                self.stats[pool_name].errors += 1
                self.stats[pool_name].last_error = error_message

            self.global_metrics["total_errors"] += 1

    async def ping_all_pools(self) -> Dict[str, bool]:
        """Ping all pools to check connectivity"""
        results = {}

        for pool_name in self.pools.keys():
            try:
                async with self.get_connection(pool_name) as client:
                    result = await client.ping()
                    results[pool_name] = bool(result)

            except Exception as e:
                logger.error(f"Failed to ping {pool_name} pool: {e}")
                results[pool_name] = False
                await self._update_error_stats(pool_name, str(e))

        return results

    async def get_pool_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get statistics for all pools"""
        async with self._lock:
            return {
                pool_name: stats.to_dict()
                for pool_name, stats in self.stats.items()
            }

    async def get_global_stats(self) -> Dict[str, Any]:
        """Get global connection manager statistics"""
        uptime = time.time() - self.global_metrics["uptime"]

        return {
            "total_requests": self.global_metrics["total_requests"],
            "total_errors": self.global_metrics["total_errors"],
            "avg_response_time": self.global_metrics["avg_response_time"],
            "uptime_seconds": uptime,
            "error_rate": (
                self.global_metrics["total_errors"] / max(self.global_metrics["total_requests"], 1)
            ),
            "requests_per_second": (
                self.global_metrics["total_requests"] / max(uptime, 1)
            )
        }

    async def close(self):
        """Close all connection pools"""
        async with self._lock:
            for name, pool in self.pools.items():
                try:
                    await pool.disconnect()
                    logger.info(f"Closed {name} pool")
                except Exception as e:
                    logger.error(f"Error closing {name} pool: {e}")

            self.pools.clear()
            self.stats.clear()
            self._initialized = False

            logger.info("Valkey connection manager closed")

    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check of all pools"""
        ping_results = await self.ping_all_pools()
        pool_stats = await self.get_pool_stats()
        global_stats = await self.get_global_stats()

        # Determine overall health
        healthy_pools = sum(1 for result in ping_results.values() if result)
        total_pools = len(ping_results)
        is_healthy = healthy_pools == total_pools and global_stats["error_rate"] < 0.01

        return {
            "healthy": is_healthy,
            "healthy_pools": healthy_pools,
            "total_pools": total_pools,
            "pool_connectivity": ping_results,
            "pool_statistics": pool_stats,
            "global_statistics": global_stats,
            "timestamp": time.time()
        }

# Global connection manager instance
_valkey_manager: Optional[ValkeyConnectionManager] = None

async def get_valkey_manager() -> ValkeyConnectionManager:
    """Get or create the global Valkey connection manager"""
    global _valkey_manager

    if _valkey_manager is None:
        # Get configuration from environment
        valkey_url = os.getenv("VALKEY_URL", os.getenv("REDIS_URL", "valkey://localhost:6379"))
        config = ValkeyConnectionConfig.from_url(valkey_url)

        # Optimize for AGUI workloads
        config.health_check_interval = 15.0  # More frequent health checks
        config.socket_timeout = 3.0  # Faster timeouts for AGUI responsiveness
        config.socket_connect_timeout = 1.0
        config.max_connections = 100  # High concurrency

        _valkey_manager = ValkeyConnectionManager(config)
        await _valkey_manager.initialize()

        logger.info("Global Valkey connection manager created and initialized")

    return _valkey_manager

async def initialize_valkey_from_url(url: str, **kwargs) -> ValkeyConnectionManager:
    """Initialize Valkey manager with custom URL and settings"""
    config = ValkeyConnectionConfig.from_url(url, **kwargs)
    manager = ValkeyConnectionManager(config)
    await manager.initialize()
    return manager

# Utility functions for specific use cases

async def get_websocket_redis() -> Redis:
    """Get Redis client optimized for WebSocket connections"""
    manager = await get_valkey_manager()
    return manager.get_redis_client("websocket")

async def get_state_redis() -> Redis:
    """Get Redis client optimized for LangGraph state management"""
    manager = await get_valkey_manager()
    return manager.get_redis_client("state")

async def get_session_redis() -> Redis:
    """Get Redis client optimized for session storage and rate limiting"""
    manager = await get_valkey_manager()
    return manager.get_redis_client("session")

async def get_broadcast_redis() -> Redis:
    """Get Redis client optimized for event broadcasting (pub/sub)"""
    manager = await get_valkey_manager()
    return manager.get_redis_client("broadcast")

# Cleanup function for graceful shutdown
async def cleanup_valkey_connections():
    """Cleanup global Valkey connections"""
    global _valkey_manager

    if _valkey_manager:
        await _valkey_manager.close()
        _valkey_manager = None
        logger.info("Global Valkey connection manager cleaned up")

# Decorator for automatic connection management
def with_valkey_connection(pool_name: str = "default"):
    """Decorator to provide Valkey connection to functions"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            manager = await get_valkey_manager()
            async with manager.get_connection(pool_name) as client:
                return await func(client, *args, **kwargs)
        return wrapper
    return decorator