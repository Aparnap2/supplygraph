#!/usr/bin/env python3
"""
Comprehensive test of SupplyGraph AI Engine core functionality
"""
import asyncio
import json
import uuid
import time
import os
from datetime import datetime
import requests
import asyncpg
from dotenv import load_dotenv

load_dotenv()

class SupplyGraphTester:
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.test_results = []

    def log_result(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅" if success else "❌"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    async def test_database_connection(self):
        """Test PostgreSQL database connection"""
        try:
            db_url = os.getenv('DATABASE_URL')
            conn = await asyncpg.connect(db_url)

            # Test basic query
            version = await conn.fetchval('SELECT version()')
            self.log_result("Database Connection", True, f"PostgreSQL {version.split()[1]}")

            # Test table creation
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS workflow_tests (
                    id SERIAL PRIMARY KEY,
                    thread_id VARCHAR(255),
                    status VARCHAR(50),
                    created_at TIMESTAMP DEFAULT NOW()
                )
            ''')
            self.log_result("Database Operations", True, "Tables can be created")

            await conn.close()

        except Exception as e:
            self.log_result("Database Connection", False, str(e))

    def test_health_endpoints(self):
        """Test FastAPI health endpoints"""
        try:
            # Root endpoint
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                self.log_result("Health Check", True, f"Service: {data.get('service')}")
            else:
                self.log_result("Health Check", False, f"Status: {response.status_code}")

            # Health detailed endpoint
            response = requests.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                self.log_result("Detailed Health", True, f"All services: {data.get('details')}")
            else:
                self.log_result("Detailed Health", False, f"Status: {response.status_code}")

        except Exception as e:
            self.log_result("Health Endpoints", False, str(e))

    def test_workflow_api(self):
        """Test procurement workflow API endpoints"""
        try:
            # Test workflow start
            workflow_data = {
                "message": "I need to purchase 30 laptops for my team",
                "org_id": "test-org-123",
                "user_id": "test-user-456"
            }

            response = requests.post(
                f"{self.base_url}/api/test/chat",
                json=workflow_data,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                data = response.json()
                thread_id = data.get('thread_id')
                self.log_result("Workflow Start", True, f"Thread ID: {thread_id}")
                return thread_id
            else:
                self.log_result("Workflow Start", False, f"Status: {response.status_code}")
                return None

        except Exception as e:
            self.log_result("Workflow API", False, str(e))
            return None

    def test_valkey_connection(self):
        """Test Valkey (Redis) connection"""
        try:
            import redis
            valkey_url = os.getenv('VALKEY_URL', 'valkey://localhost:6379')

            # Parse URL for redis-py
            if valkey_url.startswith('valkey://'):
                valkey_url = valkey_url.replace('valkey://', 'redis://')

            client = redis.from_url(valkey_url)

            # Test basic operations
            test_key = f"test_key_{int(time.time())}"
            client.set(test_key, "test_value", ex=10)
            value = client.get(test_key)

            if value == b"test_value":
                self.log_result("Valkey Connection", True, "Read/Write operations work")
            else:
                self.log_result("Valkey Connection", False, "Value mismatch")

            client.delete(test_key)
            client.close()

        except Exception as e:
            self.log_result("Valkey Connection", False, str(e))

    def test_ai_components(self):
        """Test AI/LLM components"""
        try:
            from workflows.procurement import ProcurementWorkflow
            from langchain_openai import ChatOpenAI

            # Test OpenAI API key presence
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key and api_key != 'sk-test-key-placeholder':
                self.log_result("OpenAI API Key", True, "API key is configured")
            else:
                self.log_result("OpenAI API Key", False, "Invalid or missing API key")

            # Test workflow instantiation
            workflow = ProcurementWorkflow(
                openai_api_key=api_key or "sk-test",
                db_connection_string=os.getenv('DATABASE_URL')
            )

            if workflow.workflow:
                self.log_result("LangGraph Workflow", True, "Workflow instantiated successfully")
            else:
                self.log_result("LangGraph Workflow", False, "Workflow instantiation failed")

        except Exception as e:
            self.log_result("AI Components", False, str(e))

    def test_third_party_config(self):
        """Test third-party API configurations"""
        try:
            # Check Stripe configuration
            stripe_key = os.getenv('STRIPE_API_KEY')
            if stripe_key and stripe_key.startswith('sk_test_'):
                self.log_result("Stripe Config", True, "Test mode configured")
            elif stripe_key:
                self.log_result("Stripe Config", True, "Production mode configured")
            else:
                self.log_result("Stripe Config", False, "Missing Stripe key")

            # Check Better Auth configuration
            auth_url = os.getenv('BETTER_AUTH_URL')
            if auth_url:
                self.log_result("Better Auth Config", True, f"URL: {auth_url}")
            else:
                self.log_result("Better Auth Config", False, "Missing auth URL")

            # Check environment
            node_env = os.getenv('NODE_ENV', 'development')
            self.log_result("Environment", True, f"Running in {node_env}")

        except Exception as e:
            self.log_result("Third-Party Config", False, str(e))

    def test_cors_and_security(self):
        """Test CORS configuration and security headers"""
        try:
            # Test CORS headers
            response = requests.options(
                f"{self.base_url}/",
                headers={"Origin": "http://localhost:3000"}
            )

            cors_headers = response.headers
            if 'Access-Control-Allow-Origin' in cors_headers:
                self.log_result("CORS Configuration", True, "CORS headers present")
            else:
                self.log_result("CORS Configuration", False, "Missing CORS headers")

            # Check security headers
            security_headers = [
                'X-Content-Type-Options',
                'X-Frame-Options'
            ]

            security_ok = all(header in cors_headers for header in security_headers)
            self.log_result("Security Headers", security_ok, f"Headers: {list(cors_headers.keys())}")

        except Exception as e:
            self.log_result("Security Tests", False, str(e))

    async def run_all_tests(self):
        """Run all tests and generate report"""
        print("🚀 SupplyGraph AI Engine - Comprehensive Testing")
        print("=" * 50)
        print(f"Started at: {datetime.now()}")
        print()

        # Test all components
        await self.test_database_connection()
        self.test_health_endpoints()
        self.test_valkey_connection()
        self.test_ai_components()
        self.test_workflow_api()
        self.test_third_party_config()
        self.test_cors_and_security()

        # Generate summary
        print()
        print("=" * 50)
        print("📊 Test Summary")
        print("=" * 50)

        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)

        print(f"Tests Run: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")

        if total - passed > 0:
            print()
            print("❌ Failed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['details']}")

        print()
        print(f"Completed at: {datetime.now()}")

        # Return success if at least 80% pass
        return (passed/total) >= 0.8

if __name__ == "__main__":
    tester = SupplyGraphTester()
    success = asyncio.run(tester.run_all_tests())
    exit(0 if success else 1)