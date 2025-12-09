"""
Comprehensive End-to-End Testing Script for SupplyGraph Platform
Tests all PRD requirements using Python requests and websockets
"""

import requests
import websocket
import json
import time
import io
import csv
from typing import Dict, List, Any
import base64

class SupplyGraphTester:
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.frontend_url = "http://localhost:3000"
        self.test_results = []

    def log_result(self, test_name: str, passed: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        result = f"{status} - {test_name}"
        if details:
            result += f": {details}"
        print(result)
        self.test_results.append({
            "test": test_name,
            "passed": passed,
            "details": details
        })

    def test_backend_health(self):
        """Test if backend is running"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            if response.status_code == 200:
                self.log_result("Backend Health Check", True, f"Status: {response.json()}")
            else:
                self.log_result("Backend Health Check", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Backend Health Check", False, str(e))

    def test_frontend_running(self):
        """Test if frontend is running"""
        try:
            response = requests.get(self.frontend_url, timeout=5)
            if "SupplyGraph" in response.text:
                self.log_result("Frontend Running", True, "Frontend loaded successfully")
            else:
                self.log_result("Frontend Running", False, "Frontend not showing correct content")
        except Exception as e:
            self.log_result("Frontend Running", False, str(e))

    def test_api_stats(self):
        """Test /api/stats endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/stats")
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_requests", "savings_amount", "in_progress", "active_vendors"]
                if all(field in data for field in required_fields):
                    self.log_result("Stats API", True, f"Returned {len(data)} fields")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Stats API", False, f"Missing fields: {missing}")
            else:
                self.log_result("Stats API", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Stats API", False, str(e))

    def test_api_ai_insights(self):
        """Test /api/ai-insights endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/ai-insights")
            if response.status_code == 200:
                data = response.json()
                if "insights" in data and isinstance(data["insights"], list):
                    self.log_result("AI Insights API", True, f"Returned {len(data['insights'])} insights")
                else:
                    self.log_result("AI Insights API", False, "Invalid response format")
            else:
                self.log_result("AI Insights API", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("AI Insights API", False, str(e))

    def test_api_requests(self):
        """Test /api/requests endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/requests")
            if response.status_code == 200:
                data = response.json()
                if "requests" in data and isinstance(data["requests"], list):
                    self.log_result("Requests API", True, f"Returned {len(data['requests'])} requests")
                    # Check request structure
                    if data["requests"]:
                        req = data["requests"][0]
                        required_fields = ["id", "item_name", "category", "quantity", "status", "priority"]
                        if all(field in req for field in required_fields):
                            self.log_result("Request Structure", True, "All required fields present")
                        else:
                            missing = [f for f in required_fields if f not in req]
                            self.log_result("Request Structure", False, f"Missing: {missing}")
                else:
                    self.log_result("Requests API", False, "Invalid response format")
            else:
                self.log_result("Requests API", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Requests API", False, str(e))

    def test_email_endpoint(self):
        """Test /api/email endpoint"""
        try:
            email_data = {
                "to": "test@example.com",
                "subject": "Test Email",
                "body": "This is a test email from SupplyGraph",
                "vendor_id": "vendor-123"
            }
            response = requests.post(f"{self.base_url}/api/email", json=email_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_result("Email API", True, "Email endpoint working")
                else:
                    self.log_result("Email API", False, "Email send failed")
            else:
                self.log_result("Email API", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Email API", False, str(e))

    def create_test_csv(self):
        """Create a test CSV file in memory"""
        csv_data = [
            ["item_name", "category", "quantity", "unit_price", "priority", "description"],
            ["Office Chairs", "Furniture", "10", "150.00", "HIGH", "Ergonomic office chairs"],
            ["Laptops", "IT Equipment", "5", "1200.00", "MEDIUM", "Dell Latitude laptops"],
            ["Safety Helmets", "Safety", "20", "45.00", "CRITICAL", "Construction site safety"]
        ]

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerows(csv_data)
        return output.getvalue()

    def test_csv_upload(self):
        """Test CSV upload functionality"""
        try:
            csv_content = self.create_test_csv()

            # Prepare file for upload
            files = {
                'file': ('test.csv', csv_content, 'text/csv')
            }

            response = requests.post(f"{self.base_url}/api/upload-csv", files=files)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_result("CSV Upload", True, data.get("message", "Upload successful"))
                else:
                    self.log_result("CSV Upload", False, "Upload failed")
            else:
                self.log_result("CSV Upload", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("CSV Upload", False, str(e))

    def test_websocket_connection(self):
        """Test WebSocket connection for real-time communication"""
        def on_message(ws, message):
            data = json.loads(message)
            if data.get("type") == "ai_response":
                self.ws_connected = True
                self.ws_response = data

        def on_error(ws, error):
            self.log_result("WebSocket", False, f"Error: {error}")

        def on_close(ws, close_status_code, close_msg):
            pass

        def on_open(ws):
            ws.send(json.dumps({
                "message": "Hello from test",
                "org_id": "test-org",
                "user_id": "test-user"
            }))

        try:
            self.ws_connected = False
            self.ws_response = None

            ws = websocket.WebSocketApp(
                "ws://localhost:8000/ws",
                on_open=on_open,
                on_message=on_message,
                on_error=on_error,
                on_close=on_close
            )

            # Run for 3 seconds
            ws.run_forever(ping_interval=30, ping_timeout=10)
            time.sleep(3)

            if self.ws_connected:
                self.log_result("WebSocket", True, "Real-time communication working")
            else:
                self.log_result("WebSocket", False, "No response received")
        except Exception as e:
            self.log_result("WebSocket", False, str(e))

    def test_request_details(self):
        """Test individual request endpoint"""
        try:
            # First get all requests
            response = requests.get(f"{self.base_url}/api/requests")
            if response.status_code == 200:
                data = response.json()
                if data["requests"]:
                    # Get first request's ID
                    request_id = data["requests"][0]["id"]

                    # Get specific request
                    detail_response = requests.get(f"{self.base_url}/api/requests/{request_id}")
                    if detail_response.status_code == 200:
                        self.log_result("Request Details", True, f"Retrieved request {request_id}")
                    else:
                        self.log_result("Request Details", False, f"Status code: {detail_response.status_code}")
                else:
                    self.log_result("Request Details", False, "No requests found")
            else:
                self.log_result("Request Details", False, "Could not get requests list")
        except Exception as e:
            self.log_result("Request Details", False, str(e))

    def generate_summary(self):
        """Generate test summary report"""
        total = len(self.test_results)
        passed = sum(1 for r in self.test_results if r["passed"])
        failed = total - passed

        print("\n" + "="*60)
        print("TEST SUMMARY REPORT")
        print("="*60)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed} ({passed/total*100:.1f}%)")
        print(f"Failed: {failed} ({failed/total*100:.1f}%)")
        print("="*60)

        if failed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result["passed"]:
                    print(f"  - {result['test']}: {result['details']}")

        print("\n" + "="*60)
        print("PRD REQUIREMENTS STATUS:")
        print("="*60)

        # Check specific requirements
        req_statuses = {
            "Dashboard Stats Cards": any("Stats API" in r["test"] and r["passed"] for r in self.test_results),
            "AI Insights Panel": any("AI Insights" in r["test"] and r["passed"] for r in self.test_results),
            "Recent Requests Table": any("Requests API" in r["test"] and r["passed"] for r in self.test_results),
            "Status Badges": any("Request Structure" in r["test"] and r["passed"] for r in self.test_results),
            "CSV Upload": any("CSV Upload" in r["test"] and r["passed"] for r in self.test_results),
            "WebSocket Connection": any("WebSocket" in r["test"] and r["passed"] for r in self.test_results),
            "Email Endpoint": any("Email" in r["test"] and r["passed"] for r in self.test_results),
            "Backend Health": any("Backend Health" in r["test"] and r["passed"] for r in self.test_results),
            "Frontend Running": any("Frontend Running" in r["test"] and r["passed"] for r in self.test_results)
        }

        for req, status in req_statuses.items():
            icon = "✅" if status else "❌"
            print(f"{icon} {req}")

    def run_all_tests(self):
        """Run all end-to-end tests"""
        print("\n🚀 Starting SupplyGraph E2E Tests")
        print("="*60)

        # Infrastructure tests
        self.test_backend_health()
        self.test_frontend_running()

        # API endpoint tests
        self.test_api_stats()
        self.test_api_ai_insights()
        self.test_api_requests()
        self.test_email_endpoint()
        self.test_csv_upload()

        # Feature tests
        self.test_request_details()
        self.test_websocket_connection()

        # Generate summary
        self.generate_summary()

# Run tests
if __name__ == "__main__":
    tester = SupplyGraphTester()
    tester.run_all_tests()