"""Tests for Gmail API integration."""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from src.services.gmail_service import GmailService


@pytest.fixture
def gmail_service():
    """Create a Gmail service instance."""
    return GmailService()


def test_gmail_service_initialization(gmail_service):
    """Test Gmail service initialization."""
    assert gmail_service is not None
    assert hasattr(gmail_service, 'get_auth_url')
    assert hasattr(gmail_service, 'exchange_code_for_tokens')
    assert hasattr(gmail_service, 'send_rfq_email')
    assert hasattr(gmail_service, 'monitor_inbox')


@pytest.mark.asyncio
async def test_gmail_authentication(gmail_service):
    """Test Gmail OAuth flow."""
    with patch('google_auth_oauthlib.flow.Flow') as mock_flow:
        mock_flow_instance = MagicMock()
        mock_flow.from_client_config.return_value = mock_flow_instance
        mock_flow_instance.authorization_url.return_value = ("auth_url", "state")
        
        auth_url = gmail_service.get_auth_url()
        assert auth_url.startswith("auth_url")
        assert mock_flow.from_client_config.called


@pytest.mark.asyncio
async def test_token_exchange(gmail_service):
    """Test OAuth token exchange."""
    with patch('google_auth_oauthlib.flow.Flow') as mock_flow:
        mock_flow_instance = MagicMock()
        mock_flow.from_client_config.return_value = mock_flow_instance
        mock_flow_instance.fetch_token.return_value = {
            'access_token': 'test_access_token',
            'refresh_token': 'test_refresh_token',
            'token_type': 'Bearer',
            'expires_in': 3600
        }
        
        tokens = await gmail_service.exchange_code_for_tokens('test_code')
        
        assert tokens['access_token'] == 'test_access_token'
        assert tokens['refresh_token'] == 'test_refresh_token'
        assert mock_flow_instance.fetch_token.called


@pytest.mark.asyncio
async def test_send_rfq_email(gmail_service):
    """Test RFQ email sending."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'id': 'email_id_123',
            'threadId': 'thread_456',
            'labelIds': ['SENT']
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await gmail_service.send_rfq_email(
            vendor_email="test@example.com",
            vendor_name="Test Vendor",
            subject="Test RFQ",
            content="Test content",
            request_id="test-123"
        )
        
        assert result == True
        mock_client.return_value.__aenter__.return_value.post.assert_called_once()
        
        # Verify the request was made to Gmail API
        call_args = mock_client.return_value.__aenter__.return_value.post.call_args
        assert 'https://www.googleapis.com/gmail/v1/users/me/messages/send' in str(call_args)


@pytest.mark.asyncio
async def test_send_rfq_email_failure(gmail_service):
    """Test RFQ email sending failure."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 401
        mock_response.json.return_value = {
            'error': {
                'code': 401,
                'message': 'Unauthorized',
                'status': 'UNAUTHENTICATED'
            }
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await gmail_service.send_rfq_email(
            vendor_email="test@example.com",
            vendor_name="Test Vendor",
            subject="Test RFQ",
            content="Test content",
            request_id="test-123"
        )
        
        assert result == False


@pytest.mark.asyncio
async def test_monitor_inbox(gmail_service):
    """Test inbox monitoring for quote responses."""
    with patch('httpx.AsyncClient') as mock_client:
        # Mock successful response with emails
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'messages': [
                {'id': 'msg1', 'threadId': 'thread1', 'snippet': 'Quote for office supplies'},
                {'id': 'msg2', 'threadId': 'thread2', 'snippet': 'Price proposal attached'}
            ]
        }
        mock_client.return_value.__aenter__.return_value.get.return_value = mock_response
        
        emails = await gmail_service.monitor_inbox(request_id="test-123")
        
        assert len(emails) == 2
        assert emails[0]['id'] == 'msg1'
        assert emails[1]['id'] == 'msg2'


@pytest.mark.asyncio
async def test_get_email_content(gmail_service):
    """Test retrieving email content."""
    with patch('httpx.AsyncClient') as mock_client:
        # Mock email content response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'id': 'msg123',
            'threadId': 'thread456',
            'snippet': 'Quote for office supplies - $1000 total',
            'payload': {
                'headers': [
                    {'name': 'From', 'value': 'vendor@example.com'},
                    {'name': 'Subject', 'value': 'Quote Response'}
                ],
                'body': {
                    'data': 'SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IGVtYWls',
                    'size': 28
                }
            }
        }
        mock_client.return_value.__aenter__.return_value.get.return_value = mock_response
        
        email_content = await gmail_service.get_email_content('msg123')
        
        assert email_content['id'] == 'msg123'
        assert email_content['snippet'] == 'Quote for office supplies - $1000 total'
        assert email_content['subject'] == 'Quote Response'
        assert email_content['from'] == 'vendor@example.com'


@pytest.mark.asyncio
async def test_search_emails_by_subject(gmail_service):
    """Test searching emails by subject."""
    with patch('httpx.AsyncClient') as mock_client:
        # Mock search results
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'resultSizeEstimate': 2,
            'messages': [
                {'id': 'msg1', 'threadId': 'thread1'},
                {'id': 'msg2', 'threadId': 'thread2'}
            ]
        }
        mock_client.return_value.__aenter__.return_value.get.return_value = mock_response
        
        results = await gmail_service.search_emails_by_subject(
            query="RFQ Response",
            request_id="test-123"
        )
        
        assert len(results) == 2
        assert results[0]['id'] == 'msg1'
        assert results[1]['id'] == 'msg2'


@pytest.mark.asyncio
async def test_handle_gmail_api_error(gmail_service):
    """Test handling of Gmail API errors."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 403
        mock_response.json.return_value = {
            'error': {
                'code': 403,
                'message': 'Daily limit exceeded',
                'status': 'RATE_LIMIT_EXCEEDED'
            }
        }
        mock_client.return_value.__aenter__.return_value.get.return_value = mock_response
        
        with pytest.raises(Exception) as exc_info:
            await gmail_service.monitor_inbox(request_id="test-123")
        
        assert 'Daily limit exceeded' in str(exc_info.value)


@pytest.mark.asyncio
async def test_refresh_access_token(gmail_service):
    """Test access token refresh."""
    with patch('google.oauth2.credentials.Credentials') as mock_credentials:
        mock_creds_instance = MagicMock()
        mock_creds_instance.refresh.return_value = None
        mock_creds_instance.token = 'new_access_token'
        
        # Mock the credentials loading
        with patch.object(gmail_service, '_load_credentials') as mock_load:
            mock_load.return_value = mock_creds_instance
            
            await gmail_service._refresh_access_token()
            
            assert mock_creds_instance.refresh.called


@pytest.mark.asyncio
async def test_email_parsing_for_quotes(gmail_service):
    """Test parsing email content for quote information."""
    test_email_content = """
    Subject: Quote for Office Supplies - Request #123
    
    Dear Customer,
    
    Please find our quote below:
    
    Items:
    - Office Chairs: 10 units @ $150.00 each = $1,500.00
    - Desks: 5 units @ $300.00 each = $1,500.00
    
    Total: $3,000.00
    Delivery: 5-7 business days
    Payment Terms: Net 30
    
    Best regards,
    ABC Suppliers
    """
    
    parsed_data = gmail_service._parse_quote_from_email(test_email_content, "test@example.com")
    
    assert parsed_data['vendor_email'] == 'test@example.com'
    assert parsed_data['total_amount'] == 3000.00
    assert parsed_data['delivery_days'] == '5-7 business days'
    assert parsed_data['payment_terms'] == 'Net 30'
    assert len(parsed_data['items']) == 2
    assert parsed_data['items'][0]['name'] == 'Office Chairs'
    assert parsed_data['items'][0]['quantity'] == 10