"""Tests for email processing workflow."""

import pytest
from unittest.mock import AsyncMock, patch
from src.workflows.email_processing import EmailProcessingWorkflow


@pytest.fixture
def email_workflow():
    """Create an email processing workflow instance."""
    return EmailProcessingWorkflow()


def test_email_workflow_initialization(email_workflow):
    """Test email workflow initialization."""
    graph = email_workflow.compile()
    assert graph is not None


@pytest.mark.asyncio
async def test_email_reception_step(email_workflow):
    """Test email reception step."""
    initial_state = email_workflow.create_initial_state(
        workflow_id="email-workflow-123",
        org_id="test-org-456",
        entity_id="email-789",
        entity_type="email_message",
        data={
            "email_id": "msg123",
            "thread_id": "thread456",
            "subject": "Quote Response",
            "from": "vendor@example.com"
        }
    )
    
    # Mock Gmail service
    with patch('src.services.gmail_service.GmailService') as mock_gmail:
        mock_gmail_instance = AsyncMock()
        mock_gmail.return_value = mock_gmail_instance
        
        # Mock email content
        mock_gmail_instance.get_email_content.return_value = {
            'id': 'msg123',
            'subject': 'Quote Response',
            'from': 'vendor@example.com',
            'snippet': 'Quote for office supplies - $1000 total',
            'body': 'Items: 10 chairs @ $100 each = $1000 total'
        }
        
        result = await email_workflow.receive_email(initial_state)
        
        # Verify email was processed
        assert result["data"]["email_content"] is not None
        assert result["data"]["email_content"]["subject"] == "Quote Response"


@pytest.mark.asyncio
async def test_quote_extraction_step(email_workflow):
    """Test quote extraction from email."""
    state = email_workflow.create_initial_state(
        workflow_id="email-workflow-123",
        org_id="test-org-456",
        entity_id="email-789",
        entity_type="email_message",
        data={
            "email_content": {
                'subject': 'Quote for Office Supplies',
                'from': 'vendor@example.com',
                'body': '''Items:
- Office Chairs: 10 units @ $150.00 each = $1,500.00
- Desks: 5 units @ $300.00 each = $1,500.00

Total: $3,000.00
Delivery: 5-7 business days'''
            }
        }
    )
    
    result = await email_workflow.extract_quote_data(state)
    
    # Verify quote extraction
    assert "quote_data" in result["data"]
    assert result["data"]["quote_data"]["vendor_email"] == "vendor@example.com"
    assert result["data"]["quote_data"]["total_amount"] == 3000.00
    assert len(result["data"]["quote_data"]["items"]) == 2


@pytest.mark.asyncio
async def test_quote_validation_step(email_workflow):
    """Test quote validation step."""
    state = email_workflow.create_initial_state(
        workflow_id="email-workflow-123",
        org_id="test-org-456",
        entity_id="email-789",
        entity_type="email_message",
        data={
            "quote_data": {
                "vendor_email": "vendor@example.com",
                "total_amount": 1000.00,
                "items": [{"name": "Chairs", "quantity": 10}],
                "currency": "USD"
            }
        }
    )
    
    result = await email_workflow.validate_quote_data(state)
    
    # Verify validation
    assert result["data"]["validation_status"] == "valid"
    assert result["data"]["is_valid_quote"] == True


@pytest.mark.asyncio
async def test_database_persistence_step(email_workflow):
    """Test database persistence of quote data."""
    state = email_workflow.create_initial_state(
        workflow_id="email-workflow-123",
        org_id="test-org-456",
        entity_id="email-789",
        entity_type="email_message",
        data={
            "quote_data": {
                "vendor_email": "vendor@example.com",
                "total_amount": 1000.00,
                "items": [{"name": "Chairs", "quantity": 10}],
                "currency": "USD",
                "request_id": "request-123"
            },
            "validation_status": "valid"
        }
    )
    
    # Mock database
    with patch('src.database.with_tenant') as mock_db:
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        # Mock vendor
        mock_vendor = AsyncMock()
        mock_vendor.id = "vendor-123"
        mock_db_context.vendor.find_first.return_value = mock_vendor
        
        # Mock quote creation
        mock_quote = AsyncMock()
        mock_quote.id = "quote-456"
        mock_db_context.quote.create.return_value = mock_quote
        
        result = await email_workflow.persist_quote_data(state)
        
        # Verify database operations
        assert result["data"]["quote_id"] == "quote-456"
        mock_db_context.vendor.find_first.assert_called_once()
        mock_db_context.quote.create.assert_called_once()


@pytest.mark.asyncio
async def test_error_handling_in_email_workflow(email_workflow):
    """Test error handling in email workflow."""
    state = email_workflow.create_initial_state(
        workflow_id="email-workflow-123",
        org_id="test-org-456",
        entity_id="email-789",
        entity_type="email_message",
        data={"email_id": "invalid-email"}
    )
    
    # Mock Gmail service to raise error
    with patch('src.services.gmail_service.GmailService') as mock_gmail:
        mock_gmail_instance = AsyncMock()
        mock_gmail.return_value = mock_gmail_instance
        mock_gmail_instance.get_email_content.side_effect = Exception("Email not found")
        
        result = await email_workflow.receive_email(state)
        
        # Verify error handling
        assert result["error_message"] == "Email not found"
        assert result["retry_count"] == 1


@pytest.mark.asyncio
async def test_routing_in_email_workflow(email_workflow):
    """Test routing logic in email workflow."""
    
    # Test successful email reception routing
    state = {
        "data": {
            "email_received": True,
            "email_content": {"subject": "Test"}
        }
    }
    next_node = email_workflow.route_after_reception(state)
    assert next_node == "extract_quote"
    
    # Test failed email reception routing
    state["data"]["email_received"] = False
    state["retry_count"] = 1
    next_node = email_workflow.route_after_reception(state)
    assert next_node == "retry"
    
    # Test validation routing
    state = {
        "data": {
            "validation_status": "valid",
            "is_valid_quote": True
        }
    }
    next_node = email_workflow.route_after_validation(state)
    assert next_node == "persist_data"
    
    state["data"]["validation_status"] = "invalid"
    next_node = email_workflow.route_after_validation(state)
    assert next_node == "handle_error"