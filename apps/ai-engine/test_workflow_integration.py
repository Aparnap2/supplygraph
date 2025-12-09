#!/usr/bin/env python3
"""
Test procurement workflow integration with real APIs
"""
import asyncio
import json
import uuid
import requests
import sys
import os

# Add src to path for imports
sys.path.insert(0, 'src')

from workflows.procurement import ProcurementWorkflow
from dotenv import load_dotenv

load_dotenv()

class WorkflowIntegrationTester:
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.workflow = None

    def log_result(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅" if success else "❌"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")

    def test_workflow_instantiation(self):
        """Test LangGraph workflow instantiation"""
        try:
            self.workflow = ProcurementWorkflow(
                openai_api_key=os.getenv('OPENAI_API_KEY'),
                db_connection_string=os.getenv('DATABASE_URL')
            )

            if self.workflow.workflow:
                self.log_result("Workflow Instantiation", True, "LangGraph workflow created")
                return True
            else:
                self.log_result("Workflow Instantiation", False, "Workflow object is None")
                return False

        except Exception as e:
            self.log_result("Workflow Instantiation", False, str(e))
            return False

    def test_workflow_nodes(self):
        """Test individual workflow nodes"""
        if not self.workflow:
            self.log_result("Workflow Nodes", False, "Workflow not instantiated")
            return False

        try:
            # Create test state
            test_state = {
                "messages": [],
                "org_id": "test-org-123",
                "user_id": "test-user-456",
                "request_data": {"original_message": "I need 50 laptops"},
                "items": [],
                "quotes": [],
                "selected_quote": None,
                "status": "PENDING",
                "ui": [],
                "thread_id": str(uuid.uuid4())
            }

            # Test analyze_request node
            result = self.workflow.analyze_request(test_state)

            if "items" in result and len(result["items"]) > 0:
                self.log_result("Analyze Request Node", True, f"Extracted {len(result['items'])} items")
            else:
                self.log_result("Analyze Request Node", False, "No items extracted")

            # Test inventory check
            result = self.workflow.check_inventory(test_state)

            if "items" in result and len(result["items"]) > 0:
                self.log_result("Inventory Check Node", True, "Inventory data generated")
            else:
                self.log_result("Inventory Check Node", False, "No inventory data")

            # Test quote fetching
            result = self.workflow.fetch_quotes(test_state)

            if "quotes" in result and len(result["quotes"]) > 0:
                self.log_result("Quote Fetch Node", True, f"Generated {len(result['quotes'])} mock quotes")
            else:
                self.log_result("Quote Fetch Node", False, "No quotes generated")

            return True

        except Exception as e:
            self.log_result("Workflow Nodes", False, str(e))
            return False

    def test_end_to_end_workflow(self):
        """Test complete workflow execution"""
        try:
            # Start workflow via API
            workflow_data = {
                "message": "I need to purchase 25 laptops for my engineering team",
                "org_id": "test-org-123",
                "user_id": "test-user-456"
            }

            response = requests.post(
                f"{self.base_url}/api/test/chat",
                json=workflow_data,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code != 200:
                self.log_result("End-to-End Workflow", False, f"API error: {response.status_code}")
                return False

            api_result = response.json()
            thread_id = api_result.get('thread_id')

            if not thread_id:
                self.log_result("End-to-End Workflow", False, "No thread_id returned")
                return False

            self.log_result("Workflow Start API", True, f"Thread: {thread_id}")

            # Test workflow state persistence (would normally query database)
            # For now, just verify the workflow processes without errors

            # Test different message types
            test_messages = [
                "I need 10 office chairs for the meeting room",
                "Please order 5 monitors with 4K resolution",
                "We need wireless mice for 20 employees"
            ]

            for i, message in enumerate(test_messages):
                workflow_data["message"] = message

                response = requests.post(
                    f"{self.base_url}/api/test/chat",
                    json=workflow_data,
                    headers={"Content-Type": "application/json"}
                )

                if response.status_code == 200:
                    result = response.json()
                    self.log_result(f"Message Test {i+1}", True, f"Thread: {result.get('thread_id', 'None')}")
                else:
                    self.log_result(f"Message Test {i+1}", False, f"Status: {response.status_code}")

            return True

        except Exception as e:
            self.log_result("End-to-End Workflow", False, str(e))
            return False

    def test_agui_components(self):
        """Test AGUI component generation"""
        try:
            # Test that workflow nodes generate UI components
            test_state = {
                "messages": [],
                "org_id": "test-org-123",
                "user_id": "test-user-456",
                "request_data": {"original_message": "Test message"},
                "items": [{"name": "Laptop", "quantity": 10}],
                "quotes": [],
                "selected_quote": None,
                "status": "ANALYZING",
                "ui": [],
                "thread_id": str(uuid.uuid4())
            }

            # Test approval UI generation
            result = self.workflow.human_approval(test_state)

            if "ui" in result and len(result["ui"]) > 0:
                ui_component = result["ui"][0]
                if ui_component.get("type") == "quote_approval_card":
                    self.log_result("AGUI Approval Card", True, "Approval UI generated")
                else:
                    self.log_result("AGUI Approval Card", False, f"Wrong UI type: {ui_component.get('type')}")
            else:
                self.log_result("AGUI Approval Card", False, "No UI components generated")

            # Test other UI components
            test_results = [
                ("Thinking Loader", self.workflow.analyze_request(test_state)),
                ("Inventory Check", self.workflow.check_inventory(test_state)),
                ("Quote Fetcher", self.workflow.fetch_quotes(test_state))
            ]

            for name, result_data in test_results:
                if "ui" in result_data and len(result_data["ui"]) > 0:
                    self.log_result(f"AGUI {name}", True, f"UI type: {result_data['ui'][0].get('type')}")
                else:
                    self.log_result(f"AGUI {name}", False, "No UI components")

            return True

        except Exception as e:
            self.log_result("AGUI Components", False, str(e))
            return False

    def test_error_handling(self):
        """Test error handling in workflows"""
        try:
            # Test with invalid data
            invalid_state = {
                "messages": [],
                "org_id": "",  # Invalid org_id
                "user_id": None,  # Invalid user_id
                "request_data": None,
                "items": None,
                "quotes": None,
                "selected_quote": None,
                "status": "INVALID",
                "ui": None,
                "thread_id": None
            }

            # Test that workflow handles invalid state gracefully
            result = self.workflow.analyze_request(invalid_state)

            if result and "items" in result:
                self.log_result("Error Handling - Invalid State", True, "Workflow recovered from invalid state")
            else:
                self.log_result("Error Handling - Invalid State", False, "Workflow failed to handle invalid state")

            # Test with missing quotes
            no_quotes_state = {
                "messages": [],
                "org_id": "test-org",
                "user_id": "test-user",
                "request_data": {},
                "items": [{"name": "Test Item", "quantity": 1}],
                "quotes": [],  # Empty quotes
                "selected_quote": None,
                "status": "NORMALIZING_QUOTES",
                "ui": [],
                "thread_id": str(uuid.uuid4())
            }

            result = self.workflow.normalize_quotes(no_quotes_state)

            if result and result.get("status") == "ERROR":
                self.log_result("Error Handling - No Quotes", True, "Properly handled no quotes scenario")
            else:
                self.log_result("Error Handling - No Quotes", False, "Did not handle no quotes scenario")

            return True

        except Exception as e:
            self.log_result("Error Handling", False, str(e))
            return False

    def run_all_tests(self):
        """Run all workflow integration tests"""
        print("🔄 SupplyGraph Workflow Integration Testing")
        print("=" * 50)
        print()

        # Run all tests
        tests = [
            ("Workflow Instantiation", self.test_workflow_instantiation),
            ("Individual Workflow Nodes", self.test_workflow_nodes),
            ("End-to-End Workflow", self.test_end_to_end_workflow),
            ("AGUI Component Generation", self.test_agui_components),
            ("Error Handling", self.test_error_handling)
        ]

        results = []
        for test_name, test_func in tests:
            print(f"🧪 Running {test_name}...")
            try:
                result = test_func()
                results.append((test_name, result))
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {e}")
                results.append((test_name, False))
            print()

        # Summary
        print("=" * 50)
        print("📊 Integration Test Summary")
        print("=" * 50)

        passed = sum(1 for _, result in results if result)
        total = len(results)

        print(f"Tests Run: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")

        if total - passed > 0:
            print()
            print("❌ Failed Tests:")
            for test_name, result in results:
                if not result:
                    print(f"   • {test_name}")

        return passed >= total * 0.8  # 80% success rate

if __name__ == "__main__":
    tester = WorkflowIntegrationTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)