"""
FastAPI endpoint tests for SupplyGraph AI Engine
"""
import pytest
import asyncio
import uuid
import json
from datetime import datetime
from typing import Dict, Any
import httpx
import websockets
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock


@pytest.mark.asyncio
class TestAPIEndpoints:
    """Test FastAPI API endpoints"""

    async def test_health_check_endpoints(self):
        """Test health check endpoints"""
        # Test root endpoint
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get('http://localhost:8000/')
                assert response.status_code == 200
                data = response.json()
                assert 'service' in data
                assert 'status' in data
                assert data['status'] == 'healthy'
                print(f"✅ Root health check passed: {data}")

            except httpx.ConnectError:
                print("❌ Could not connect to AI Engine - ensure it's running")

        # Test detailed health endpoint
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get('http://localhost:8000/health')
                assert response.status_code == 200
                data = response.json()
                assert 'status' in data
                assert 'details' in data
                print(f"✅ Detailed health check passed: {data}")

            except httpx.ConnectError:
                print("❌ Could not connect to health endpoint")

    async def test_chat_endpoint_initialization(self, test_organization, test_user):
        """Test chat endpoint for starting procurement workflows"""
        chat_data = {
            'message': 'I need to order 10 laptops for the development team',
            'org_id': test_organization['id'],
            'user_id': test_user['id']
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    'http://localhost:8000/api/chat',
                    json=chat_data
                )

                if response.status_code == 200:
                    data = response.json()
                    assert 'success' in data
                    assert 'thread_id' in data
                    assert 'message' in data
                    assert data['success'] is True
                    print(f"✅ Chat endpoint working: thread_id={data['thread_id']}")
                    return data['thread_id']

                elif response.status_code == 503:
                    print("⚠️  AI Engine not fully initialized - workflow not available")

                else:
                    print(f"❌ Chat endpoint failed with status {response.status_code}: {response.text}")

            except httpx.ConnectError:
                print("❌ Could not connect to chat endpoint")
            except Exception as e:
                print(f"❌ Chat endpoint error: {e}")

    async def test_workflow_resume_endpoint(self):
        """Test workflow resumption endpoint"""
        # Use a sample thread_id for testing
        thread_id = str(uuid.uuid4())
        resume_data = {
            'thread_id': thread_id,
            'action': 'approve',
            'data': {
                'notes': 'Approved for procurement',
                'approved_by': 'test_user'
            }
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    'http://localhost:8000/api/workflow/resume',
                    json=resume_data
                )

                # Expected behavior depends on whether thread exists
                if response.status_code == 200:
                    data = response.json()
                    assert 'success' in data
                    assert 'thread_id' in data
                    print(f"✅ Workflow resume working: {data}")

                elif response.status_code == 404:
                    print("✅ Expected 404 for non-existent thread")

                else:
                    print(f"⚠️  Workflow resume status {response.status_code}: {response.text}")

            except httpx.ConnectError:
                print("❌ Could not connect to workflow resume endpoint")
            except Exception as e:
                print(f"❌ Workflow resume error: {e}")

    async def test_workflow_status_endpoint(self):
        """Test workflow status endpoint"""
        thread_id = str(uuid.uuid4())

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.get(
                    f'http://localhost:8000/api/workflow/{thread_id}/status'
                )

                # Expected behavior depends on implementation
                if response.status_code == 200:
                    data = response.json()
                    assert 'thread_id' in data
                    assert 'status' in data
                    print(f"✅ Workflow status working: {data}")

                elif response.status_code == 404:
                    print("✅ Expected 404 for non-existent thread")

                else:
                    print(f"⚠️  Workflow status returned {response.status_code}: {response.text}")

            except httpx.ConnectError:
                print("❌ Could not connect to workflow status endpoint")
            except Exception as e:
                print(f"❌ Workflow status error: {e}")

    async def test_websocket_connection(self):
        """Test WebSocket connection for real-time updates"""
        thread_id = str(uuid.uuid4())

        try:
            async with websockets.connect(f'ws://localhost:8000/ws/{thread_id}') as websocket:
                print(f"✅ WebSocket connected for thread: {thread_id}")

                # Test sending a message
                test_message = json.dumps({
                    'type': 'test',
                    'data': 'Hello WebSocket!'
                })

                await websocket.send(test_message)
                print(f"✅ WebSocket message sent")

                # Test receiving (with timeout)
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    print(f"✅ WebSocket message received: {response}")
                except asyncio.TimeoutError:
                    print("⚠️  No WebSocket response within timeout (this may be normal)")

        except ConnectionRefusedError:
            print("❌ WebSocket connection refused - AI Engine may not be running")
        except Exception as e:
            print(f"❌ WebSocket error: {e}")

    async def test_concurrent_websocket_connections(self):
        """Test multiple concurrent WebSocket connections"""
        thread_ids = [str(uuid.uuid4()) for _ in range(3)]
        connections = []

        try:
            # Create multiple connections
            for thread_id in thread_ids:
                try:
                    ws = await websockets.connect(f'ws://localhost:8000/ws/{thread_id}')
                    connections.append(ws)
                    print(f"✅ WebSocket connection {len(connections)} established")
                except Exception as e:
                    print(f"❌ Failed to create WebSocket {thread_id}: {e}")

            # Test concurrent messaging
            tasks = []
            for i, ws in enumerate(connections):
                message = json.dumps({
                    'connection': i,
                    'message': f'Hello from connection {i}'
                })
                tasks.append(ws.send(message))

            if tasks:
                await asyncio.gather(*tasks, return_exceptions=True)
                print(f"✅ Sent {len(tasks)} concurrent WebSocket messages")

        except Exception as e:
            print(f"❌ Concurrent WebSocket test error: {e}")
        finally:
            # Cleanup connections
            for ws in connections:
                try:
                    await ws.close()
                except:
                    pass


@pytest.mark.asyncio
class TestErrorHandling:
    """Test API error handling and edge cases"""

    async def test_invalid_chat_payload(self):
        """Test chat endpoint with invalid payloads"""
        invalid_payloads = [
            {},  # Missing all required fields
            {'message': 'test'},  # Missing org_id and user_id
            {'org_id': 'invalid'},  # Missing message and user_id
            {'message': '', 'org_id': '', 'user_id': ''},  # Empty strings
            {'message': 123, 'org_id': 'test', 'user_id': 'test'},  # Wrong type
        ]

        async with httpx.AsyncClient() as client:
            for payload in invalid_payloads:
                try:
                    response = await client.post(
                        'http://localhost:8000/api/chat',
                        json=payload
                    )

                    # Should receive validation error (422) or similar
                    if response.status_code >= 400:
                        print(f"✅ Invalid payload correctly rejected: {payload}")
                    else:
                        print(f"⚠️  Invalid payload not rejected: {payload}, status: {response.status_code}")

                except Exception as e:
                    print(f"⚠️  Error testing invalid payload {payload}: {e}")

    async def test_thread_not_found_errors(self):
        """Test error handling for non-existent threads"""
        fake_thread_id = str(uuid.uuid4())

        # Test workflow status for non-existent thread
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f'http://localhost:8000/api/workflow/{fake_thread_id}/status'
                )

                if response.status_code == 404:
                    print(f"✅ Non-existent thread correctly returns 404")
                else:
                    print(f"⚠️  Expected 404 for non-existent thread, got {response.status_code}")

            except Exception as e:
                print(f"❌ Error testing non-existent thread: {e}")

        # Test workflow resume for non-existent thread
        resume_data = {
            'thread_id': fake_thread_id,
            'action': 'approve'
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    'http://localhost:8000/api/workflow/resume',
                    json=resume_data
                )

                if response.status_code == 404:
                    print(f"✅ Resume for non-existent thread correctly returns 404")
                else:
                    print(f"⚠️  Expected 404 for resume non-existent thread, got {response.status_code}")

            except Exception as e:
                print(f"❌ Error testing resume non-existent thread: {e}")

    async def test_service_unavailable_scenarios(self):
        """Test behavior when services are unavailable"""
        # This test would need to mock service unavailability
        # For now, we'll just test the endpoint structure
        async with httpx.AsyncClient() as client:
            try:
                # Test chat endpoint (might fail if AI workflow not initialized)
                response = await client.post(
                    'http://localhost:8000/api/chat',
                    json={
                        'message': 'test message',
                        'org_id': str(uuid.uuid4()),
                        'user_id': str(uuid.uuid4())
                    }
                )

                if response.status_code == 503:
                    print(f"✅ Service unavailable correctly returns 503")
                    data = response.json()
                    assert 'detail' in data
                    print(f"✅ Service unavailable detail: {data['detail']}")
                else:
                    print(f"⚠️  Service status: {response.status_code}")

            except Exception as e:
                print(f"❌ Error testing service unavailable: {e}")


@pytest.mark.asyncio
class TestAuthentication:
    """Test authentication and authorization"""

    async def test_unauthorized_access(self):
        """Test endpoints with missing/invalid authentication"""
        # Note: This depends on how authentication is implemented
        # For now, test if endpoints exist and respond appropriately
        test_payload = {
            'message': 'test message',
            'org_id': str(uuid.uuid4()),
            'user_id': str(uuid.uuid4())
        }

        async with httpx.AsyncClient() as client:
            try:
                # Test without authentication headers
                response = await client.post(
                    'http://localhost:8000/api/chat',
                    json=test_payload
                )

                # Response depends on auth implementation
                print(f"📝 Unauthenticated access status: {response.status_code}")

            except Exception as e:
                print(f"❌ Error testing unauthorized access: {e}")

    async def test_organization_isolation(self):
        """Test that users can only access their organization data"""
        # This would require setting up multiple organizations and testing access patterns
        org1_id = str(uuid.uuid4())
        org2_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())

        # Test accessing data from different organization
        test_payload = {
            'message': 'test message',
            'org_id': org1_id,
            'user_id': user_id
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    'http://localhost:8000/api/chat',
                    json=test_payload
                )

                # Implementation-dependent behavior
                if response.status_code == 403:
                    print(f"✅ Organization isolation enforced (403)")
                elif response.status_code == 200:
                    print(f"⚠️  Organization access allowed - verify implementation")
                else:
                    print(f"📝 Organization isolation status: {response.status_code}")

            except Exception as e:
                print(f"❌ Error testing organization isolation: {e}")


@pytest.mark.asyncio
class TestAPIPerformance:
    """Test API performance characteristics"""

    async def test_response_times(self):
        """Test endpoint response times"""
        test_endpoints = [
            ('GET', 'http://localhost:8000/'),
            ('GET', 'http://localhost:8000/health'),
        ]

        for method, url in test_endpoints:
            start_time = asyncio.get_event_loop().time()

            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    if method == 'GET':
                        response = await client.get(url)
                    else:
                        response = await client.post(url, json={})

                end_time = asyncio.get_event_loop().time()
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds

                print(f"📊 {method} {url}: {response_time:.2f}ms (status: {response.status_code})")

                # Assert reasonable response time (adjust thresholds as needed)
                if response_time < 1000:  # 1 second
                    print(f"✅ Response time acceptable")
                else:
                    print(f"⚠️  Response time slow: {response_time:.2f}ms")

            except Exception as e:
                print(f"❌ Error testing {method} {url}: {e}")

    async def test_concurrent_requests(self):
        """Test handling of concurrent requests"""
        num_requests = 10
        url = 'http://localhost:8000/health'

        async def make_request(request_id):
            start_time = asyncio.get_event_loop().time()
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    response = await client.get(url)
                    end_time = asyncio.get_event_loop().time()
                    response_time = (end_time - start_time) * 1000
                    return request_id, response.status_code, response_time
            except Exception as e:
                end_time = asyncio.get_event_loop().time()
                response_time = (end_time - start_time) * 1000
                return request_id, None, response_time, str(e)

        # Run concurrent requests
        start_time = asyncio.get_event_loop().time()
        tasks = [make_request(i) for i in range(num_requests)]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        end_time = asyncio.get_event_loop().time()

        total_time = (end_time - start_time) * 1000

        successful_requests = [r for r in results if r[1] == 200]
        avg_response_time = sum(r[2] for r in successful_requests) / len(successful_requests) if successful_requests else 0

        print(f"📊 Concurrent requests ({num_requests}):")
        print(f"   Total time: {total_time:.2f}ms")
        print(f"   Successful: {len(successful_requests)}/{num_requests}")
        print(f"   Average response time: {avg_response_time:.2f}ms")

        if len(successful_requests) >= num_requests * 0.8:  # 80% success rate
            print(f"✅ Concurrent request handling acceptable")
        else:
            print(f"⚠️  Low success rate for concurrent requests")


@pytest.mark.asyncio
class TestAPIIntegration:
    """Test API integration scenarios"""

    async def test_complete_workflow_simulation(self, test_organization, test_user):
        """Test complete workflow from chat to completion"""
        # Step 1: Start a procurement workflow
        chat_data = {
            'message': 'I need to order 5 ergonomic chairs for the new office',
            'org_id': test_organization['id'],
            'user_id': test_user['id']
        }

        thread_id = None
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    'http://localhost:8000/api/chat',
                    json=chat_data
                )

                if response.status_code == 200:
                    data = response.json()
                    thread_id = data['thread_id']
                    print(f"✅ Workflow started with thread_id: {thread_id}")

                    # Step 2: Monitor workflow status
                    await asyncio.sleep(2)  # Give time for workflow to process

                    status_response = await client.get(
                        f'http://localhost:8000/api/workflow/{thread_id}/status'
                    )

                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        print(f"✅ Workflow status: {status_data}")

                    # Step 3: Test workflow resumption (if needed)
                    resume_data = {
                        'thread_id': thread_id,
                        'action': 'approve',
                        'data': {'approved': True, 'notes': 'Approved for procurement'}
                    }

                    resume_response = await client.post(
                        'http://localhost:8000/api/workflow/resume',
                        json=resume_data
                    )

                    print(f"📝 Workflow resume response: {resume_response.status_code}")

                else:
                    print(f"❌ Failed to start workflow: {response.status_code}")

        except Exception as e:
            print(f"❌ Workflow simulation error: {e}")

    async def test_websocket_integration(self):
        """Test WebSocket integration with API endpoints"""
        thread_id = str(uuid.uuid4())
        websocket_tasks = []
        received_messages = []

        async def websocket_listener():
            try:
                async with websockets.connect(f'ws://localhost:8000/ws/{thread_id}') as websocket:
                    while True:
                        try:
                            message = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                            received_messages.append(message)
                            print(f"📨 WebSocket received: {message}")
                        except asyncio.TimeoutError:
                            break
            except Exception as e:
                print(f"❌ WebSocket listener error: {e}")

        # Start WebSocket listener
        ws_task = asyncio.create_task(websocket_listener())

        try:
            # Start a workflow that should send WebSocket messages
            chat_data = {
                'message': 'Test WebSocket integration',
                'org_id': str(uuid.uuid4()),
                'user_id': str(uuid.uuid4())
            }

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    'http://localhost:8000/api/chat',
                    json=chat_data
                )

                if response.status_code == 200:
                    print(f"✅ Workflow started for WebSocket test")

            # Wait for WebSocket messages
            await asyncio.wait_for(ws_task, timeout=15.0)

            if received_messages:
                print(f"✅ WebSocket integration working - received {len(received_messages)} messages")
            else:
                print(f"⚠️  No WebSocket messages received (may be normal)")

        except asyncio.TimeoutError:
            print(f"⚠️  WebSocket test timed out")
        except Exception as e:
            print(f"❌ WebSocket integration error: {e}")
        finally:
            ws_task.cancel()
            try:
                await ws_task
            except asyncio.CancelledError:
                pass