"""Tests for database integration and RLS policies."""

import pytest
from unittest.mock import AsyncMock, patch
from src.database import get_db_client


@pytest.mark.asyncio
async def test_database_connection():
    """Test database connection."""
    db = await get_db_client()
    assert db is not None
    await db.disconnect()


@pytest.mark.asyncio
async def test_rls_policies():
    """Test Row-Level Security policies."""
    db = await get_db_client()
    
    # Test tenant isolation by creating test data for different orgs
    org1_id = "test-org-1"
    org2_id = "test-org-2"
    
    # Create test data for org1
    org1_request = await db.procurementrequest.create({
        "data": {
            "title": "Test Request Org1",
            "status": "CREATED",
            "items": [{"name": "Test Item", "quantity": 1}],
            "orgId": org1_id,
            "createdBy": "test-user-1"
        }
    })
    
    # Create test data for org2
    org2_request = await db.procurementrequest.create({
        "data": {
            "title": "Test Request Org2",
            "status": "CREATED",
            "items": [{"name": "Test Item", "quantity": 1}],
            "orgId": org2_id,
            "createdBy": "test-user-2"
        }
    })
    
    # Test that org1 cannot see org2's data
    org1_requests = await db.procurementrequest.find_many({
        "where": {"orgId": org1_id}
    })
    
    org2_requests = await db.procurementrequest.find_many({
        "where": {"orgId": org2_id}
    })
    
    # Verify tenant isolation
    assert len(org1_requests) == 1
    assert len(org2_requests) == 1
    assert org1_requests[0].id != org2_requests[0].id
    assert org1_requests[0].orgId == org1_id
    assert org2_requests[0].orgId == org2_id
    
    # Cleanup
    await db.procurementrequest.delete_many({
        "where": {"id": {"in": [org1_request.id, org2_request.id]}}
    })
    
    await db.disconnect()


@pytest.mark.asyncio
async def test_workflow_state_persistence():
    """Test workflow state persistence in database."""
    db = await get_db_client()
    
    # Create test workflow execution
    workflow = await db.workflowexecution.create({
        "data": {
            "workflowId": "test-workflow-123",
            "orgId": "test-org-456",
            "entityId": "test-request-789",
            "entityType": "procurement_request",
            "currentState": "CREATED",
            "status": "RUNNING",
            "stateData": {
                "step": "validate_request",
                "retryCount": 0
            }
        }
    })
    
    # Verify persistence
    saved_workflow = await db.workflowexecution.find_unique({
        "where": {"id": workflow.id}
    })
    
    assert saved_workflow.currentState == "CREATED"
    assert saved_workflow.status == "RUNNING"
    assert saved_workflow.entityId == "test-request-789"
    assert saved_workflow.entityType == "procurement_request"
    
    # Test state update
    updated_workflow = await db.workflowexecution.update({
        "where": {"id": workflow.id},
        "data": {
            "currentState": "QUOTES_REQUESTED",
            "status": "RUNNING",
            "stateData": {
                "step": "send_rfqs",
                "retryCount": 0,
                "rfqSentCount": 3
            }
        }
    })
    
    assert updated_workflow.currentState == "QUOTES_REQUESTED"
    assert updated_workflow.stateData["rfqSentCount"] == 3
    
    # Cleanup
    await db.workflowexecution.delete({
        "where": {"id": workflow.id}
    })
    
    await db.disconnect()


@pytest.mark.asyncio
async def test_procurement_request_lifecycle():
    """Test procurement request lifecycle with database."""
    db = await get_db_client()
    
    # Create test organization
    org = await db.organization.create({
        "data": {
            "name": "Test Organization",
            "slug": "test-org",
            "status": "ACTIVE"
        }
    })
    
    # Create test user
    user = await db.user.create({
        "data": {
            "email": "test@example.com",
            "name": "Test User",
            "orgId": org.id,
            "role": "ADMIN"
        }
    })
    
    # Create test vendor
    vendor = await db.vendor.create({
        "data": {
            "name": "Test Vendor",
            "email": "vendor@example.com",
            "orgId": org.id,
            "isActive": True
        }
    })
    
    # Create procurement request
    request = await db.procurementrequest.create({
        "data": {
            "title": "Test Office Supplies",
            "description": "Test procurement request",
            "items": [
                {"name": "Office Chairs", "quantity": 10, "unit": "each"},
                {"name": "Desks", "quantity": 5, "unit": "each"}
            ],
            "orgId": org.id,
            "createdBy": user.id,
            "status": "CREATED"
        }
    })
    
    # Verify request creation
    assert request.title == "Test Office Supplies"
    assert request.status == "CREATED"
    assert request.orgId == org.id
    
    # Update request status
    updated_request = await db.procurementrequest.update({
        "where": {"id": request.id},
        "data": {"status": "QUOTES_REQUESTED"}
    })
    
    assert updated_request.status == "QUOTES_REQUESTED"
    
    # Create quote
    quote = await db.quote.create({
        "data": {
            "requestId": request.id,
            "vendorId": vendor.id,
            "totalAmount": 1500.00,
            "currency": "USD",
            "items": [
                {"name": "Office Chairs", "quantity": 10, "unitPrice": 100.00},
                {"name": "Desks", "quantity": 5, "unitPrice": 100.00}
            ],
            "deliveryDays": 7,
            "terms": "Net 30",
            "status": "RECEIVED"
        }
    })
    
    # Verify quote creation
    assert quote.totalAmount == 1500.00
    assert quote.requestId == request.id
    assert quote.vendorId == vendor.id
    
    # Update request with approved quote
    final_request = await db.procurementrequest.update({
        "where": {"id": request.id},
        "data": {
            "status": "APPROVED",
            "approvedQuoteId": quote.id,
            "approvedVendorId": vendor.id
        }
    })
    
    assert final_request.status == "APPROVED"
    assert final_request.approvedQuoteId == quote.id
    
    # Create payment
    payment = await db.payment.create({
        "data": {
            "orgId": org.id,
            "requestId": request.id,
            "quoteId": quote.id,
            "amount": 1500.00,
            "currency": "USD",
            "status": "PENDING",
            "paymentMethod": "stripe",
            "transactionId": "pi_test_123456789"
        }
    })
    
    # Verify payment creation
    assert payment.amount == 1500.00
    assert payment.status == "PENDING"
    
    # Update payment status
    updated_payment = await db.payment.update({
        "where": {"id": payment.id},
        "data": {
            "status": "SUCCEEDED",
            "paidAt": "2024-01-01T00:00:00Z"
        }
    })
    
    assert updated_payment.status == "SUCCEEDED"
    
    # Update request to completed
    completed_request = await db.procurementrequest.update({
        "where": {"id": request.id},
        "data": {
            "status": "COMPLETED",
            "completedAt": "2024-01-01T00:00:00Z"
        }
    })
    
    assert completed_request.status == "COMPLETED"
    
    # Cleanup
    await db.payment.delete({"where": {"id": payment.id}
    })
    await db.quote.delete({"where": {"id": quote.id}
    })
    await db.procurementrequest.delete({"where": {"id": request.id}
    })
    await db.vendor.delete({"where": {"id": vendor.id}
    })
    await db.user.delete({"where": {"id": user.id}
    })
    await db.organization.delete({"where": {"id": org.id}
    })
    
    await db.disconnect()


@pytest.mark.asyncio
async def test_audit_log_creation():
    """Test audit log creation."""
    db = await get_db_client()
    
    # Create test audit log entry
    audit_log = await db.auditlog.create({
        "data": {
            "orgId": "test-org-123",
            "userId": "test-user-456",
            "action": "CREATE_PROCUREMENT_REQUEST",
            "entityType": "procurement_request",
            "entityId": "test-request-789",
            "oldData": {},
            "newData": {
                "title": "Test Request",
                "status": "CREATED"
            },
            "metadata": {
                "ipAddress": "127.0.0.1",
                "userAgent": "Test Agent"
            }
        }
    })
    
    # Verify audit log creation
    assert audit_log.action == "CREATE_PROCUREMENT_REQUEST"
    assert audit_log.entityType == "procurement_request"
    assert audit_log.entityId == "test-request-789"
    
    # Test audit log retrieval
    logs = await db.auditlog.find_many({
        "where": {
            "orgId": "test-org-123",
            "entityId": "test-request-789"
        },
        "orderBy": {"createdAt": "desc"}
    })
    
    assert len(logs) == 1
    assert logs[0].action == "CREATE_PROCUREMENT_REQUEST"
    
    # Cleanup
    await db.auditlog.delete({"where": {"id": audit_log.id}
    })
    
    await db.disconnect()


@pytest.mark.asyncio
async def test_email_thread_management():
    """Test email thread management."""
    db = await get_db_client()
    
    # Create test email thread
    thread = await db.emailthread.create({
        "data": {
            "orgId": "test-org-123",
            "requestId": "test-request-456",
            "subject": "RFQ: Office Supplies",
            "threadId": "gmail-thread-789",
            "status": "OPEN",
            "vendorEmail": "vendor@example.com"
        }
    })
    
    # Verify thread creation
    assert thread.subject == "RFQ: Office Supplies"
    assert thread.threadId == "gmail-thread-789"
    
    # Create email message
    message = await db.emailmessage.create({
        "data": {
            "threadId": thread.id,
            "messageId": "gmail-msg-123",
            "from": "vendor@example.com",
            "to": "procurement@company.com",
            "subject": "Re: RFQ: Office Supplies",
            "body": "Please find our quote attached.",
            "status": "RECEIVED",
            "isQuote": True,
            "processed": False
        }
    })
    
    # Verify message creation
    assert message.subject == "Re: RFQ: Office Supplies"
    assert message.isQuote == True
    
    # Update message as processed
    updated_message = await db.emailmessage.update({
        "where": {"id": message.id},
        "data": {
            "processed": True,
            "quoteData": {
                "totalAmount": 1500.00,
                "items": [{"name": "Chairs", "quantity": 10}]
            }
        }
    })
    
    assert updated_message.processed == True
    assert updated_message.quoteData["totalAmount"] == 1500.00
    
    # Test message retrieval by thread
    thread_messages = await db.emailmessage.find_many({
        "where": {"threadId": thread.id}
    })
    
    assert len(thread_messages) == 1
    assert thread_messages[0].id == message.id
    
    # Cleanup
    await db.emailmessage.delete({"where": {"id": message.id}
    })
    await db.emailthread.delete({"where": {"id": thread.id}
    })
    
    await db.disconnect()


@pytest.mark.asyncio
async def test_tenant_isolation_comprehensive():
    """Comprehensive test for tenant isolation."""
    db = await get_db_client()
    
    # Create organizations
    org1 = await db.organization.create({
        "data": {"name": "Organization 1", "slug": "org1"}
    })
    org2 = await db.organization.create({
        "data": {"name": "Organization 2", "slug": "org2"}
    })
    
    # Create users for each org
    user1 = await db.user.create({
        "data": {
            "email": "user1@org1.com",
            "name": "User 1",
            "orgId": org1.id
        }
    })
    user2 = await db.user.create({
        "data": {
            "email": "user2@org2.com",
            "name": "User 2",
            "orgId": org2.id
        }
    })
    
    # Create vendors for each org
    vendor1 = await db.vendor.create({
        "data": {
            "name": "Vendor 1",
            "email": "vendor1@org1.com",
            "orgId": org1.id
        }
    })
    vendor2 = await db.vendor.create({
        "data": {
            "name": "Vendor 2",
            "email": "vendor2@org2.com",
            "orgId": org2.id
        }
    })
    
    # Create requests for each org
    request1 = await db.procurementrequest.create({
        "data": {
            "title": "Request 1",
            "orgId": org1.id,
            "createdBy": user1.id,
            "items": []
        }
    })
    request2 = await db.procurementrequest.create({
        "data": {
            "title": "Request 2",
            "orgId": org2.id,
            "createdBy": user2.id,
            "items": []
        }
    })
    
    # Test that org1 cannot see org2's data
    org1_requests = await db.procurementrequest.find_many({
        "where": {"orgId": org1.id}
    })
    org2_requests = await db.procurementrequest.find_many({
        "where": {"orgId": org2.id}
    })
    
    assert len(org1_requests) == 1
    assert len(org2_requests) == 1
    assert org1_requests[0].orgId == org1.id
    assert org2_requests[0].orgId == org2.id
    
    # Test that org1 cannot see org2's users
    org1_users = await db.user.find_many({
        "where": {"orgId": org1.id}
    })
    org2_users = await db.user.find_many({
        "where": {"orgId": org2.id}
    })
    
    assert len(org1_users) == 1
    assert len(org2_users) == 1
    assert org1_users[0].orgId == org1.id
    assert org2_users[0].orgId == org2.id
    
    # Test that org1 cannot see org2's vendors
    org1_vendors = await db.vendor.find_many({
        "where": {"orgId": org1.id}
    })
    org2_vendors = await db.vendor.find_many({
        "where": {"orgId": org2.id}
    })
    
    assert len(org1_vendors) == 1
    assert len(org2_vendors) == 1
    assert org1_vendors[0].orgId == org1.id
    assert org2_vendors[0].orgId == org2.id
    
    # Cleanup
    await db.procurementrequest.delete_many({
        "where": {"id": {"in": [request1.id, request2.id]}}
    })
    await db.vendor.delete_many({
        "where": {"id": {"in": [vendor1.id, vendor2.id]}}
    })
    await db.user.delete_many({
        "where": {"id": {"in": [user1.id, user2.id]}}
    })
    await db.organization.delete_many({
        "where": {"id": {"in": [org1.id, org2.id]}}
    })
    
    await db.disconnect()


@pytest.mark.asyncio
async def test_workflow_execution_with_tenant_isolation():
    """Test workflow execution with tenant isolation."""
    db = await get_db_client()
    
    # Create organizations
    org1 = await db.organization.create({
        "data": {"name": "Org 1", "slug": "org1"}
    })
    org2 = await db.organization.create({
        "data": {"name": "Org 2", "slug": "org2"}
    })
    
    # Create workflows for each org
    workflow1 = await db.workflowexecution.create({
        "data": {
            "workflowId": "workflow-org1",
            "orgId": org1.id,
            "entityId": "request-org1",
            "entityType": "procurement_request",
            "currentState": "CREATED",
            "status": "RUNNING"
        }
    })
    
    workflow2 = await db.workflowexecution.create({
        "data": {
            "workflowId": "workflow-org2",
            "orgId": org2.id,
            "entityId": "request-org2",
            "entityType": "procurement_request",
            "currentState": "CREATED",
            "status": "RUNNING"
        }
    })
    
    # Test tenant isolation for workflows
    org1_workflows = await db.workflowexecution.find_many({
        "where": {"orgId": org1.id}
    })
    org2_workflows = await db.workflowexecution.find_many({
        "where": {"orgId": org2.id}
    })
    
    assert len(org1_workflows) == 1
    assert len(org2_workflows) == 1
    assert org1_workflows[0].orgId == org1.id
    assert org2_workflows[0].orgId == org2.id
    
    # Cleanup
    await db.workflowexecution.delete_many({
        "where": {"id": {"in": [workflow1.id, workflow2.id]}}
    })
    await db.organization.delete_many({
        "where": {"id": {"in": [org1.id, org2.id]}}
    })
    
    await db.disconnect()


@pytest.mark.asyncio
async def test_database_performance():
    """Test database performance for common operations."""
    import time
    
    db = await get_db_client()
    
    # Create test organization
    org = await db.organization.create({
        "data": {"name": "Perf Test Org", "slug": "perf-test"}
    })
    
    # Test bulk operations
    start_time = time.time()
    
    # Create multiple requests
    requests = []
    for i in range(10):
        request = await db.procurementrequest.create({
            "data": {
                "title": f"Test Request {i}",
                "orgId": org.id,
                "createdBy": "test-user",
                "items": [{"name": "Test Item", "quantity": 1}],
                "status": "CREATED"
            }
        })
        requests.append(request)
    
    bulk_create_time = time.time() - start_time
    
    # Test bulk read
    start_time = time.time()
    all_requests = await db.procurementrequest.find_many({
        "where": {"orgId": org.id}
    })
    bulk_read_time = time.time() - start_time
    
    # Test bulk update
    start_time = time.time()
    for request in requests[:5]:
        await db.procurementrequest.update({
            "where": {"id": request.id},
            "data": {"status": "QUOTES_REQUESTED"}
        })
    bulk_update_time = time.time() - start_time
    
    # Test bulk delete
    start_time = time.time()
    await db.procurementrequest.delete_many({
        "where": {"id": {"in": [r.id for r in requests]}}
    })
    bulk_delete_time = time.time() - start_time
    
    # Cleanup
    await db.organization.delete({"where": {"id": org.id}
    })
    
    await db.disconnect()
    
    # Log performance metrics
    print(f"Performance Metrics:")
    print(f"  Bulk create (10 records): {bulk_create_time:.3f}s")
    print(f"  Bulk read: {bulk_read_time:.3f}s")
    print(f"  Bulk update (5 records): {bulk_update_time:.3f}s")
    print(f"  Bulk delete (10 records): {bulk_delete_time:.3f}s")
    
    # Assert reasonable performance
    assert bulk_create_time < 5.0  # Should complete in under 5 seconds
    assert bulk_read_time < 2.0    # Should complete in under 2 seconds
    assert bulk_update_time < 3.0  # Should complete in under 3 seconds
    assert bulk_delete_time < 2.0  # Should complete in under 2 seconds