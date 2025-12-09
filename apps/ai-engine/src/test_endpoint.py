"""
Test endpoint to bypass authentication for testing workflows
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any
import uuid
from pydantic import BaseModel

# Import needed functions - we'll use local imports to avoid circular dependencies
test_router = APIRouter(prefix="/api/test", tags=["test"])

# Global variable to be set from main.py
workflow_instance = None
_run_workflow_stream = None
WorkflowResponse = None


class TestChatMessage(BaseModel):
    """Test chat message model without auth"""
    message: str
    org_id: str = "test-org-123"
    user_id: str = "test-user-456"


@test_router.post("/chat")
async def test_chat_with_ai(
    message: TestChatMessage,
    background_tasks: BackgroundTasks
):
    """Test endpoint that bypasses authentication"""
    global workflow_instance, _run_workflow_stream, WorkflowResponse

    if not workflow_instance:
        raise HTTPException(status_code=503, detail="AI workflow not available")

    try:
        # Generate unique thread ID
        thread_id = str(uuid.uuid4())

        print(f"TEST: Starting workflow for thread: {thread_id}")
        print(f"TEST: Message: {message.message}")
        print(f"TEST: Org: {message.org_id}, User: {message.user_id}")

        # Run workflow in background and stream results
        background_tasks.add_task(
            _run_workflow_stream,
            message.message,
            message.org_id,
            message.user_id,
            thread_id
        )

        return {
            "success": True,
            "message": "Test workflow started (auth bypassed)",
            "thread_id": thread_id,
            "data": {"status": "started", "thread_id": thread_id}
        }

    except Exception as e:
        print(f"TEST: Workflow error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start test workflow: {str(e)}"
        )


@test_router.get("/status")
async def test_status():
    """Test endpoint status"""
    return {
        "status": "test_mode_active",
        "workflow_available": workflow_instance is not None
    }


def init_test_router(wf_instance, run_workflow_func, workflow_response_class):
    """Initialize the test router with required dependencies"""
    global workflow_instance, _run_workflow_stream, WorkflowResponse
    workflow_instance = wf_instance
    _run_workflow_stream = run_workflow_func
    WorkflowResponse = workflow_response_class

    return test_router