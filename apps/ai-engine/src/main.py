"""
FastAPI service for SupplyGraph AI Engine with LangGraph integration
"""
import os
import asyncio
import uuid
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
import redis.asyncio as redis
from dotenv import load_dotenv

from .workflows.procurement import ProcurementWorkflow
from .services.auth_service import AuthService
from .services.websocket_manager import WebSocketManager
from .middleware.auth_middleware import MultiTenantAuthMiddleware
from .api.routes import router as api_router

# Load environment variables
load_dotenv()


class ChatMessage(BaseModel):
    """Chat message model"""
    message: str = Field(..., description="User message content")
    org_id: str = Field(..., description="Organization ID")
    user_id: str = Field(..., description="User ID")


class WorkflowResumeRequest(BaseModel):
    """Request to resume a paused workflow"""
    thread_id: str = Field(..., description="LangGraph thread ID")
    action: str = Field(..., description="Action to take (approve/reject)")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional data")


class WorkflowResponse(BaseModel):
    """Response from workflow execution"""
    success: bool
    message: str
    thread_id: str
    data: Optional[Dict[str, Any]] = None
    ui_components: Optional[list] = None


# Global state
workflow_instance: Optional[ProcurementWorkflow] = None
websocket_manager = WebSocketManager()
auth_service = AuthService()
redis_client: Optional[redis.Redis] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    global workflow_instance, redis_client

    # Initialize on startup
    try:
        print("Starting SupplyGraph AI Engine...")

        # Initialize Redis connection
        redis_client = redis.from_url(
            os.getenv("REDIS_URL", "redis://localhost:6379"),
            decode_responses=True
        )
        await redis_client.ping()
        print("Redis connection established")

        # Initialize LangGraph workflow
        workflow_instance = ProcurementWorkflow(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            db_connection_string=os.getenv("DATABASE_URL")
        )
        print("LangGraph workflow initialized")

        # Initialize test router for development
        if os.getenv("NODE_ENV") == "development":
            from .test_endpoint import init_test_router
            test_router = init_test_router(workflow_instance, _run_workflow_stream, WorkflowResponse)
            app.include_router(test_router)
            print("Test router initialized for development")

        print("AI Engine ready!")

    except Exception as e:
        print(f"Failed to initialize AI Engine: {e}")
        raise

    yield

    # Cleanup on shutdown
    if redis_client:
        await redis_client.close()
    print("AI Engine shutdown complete")


# Initialize FastAPI app
app = FastAPI(
    title="SupplyGraph AI Engine",
    description="LangGraph-powered procurement automation service",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # TanStack Start dev
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "WebSocket"],
    allow_headers=["*"],
)

# Add multi-tenant authentication middleware
app.add_middleware(MultiTenantAuthMiddleware)

# Include REST API routes
app.include_router(api_router)

# Initialize test router after workflow is ready (in lifespan)
# We'll include it dynamically to avoid circular imports


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "SupplyGraph AI Engine",
        "status": "healthy",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    health_status = {
        "service": "healthy",
        "redis": "unhealthy",
        "workflow": "unhealthy"
    }

    try:
        if redis_client:
            await redis_client.ping()
            health_status["redis"] = "healthy"
    except:
        pass

    try:
        if workflow_instance:
            health_status["workflow"] = "healthy"
    except:
        pass

    overall_status = "healthy" if all(
        status == "healthy" for status in health_status.values()
    ) else "unhealthy"

    return {
        "status": overall_status,
        "details": health_status
    }


@app.post("/api/chat", response_model=WorkflowResponse)
async def chat_with_ai(
    request: Request,
    message: ChatMessage,
    background_tasks: BackgroundTasks
):
    """Start new procurement workflow chat"""
    if not workflow_instance:
        raise HTTPException(status_code=503, detail="AI workflow not available")

    try:
        # Validate tenant access from middleware
        if not hasattr(request.state, "org_id"):
            raise HTTPException(
                status_code=401,
                detail="Authentication required"
            )

        # Ensure user can only access their own org
        if request.state.org_id != message.org_id:
            raise HTTPException(
                status_code=403,
                detail="Access denied: organization mismatch"
            )

        # Generate unique thread ID
        thread_id = str(uuid.uuid4())

        # Run workflow in background and stream results
        background_tasks.add_task(
            _run_workflow_stream,
            message.message,
            message.org_id,
            message.user_id,
            thread_id
        )

        return WorkflowResponse(
            success=True,
            message="Workflow started",
            thread_id=thread_id,
            data={"status": "started", "thread_id": thread_id}
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start workflow: {str(e)}"
        )


@app.post("/api/workflow/resume", response_model=WorkflowResponse)
async def resume_workflow(request: WorkflowResumeRequest):
    """Resume a paused workflow (e.g., after user approval)"""
    if not workflow_instance:
        raise HTTPException(status_code=503, detail="AI workflow not available")

    try:
        from langgraph.types import Command

        # Create resume command with user action
        resume_command = Command(resume={
            "action": request.action,
            "data": request.data or {}
        })

        # Continue workflow execution with command
        async for event in workflow_instance.app.astream(
            resume_command,
            config={"configurable": {"thread_id": request.thread_id}}
        ):
            # Broadcast workflow events via WebSocket
            await websocket_manager.broadcast_to_thread(
                request.thread_id,
                event
            )

        return WorkflowResponse(
            success=True,
            message="Workflow resumed",
            thread_id=request.thread_id,
            data={"action": request.action, "status": "resumed"}
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to resume workflow: {str(e)}"
        )


@app.get("/api/workflow/{thread_id}/status")
async def get_workflow_status(thread_id: str):
    """Get current status of a workflow"""
    try:
        # TODO: Implement proper status retrieval from LangGraph checkpointer
        status = {
            "thread_id": thread_id,
            "status": "running",  # This should come from actual workflow state
            "progress": 50  # This should be calculated from workflow steps
        }

        return status

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Workflow {thread_id} not found: {str(e)}"
        )


@app.websocket("/ws/{thread_id}")
async def websocket_endpoint(websocket: WebSocket, thread_id: str):
    """WebSocket endpoint for real-time workflow updates"""
    await websocket_manager.connect(websocket, thread_id)
    print(f"WebSocket connected for thread: {thread_id}")

    try:
        while True:
            # Keep connection alive and handle any incoming messages
            data = await websocket.receive_text()
            # Handle any client messages if needed
            print(f"Received WebSocket message: {data}")

    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, thread_id)
        print(f"WebSocket disconnected for thread: {thread_id}")


async def _run_workflow_stream(message: str, org_id: str, user_id: str, thread_id: str):
    """Run workflow and stream results via WebSocket"""
    try:
        print(f"Starting workflow for thread: {thread_id}")

        # Check for interrupts in the workflow
        async for event in workflow_instance.run(
            initial_message=message,
            org_id=org_id,
            user_id=user_id,
            thread_id=thread_id
        ):
            # Handle LangGraph events
            for node_name, node_data in event.items():
                # Check for UI messages in node data
                if "ui" in node_data and node_data["ui"]:
                    for ui_component in node_data["ui"]:
                        await websocket_manager.broadcast_to_thread(
                            thread_id,
                            {
                                "type": "ui_component",
                                "data": ui_component,
                                "node": node_name,
                                "workflow_state": node_data.get("status", "unknown")
                            }
                        )

                # Broadcast regular messages
                if "messages" in node_data and node_data["messages"]:
                    for msg in node_data["messages"]:
                        await websocket_manager.broadcast_to_thread(
                            thread_id,
                            {
                                "type": "message",
                                "data": {
                                    "content": msg.content,
                                    "type": msg.type,
                                    "id": getattr(msg, 'id', str(uuid.uuid4())),
                                    "timestamp": str(uuid.uuid4())
                                }
                            }
                        )

                # Check for interrupts
                if "__interrupt__" in node_data:
                    await websocket_manager.broadcast_to_thread(
                        thread_id,
                        {
                            "type": "interrupt",
                            "data": {
                                "interrupt": node_data["__interrupt__"],
                                "node": node_name,
                                "message": "Workflow is waiting for user input"
                            }
                        }
                    )

        print(f"Workflow completed for thread: {thread_id}")

    except Exception as e:
        print(f"Workflow error for thread {thread_id}: {e}")
        import traceback
        traceback.print_exc()
        await websocket_manager.broadcast_to_thread(
            thread_id,
            {
                "type": "error",
                "data": {"error": str(e), "timestamp": str(uuid.uuid4())}
            }
        )


async def _get_thread_context(thread_id: str) -> Optional[Dict[str, Any]]:
    """Get thread context from Redis or database"""
    if not redis_client:
        return None

    try:
        context = await redis_client.hgetall(f"thread:{thread_id}")
        return context if context else None
    except:
        return None


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )