"""Tests for Procurement Workflow state machine."""

import pytest
from unittest.mock import AsyncMock, patch
from datetime import datetime
from src.workflows.procurement import ProcurementWorkflow
from src.workflows.base import WorkflowState


@pytest.fixture
def workflow():
    """Create a procurement workflow instance."""
    return ProcurementWorkflow()


@pytest.fixture
def initial_state():
    """Create initial workflow state."""
    return {
        "workflow_id": "test-workflow-123",
        "org_id": "test-org-456",
        "entity_id": "test-request-789",
        "entity_type": "procurement_request",
        "current_step": "START",
        "started_at": datetime.now(),
        "updated_at": datetime.now(),
        "retry_count": 0,
        "error_message": None,
        "data": {
            "title": "Test Office Supplies",
            "items": [{"name": "Chairs", "quantity": 10}],
            "orgId": "test-org-456",
            "createdBy": "test-user-001"
        },
        "messages": []
    }


def test_workflow_initialization(workflow):
    """Test workflow graph structure."""
    graph = workflow.compile()
    assert graph is not None
    
    # Verify graph has expected nodes
    expected_nodes = [
        "validate_request", "select_vendors", "send_rfqs", 
        "monitor_responses", "process_quotes", "await_approval",
        "process_payment", "complete_request", "handle_error"
    ]
    
    # Check that all expected nodes are present
    for node in expected_nodes:
        assert node in str(graph), f"Node {node} not found in workflow graph"


@pytest.mark.asyncio
async def test_state_transitions(workflow, initial_state):
    """Test workflow state transitions."""
    
    # Test CREATED → QUOTES_REQUESTED transition
    state = initial_state.copy()
    
    # Mock validation
    with patch.object(workflow, 'validate_request', new_callable=AsyncMock) as mock_validate:
        mock_validate.return_value = state
        state["data"]["validation_status"] = "valid"
        
        next_node = workflow.route_after_validation(state)
        assert next_node == "valid"
    
    # Test QUOTES_REQUESTED → QUOTES_RECEIVED transition
    state["data"]["rfq_sent_count"] = 3
    next_node = workflow.route_after_rfq_send(state)
    assert next_node == "sent"


@pytest.mark.asyncio
async def test_error_handling(workflow, initial_state):
    """Test workflow error handling and retry logic."""
    state = initial_state.copy()
    
    # Simulate error
    state = await workflow.handle_error(state, Exception("Test error"), "test_step")
    assert state["retry_count"] == 1
    assert state["error_message"] == "Test error"
    
    # Test retry logic
    assert workflow.should_retry(state) == True
    state["retry_count"] = 3
    assert workflow.should_retry(state) == False


@pytest.mark.asyncio
async def test_validation_step(workflow, initial_state):
    """Test request validation step."""
    state = initial_state.copy()
    
    # Test with valid data
    with patch('src.database.with_tenant') as mock_db:
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        result = await workflow.validate_request(state)
        
        # Verify validation passed
        assert result["data"]["validation_status"] == "valid"
        assert result["current_step"] == "validate_request"
        
        # Verify database update was called
        mock_db_context.procurementrequest.update.assert_called_once()


@pytest.mark.asyncio
async def test_vendor_selection(workflow, initial_state):
    """Test vendor selection step."""
    state = initial_state.copy()
    state["data"]["validation_status"] = "valid"
    
    # Mock database and vendor service
    with patch('src.database.with_tenant') as mock_db, \
         patch('src.services.vendor_service.VendorService') as mock_vendor_service:
        
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        # Mock vendors
        mock_vendor = AsyncMock()
        mock_vendor.id = "vendor-123"
        mock_vendor.name = "Test Vendor"
        mock_vendor.email = "vendor@example.com"
        
        mock_db_context.vendor.find_many.return_value = [mock_vendor]
        
        result = await workflow.select_vendors(state)
        
        # Verify vendors were selected
        assert "selected_vendors" in result["data"]
        assert len(result["data"]["selected_vendors"]) == 1
        assert result["data"]["selected_vendors"][0]["name"] == "Test Vendor"


@pytest.mark.asyncio
async def test_rfq_sending(workflow, initial_state):
    """Test RFQ sending step."""
    state = initial_state.copy()
    state["data"]["selected_vendors"] = [
        {"id": "vendor-123", "name": "Test Vendor", "email": "vendor@example.com"}
    ]
    
    # Mock email service and database
    with patch('src.services.email_service.EmailService') as mock_email_service, \
         patch('src.database.with_tenant') as mock_db:
        
        mock_email_instance = AsyncMock()
        mock_email_service.return_value = mock_email_instance
        
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        result = await workflow.send_rfqs(state)
        
        # Verify RFQ was sent
        assert result["data"]["rfq_sent_count"] == 1
        assert result["data"]["rfq_sent_at"] is not None
        
        # Verify email service was called
        mock_email_instance.send_rfq_email.assert_called_once()
        
        # Verify database update
        mock_db_context.procurementrequest.update.assert_called_once()


@pytest.mark.asyncio
async def test_quote_monitoring(workflow, initial_state):
    """Test quote monitoring step."""
    state = initial_state.copy()
    state["data"]["rfq_sent_count"] = 2
    state["data"]["rfq_sent_at"] = datetime.now().isoformat()
    
    # Mock database
    with patch('src.database.with_tenant') as mock_db:
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        # Mock quotes
        mock_quote = AsyncMock()
        mock_quote.id = "quote-123"
        mock_db_context.quote.find_many.return_value = [mock_quote]
        
        result = await workflow.monitor_responses(state)
        
        # Verify quote monitoring
        assert result["data"]["quotes_received_count"] == 1
        assert result["data"]["monitoring_status"] == "quotes_received"


@pytest.mark.asyncio
async def test_quote_processing(workflow, initial_state):
    """Test quote processing step."""
    state = initial_state.copy()
    
    # Mock database
    with patch('src.database.with_tenant') as mock_db:
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        # Mock quotes
        mock_quote = AsyncMock()
        mock_quote.id = "quote-123"
        mock_quote.vendorId = "vendor-123"
        mock_quote.totalAmount = 1000.00
        mock_quote.currency = "USD"
        mock_quote.deliveryDays = 5
        mock_quote.items = [{"name": "Chairs", "quantity": 10}]
        
        mock_vendor = AsyncMock()
        mock_vendor.name = "Test Vendor"
        mock_quote.vendor = mock_vendor
        
        mock_db_context.quote.find_many.return_value = [mock_quote]
        
        result = await workflow.process_quotes(state)
        
        # Verify quotes were processed
        assert "processed_quotes" in result["data"]
        assert len(result["data"]["processed_quotes"]) == 1
        assert result["data"]["processed_quotes"][0]["total_amount"] == 1000.00


@pytest.mark.asyncio
async def test_approval_workflow(workflow, initial_state):
    """Test approval workflow step."""
    state = initial_state.copy()
    
    # Mock database
    with patch('src.database.with_tenant') as mock_db:
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        # Mock request with approved quote
        mock_request = AsyncMock()
        mock_request.approvedQuoteId = "quote-123"
        mock_db_context.procurementrequest.find_unique.return_value = mock_request
        
        result = await workflow.await_approval(state)
        
        # Verify approval status
        assert result["data"]["approval_status"] == "approved"
        assert result["data"]["approved_quote_id"] == "quote-123"


@pytest.mark.asyncio
async def test_payment_processing(workflow, initial_state):
    """Test payment processing step."""
    state = initial_state.copy()
    state["data"]["approved_quote_id"] = "quote-123"
    
    # Mock database
    with patch('src.database.with_tenant') as mock_db:
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        # Mock quote
        mock_quote = AsyncMock()
        mock_quote.totalAmount = 1000.00
        mock_quote.currency = "USD"
        mock_quote.vendorId = "vendor-123"
        
        mock_db_context.quote.find_unique.return_value = mock_quote
        
        # Mock payment creation
        mock_payment = AsyncMock()
        mock_payment.id = "payment-123"
        mock_db_context.payment.create.return_value = mock_payment
        
        result = await workflow.process_payment(state)
        
        # Verify payment processing
        assert result["data"]["payment_status"] == "paid"
        assert result["data"]["payment_id"] == "payment-123"
        
        # Verify database updates
        mock_db_context.payment.update.assert_called_once()
        mock_db_context.procurementrequest.update.assert_called()


@pytest.mark.asyncio
async def test_workflow_completion(workflow, initial_state):
    """Test workflow completion step."""
    state = initial_state.copy()
    
    # Mock database
    with patch('src.database.with_tenant') as mock_db:
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        result = await workflow.complete_request(state)
        
        # Verify completion
        assert result["data"]["completion_status"] == "completed"
        
        # Verify database update
        mock_db_context.procurementrequest.update.assert_called_once()


@pytest.mark.asyncio
async def test_error_handling_in_workflow(workflow, initial_state):
    """Test error handling in workflow."""
    state = initial_state.copy()
    
    # Mock database
    with patch('src.database.with_tenant') as mock_db:
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        result = await workflow.handle_workflow_error(state)
        
        # Verify error handling
        assert result["current_step"] == "handle_error"
        
        # Verify database update for error state
        mock_db_context.procurementrequest.update.assert_called_once()