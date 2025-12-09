"""
Test script to verify AGUI integration with procurement workflow
"""
import asyncio
import uuid
from src.workflows.procurement import ProcurementWorkflow

async def test_agui_integration():
    """Test that UI components are properly emitted"""

    # Initialize workflow with test credentials
    workflow = ProcurementWorkflow(
        openai_api_key="test-key",
        db_connection_string="postgresql://test"
    )

    # Generate a thread ID
    thread_id = str(uuid.uuid4())

    print("Starting AGUI integration test...")
    print(f"Thread ID: {thread_id}")

    # Run workflow with test message
    events = []
    async for event in workflow.run(
        initial_message="Buy 50 laptops for the office",
        org_id="test_org_123",
        user_id="test_user_456",
        thread_id=thread_id
    ):
        events.append(event)
        print(f"\nEvent from node: {list(event.keys())}")

        # Check for UI components
        for node_name, node_data in event.items():
            if "ui" in node_data:
                print(f"  UI Components from {node_name}:")
                for ui_msg in node_data["ui"]:
                    print(f"    - Type: {ui_msg.get('type', 'unknown')}")
                    print(f"    - ID: {ui_msg.get('id', 'no-id')}")

            # Check for messages
            if "messages" in node_data:
                print(f"  Messages from {node_name}:")
                for msg in node_data["messages"]:
                    print(f"    - {msg.type}: {msg.content[:50]}...")

            # Check for interrupts
            if "__interrupt__" in node_data:
                print(f"  INTERRUPT in {node_name}:")
                print(f"    {node_data['__interrupt__']}")

    print(f"\nTest complete. Total events: {len(events)}")
    return events

if __name__ == "__main__":
    asyncio.run(test_agui_integration())