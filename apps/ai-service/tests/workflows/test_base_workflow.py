"""Tests for base workflow functionality."""

import pytest
from unittest.mock import AsyncMock
from datetime import datetime
from src.workflows.base import BaseWorkflow, WorkflowState, ConditionalRouter


class TestBaseWorkflow(BaseWorkflow):
    """Test implementation of BaseWorkflow."""
    
    def _setup_graph(self) -> None:
        """Minimal graph setup for testing."""
        self.graph_builder.add_node("test_node", lambda state: state)
        self.graph_builder.add_edge("__start__", "test_node")
        self.graph_builder.add_edge("test_node", "__end__")


@pytest.fixture
def base_workflow():
    """Create a base workflow instance."""
    return TestBaseWorkflow()


@pytest.fixture
def test_state():
    """Create a test workflow state."""
    return {
        "workflow_id": "test-123",
        "org_id": "org-456",
        "entity_id": "entity-789",
        "entity_type": "test_entity",
        "current_step": "START",
        "started_at": datetime.now(),
        "updated_at": datetime.now(),
        "retry_count": 0,
        "error_message": None,
        "data": {"test_field": "test_value"},
        "messages": []
    }


def test_workflow_compilation(base_workflow):
    """Test workflow compilation."""
    graph = base_workflow.compile()
    assert graph is not None


def test_create_initial_state(base_workflow):
    """Test initial state creation."""
    state = base_workflow.create_initial_state(
        workflow_id="test-123",
        org_id="org-456",
        entity_id="entity-789",
        entity_type="test_entity",
        data={"test_field": "test_value"}
    )
    
    assert state["workflow_id"] == "test-123"
    assert state["org_id"] == "org-456"
    assert state["entity_id"] == "entity-789"
    assert state["entity_type"] == "test_entity"
    assert state["current_step"] == "START"
    assert state["retry_count"] == 0
    assert state["error_message"] is None
    assert state["data"]["test_field"] == "test_value"
    assert len(state["messages"]) == 1


@pytest.mark.asyncio
async def test_log_step(base_workflow, test_state):
    """Test step logging functionality."""
    result = await base_workflow.log_step(test_state, "test_step", "Test message")
    
    assert result["current_step"] == "test_step"
    assert result["updated_at"] >= test_state["updated_at"]
    assert len(result["messages"]) == 1
    assert result["messages"][0]["role"] == "system"
    assert "test_step" in result["messages"][0]["content"]
    assert "Test message" in result["messages"][0]["content"]


@pytest.mark.asyncio
async def test_error_handling(base_workflow, test_state):
    """Test error handling functionality."""
    error = Exception("Test error message")
    result = await base_workflow.handle_error(test_state, error, "test_step")
    
    assert result["retry_count"] == 1
    assert result["error_message"] == "Test error message"
    assert len(result["messages"]) == 1
    assert result["messages"][0]["role"] == "system"
    assert "ERROR" in result["messages"][0]["content"]


def test_retry_logic(base_workflow, test_state):
    """Test retry logic."""
    # Test initial retry
    assert base_workflow.should_retry(test_state) == True
    
    # Test after 2 retries
    test_state["retry_count"] = 2
    assert base_workflow.should_retry(test_state) == True
    
    # Test after max retries
    test_state["retry_count"] = 3
    assert base_workflow.should_retry(test_state) == False


def test_conditional_router():
    """Test conditional router functionality."""
    
    # Test route_by_status
    state = {
        "data": {"status": "SUCCESS"}
    }
    assert ConditionalRouter.route_by_status(state) == "success"
    
    state["data"]["status"] = "FAILURE"
    assert ConditionalRouter.route_by_status(state) == "failure"
    
    # Test route_by_condition
    state = {"data": {"value": 10}}
    condition_func = lambda s: s["data"]["value"] > 5
    assert ConditionalRouter.route_by_condition(state, condition_func) == "success"
    
    # Test route_with_retry
    state = {"retry_count": 1, "error_message": "Test error"}
    assert ConditionalRouter.route_with_retry(state) == "retry"
    
    state["retry_count"] = 3
    assert ConditionalRouter.route_with_retry(state) == "failed"
    
    state["error_message"] = None
    assert ConditionalRouter.route_with_retry(state) == "success"