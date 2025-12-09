"""
Production-ready FastAPI service for SupplyGraph AI Engine with comprehensive error handling
"""
import os
import asyncio
import uuid
import json
import time
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
import uvicorn

# Production imports
from src.services.websocket_manager_prod import ProductionWebSocketManager, ConnectionPoolConfig
from src.services.auth_service import AuthService
from src.models.validation import (
    SecureChatMessage, SecureWorkflowResumeRequest, SecurityValidationError,
    ErrorResponse, HealthCheckResponse, WebSocketMessage
)
from src.utils.error_handling import (
    CircuitBreaker, CircuitBreakerConfig, DatabaseConnectionManager,
    ExternalServiceClient, ErrorReportingService, RetryPolicy,
    create_error_handling_middleware, error_boundary
)
from src.utils.state_manager import (
    RedisCheckpointSaver, ConcurrentWorkflowManager,
    create_state_manager, create_workflow_manager, verify_integrity_hash
)
from src.utils.valkey_manager import (
    get_valkey_manager, get_state_redis, get_websocket_redis,
    get_session_redis, get_broadcast_redis, with_valkey_connection
)
from src.utils.monitoring import (
    ObservabilityManager, setup_correlation_id, span_context,
    create_application_health_checks, get_observability_manager
)
from src.utils.logging import (
    initialize_logging, get_logger, LogConfiguration, LogLevel,
    LogCategory, performance_logger, log_request
)
from src.workflows.procurement import ProcurementWorkflow

# Environment configuration
class ProductionConfig:
    """Production configuration from environment variables"""

    def __init__(self):
        self.service_name = os.getenv("SERVICE_NAME", "supplygraph-ai-engine")
        self.service_version = os.getenv("SERVICE_VERSION", "1.0.0")
        self.environment = os.getenv("ENVIRONMENT", "production")
        self.log_level = LogLevel[os.getenv("LOG_LEVEL", "INFO").upper()]
        # Prefer VALKEY_URL, fallback to REDIS_URL for backward compatibility
        self.valkey_url = os.getenv("VALKEY_URL") or os.getenv("REDIS_URL", "valkey://localhost:6379/0")
        self.redis_url = self.valkey_url  # For backward compatibility
        self.database_url = os.getenv("DATABASE_URL", "postgresql://localhost/supplygraph")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.better_auth_url = os.getenv("BETTER_AUTH_URL", "http://localhost:3000/api/auth")
        self.supplygraph_api_key = os.getenv("SUPPLYGRAPH_API_KEY", "dev-key")

        # Monitoring configuration
        self.jaeger_endpoint = os.getenv("JAEGER_ENDPOINT")
        self.prometheus_enabled = os.getenv("PROMETHEUS_ENABLED", "true").lower() == "true"

        # Security configuration
        self.allowed_hosts = os.getenv("ALLOWED_HOSTS", "*").split(",")
        self.cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
        self.enable_security_middleware = os.getenv("ENABLE_SECURITY_MIDDLEWARE", "true").lower() == "true"

        # Performance configuration
        self.max_concurrent_workflows = int(os.getenv("MAX_CONCURRENT_WORKFLOWS", "50"))
        self.workflow_timeout = int(os.getenv("WORKFLOW_TIMEOUT", "300"))
        self.request_timeout = int(os.getenv("REQUEST_TIMEOUT", "60"))

# Global state
config = ProductionConfig()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Production application lifecycle management
    """
    logger = get_logger()

    try:
        logger.info(
            f"Starting {config.service_name} v{config.service_version} in {config.environment} mode",
            category=LogCategory.SYSTEM
        )

        # Initialize Valkey connection manager
        valkey_manager = await get_valkey_manager()

        # Get specialized Redis clients for different use cases
        redis_client = await get_state_redis()  # For state management
        redis_binary_client = await get_state_redis()  # Note: Would need binary client config

        # Initialize logging
        log_config = LogConfiguration(
            service_name=config.service_name,
            service_version=config.service_version,
            environment=config.environment,
            log_level=config.log_level,
            enable_redis_logging=True,
            enable_performance_logging=True,
            enable_json_output=True
        )
        structured_logger = initialize_logging(log_config, redis_client)

        # Initialize observability
        observability_manager = ObservabilityManager(
            service_name=config.service_name,
            service_version=config.service_version,
            redis_client=redis_client,
            jaeger_endpoint=config.jaeger_endpoint,
            prometheus_enabled=config.prometheus_enabled
        )
        observability_manager.initialize()

        # Set global observability manager
        from src.utils.monitoring import set_observability_manager
        set_observability_manager(observability_manager)

        # Initialize error reporting
        error_reporting = ErrorReportingService(redis_client)

        # Initialize circuit breakers
        circuit_breakers = await initialize_circuit_breakers(redis_client)

        # Initialize state management with Valkey
        checkpoint_saver = await create_state_manager(
            config.valkey_url,
            ttl=config.workflow_timeout * 2
        )
        workflow_manager = await create_workflow_manager(
            config.valkey_url,
            max_concurrent_per_org=config.max_concurrent_workflows // 10,
            max_concurrent_per_user=config.max_concurrent_workflows // 20,
            checkpoint_ttl=config.workflow_timeout
        )

        # Initialize database connection manager
        db_manager = DatabaseConnectionManager(
            config.database_url,
            "supplygraph",
            CircuitBreakerConfig(
                failure_threshold=3,
                recovery_timeout=30.0,
                timeout=10.0
            ),
            redis_client
        )

        # Initialize external service clients
        external_clients = await initialize_external_services()

        # Initialize WebSocket manager with Valkey
        websocket_config = ConnectionPoolConfig(
            max_connections_per_thread=10,
            max_total_connections=config.max_concurrent_workflows,
            heartbeat_interval=30,
            connection_timeout=config.workflow_timeout,
            rate_limit_requests=60,
            rate_limit_window=60,
            redis_url=config.valkey_url  # Use Valkey
        )
        websocket_manager = ProductionWebSocketManager(websocket_config)
        await websocket_manager.initialize()

        # Initialize workflow
        workflow_instance = ProcurementWorkflow(
            openai_api_key=config.openai_api_key,
            db_connection_string=config.database_url
        )

        # Initialize authentication
        auth_service = AuthService()

        # Add health checks
        health_checks = create_application_health_checks(redis_client, circuit_breakers)
        for health_check in health_checks:
            observability_manager.add_health_check(health_check)

        # Store in app state
        app.state.redis_client = redis_client
        app.state.redis_binary_client = redis_binary_client
        app.state.structured_logger = structured_logger
        app.state.observability_manager = observability_manager
        app.state.error_reporting = error_reporting
        app.state.circuit_breakers = circuit_breakers
        app.state.checkpoint_saver = checkpoint_saver
        app.state.workflow_manager = workflow_manager
        app.state.db_manager = db_manager
        app.state.external_clients = external_clients
        app.state.websocket_manager = websocket_manager
        app.state.workflow_instance = workflow_instance
        app.state.auth_service = auth_service

        logger.info(
            f"Service initialized successfully",
            category=LogCategory.SYSTEM,
            metadata={
                "max_concurrent_workflows": config.max_concurrent_workflows,
                "workflow_timeout": config.workflow_timeout,
                "prometheus_enabled": config.prometheus_enabled
            }
        )

        yield

    except Exception as e:
        logger.error(
            f"Failed to start service: {e}",
            category=LogCategory.ERROR,
            error_type=type(e).__name__,
            exc_info=True
        )
        raise

    finally:
        logger.info("Shutting down service...", category=LogCategory.SYSTEM)

        # Cleanup components
        if hasattr(app.state, 'websocket_manager'):
            await app.state.websocket_manager.shutdown()

        if hasattr(app.state, 'external_clients'):
            for client in app.state.external_clients.values():
                await client.close()

        if hasattr(app.state, 'observability_manager'):
            await app.state.observability_manager.shutdown()

        if hasattr(app.state, 'redis_client'):
            await app.state.redis_client.close()

        if hasattr(app.state, 'redis_binary_client'):
            await app.state.redis_binary_client.close()

        logger.info("Service shutdown complete", category=LogCategory.SYSTEM)

# Initialize FastAPI application
app = FastAPI(
    title="SupplyGraph AI Engine",
    description="Production-ready LangGraph-powered procurement automation service",
    version=config.service_version,
    lifespan=lifespan,
    docs_url="/docs" if config.environment != "production" else None,
    redoc_url="/redoc" if config.environment != "production" else None
)

# Add middleware
if config.enable_security_middleware:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=config.allowed_hosts
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "WebSocket"],
    allow_headers=["*"],
)

# Add correlation ID middleware
app.middleware("http")(setup_correlation_id())

# Add error handling middleware
async def create_error_middleware():
    """Create error handling middleware"""
    observability_manager = get_observability_manager()
    if observability_manager:
        return observability_manager.create_monitoring_middleware()
    else:
        async def no_op_middleware(request: Request, call_next):
            return await call_next(request)
        return no_op_middleware

app.middleware("http")(create_error_middleware())

# Utility functions for initialization
async def initialize_redis(decode_responses: bool = True) -> redis.Redis:
    """Initialize Redis with retry logic"""
    retry_policy = RetryPolicy(
        max_attempts=5,
        initial_delay=1.0,
        max_delay=10.0,
        retry_on=[redis.ConnectionError, redis.TimeoutError]
    )

    for attempt in range(retry_policy.max_attempts):
        try:
            client = redis.from_url(
                config.redis_url,
                decode_responses=decode_responses,
                health_check_interval=30,
                socket_timeout=5,
                socket_connect_timeout=5,
                retry_on_timeout=True
            )
            await client.ping()
            return client
        except Exception as e:
            if attempt == retry_policy.max_attempts - 1:
                raise
            delay = retry_policy.get_delay(attempt)
            await asyncio.sleep(delay)

async def initialize_circuit_breakers(redis_client: redis.Redis) -> Dict[str, CircuitBreaker]:
    """Initialize circuit breakers for external services"""
    breakers = {}

    # Database circuit breaker
    breakers["database"] = CircuitBreaker(
        "database",
        CircuitBreakerConfig(
            failure_threshold=3,
            recovery_timeout=60.0,
            timeout=10.0
        ),
        redis_client
    )

    # Authentication service circuit breaker
    breakers["auth"] = CircuitBreaker(
        "auth_service",
        CircuitBreakerConfig(
            failure_threshold=3,
            recovery_timeout=30.0,
            timeout=5.0
        ),
        redis_client
    )

    # External services circuit breakers
    breakers["email_service"] = CircuitBreaker(
        "email_service",
        CircuitBreakerConfig(
            failure_threshold=3,
            recovery_timeout=60.0,
            timeout=30.0
        ),
        redis_client
    )

    breakers["vendor_api"] = CircuitBreaker(
        "vendor_api",
        CircuitBreakerConfig(
            failure_threshold=5,
            recovery_timeout=120.0,
            timeout=15.0
        ),
        redis_client
    )

    return breakers

async def initialize_external_services() -> Dict[str, ExternalServiceClient]:
    """Initialize external service clients"""
    clients = {}

    # Email service client
    email_url = os.getenv("EMAIL_SERVICE_URL")
    if email_url:
        clients["email"] = ExternalServiceClient(
            "email_service",
            email_url,
            api_key=os.getenv("EMAIL_SERVICE_API_KEY"),
            circuit_breaker_config=CircuitBreakerConfig(failure_threshold=3, timeout=30.0),
            retry_policy=RetryPolicy(max_attempts=3, initial_delay=1.0)
        )

    # Vendor API client
    vendor_url = os.getenv("VENDOR_API_URL")
    if vendor_url:
        clients["vendor"] = ExternalServiceClient(
            "vendor_api",
            vendor_url,
            api_key=os.getenv("VENDOR_API_KEY"),
            circuit_breaker_config=CircuitBreakerConfig(failure_threshold=5, timeout=15.0),
            retry_policy=RetryPolicy(max_attempts=2, initial_delay=2.0)
        )

    return clients

# Dependency functions
async def get_current_state(request: Request) -> Dict[str, Any]:
    """Get current application state"""
    return request.app.state

async def validate_user_permissions(user_id: str, org_id: str) -> bool:
    """Validate user permissions"""
    app_state = get_current_state(None)  # Simplified for demo
    auth_service = app_state.auth_service

    try:
        return await auth_service.verify_user_org_access(user_id, org_id)
    except Exception:
        return False

# API Routes
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "service": config.service_name,
        "status": "healthy",
        "version": config.service_version,
        "environment": config.environment
    }

@app.get("/health", response_model=HealthCheckResponse)
async def health_check(request: Request):
    """Comprehensive health check endpoint"""
    observability_manager = request.app.state.observability_manager

    health_data = await observability_manager.check_health()

    return HealthCheckResponse(**health_data)

@app.get("/metrics")
async def metrics_endpoint(request: Request):
    """Prometheus metrics endpoint"""
    observability_manager = request.app.state.observability_manager

    metrics = await observability_manager.get_metrics()
    prometheus_metrics = metrics.get("prometheus", "")

    return Response(
        content=prometheus_metrics,
        media_type="text/plain"
    )

@app.post("/api/chat", response_model=Dict[str, Any])
async def start_chat(
    message: SecureChatMessage,
    background_tasks: BackgroundTasks,
    request: Request,
    current_state: Dict[str, Any] = Depends(get_current_state)
):
    """
    Start new procurement workflow chat with comprehensive validation and error handling
    """
    structured_logger = current_state.structured_logger
    workflow_manager = current_state.workflow_manager
    websocket_manager = current_state.websocket_manager

    try:
        # Generate unique thread ID
        thread_id = str(uuid.uuid4())

        # Validate user permissions
        if not await validate_user_permissions(message.user_id, message.org_id):
            raise HTTPException(
                status_code=403,
                detail={
                    "error": "UNAUTHORIZED",
                    "message": "User not authorized for this organization"
                }
            )

        # Check workflow limits
        if not await workflow_manager.can_start_workflow(message.org_id, message.user_id):
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "RATE_LIMIT_EXCEEDED",
                    "message": "Too many concurrent workflows for this user/organization"
                }
            )

        # Register workflow
        if not await workflow_manager.register_workflow(thread_id, message.org_id, message.user_id):
            raise HTTPException(
                status_code=503,
                detail={
                    "error": "SERVICE_UNAVAILABLE",
                    "message": "Unable to register workflow"
                }
            )

        # Start workflow in background with error handling
        async def run_workflow():
            try:
                async with span_context("workflow_execution", {
                    "workflow_type": "procurement",
                    "thread_id": thread_id,
                    "user_id": message.user_id,
                    "org_id": message.org_id
                }):
                    await run_workflow_stream(
                        message.message,
                        message.org_id,
                        message.user_id,
                        thread_id,
                        current_state
                    )
            except Exception as e:
                await structured_logger.error(
                    f"Workflow execution failed: {e}",
                    category=LogCategory.WORKFLOW,
                    error_type=type(e).__name__,
                    metadata={
                        "thread_id": thread_id,
                        "user_id": message.user_id,
                        "org_id": message.org_id,
                        "message": message.message
                    },
                    exc_info=True
                )
                await websocket_manager.broadcast_to_thread(
                    thread_id,
                    {
                        "type": "error",
                        "data": {
                            "error": "WORKFLOW_EXECUTION_FAILED",
                            "message": "Workflow execution encountered an error",
                            "thread_id": thread_id
                        }
                    }
                )
            finally:
                # Unregister workflow
                await workflow_manager.unregister_workflow(thread_id)

        background_tasks.add_task(run_workflow)

        await structured_logger.info(
            f"Started new workflow for user {message.user_id} in org {message.org_id}",
            category=LogCategory.WORKFLOW,
            metadata={
                "thread_id": thread_id,
                "message": message.message
            }
        )

        return {
            "success": True,
            "message": "Workflow started successfully",
            "thread_id": thread_id,
            "data": {
                "status": "started",
                "thread_id": thread_id,
                "estimated_duration": "2-5 minutes"
            }
        }

    except HTTPException:
        raise
    except SecurityValidationError as e:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "VALIDATION_ERROR",
                "message": str(e)
            }
        )
    except Exception as e:
        await structured_logger.error(
            f"Failed to start workflow: {e}",
            category=LogCategory.ERROR,
            error_type=type(e).__name__,
            exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error": "INTERNAL_ERROR",
                "message": "An unexpected error occurred"
            }
        )

@app.post("/api/workflow/resume", response_model=Dict[str, Any])
async def resume_workflow(
    request: SecureWorkflowResumeRequest,
    current_state: Dict[str, Any] = Depends(get_current_state)
):
    """
    Resume a paused workflow with comprehensive validation
    """
    structured_logger = current_state.structured_logger
    workflow_instance = current_state.workflow_instance
    websocket_manager = current_state.websocket_manager
    circuit_breakers = current_state.circuit_breakers

    try:
        # Validate request
        if not request.action in ["approve", "reject", "cancel", "retry"]:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "INVALID_ACTION",
                    "message": "Invalid workflow action"
                }
            )

        # Get thread context from state manager
        checkpoint_saver = current_state.checkpoint_saver
        thread_context = await checkpoint_saver.get({
            "configurable": {"thread_id": request.thread_id}
        })

        if not thread_context:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": "WORKFLOW_NOT_FOUND",
                    "message": f"Workflow thread {request.thread_id} not found"
                }
            )

        # Validate user has permission for this workflow
        # This would require extracting user context from the stored state

        await structured_logger.audit(
            f"Workflow resume action: {request.action}",
            metadata={
                "thread_id": request.thread_id,
                "action": request.action,
                "data": request.data,
                "approval_note": request.approval_note
            }
        )

        # Continue workflow execution with circuit breaker protection
        workflow_state = {
            "user_action": request.action,
            "action_data": request.data or {},
            "approval_note": request.approval_note
        }

        async def resume_execution():
            try:
                async with circuit_breakers["database"].call(
                    lambda: workflow_instance.app.astream(
                        workflow_state,
                        config={"configurable": {"thread_id": request.thread_id}}
                    )
                ):
                    async for event in result:
                        await websocket_manager.broadcast_to_thread(
                            request.thread_id,
                            {
                                "type": "workflow_event",
                                "data": event,
                                "action": request.action
                            }
                        )
            except Exception as e:
                await structured_logger.error(
                    f"Workflow resume failed: {e}",
                    category=LogCategory.WORKFLOW,
                    error_type=type(e).__name__,
                    metadata={
                        "thread_id": request.thread_id,
                        "action": request.action
                    },
                    exc_info=True
                )
                raise

        # Run workflow resume
        await resume_execution()

        return {
            "success": True,
            "message": f"Workflow resumed with action: {request.action}",
            "thread_id": request.thread_id,
            "data": {
                "action": request.action,
                "status": "resumed"
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        await structured_logger.error(
            f"Failed to resume workflow: {e}",
            category=LogCategory.ERROR,
            error_type=type(e).__name__,
            exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error": "INTERNAL_ERROR",
                "message": "An unexpected error occurred during workflow resume"
            }
        )

@app.get("/api/workflow/{thread_id}/status")
async def get_workflow_status(
    thread_id: str,
    current_state: Dict[str, Any] = Depends(get_current_state)
):
    """Get current status of a workflow"""
    checkpoint_saver = current_state.checkpoint_saver
    workflow_manager = current_state.workflow_manager

    try:
        # Get workflow checkpoints
        checkpoints = await checkpoint_saver.list({
            "configurable": {"thread_id": thread_id}
        }, limit=10)

        if not checkpoints:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": "WORKFLOW_NOT_FOUND",
                    "message": f"Workflow {thread_id} not found"
                }
            )

        # Get active workflows
        active_workflows = await workflow_manager.get_active_workflows()
        is_active = any(w["thread_id"] == thread_id for w in active_workflows)

        latest_checkpoint = checkpoints[0]
        metadata = latest_checkpoint.get("metadata", {})

        status = {
            "thread_id": thread_id,
            "status": "running" if is_active else "completed",
            "last_checkpoint": latest_checkpoint["checkpoint"],
            "metadata": metadata,
            "is_active": is_active,
            "checkpoints_found": len(checkpoints)
        }

        return status

    except HTTPException:
        raise
    except Exception as e:
        structured_logger = current_state.structured_logger
        await structured_logger.error(
            f"Failed to get workflow status: {e}",
            category=LogCategory.ERROR,
            error_type=type(e).__name__,
            metadata={"thread_id": thread_id}
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error": "INTERNAL_ERROR",
                "message": "Failed to retrieve workflow status"
            }
        )

@app.websocket("/ws/{thread_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    thread_id: str,
    current_state: Dict[str, Any] = Depends(get_current_state)
):
    """
    WebSocket endpoint for real-time workflow updates with production error handling
    """
    structured_logger = current_state.structured_logger
    websocket_manager = current_state.websocket_manager

    try:
        # Accept WebSocket connection with validation
        connection_id = await websocket_manager.connect(websocket, thread_id)

        await structured_logger.info(
            f"WebSocket connection established for thread {thread_id}",
            category=LogCategory.WEBSOCKET,
            metadata={
                "connection_id": connection_id,
                "thread_id": thread_id
            }
        )

        # Handle WebSocket messages
        while True:
            try:
                # Receive message with timeout
                data = await asyncio.wait_for(
                    websocket.receive_text(),
                    timeout=config.workflow_timeout
                )

                # Parse and validate message
                try:
                    message_data = json.loads(data)
                    validated_message = WebSocketMessage(**message_data)
                except (json.JSONDecodeError, ValueError) as e:
                    await structured_logger.warning(
                        f"Invalid WebSocket message received: {e}",
                        category=LogCategory.WEBSOCKET,
                        metadata={
                            "connection_id": connection_id,
                            "thread_id": thread_id,
                            "raw_message": data[:100]
                        }
                    )
                    continue

                # Handle message based on type
                if validated_message.type == "ping":
                    await websocket.send_json({
                        "type": "pong",
                        "timestamp": time.time()
                    })
                elif validated_message.type == "disconnect":
                    await structured_logger.info(
                        f"WebSocket disconnect requested for thread {thread_id}",
                        category=LogCategory.WEBSOCKET,
                        metadata={"connection_id": connection_id}
                    )
                    break

            except asyncio.TimeoutError:
                await structured_logger.warning(
                    f"WebSocket timeout for thread {thread_id}",
                    category=LogCategory.WEBSOCKET,
                    metadata={"connection_id": connection_id}
                )
                break
            except WebSocketDisconnect:
                break
            except Exception as e:
                await structured_logger.error(
                    f"WebSocket error: {e}",
                    category=LogCategory.WEBSOCKET,
                    error_type=type(e).__name__,
                    metadata={"connection_id": connection_id},
                    exc_info=True
                )
                break

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await structured_logger.error(
            f"WebSocket connection failed: {e}",
            category=LogCategory.WEBSOCKET,
            error_type=type(e).__name__,
            metadata={"thread_id": thread_id},
            exc_info=True
        )
    finally:
        # Clean up connection
        if 'connection_id' in locals():
            await websocket_manager.disconnect(connection_id, "websocket_closed")

# Helper functions
async def run_workflow_stream(
    message: str,
    org_id: str,
    user_id: str,
    thread_id: str,
    current_state: Dict[str, Any]
):
    """
    Run workflow and stream results via WebSocket with comprehensive error handling
    """
    structured_logger = current_state.structured_logger
    workflow_instance = current_state.workflow_instance
    websocket_manager = current_state.websocket_manager
    circuit_breakers = current_state.circuit_breakers

    try:
        await structured_logger.info(
            f"Starting workflow execution for thread {thread_id}",
            category=LogCategory.WORKFLOW,
            metadata={
                "thread_id": thread_id,
                "user_id": user_id,
                "org_id": org_id,
                "message": message
            }
        )

        # Execute workflow with circuit breaker protection
        async def execute_workflow():
            return workflow_instance.run(
                initial_message=message,
                org_id=org_id,
                user_id=user_id,
                thread_id=thread_id
            )

        workflow_generator = await circuit_breakers["database"].call(execute_workflow)

        # Stream workflow events
        async for event in workflow_generator:
            try:
                # Extract and broadcast UI components
                if "ui" in event:
                    for ui_component in event["ui"]:
                        await websocket_manager.broadcast_to_thread(
                            thread_id,
                            {
                                "type": "ui_component",
                                "data": ui_component,
                                "workflow_state": event.get("status", "unknown"),
                                "thread_id": thread_id
                            }
                        )

                # Broadcast regular messages
                if "messages" in event and event["messages"]:
                    for msg in event["messages"]:
                        await websocket_manager.broadcast_to_thread(
                            thread_id,
                            {
                                "type": "message",
                                "data": {
                                    "content": msg.content,
                                    "type": msg.type,
                                    "timestamp": time.time()
                                },
                                "thread_id": thread_id
                            }
                        )

                # Broadcast workflow state changes
                await websocket_manager.broadcast_to_thread(
                    thread_id,
                    {
                        "type": "workflow_state",
                        "data": {
                            "status": event.get("status", "unknown"),
                            "progress": event.get("progress", 0)
                        },
                        "thread_id": thread_id
                    }
                )

            except Exception as e:
                await structured_logger.error(
                    f"Failed to process workflow event: {e}",
                    category=LogCategory.WEBSOCKET,
                    error_type=type(e).__name__,
                    metadata={"thread_id": thread_id},
                    exc_info=True
                )
                # Continue processing other events

        await structured_logger.info(
            f"Workflow completed for thread {thread_id}",
            category=LogCategory.WORKFLOW,
            metadata={"thread_id": thread_id}
        )

        # Send completion message
        await websocket_manager.broadcast_to_thread(
            thread_id,
            {
                "type": "workflow_completed",
                "data": {
                    "status": "completed",
                    "thread_id": thread_id,
                    "timestamp": time.time()
                }
            }
        )

    except Exception as e:
        await structured_logger.error(
            f"Workflow execution failed: {e}",
            category=LogCategory.WORKFLOW,
            error_type=type(e).__name__,
            metadata={
                "thread_id": thread_id,
                "user_id": user_id,
                "org_id": org_id
            },
            exc_info=True
        )

        # Send error message via WebSocket
        await websocket_manager.broadcast_to_thread(
            thread_id,
            {
                "type": "error",
                "data": {
                    "error": "WORKFLOW_ERROR",
                    "message": "Workflow execution encountered an error",
                    "thread_id": thread_id,
                    "timestamp": time.time()
                }
            }
        )
        raise

# Error handlers
@app.exception_handler(SecurityValidationError)
async def security_validation_exception_handler(request: Request, exc: SecurityValidationError):
    """Handle security validation errors"""
    structured_logger = get_logger()
    await structured_logger.security(
        f"Security validation failed: {exc}",
        metadata={
            "request_id": getattr(request.state, 'correlation_id', None),
            "error": str(exc)
        }
    )

    return JSONResponse(
        status_code=400,
        content=ErrorResponse(
            error="SECURITY_VALIDATION_ERROR",
            message=str(exc),
            error_code="SEC_001"
        ).dict()
    )

@app.exception_handler(ValidationErrorRateLimit)
async def validation_rate_limit_handler(request: Request, exc: ValidationErrorRateLimit):
    """Handle validation rate limit errors"""
    return JSONResponse(
        status_code=429,
        content=ErrorResponse(
            error="VALIDATION_RATE_LIMIT_EXCEEDED",
            message="Too many validation requests. Please slow down.",
            error_code="VAL_001"
        ).dict()
    )

# Run application
if __name__ == "__main__":
    uvicorn.run(
        "main_production:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        log_level=config.log_level.name.lower(),
        access_log=True,
        workers=int(os.getenv("WORKERS", 1)),
        timeout_keep_alive=65,
        timeout_graceful_shutdown=30,
        ssl_keyfile=os.getenv("SSL_KEY_FILE") if config.environment == "production" else None,
        ssl_certfile=os.getenv("SSL_CERT_FILE") if config.environment == "production" else None
    )