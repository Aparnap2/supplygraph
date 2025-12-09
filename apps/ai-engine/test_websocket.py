#!/usr/bin/env python3
"""
Test WebSocket connection to AI Engine
"""
import asyncio
import websockets
import json
import uuid

async def test_websocket():
    """Test WebSocket connection and workflow execution"""
    uri = "ws://localhost:8000/ws"

    try:
        print("🔌 Connecting to WebSocket...")
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to WebSocket")

            # Send a procurement request
            request = {
                "type": "workflow_start",
                "data": {
                    "message": "I need to purchase 25 laptops for my team",
                    "org_id": "test-org-123",
                    "user_id": "test-user-456",
                    "thread_id": str(uuid.uuid4())
                }
            }

            print(f"📤 Sending: {json.dumps(request, indent=2)}")
            await websocket.send(json.dumps(request))

            # Listen for responses
            print("📥 Listening for responses...")
            timeout = 30  # 30 seconds timeout
            response_count = 0

            try:
                while response_count < 10:  # Limit responses for testing
                    message = await asyncio.wait_for(websocket.recv(), timeout=timeout)
                    response = json.loads(message)
                    response_count += 1

                    print(f"📩 Response {response_count}:")
                    print(json.dumps(response, indent=2))

                    # Check if workflow completed
                    if response.get("type") == "workflow_complete":
                        print("✅ Workflow completed successfully!")
                        break

            except asyncio.TimeoutError:
                print(f"⏰ Timeout after {timeout} seconds")

    except Exception as e:
        print(f"❌ WebSocket error: {e}")
        return False

    return True

if __name__ == "__main__":
    print("🧪 Testing AI Engine WebSocket...")
    result = asyncio.run(test_websocket())
    if result:
        print("✅ WebSocket test passed!")
    else:
        print("❌ WebSocket test failed!")