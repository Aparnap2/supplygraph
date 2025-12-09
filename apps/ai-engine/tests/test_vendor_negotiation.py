"""
Tests for vendor email negotiation functionality
Following TDD principles - tests written first, then implementation
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime, timedelta
import json

from src.tasks.vendor_negotiation_tasks import (
    initiate_vendor_negotiation,
    process_vendor_quote,
    check_negotiation_status,
    send_negotiation_reminders,
    finalize_negotiation,
    _initiate_vendor_negotiation_impl,
    _process_vendor_quote_impl,
    _check_negotiation_status_impl,
    _send_negotiation_reminders_impl,
    _finalize_negotiation_impl
)
from src.services.vendor_email_service import VendorEmailService, VendorQuoteRequest

class TestVendorNegotiation:
    """Test suite for vendor negotiation functionality"""

    @pytest.fixture
    def mock_procurement_data(self):
        """Mock procurement data for testing"""
        return {
            'org_id': 'test_org_123',
            'procurement_id': 'proc_456',
            'user_id': 'user_789',
            'items': [
                {
                    'name': 'Laptop',
                    'quantity': 10,
                    'unit': 'pcs',
                    'specifications': '16GB RAM, 512GB SSD',
                    'category': 'Electronics'
                }
            ],
            'special_instructions': 'Please include bulk pricing'
        }

    @pytest.fixture
    def mock_vendor_quote_response(self):
        """Mock vendor quote response"""
        return {
            'procurement_id': 'proc_456',
            'vendor_id': 'vendor_001',
            'quote_id': 'quote_abc123',
            'items': [
                {
                    'name': 'Laptop',
                    'quantity': 10,
                    'unit_price': 1200.00
                }
            ],
            'total_amount': 12000.00,
            'delivery_time': '5-7 business days',
            'notes': 'Bulk pricing applied'
        }

    @pytest.mark.asyncio
    async def test_initiate_vendor_negotiation_success(self, mock_procurement_data):
        """Test successful initiation of vendor negotiation"""
        with patch('src.tasks.vendor_negotiation_tasks._get_organization_vendors') as mock_vendors, \
             patch('src.tasks.vendor_negotiation_tasks._get_smtp_config') as mock_smtp, \
             patch('src.tasks.vendor_negotiation_tasks.get_state_redis') as mock_redis:
            
            # Mock vendors
            mock_vendors.return_value = [
                {'id': 'vendor_001', 'name': 'TechCorp', 'email': 'tech@corp.com'},
                {'id': 'vendor_002', 'name': 'OfficeSupplies', 'email': 'office@supplies.com'}
            ]
            
            # Mock SMTP config
            mock_smtp.return_value = {'smtp_server': 'smtp.test.com'}
            
            # Mock Redis
            mock_redis_instance = AsyncMock()
            mock_redis.return_value = mock_redis_instance
            
            # Mock email service
            with patch.object(VendorEmailService, 'send_quote_requests') as mock_email:
                mock_email.return_value = {
                    'success': True,
                    'sent_count': 2,
                    'failed_count': 0
                }
                
                result = await _initiate_vendor_negotiation_impl(mock_procurement_data)
                
                # Verify successful initiation
                assert result['success'] is True
                assert result['procurement_id'] == 'proc_456'
                assert result['vendors_contacted'] == 2
                assert 'deadline' in result
                assert 'negotiation_key' in result
                
                # Verify Redis state was set
                mock_redis_instance.hset.assert_called_once()
                mock_redis_instance.expire.assert_called_once()

    @pytest.mark.asyncio
    async def test_initiate_vendor_negotiation_no_vendors(self, mock_procurement_data):
        """Test negotiation initiation with no vendors configured"""
        with patch('src.tasks.vendor_negotiation_tasks._get_organization_vendors') as mock_vendors, \
             patch('src.tasks.vendor_negotiation_tasks._get_smtp_config') as mock_smtp:
            
            # Mock empty vendor list
            mock_vendors.return_value = []
            
            result = await _initiate_vendor_negotiation_impl(mock_procurement_data)
            
            # Verify failure
            assert result['success'] is False
            assert 'No vendors configured' in result['error']

    @pytest.mark.asyncio
    async def test_process_vendor_quote_success(self, mock_vendor_quote_response):
        """Test successful processing of vendor quote"""
        with patch('src.tasks.vendor_negotiation_tasks._get_smtp_config') as mock_smtp, \
             patch('src.tasks.vendor_negotiation_tasks.get_state_redis') as mock_redis:
            
            # Mock SMTP config
            mock_smtp.return_value = {'smtp_server': 'smtp.test.com'}
            
            # Mock Redis
            mock_redis_instance = AsyncMock()
            mock_redis.return_value = mock_redis_instance
            
            # Mock existing negotiation state
            mock_redis_instance.hgetall.return_value = {
                b'status': b'awaiting_quotes',
                b'vendors_responded': b'0',
                b'quotes_received': b'[]'
            }
            
            # Mock email service
            with patch.object(VendorEmailService, 'process_vendor_response') as mock_email:
                mock_email.return_value = {
                    'success': True,
                    'quote_id': 'quote_abc123',
                    'total_amount': 12000.00,
                    'processed_at': datetime.utcnow().isoformat()
                }
                
                result = await _process_vendor_quote_impl(mock_vendor_quote_response)
                
                # Verify successful processing
                assert result['success'] is True
                assert result['quote_id'] == 'quote_abc123'
                assert 'processed_at' in result
                
                # Verify Redis state was updated
                mock_redis_instance.hset.assert_called()

    @pytest.mark.asyncio
    async def test_check_negotiation_status_awaiting_quotes(self):
        """Test checking negotiation status while waiting for quotes"""
        with patch('src.tasks.vendor_negotiation_tasks.get_state_redis') as mock_redis:
            
            # Mock Redis state
            mock_redis_instance = AsyncMock()
            mock_redis.return_value = mock_redis_instance
            
            negotiation_state = {
                'status': 'awaiting_quotes',
                'vendors_contacted': 3,
                'vendors_responded': 1,
                'quotes_received': json.dumps([{'vendor_id': 'vendor_001'}]),
                'deadline': (datetime.utcnow() + timedelta(hours=24)).isoformat(),
                'initiated_at': datetime.utcnow().isoformat()
            }
            
            mock_redis_instance.hgetall.return_value = negotiation_state
            
            result = await _check_negotiation_status_impl('proc_456')
            
            # Verify status check
            assert result['success'] is True
            assert result['status'] == 'receiving_quotes'
            assert result['vendors_contacted'] == 3
            assert result['vendors_responded'] == 1
            assert result['quotes_received'] == 1
            assert result['deadline_passed'] is False

    @pytest.mark.asyncio
    async def test_check_negotiation_status_complete(self):
        """Test checking negotiation status when all vendors responded"""
        with patch('src.tasks.vendor_negotiation_tasks.get_state_redis') as mock_redis:
            
            # Mock Redis state
            mock_redis_instance = AsyncMock()
            mock_redis.return_value = mock_redis_instance
            
            negotiation_state = {
                'status': 'receiving_quotes',
                'vendors_contacted': 2,
                'vendors_responded': 2,
                'quotes_received': json.dumps([
                    {'vendor_id': 'vendor_001', 'total_amount': 1000},
                    {'vendor_id': 'vendor_002', 'total_amount': 1200}
                ]),
                'deadline': (datetime.utcnow() + timedelta(hours=48)).isoformat()
            }
            
            mock_redis_instance.hgetall.return_value = negotiation_state
            
            result = await _check_negotiation_status_impl('proc_456')
            
            # Verify complete status
            assert result['success'] is True
            assert result['status'] == 'quotes_complete'
            assert result['quotes_received'] == 2

    @pytest.mark.asyncio
    async def test_check_negotiation_status_deadline_passed(self):
        """Test checking negotiation status after deadline passed"""
        with patch('src.tasks.vendor_negotiation_tasks.get_state_redis') as mock_redis:
            
            # Mock Redis state with passed deadline
            mock_redis_instance = AsyncMock()
            mock_redis.return_value = mock_redis_instance
            
            negotiation_state = {
                'status': 'receiving_quotes',
                'vendors_contacted': 2,
                'vendors_responded': 1,
                'quotes_received': json.dumps([]),
                'deadline': (datetime.utcnow() - timedelta(hours=1)).isoformat()  # Past deadline
            }
            
            mock_redis_instance.hgetall.return_value = negotiation_state
            
            result = await _check_negotiation_status_impl('proc_456')
            
            # Verify deadline passed status
            assert result['success'] is True
            assert result['status'] == 'deadline_passed'
            assert result['deadline_passed'] is True

    @pytest.mark.asyncio
    async def test_send_negotiation_reminders(self):
        """Test sending follow-up reminders to vendors"""
        with patch('src.tasks.vendor_negotiation_tasks.get_state_redis') as mock_redis, \
             patch('src.tasks.vendor_negotiation_tasks._get_smtp_config') as mock_smtp:
            
            # Mock Redis with multiple negotiations
            mock_redis_instance = AsyncMock()
            mock_redis.return_value = mock_redis_instance
            
            # Mock negotiations needing reminders
            negotiations = {
                'negotiation:proc_456': {
                    'org_id': 'test_org_123',
                    'status': 'receiving_quotes',
                    'last_reminder_sent': (datetime.utcnow() - timedelta(hours=13)).isoformat(),  # Due for reminder
                    'vendor_data': {'vendor_name': 'TechCorp'}
                },
                'negotiation:proc_789': {
                    'org_id': 'test_org_123',
                    'status': 'awaiting_quotes',
                    'last_reminder_sent': (datetime.utcnow() - timedelta(hours=25)).isoformat(),  # Not due yet
                    'vendor_data': {'vendor_name': 'OfficeSupplies'}
                }
            }
            
            mock_redis_instance.keys.return_value = list(negotiations.keys())
            mock_redis_instance.hgetall.side_effect = lambda key: negotiations.get(key if isinstance(key, str) else key.decode(), {})
            
            # Mock SMTP config
            mock_smtp.return_value = {'smtp_server': 'smtp.test.com'}
            
            # Mock email service
            with patch.object(VendorEmailService, 'send_follow_up_reminders') as mock_email:
                mock_email.return_value = {'reminders_sent': 1}
                
                result = await _send_negotiation_reminders_impl()
                
                # Verify reminders sent
                assert result['success'] is True
                assert result['reminders_sent'] == 2
                assert result['negotiations_processed'] == 2

    @pytest.mark.asyncio
    async def test_finalize_negotiation_success(self):
        """Test successful finalization of negotiation"""
        with patch('src.tasks.vendor_negotiation_tasks.get_state_redis') as mock_redis:
            
            # Mock Redis state with quotes
            mock_redis_instance = AsyncMock()
            mock_redis.return_value = mock_redis_instance
            
            quotes_data = [
                {
                    'quote_id': 'quote_001',
                    'vendor_id': 'vendor_001',
                    'total_amount': 1000.00,
                    'delivery_time': '5-7 days',
                    'items': [],
                    'received_at': datetime.utcnow().isoformat(),
                    'valid_until': (datetime.utcnow() + timedelta(days=7)).isoformat()
                },
                {
                    'quote_id': 'quote_002',
                    'vendor_id': 'vendor_002',
                    'total_amount': 1200.00,
                    'delivery_time': '3-5 days',
                    'items': [],
                    'received_at': datetime.utcnow().isoformat(),
                    'valid_until': (datetime.utcnow() + timedelta(days=7)).isoformat()
                }
            ]
            
            negotiation_state = {
                'status': 'receiving_quotes',
                'quotes_received': json.dumps(quotes_data)
            }
            
            mock_redis_instance.hgetall.return_value = negotiation_state
            
            result = await _finalize_negotiation_impl('proc_456')
            
            # Verify successful finalization
            assert result['success'] is True
            assert result['quotes_count'] == 2
            assert result['best_quote']['vendor'] == 'vendor_001'  # Lowest price
            assert result['best_quote']['total_amount'] == 1000.00
            assert 'finalized_at' in result
            
            # Verify status updated to finalized
            mock_redis_instance.hset.assert_called()
            # Verify the call was made with correct parameters
            call_args = mock_redis_instance.hset.call_args
            assert call_args[0][0] == 'negotiation:proc_456'

    @pytest.mark.asyncio
    async def test_finalize_negotiation_no_quotes(self):
        """Test finalization when no quotes received"""
        with patch('src.tasks.vendor_negotiation_tasks.get_state_redis') as mock_redis:
            
            # Mock Redis state with no quotes
            mock_redis_instance = AsyncMock()
            mock_redis.return_value = mock_redis_instance
            
            negotiation_state = {
                'status': 'receiving_quotes',
                'quotes_received': json.dumps([])
            }
            
            mock_redis_instance.hgetall.return_value = negotiation_state
            
            result = await _finalize_negotiation_impl('proc_456')
            
            # Verify failure
            assert result['success'] is False
            assert 'No quotes received' in result['error']

    @pytest.mark.asyncio
    async def test_vendor_email_service_integration(self, mock_procurement_data):
        """Test integration of vendor email service with negotiation tasks"""
        with patch('src.tasks.vendor_negotiation_tasks._get_organization_vendors') as mock_vendors, \
             patch('src.tasks.vendor_negotiation_tasks._get_smtp_config') as mock_smtp:
            
            # Mock vendors
            mock_vendors.return_value = [
                {'id': 'vendor_001', 'name': 'TechCorp', 'email': 'tech@corp.com'}
            ]
            
            # Mock SMTP config
            mock_smtp.return_value = {'smtp_server': 'smtp.test.com'}
            
            # Create email service instance
            email_service = VendorEmailService(mock_smtp.return_value)
            
            # Test quote request creation
            quote_request = VendorQuoteRequest(
                vendor_id='vendor_001',
                vendor_name='TechCorp',
                vendor_email='tech@corp.com',
                items=mock_procurement_data['items'],
                organization_id='test_org_123',
                procurement_id='proc_456',
                deadline=datetime.utcnow() + timedelta(hours=48)
            )
            
            # Test email content generation
            email_content = email_service._generate_quote_request_email(quote_request)
            
            # Verify email content
            assert 'Request for Quote' in email_content
            assert 'proc_456' in email_content
            assert 'TechCorp' in email_content
            assert 'Laptop' in email_content
            assert 'deadline above' in email_content

    def test_get_organization_vendors_mock(self):
        """Test mock vendor data structure"""
        from src.tasks.vendor_negotiation_tasks import _get_organization_vendors
        
        vendors = _get_organization_vendors('test_org')
        
        # Verify mock vendor structure
        assert len(vendors) == 3
        assert all('id' in vendor for vendor in vendors)
        assert all('name' in vendor for vendor in vendors)
        assert all('email' in vendor for vendor in vendors)
        assert all('specialties' in vendor for vendor in vendors)

    def test_get_smtp_config_mock(self):
        """Test mock SMTP configuration"""
        from src.tasks.vendor_negotiation_tasks import _get_smtp_config
        
        config = _get_smtp_config('test_org')
        
        # Verify SMTP config structure
        assert 'smtp_server' in config
        assert 'smtp_port' in config
        assert 'from_email' in config
        assert 'from_name' in config
        assert 'test_org' in config['from_email']

if __name__ == '__main__':
    pytest.main([__file__])