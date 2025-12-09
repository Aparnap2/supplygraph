"""
Advanced error handling with circuit breaker patterns for production use
"""
import asyncio
import logging
import time
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Any, Optional, Callable, Type, Union, Awaitable
from dataclasses import dataclass, field
from functools import wraps
import traceback
import json
from contextlib import asynccontextmanager

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
import redis.asyncio as redis
import httpx

# Configure structured logging
logger = logging.getLogger(__name__)

class CircuitState(Enum):
    """Circuit breaker states"""
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing, stop calling
    HALF_OPEN = "half_open"  # Testing if service recovered

class ErrorSeverity(Enum):
    """Error severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ErrorCategory(Enum):
    """Error categories for classification"""
    NETWORK = "network"
    DATABASE = "database"
    AUTHENTICATION = "authentication"
    AUTHORIZATION = "authorization"
    VALIDATION = "validation"
    RATE_LIMIT = "rate_limit"
    EXTERNAL_SERVICE = "external_service"
    INTERNAL_ERROR = "internal_error"
    TIMEOUT = "timeout"
    RESOURCE_EXHAUSTION = "resource_exhaustion"
    BUSINESS_LOGIC = "business_logic"

@dataclass
class ErrorMetrics:
    """Error metrics tracking"""
    error_count: int = 0
    last_error_time: Optional[datetime] = None
    error_rate: float = 0.0
    consecutive_failures: int = 0
    total_requests: int = 0
    last_success_time: Optional[datetime] = None
    success_rate: float = 0.0
    error_types: Dict[str, int] = field(default_factory=dict)

@dataclass
class CircuitBreakerConfig:
    """Configuration for circuit breaker"""
    failure_threshold: int = 5              # Open circuit after N failures
    recovery_timeout: float = 60.0           # Wait N seconds before trying again
    success_threshold: int = 2               # Close circuit after N successes
    timeout: float = 30.0                    # Operation timeout in seconds
    monitoring_window: float = 300.0         # Monitoring window in seconds
    error_rate_threshold: float = 0.5        # Open if error rate exceeds 50%
    consecutive_failure_threshold: int = 3    # Open on N consecutive failures

@dataclass
class ErrorContext:
    """Context for error handling"""
    request_id: Optional[str] = None
    user_id: Optional[str] = None
    org_id: Optional[str] = None
    operation: Optional[str] = None
    component: Optional[str] = None
    additional_data: Dict[str, Any] = field(default_factory=dict)

class CircuitBreakerError(Exception):
    """Circuit breaker is open error"""
    def __init__(self, service_name: str, state: CircuitState, next_attempt: datetime):
        self.service_name = service_name
        self.state = state
        self.next_attempt = next_attempt
        super().__init__(f"Circuit breaker OPEN for {service_name}. Next attempt at {next_attempt}")

class ServiceTimeoutError(Exception):
    """Service operation timeout error"""
    def __init__(self, service_name: str, timeout: float):
        self.service_name = service_name
        self.timeout = timeout
        super().__init__(f"Service {service_name} timed out after {timeout}s")

class RateLimitExceededError(Exception):
    """Rate limit exceeded error"""
    def __init__(self, limit: int, window: int, retry_after: int):
        self.limit = limit
        self.window = window
        self.retry_after = retry_after
        super().__init__(f"Rate limit exceeded: {limit} requests per {window}s. Retry after {retry_after}s")

class DatabaseConnectionError(Exception):
    """Database connection error"""
    def __init__(self, database_name: str, operation: str):
        self.database_name = database_name
        self.operation = operation
        super().__init__(f"Database {database_name} connection failed during {operation}")

class ExternalServiceError(Exception):
    """External service error"""
    def __init__(self, service_name: str, status_code: int, response_text: str):
        self.service_name = service_name
        self.status_code = status_code
        self.response_text = response_text
        super().__init__(f"External service {service_name} returned {status_code}: {response_text[:200]}")

class CircuitBreaker:
    """
    Advanced circuit breaker with multiple failure detection strategies
    """

    def __init__(self, service_name: str, config: CircuitBreakerConfig,
                 redis_client: Optional[redis.Redis] = None):
        self.service_name = service_name
        self.config = config
        self.redis_client = redis_client

        self.state = CircuitState.CLOSED
        self.metrics = ErrorMetrics()
        self.last_state_change = datetime.utcnow()
        self._lock = asyncio.Lock()

    async def call(self, func: Callable[..., Awaitable[Any]], *args, **kwargs) -> Any:
        """
        Execute function with circuit breaker protection
        """
        async with self._lock:
            # Check if we should attempt the call
            if not self._should_attempt_call():
                raise CircuitBreakerError(
                    self.service_name,
                    self.state,
                    self._get_next_attempt_time()
                )

            # Update request count
            self.metrics.total_requests += 1

        try:
            # Execute with timeout
            result = await asyncio.wait_for(
                func(*args, **kwargs),
                timeout=self.config.timeout
            )

            # Record success
            await self._record_success()
            return result

        except asyncio.TimeoutError:
            await self._record_failure(ErrorCategory.TIMEOUT, "Operation timeout")
            raise ServiceTimeoutError(self.service_name, self.config.timeout)

        except Exception as e:
            # Categorize error
            error_category = self._categorize_error(e)
            await self._record_failure(error_category, str(e))
            raise

    async def force_open(self):
        """Force circuit breaker to open state"""
        async with self._lock:
            self.state = CircuitState.OPEN
            self.last_state_change = datetime.utcnow()
            await self._persist_state()

    async def force_close(self):
        """Force circuit breaker to closed state"""
        async with self._lock:
            self.state = CircuitState.CLOSED
            self.metrics = ErrorMetrics()
            self.last_state_change = datetime.utcnow()
            await self._persist_state()

    def get_status(self) -> Dict[str, Any]:
        """Get circuit breaker status"""
        return {
            "service": self.service_name,
            "state": self.state.value,
            "metrics": {
                "error_count": self.metrics.error_count,
                "total_requests": self.metrics.total_requests,
                "success_rate": self.metrics.success_rate,
                "error_rate": self.metrics.error_rate,
                "consecutive_failures": self.metrics.consecutive_failures,
                "last_error_time": self.metrics.last_error_time.isoformat() if self.metrics.last_error_time else None,
                "last_success_time": self.metrics.last_success_time.isoformat() if self.metrics.last_success_time else None,
                "error_types": self.metrics.error_types.copy()
            },
            "config": {
                "failure_threshold": self.config.failure_threshold,
                "recovery_timeout": self.config.recovery_timeout,
                "success_threshold": self.config.success_threshold,
                "timeout": self.config.timeout
            },
            "last_state_change": self.last_state_change.isoformat(),
            "next_attempt": self._get_next_attempt_time().isoformat()
        }

    # Private methods

    def _should_attempt_call(self) -> bool:
        """Check if call should be attempted based on state"""
        if self.state == CircuitState.CLOSED:
            return True

        if self.state == CircuitState.OPEN:
            # Check if recovery timeout has passed
            if (datetime.utcnow() - self.last_state_change).total_seconds() >= self.config.recovery_timeout:
                self.state = CircuitState.HALF_OPEN
                self.last_state_change = datetime.utcnow()
                return True
            return False

        return True  # HALF_OPEN

    async def _record_success(self):
        """Record successful operation"""
        async with self._lock:
            now = datetime.utcnow()
            self.metrics.last_success_time = now
            self.metrics.consecutive_failures = 0

            # Update success rate
            if self.metrics.total_requests > 0:
                self.metrics.success_rate = (
                    self.metrics.total_requests - self.metrics.error_count
                ) / self.metrics.total_requests

            # Close circuit if we're in HALF_OPEN and have enough successes
            if (self.state == CircuitState.HALF_OPEN and
                self.metrics.consecutive_failures == 0):
                # In half-open, we need actual success count
                success_count = getattr(self, '_half_open_success_count', 0) + 1
                self._half_open_success_count = success_count

                if success_count >= self.config.success_threshold:
                    self.state = CircuitState.CLOSED
                    self.last_state_change = now
                    delattr(self, '_half_open_success_count')

            await self._persist_state()

    async def _record_failure(self, category: ErrorCategory, message: str):
        """Record failed operation"""
        async with self._lock:
            now = datetime.utcnow()
            self.metrics.error_count += 1
            self.metrics.last_error_time = now
            self.metrics.consecutive_failures += 1

            # Track error types
            error_type = f"{category.value}:{message[:50]}"
            self.metrics.error_types[error_type] = self.metrics.error_types.get(error_type, 0) + 1

            # Update error rate
            if self.metrics.total_requests > 0:
                self.metrics.error_rate = self.metrics.error_count / self.metrics.total_requests

            # Check if we should open the circuit
            should_open = False

            # Consecutive failures threshold
            if self.metrics.consecutive_failures >= self.config.consecutive_failure_threshold:
                should_open = True

            # Total failure threshold
            elif self.metrics.error_count >= self.config.failure_threshold:
                should_open = True

            # Error rate threshold (if we have enough data)
            elif (self.metrics.total_requests >= 10 and
                  self.metrics.error_rate >= self.config.error_rate_threshold):
                should_open = True

            if should_open and self.state != CircuitState.OPEN:
                self.state = CircuitState.OPEN
                self.last_state_change = now
                logger.warning(f"Circuit breaker OPENED for {self.service_name} - "
                             f"Error rate: {self.metrics.error_rate:.2%}, "
                             f"Consecutive failures: {self.metrics.consecutive_failures}")

            await self._persist_state()

    def _categorize_error(self, error: Exception) -> ErrorCategory:
        """Categorize error for tracking"""
        if isinstance(error, asyncio.TimeoutError):
            return ErrorCategory.TIMEOUT
        elif isinstance(error, httpx.ConnectError):
            return ErrorCategory.NETWORK
        elif isinstance(error, httpx.HTTPStatusError):
            if error.response.status_code == 401:
                return ErrorCategory.AUTHENTICATION
            elif error.response.status_code == 403:
                return ErrorCategory.AUTHORIZATION
            elif error.response.status_code == 429:
                return ErrorCategory.RATE_LIMIT
            elif 500 <= error.response.status_code < 600:
                return ErrorCategory.EXTERNAL_SERVICE
            else:
                return ErrorCategory.EXTERNAL_SERVICE
        elif isinstance(error, redis.ConnectionError):
            return ErrorCategory.DATABASE
        elif isinstance(error, ValueError) or isinstance(error, TypeError):
            return ErrorCategory.VALIDATION
        else:
            return ErrorCategory.INTERNAL_ERROR

    def _get_next_attempt_time(self) -> datetime:
        """Get next time circuit will allow calls"""
        if self.state != CircuitState.OPEN:
            return datetime.utcnow()

        return self.last_state_change + timedelta(seconds=self.config.recovery_timeout)

    async def _persist_state(self):
        """Persist circuit breaker state to Redis"""
        if not self.redis_client:
            return

        try:
            state_data = {
                "service": self.service_name,
                "state": self.state.value,
                "last_state_change": self.last_state_change.isoformat(),
                "metrics": {
                    "error_count": self.metrics.error_count,
                    "total_requests": self.metrics.total_requests,
                    "success_rate": self.metrics.success_rate,
                    "error_rate": self.metrics.error_rate,
                    "consecutive_failures": self.metrics.consecutive_failures,
                    "last_error_time": self.metrics.last_error_time.isoformat() if self.metrics.last_error_time else None,
                    "last_success_time": self.metrics.last_success_time.isoformat() if self.metrics.last_success_time else None,
                    "error_types": json.dumps(self.metrics.error_types)
                }
            }

            await self.redis_client.hset(
                f"circuit_breaker:{self.service_name}",
                mapping=state_data
            )

            # Set expiration
            await self.redis_client.expire(
                f"circuit_breaker:{self.service_name}",
                int(self.config.monitoring_window)
            )

        except Exception as e:
            logger.warning(f"Failed to persist circuit breaker state for {self.service_name}: {e}")

    async def _load_state(self):
        """Load circuit breaker state from Redis"""
        if not self.redis_client:
            return

        try:
            state_data = await self.redis_client.hgetall(f"circuit_breaker:{self.service_name}")

            if not state_data:
                return

            self.state = CircuitState(state_data.get("state", "closed"))
            self.last_state_change = datetime.fromisoformat(
                state_data.get("last_state_change", datetime.utcnow().isoformat())
            )

            # Load metrics
            if "metrics" in state_data:
                metrics_data = json.loads(state_data["metrics"])
                self.metrics.error_count = metrics_data.get("error_count", 0)
                self.metrics.total_requests = metrics_data.get("total_requests", 0)
                self.metrics.success_rate = metrics_data.get("success_rate", 0.0)
                self.metrics.error_rate = metrics_data.get("error_rate", 0.0)
                self.metrics.consecutive_failures = metrics_data.get("consecutive_failures", 0)

                if metrics_data.get("last_error_time"):
                    self.metrics.last_error_time = datetime.fromisoformat(metrics_data["last_error_time"])

                if metrics_data.get("last_success_time"):
                    self.metrics.last_success_time = datetime.fromisoformat(metrics_data["last_success_time"])

                self.metrics.error_types = json.loads(metrics_data.get("error_types", "{}"))

        except Exception as e:
            logger.warning(f"Failed to load circuit breaker state for {self.service_name}: {e}")

class ErrorReportingService:
    """Service for structured error reporting and alerting"""

    def __init__(self, redis_client: Optional[redis.Redis] = None):
        self.redis_client = redis_client

    async def report_error(self, error: Exception, context: ErrorContext,
                          severity: ErrorSeverity = ErrorSeverity.MEDIUM):
        """Report error with structured context"""
        error_data = {
            "error_type": error.__class__.__name__,
            "error_message": str(error),
            "traceback": traceback.format_exc(),
            "severity": severity.value,
            "context": {
                "request_id": context.request_id,
                "user_id": context.user_id,
                "org_id": context.org_id,
                "operation": context.operation,
                "component": context.component,
                "additional_data": context.additional_data
            },
            "timestamp": datetime.utcnow().isoformat()
        }

        # Store in Redis for monitoring
        if self.redis_client:
            try:
                await self.redis_client.lpush(
                    "error_reports",
                    json.dumps(error_data, default=str)
                )

                # Keep only last 1000 errors
                await self.redis_client.ltrim("error_reports", 0, 999)

                # Critical errors go to separate alert queue
                if severity == ErrorSeverity.CRITICAL:
                    await self.redis_client.lpush(
                        "critical_alerts",
                        json.dumps(error_data, default=str)
                    )
                    await self.redis_client.ltrim("critical_alerts", 0, 99)

            except Exception as e:
                logger.error(f"Failed to report error to Redis: {e}")

        # Log error
        log_level = {
            ErrorSeverity.LOW: logging.INFO,
            ErrorSeverity.MEDIUM: logging.WARNING,
            ErrorSeverity.HIGH: logging.ERROR,
            ErrorSeverity.CRITICAL: logging.CRITICAL
        }.get(severity, logging.ERROR)

        logger.log(
            log_level,
            f"Error in {context.operation}: {error_type:=error.__class__.__name__}, "
            f"Message: {error_message:=str(error)}, Context: {context}"
        )

class RetryPolicy:
    """Retry policy configuration"""

    def __init__(self,
                 max_attempts: int = 3,
                 initial_delay: float = 1.0,
                 max_delay: float = 60.0,
                 exponential_base: float = 2.0,
                 jitter: bool = True,
                 retry_on: Optional[List[Type[Exception]]] = None):
        self.max_attempts = max_attempts
        self.initial_delay = initial_delay
        self.max_delay = max_delay
        self.exponential_base = exponential_base
        self.jitter = jitter
        self.retry_on = retry_on or [Exception]

    def get_delay(self, attempt: int) -> float:
        """Calculate delay for retry attempt"""
        delay = min(
            self.initial_delay * (self.exponential_base ** attempt),
            self.max_delay
        )

        if self.jitter:
            # Add random jitter up to 50% of delay
            import random
            delay *= (1 + random.random() * 0.5)

        return delay

    def should_retry(self, error: Exception, attempt: int) -> bool:
        """Determine if error should be retried"""
        if attempt >= self.max_attempts:
            return False

        return isinstance(error, tuple(self.retry_on))

def circuit_breaker(circuit_breaker: CircuitBreaker,
                    error_context: Optional[ErrorContext] = None):
    """
    Decorator for circuit breaker protection
    """
    def decorator(func: Callable[..., Awaitable[Any]]):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await circuit_breaker.call(func, *args, **kwargs)
            except CircuitBreakerError:
                # Re-raise as HTTP exception for API responses
                raise HTTPException(
                    status_code=503,
                    detail={
                        "error": "SERVICE_UNAVAILABLE",
                        "message": f"Service {circuit_breaker.service_name} is temporarily unavailable",
                        "next_attempt": circuit_breaker._get_next_attempt_time().isoformat()
                    }
                )
            except ServiceTimeoutError as e:
                raise HTTPException(
                    status_code=504,
                    detail={
                        "error": "SERVICE_TIMEOUT",
                        "message": str(e),
                        "service": e.service_name,
                        "timeout": e.timeout
                    }
                )
        return wrapper
    return decorator

def retry_with_policy(policy: RetryPolicy,
                      error_context: Optional[ErrorContext] = None):
    """
    Decorator for retry functionality
    """
    def decorator(func: Callable[..., Awaitable[Any]]):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_error = None

            for attempt in range(policy.max_attempts):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_error = e

                    if not policy.should_retry(e, attempt):
                        break

                    delay = policy.get_delay(attempt)
                    logger.warning(
                        f"Attempt {attempt + 1} failed for {func.__name__}: {e}. "
                        f"Retrying in {delay:.2f}s"
                    )
                    await asyncio.sleep(delay)

            # All attempts failed
            raise last_error

        return wrapper
    return decorator

def async_error_handler(
    error_reporting: ErrorReportingService,
    default_context: Optional[ErrorContext] = None
):
    """
    Decorator for comprehensive async error handling
    """
    def decorator(func: Callable[..., Awaitable[Any]]):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)

            except HTTPException:
                # Re-raise HTTP exceptions as-is
                raise

            except asyncio.CancelledError:
                # Handle cancellation gracefully
                context = default_context or ErrorContext(operation=func.__name__)
                await error_reporting.report_error(
                    asyncio.CancelledError("Operation was cancelled"),
                    context,
                    ErrorSeverity.LOW
                )
                raise

            except Exception as e:
                # Handle all other exceptions
                context = default_context or ErrorContext(operation=func.__name__)
                severity = ErrorSeverity.HIGH

                # Determine severity based on error type
                if isinstance(e, (ValueError, TypeError)):
                    severity = ErrorSeverity.MEDIUM
                elif isinstance(e, (asyncio.TimeoutError, ConnectionError)):
                    severity = ErrorSeverity.HIGH
                elif "critical" in str(e).lower() or "emergency" in str(e).lower():
                    severity = ErrorSeverity.CRITICAL

                await error_reporting.report_error(e, context, severity)

                # Convert to HTTP exception for API responses
                raise HTTPException(
                    status_code=500,
                    detail={
                        "error": "INTERNAL_ERROR",
                        "message": "An internal error occurred. The error has been reported.",
                        "request_id": context.request_id
                    }
                )

        return wrapper
    return decorator

class DatabaseConnectionManager:
    """Database connection manager with circuit breaker"""

    def __init__(self, connection_string: str, database_name: str,
                 circuit_breaker_config: Optional[CircuitBreakerConfig] = None,
                 redis_client: Optional[redis.Redis] = None):
        self.connection_string = connection_string
        self.database_name = database_name
        self.circuit_breaker_config = circuit_breaker_config or CircuitBreakerConfig()
        self.redis_client = redis_client

        self.circuit_breaker = CircuitBreaker(
            f"database_{database_name}",
            self.circuit_breaker_config,
            redis_client
        )

        # Initialize circuit breaker state
        asyncio.create_task(self.circuit_breaker._load_state())

    async def execute_query(self, query_func: Callable[..., Awaitable[Any]], *args, **kwargs):
        """Execute database query with circuit breaker protection"""
        @circuit_breaker(self.circuit_breaker)
        async def protected_query(*args, **kwargs):
            try:
                return await query_func(*args, **kwargs)
            except Exception as e:
                raise DatabaseConnectionError(self.database_name, query_func.__name__) from e

        return await protected_query(*args, **kwargs)

    async def health_check(self) -> Dict[str, Any]:
        """Perform database health check"""
        try:
            # Simple ping query - implement based on your database
            await self.execute_query(self._ping_query)
            return {"status": "healthy", "database": self.database_name}
        except Exception as e:
            return {"status": "unhealthy", "database": self.database_name, "error": str(e)}

    async def _ping_query(self):
        """Simple ping query - override based on your database"""
        # This is a placeholder - implement actual ping for your database
        pass

class ExternalServiceClient:
    """External service client with comprehensive error handling"""

    def __init__(self, service_name: str, base_url: str,
                 api_key: Optional[str] = None,
                 circuit_breaker_config: Optional[CircuitBreakerConfig] = None,
                 retry_policy: Optional[RetryPolicy] = None,
                 redis_client: Optional[redis.Redis] = None):
        self.service_name = service_name
        self.base_url = base_url
        self.api_key = api_key
        self.circuit_breaker_config = circuit_breaker_config or CircuitBreakerConfig()
        self.retry_policy = retry_policy or RetryPolicy()
        self.redis_client = redis_client

        self.circuit_breaker = CircuitBreaker(
            service_name,
            self.circuit_breaker_config,
            redis_client
        )

        # Initialize circuit breaker state
        asyncio.create_task(self.circuit_breaker._load_state())

        self.http_client = httpx.AsyncClient(
            base_url=base_url,
            headers={"Authorization": f"Bearer {api_key}"} if api_key else None,
            timeout=30.0
        )

    async def make_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make HTTP request with comprehensive error handling"""
        @circuit_breaker(self.circuit_breaker)
        @retry_with_policy(self.retry_policy)
        async def protected_request():
            try:
                response = await self.http_client.request(method, endpoint, **kwargs)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                raise ExternalServiceError(
                    self.service_name,
                    e.response.status_code,
                    e.response.text
                ) from e

        return await protected_request()

    async def health_check(self) -> Dict[str, Any]:
        """Perform service health check"""
        try:
            # Try to make a simple request - override based on service
            response = await self.http_client.get("/health")
            response.raise_for_status()
            return {"status": "healthy", "service": self.service_name}
        except Exception as e:
            return {"status": "unhealthy", "service": self.service_name, "error": str(e)}

    async def close(self):
        """Close HTTP client"""
        await self.http_client.aclose()

# Global error handling utilities

async def create_error_handling_middleware(
    error_reporting: ErrorReportingService,
    redis_client: Optional[redis.Redis] = None
):
    """Create error handling middleware for FastAPI"""

    async def error_handler(request: Request, call_next):
        """Error handling middleware"""
        request_id = getattr(request.state, 'request_id', None)
        start_time = time.time()

        try:
            response = await call_next(request)

            # Log successful requests
            processing_time = time.time() - start_time
            logger.info(
                f"Request completed: {request.method} {request.url.path} - "
                f"Status: {response.status_code}, Time: {processing_time:.3f}s, "
                f"Request ID: {request_id}"
            )

            return response

        except HTTPException:
            # HTTP exceptions are handled by FastAPI
            raise

        except Exception as e:
            # Handle unexpected errors
            processing_time = time.time() - start_time
            context = ErrorContext(
                request_id=request_id,
                user_id=getattr(request.state, 'user_id', None),
                org_id=getattr(request.state, 'org_id', None),
                operation=f"{request.method} {request.url.path}",
                component="api_middleware",
                additional_data={
                    "method": request.method,
                    "path": request.url.path,
                    "query_params": dict(request.query_params),
                    "processing_time": processing_time
                }
            )

            await error_reporting.report_error(e, context, ErrorSeverity.HIGH)

            # Return structured error response
            return JSONResponse(
                status_code=500,
                content={
                    "error": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred. The error has been reported.",
                    "request_id": request_id,
                    "timestamp": datetime.utcnow().isoformat()
                }
            )

    return error_handler

@asynccontextmanager
async def error_boundary(error_reporting: ErrorReportingService,
                         context: Optional[ErrorContext] = None):
    """Context manager for error boundary"""
    try:
        yield
    except Exception as e:
        if context:
            await error_reporting.report_error(e, context, ErrorSeverity.MEDIUM)
        else:
            logger.error(f"Error in boundary: {e}")
        raise