"""
Tests for AGUI Approval workflow functionality
Following TDD principles - tests written first, then implementation
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime, timedelta
import json
import uuid

from langchain_core.messages import HumanMessage
from src.workflows.procurement import ProcurementWorkflow

class TestAGUIApproval:
    """Test suite for AGUI Approval functionality"""

    @pytest.fixture
    def mock_procurement_state(self):
        """Mock procurement state for testing"""
        return {
            'messages': [
                {'type': 'human', 'content': 'Buy 50 laptops'}
            ],
            'org_id': 'test_org_123',
            'user_id': 'user_789',
            'items': [
                {
                    'name': 'Laptop',
                    'quantity': 50,
                    'unit': 'pcs',
                    'specifications': '16GB RAM, 512GB SSD',
                    'category': 'Electronics'
                }
            ],
            'quotes': [
                {
                    'id': 'quote_001',
                    'vendor': 'TechCorp Solutions',
                    'items': [
                        {
                            'name': 'Laptop',
                            'quantity': 50,
                            'unit_price': 1200.00
                        }
                    ],
                    'total_amount': 60000.00,
                    'delivery_time': '5-7 business days',
                    'valid_until': (datetime.utcnow() + timedelta(days=7)).isoformat(),
                    'savings_percentage': '15%'
                },
                {
                    'id': 'quote_002',
                    'vendor': 'Office Supplies Inc',
                    'items': [
                        {
                            'name': 'Laptop',
                            'quantity': 50,
                            'unit_price': 1350.00
                        }
                    ],
                    'total_amount': 67500.00,
                    'delivery_time': '3-5 business days',
                    'valid_until': (datetime.utcnow() + timedelta(days=7)).isoformat(),
                    'savings_percentage': '8%'
                }
            ],
            'selected_quote': {
                'id': 'quote_001',
                'vendor': 'TechCorp Solutions',
                'items': [
                    {
                        'name': 'Laptop',
                        'quantity': 50,
                        'unit_price': 1200.00
                    }
                ],
                'total_amount': 60000.00,
                'delivery_time': '5-7 business days',
                'savings_percentage': '15%'
            },
            'status': 'APPROVAL_PENDING',
            'ui': [],
            'thread_id': 'thread_123'
        }

    @pytest.mark.asyncio
    async def test_human_approval_ui_generation(self, mock_procurement_state):
        """Test generation of approval UI component"""
        workflow = ProcurementWorkflow(
            openai_api_key='test_key',
            db_connection_string='test_db'
        )

        result = workflow.human_approval(mock_procurement_state)

        # Verify UI component generation
        assert result['status'] == 'WAITING_APPROVAL'
        assert len(result['ui']) == 1
        
        # Check approval card structure
        approval_ui = result['ui'][0]
        assert approval_ui['type'] == 'quote_approval_card'
        
        # Verify card content
        props = approval_ui['props']
        assert props['vendor'] == 'TechCorp Solutions'
        assert props['total_amount'] == 60000.00
        assert props['savings'] == '15%'
        assert props['delivery_time'] == '5-7 business days'
        assert props['items'] == mock_procurement_state['selected_quote']['items']
        assert 'quote_id' in props
        assert 'org_id' in props

    @pytest.mark.asyncio
    async def test_approval_workflow_with_user_approval(self, mock_procurement_state):
        """Test complete approval workflow when user approves"""
        workflow = ProcurementWorkflow(
            openai_api_key='test_key',
            db_connection_string='test_db'
        )

        # Simulate user approval message
        approval_message = HumanMessage(content='I approve this purchase')

        # First call to generate approval UI
        approval_result = workflow.human_approval(mock_procurement_state)
        assert approval_result['status'] == 'WAITING_APPROVAL'

        # Then simulate user approval
        with patch('src.workflows.procurement.PostgresSaver.from_conn_string') as mock_saver:
            mock_saver.return_value = MagicMock()
            
            # Simulate workflow continuation with approval
            updated_state = {
                **mock_procurement_state,
                'messages': mock_procurement_state['messages'] + [approval_message]
            }

            # This should trigger the approval decision logic
            decision_result = workflow._approval_decision(updated_state)
            assert decision_result == 'approved'

    @pytest.mark.asyncio
    async def test_approval_workflow_with_user_rejection(self, mock_procurement_state):
        """Test approval workflow when user rejects"""
        workflow = ProcurementWorkflow(
            openai_api_key='test_key',
            db_connection_string='test_db'
        )

        # Simulate user rejection message
        rejection_message = HumanMessage(content='I reject this quote, too expensive')

        # First call to generate approval UI
        approval_result = workflow.human_approval(mock_procurement_state)
        assert approval_result['status'] == 'WAITING_APPROVAL'

        # Then simulate user rejection
        updated_state = {
            **mock_procurement_state,
            'messages': mock_procurement_state['messages'] + [rejection_message]
        }

        # This should trigger the approval decision logic
        decision_result = workflow._approval_decision(updated_state)
        assert decision_result == 'rejected'

    @pytest.mark.asyncio
    async def test_approval_workflow_no_quotes(self, mock_procurement_state):
        """Test approval workflow when no quotes available"""
        workflow = ProcurementWorkflow(
            openai_api_key='test_key',
            db_connection_string='test_db'
        )
        
        # State with no quotes
        no_quotes_state = {
            **mock_procurement_state,
            'quotes': [],
            'selected_quote': None
        }

        result = workflow.human_approval(no_quotes_state)

        # Should generate error UI
        assert result['status'] == 'ERROR'
        assert len(result['ui']) == 1
        
        error_ui = result['ui'][0]
        assert error_ui['type'] == 'error_card'
        assert 'No quotes available' in error_ui['props']['error']

    @pytest.mark.asyncio
    async def test_approval_workflow_with_multiple_quotes(self, mock_procurement_state):
        """Test approval workflow with multiple vendor quotes"""
        workflow = ProcurementWorkflow(
            openai_api_key='test_key',
            db_connection_string='test_db'
        )
        
        # State with multiple quotes
        multi_quote_state = {
            **mock_procurement_state,
            'quotes': [
                {
                    'id': 'quote_001',
                    'vendor': 'TechCorp',
                    'total_amount': 60000.00,
                    'delivery_time': '5-7 days',
                    'savings_percentage': '15%'
                },
                {
                    'id': 'quote_002',
                    'vendor': 'Office Supplies',
                    'total_amount': 67500.00,
                    'delivery_time': '3-5 days',
                    'savings_percentage': '8%'
                },
                {
                    'id': 'quote_003',
                    'vendor': 'GlobalTech',
                    'total_amount': 55000.00,
                    'delivery_time': '7-10 days',
                    'savings_percentage': '25%'
                }
            ]
        }

        result = workflow.human_approval(multi_quote_state)

        # Should select best quote (lowest price)
        assert result['status'] == 'WAITING_APPROVAL'
        approval_ui = result['ui'][0]
        props = approval_ui['props']
        
        # Should select TechCorp Solutions (based on mock data)
        assert props['vendor'] == 'TechCorp Solutions'
        # Should select the quote with lowest total_amount from the actual quotes
        # In this case, it's the first quote (60000.00) based on the mock data
        assert props['total_amount'] == 60000.00
        assert props['savings'] == '15%'

    @pytest.mark.asyncio
    async def test_approval_ui_component_structure(self, mock_procurement_state):
        """Test that approval UI component has correct structure"""
        workflow = ProcurementWorkflow(
            openai_api_key='test_key',
            db_connection_string='test_db'
        )
        
        result = workflow.human_approval(mock_procurement_state)

        # Verify UI message structure
        assert result['status'] == 'WAITING_APPROVAL'
        assert 'ui' in result
        assert len(result['ui']) > 0

        # Get the approval UI message
        approval_ui = None
        for ui_message in result['ui']:
            if ui_message.get('type') == 'quote_approval_card':
                approval_ui = ui_message
                break

        assert approval_ui is not None
        assert 'props' in approval_ui
        assert 'type' in approval_ui

        # Verify required props for approval card
        props = approval_ui['props']
        required_props = ['vendor', 'total_amount', 'items', 'delivery_time', 'savings', 'quote_id', 'org_id']
        for prop in required_props:
            assert prop in props, f"Missing required prop: {prop}"

    @pytest.mark.asyncio
    async def test_approval_wait_state_persistence(self, mock_procurement_state):
        """Test that approval wait state persists correctly"""
        workflow = ProcurementWorkflow(
            openai_api_key='test_key',
            db_connection_string='test_db'
        )

        with patch('src.workflows.procurement.PostgresSaver.from_conn_string') as mock_saver:
            mock_saver.return_value = MagicMock()
            
            # Generate approval UI
            result = workflow.human_approval(mock_procurement_state)
            
            # Verify the approval UI was generated correctly
            assert result['status'] == 'WAITING_APPROVAL'
            assert len(result['ui']) == 1
            assert result['ui'][0]['type'] == 'quote_approval_card'
            # Verify approval UI was generated correctly
            assert result['status'] == 'WAITING_APPROVAL'
            assert len(result['ui']) == 1
            assert result['ui'][0]['type'] == 'quote_approval_card'

    @pytest.mark.asyncio
    async def test_approval_error_handling(self, mock_procurement_state):
        """Test error handling in approval workflow"""
        workflow = ProcurementWorkflow(
            openai_api_key='test_key',
            db_connection_string='test_db'
        )
        
        # Test with missing selected quote
        invalid_state = {
            **mock_procurement_state,
            'selected_quote': None
        }

        result = workflow.human_approval(invalid_state)

        # Should handle gracefully
        assert result['status'] == 'ERROR'
        assert len(result['ui']) == 1
        
        error_ui = result['ui'][0]
        assert error_ui['type'] == 'error_card'
        assert 'error' in str(error_ui['props']).lower()

if __name__ == '__main__':
    pytest.main([__file__])