"""Tests for Stripe payment processing in test mode."""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from src.services.payment_service import PaymentService


@pytest.fixture
def payment_service():
    """Create a payment service instance."""
    return PaymentService()


def test_stripe_test_mode_configuration(payment_service):
    """Test Stripe test mode configuration."""
    assert payment_service.stripe_secret_key.startswith("sk_test")
    assert payment_service.stripe_publishable_key.startswith("pk_test")
    assert payment_service.stripe_api_version == "2024-06-20"


@pytest.mark.asyncio
async def test_payment_intent_creation(payment_service):
    """Test payment intent creation in test mode."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "pi_test_123456789",
            "object": "payment_intent",
            "amount": 10000,
            "currency": "usd",
            "status": "requires_payment_method",
            "description": "Test payment for procurement",
            "metadata": {
                "request_id": "test-request-123",
                "org_id": "test-org-456"
            },
            "created": 1712345678,
            "client_secret": "pi_test_123456789_secret_abcdef"
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await payment_service.create_payment_intent(
            amount=10000,
            currency="usd",
            description="Test payment for procurement",
            request_id="test-request-123",
            org_id="test-org-456"
        )
        
        assert result["status"] == "requires_payment_method"
        assert result["amount"] == 10000
        assert result["currency"] == "usd"
        assert result["id"].startswith("pi_test_")
        assert result["client_secret"].startswith("pi_test_")
        
        # Verify the request was made to Stripe API
        call_args = mock_client.return_value.__aenter__.return_value.post.call_args
        assert 'https://api.stripe.com/v1/payment_intents' in str(call_args)


@pytest.mark.asyncio
async def test_payment_intent_creation_failure(payment_service):
    """Test payment intent creation failure."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 400
        mock_response.json.return_value = {
            "error": {
                "type": "invalid_request_error",
                "message": "Invalid amount",
                "code": "amount_invalid"
            }
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        with pytest.raises(Exception) as exc_info:
            await payment_service.create_payment_intent(
                amount=-100,
                currency="usd",
                description="Invalid payment"
            )
        
        assert "Invalid amount" in str(exc_info.value)


@pytest.mark.asyncio
async def test_payment_confirmation(payment_service):
    """Test payment confirmation in test mode."""
    with patch('httpx.AsyncClient') as mock_client:
        # Mock successful payment confirmation
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "pi_test_123456789",
            "object": "payment_intent",
            "amount": 10000,
            "currency": "usd",
            "status": "succeeded",
            "description": "Test payment for procurement",
            "payment_method": "pm_test_visa",
            "charges": {
                "data": [{
                    "id": "ch_test_123456789",
                    "amount": 10000,
                    "currency": "usd",
                    "status": "succeeded",
                    "payment_method_details": {
                        "card": {
                            "brand": "visa",
                            "last4": "4242",
                            "exp_month": 12,
                            "exp_year": 2030
                        }
                    }
                }]
            }
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await payment_service.confirm_payment(
            payment_intent_id="pi_test_123456789",
            payment_method_id="pm_test_visa"
        )
        
        assert result["status"] == "succeeded"
        assert result["amount"] == 10000
        assert result["charges"]["data"][0]["status"] == "succeeded"
        assert result["charges"]["data"][0]["payment_method_details"]["card"]["brand"] == "visa"


@pytest.mark.asyncio
async def test_webhook_verification(payment_service):
    """Test Stripe webhook signature verification."""
    test_payload = {
        "id": "evt_test_webhook123",
        "object": "event",
        "api_version": "2024-06-20",
        "created": 1712345678,
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_test_123456789",
                "object": "payment_intent",
                "amount": 10000,
                "currency": "usd",
                "status": "succeeded",
                "description": "Test payment"
            }
        }
    }
    
    test_signature = "test_signature_abc123"
    
    with patch('hmac.new') as mock_hmac:
        mock_hmac.return_value.hexdigest.return_value = "computed_signature_abc123"
        
        result = payment_service.verify_webhook_signature(
            payload=test_payload,
            signature=test_signature
        )
        
        assert result == True
        mock_hmac.assert_called_once()


@pytest.mark.asyncio
async def test_webhook_verification_failure(payment_service):
    """Test webhook verification failure."""
    test_payload = {
        "id": "evt_test_webhook123",
        "type": "payment_intent.succeeded"
    }
    
    test_signature = "invalid_signature"
    
    with patch('hmac.new') as mock_hmac:
        mock_hmac.return_value.hexdigest.return_value = "computed_signature_different"
        
        result = payment_service.verify_webhook_signature(
            payload=test_payload,
            signature=test_signature
        )
        
        assert result == False


@pytest.mark.asyncio
async def test_webhook_processing(payment_service):
    """Test webhook event processing."""
    test_event = {
        "id": "evt_test_webhook123",
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_test_123456789",
                "status": "succeeded",
                "amount": 10000,
                "currency": "usd",
                "metadata": {
                    "request_id": "test-request-123",
                    "org_id": "test-org-456"
                }
            }
        }
    }
    
    # Mock database
    with patch('src.database.with_tenant') as mock_db:
        mock_db_context = AsyncMock()
        mock_db.return_value.__aenter__.return_value = mock_db_context
        
        # Mock payment update
        mock_payment = AsyncMock()
        mock_payment.id = "payment-123"
        mock_db_context.payment.find_first.return_value = mock_payment
        
        result = await payment_service.process_webhook_event(test_event)
        
        # Verify payment was updated
        assert result["status"] == "processed"
        mock_db_context.payment.update.assert_called_once()
        
        # Verify procurement request was updated
        mock_db_context.procurementrequest.update.assert_called_once()


@pytest.mark.asyncio
async def test_refund_processing(payment_service):
    """Test refund processing in test mode."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "re_test_123456789",
            "object": "refund",
            "amount": 10000,
            "currency": "usd",
            "status": "succeeded",
            "payment_intent": "pi_test_123456789",
            "reason": "requested_by_customer",
            "metadata": {
                "request_id": "test-request-123"
            }
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await payment_service.create_refund(
            payment_intent_id="pi_test_123456789",
            amount=10000,
            reason="requested_by_customer",
            request_id="test-request-123"
        )
        
        assert result["status"] == "succeeded"
        assert result["amount"] == 10000
        assert result["id"].startswith("re_test_")


@pytest.mark.asyncio
async def test_customer_creation(payment_service):
    """Test customer creation in test mode."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "cus_test_123456789",
            "object": "customer",
            "name": "Test Customer",
            "email": "test@example.com",
            "description": "Test customer for procurement",
            "metadata": {
                "org_id": "test-org-456",
                "user_id": "test-user-789"
            }
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await payment_service.create_customer(
            name="Test Customer",
            email="test@example.com",
            description="Test customer for procurement",
            org_id="test-org-456",
            user_id="test-user-789"
        )
        
        assert result["id"].startswith("cus_test_")
        assert result["name"] == "Test Customer"
        assert result["email"] == "test@example.com"


@pytest.mark.asyncio
async def test_payment_method_attachment(payment_service):
    """Test payment method attachment to customer."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "pm_test_123456789",
            "object": "payment_method",
            "type": "card",
            "card": {
                "brand": "visa",
                "last4": "4242",
                "exp_month": 12,
                "exp_year": 2030
            },
            "customer": "cus_test_123456789"
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await payment_service.attach_payment_method(
            payment_method_id="pm_test_123456789",
            customer_id="cus_test_123456789"
        )
        
        assert result["id"].startswith("pm_test_")
        assert result["customer"] == "cus_test_123456789"
        assert result["card"]["brand"] == "visa"


@pytest.mark.asyncio
async def test_payment_intent_cancellation(payment_service):
    """Test payment intent cancellation."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "pi_test_123456789",
            "object": "payment_intent",
            "amount": 10000,
            "currency": "usd",
            "status": "canceled",
            "cancellation_reason": "requested_by_customer"
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await payment_service.cancel_payment_intent(
            payment_intent_id="pi_test_123456789"
        )
        
        assert result["status"] == "canceled"
        assert result["cancellation_reason"] == "requested_by_customer"


@pytest.mark.asyncio
async def test_test_mode_specific_features(payment_service):
    """Test Stripe test mode specific features."""
    
    # Test test clock usage
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "clock_test_123456789",
            "object": "test_helpers.test_clock",
            "frozen_time": 1712345678,
            "status": "ready"
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await payment_service.create_test_clock()
        assert result["id"].startswith("clock_test_")
        assert result["status"] == "ready"
    
    # Test test mode card numbers
    test_cards = payment_service.get_test_card_numbers()
    assert "4242424242424242" in test_cards  # Visa
    assert "4000056655665556" in test_cards  # 3D Secure
    assert "4000002500003155" in test_cards  # Requires authentication


@pytest.mark.asyncio
async def test_payment_intent_with_metadata(payment_service):
    """Test payment intent creation with metadata."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "pi_test_123456789",
            "object": "payment_intent",
            "amount": 15000,
            "currency": "usd",
            "status": "requires_action",
            "metadata": {
                "request_id": "test-request-123",
                "org_id": "test-org-456",
                "quote_id": "quote-789",
                "vendor_id": "vendor-456"
            },
            "next_action": {
                "type": "use_stripe_sdk",
                "use_stripe_sdk": {
                    "type": "three_d_secure_redirect",
                    "stripe_js": "https://hooks.stripe.com/redirect/...",
                    "url": "https://hooks.stripe.com/redirect/..."
                }
            }
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await payment_service.create_payment_intent(
            amount=15000,
            currency="usd",
            description="Test payment with 3D Secure",
            request_id="test-request-123",
            org_id="test-org-456",
            quote_id="quote-789",
            vendor_id="vendor-456",
            requires_3d_secure=True
        )
        
        assert result["status"] == "requires_action"
        assert result["metadata"]["request_id"] == "test-request-123"
        assert result["next_action"]["type"] == "use_stripe_sdk"


@pytest.mark.asyncio
async def test_payment_intent_with_saved_payment_method(payment_service):
    """Test payment intent with saved payment method."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "pi_test_123456789",
            "object": "payment_intent",
            "amount": 20000,
            "currency": "usd",
            "status": "requires_confirmation",
            "payment_method": "pm_test_123456789",
            "customer": "cus_test_123456789",
            "confirmation_method": "manual",
            "metadata": {
                "request_id": "test-request-123"
            }
        }
        mock_client.return_value.__aenter__.return_value.post.return_value = mock_response
        
        result = await payment_service.create_payment_intent(
            amount=20000,
            currency="usd",
            description="Test payment with saved card",
            request_id="test-request-123",
            customer_id="cus_test_123456789",
            payment_method_id="pm_test_123456789"
        )
        
        assert result["status"] == "requires_confirmation"
        assert result["payment_method"] == "pm_test_123456789"
        assert result["customer"] == "cus_test_123456789"


@pytest.mark.asyncio
async def test_payment_intent_listing(payment_service):
    """Test listing payment intents."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "object": "list",
            "data": [
                {
                    "id": "pi_test_123456789",
                    "object": "payment_intent",
                    "amount": 10000,
                    "currency": "usd",
                    "status": "succeeded",
                    "created": 1712345678
                },
                {
                    "id": "pi_test_987654321",
                    "object": "payment_intent",
                    "amount": 5000,
                    "currency": "usd",
                    "status": "canceled",
                    "created": 1712345000
                }
            ],
            "has_more": False
        }
        mock_client.return_value.__aenter__.return_value.get.return_value = mock_response
        
        result = await payment_service.list_payment_intents(
            limit=10,
            request_id="test-request-123"
        )
        
        assert len(result["data"]) == 2
        assert result["data"][0]["status"] == "succeeded"
        assert result["data"][1]["status"] == "canceled"


@pytest.mark.asyncio
async def test_payment_intent_retrieval(payment_service):
    """Test retrieving a specific payment intent."""
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "pi_test_123456789",
            "object": "payment_intent",
            "amount": 10000,
            "currency": "usd",
            "status": "succeeded",
            "description": "Test payment",
            "metadata": {
                "request_id": "test-request-123"
            },
            "charges": {
                "data": [{
                    "id": "ch_test_123456789",
                    "amount": 10000,
                    "currency": "usd",
                    "status": "succeeded"
                }]
            }
        }
        mock_client.return_value.__aenter__.return_value.get.return_value = mock_response
        
        result = await payment_service.get_payment_intent(
            payment_intent_id="pi_test_123456789"
        )
        
        assert result["id"] == "pi_test_123456789"
        assert result["status"] == "succeeded"
        assert result["charges"]["data"][0]["status"] == "succeeded"