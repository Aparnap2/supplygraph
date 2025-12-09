#!/usr/bin/env python3
"""
Test runner for SupplyGraph comprehensive testing
"""
import asyncio
import subprocess
import sys
import time
import signal
from pathlib import Path
import argparse
from typing import List, Tuple


class TestRunner:
    """Manage running SupplyGraph tests"""

    def __init__(self):
        self.test_dir = Path(__file__).parent.parent / 'tests'
        self.project_root = Path(__file__).parent.parent
        self.setup_complete = False

    def check_dependencies(self) -> bool:
        """Check if all dependencies are available"""
        print("🔍 Checking dependencies...")

        try:
            # Check Python packages
            import pytest
            import httpx
            import psycopg2
            import redis
            import websockets
            print("✅ Python dependencies available")

            # Check Docker containers
            result = subprocess.run(
                ['docker', 'ps'],
                capture_output=True,
                text=True
            )

            if 'agentstack-db-test' in result.stdout:
                print("✅ Database container running")
            else:
                print("❌ Database container not found")
                return False

            if 'supplygraph-redis' in result.stdout:
                print("✅ Redis container running")
            else:
                print("❌ Redis container not found")
                return False

            return True

        except ImportError as e:
            print(f"❌ Missing Python dependency: {e}")
            return False

    def setup_test_environment(self) -> bool:
        """Set up the test environment"""
        print("\n🚀 Setting up test environment...")

        try:
            # Run database setup
            setup_script = self.project_root / 'scripts' / 'setup_test_database.py'
            result = subprocess.run(
                [sys.executable, str(setup_script)],
                capture_output=True,
                text=True,
                timeout=60
            )

            if result.returncode == 0:
                print("✅ Database setup completed")
                self.setup_complete = True
                return True
            else:
                print(f"❌ Database setup failed: {result.stderr}")
                return False

        except subprocess.TimeoutExpired:
            print("❌ Database setup timed out")
            return False
        except Exception as e:
            print(f"❌ Setup error: {e}")
            return False

    def run_database_tests(self) -> Tuple[bool, str]:
        """Run database CRUD tests"""
        print("\n🗄️  Running Database CRUD Tests...")

        try:
            # Set environment variables for tests
            env = {
                'DATABASE_URL': 'postgresql://postgres:password@localhost:5432/agentstack',
                'REDIS_URL': 'redis://localhost:6379',
                'TESTING': 'true'
            }

            # Override existing environment
            test_env = {**os.environ, **env}

            result = subprocess.run(
                [
                    sys.executable, '-m', 'pytest',
                    str(self.test_dir / 'test_database_crud.py'),
                    '-v',
                    '--tb=short',
                    '--disable-warnings'
                ],
                capture_output=True,
                text=True,
                env=test_env,
                timeout=300  # 5 minutes timeout
            )

            print(result.stdout)
            if result.stderr:
                print("STDERR:", result.stderr)

            return result.returncode == 0, result.stdout

        except subprocess.TimeoutExpired:
            return False, "Database tests timed out after 5 minutes"
        except Exception as e:
            return False, f"Database test execution error: {e}"

    def start_ai_engine(self) -> bool:
        """Start the AI Engine service"""
        print("\n🤖 Starting AI Engine...")

        try:
            # Check if AI Engine is already running
            docker_ps = subprocess.run(
                ['docker', 'ps'],
                capture_output=True,
                text=True
            )

            if 'supplygraph-ai-engine' in docker_ps.stdout:
                print("✅ AI Engine already running")
                return True

            # Start AI Engine container
            result = subprocess.run(
                ['docker', 'compose', 'up', 'ai-engine', '-d'],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=60
            )

            if result.returncode != 0:
                print(f"❌ Failed to start AI Engine: {result.stderr}")
                return False

            # Wait for AI Engine to be healthy
            print("⏳ Waiting for AI Engine to be healthy...")
            for i in range(30):  # Wait up to 30 seconds
                docker_ps = subprocess.run(
                    ['docker', 'ps', '--filter', 'name=supplygraph-ai-engine', '--format', 'table {{.Names}}\t{{.Status}}'],
                    capture_output=True,
                    text=True
                )

                if 'healthy' in docker_ps.stdout:
                    print("✅ AI Engine is healthy")
                    return True

                time.sleep(1)

            print("❌ AI Engine did not become healthy")
            return False

        except subprocess.TimeoutExpired:
            print("❌ AI Engine startup timed out")
            return False
        except Exception as e:
            print(f"❌ AI Engine startup error: {e}")
            return False

    def run_api_tests(self) -> Tuple[bool, str]:
        """Run API endpoint tests"""
        print("\n🌐 Running API Endpoint Tests...")

        try:
            result = subprocess.run(
                [
                    sys.executable, '-m', 'pytest',
                    str(self.test_dir / 'test_api_endpoints.py'),
                    '-v',
                    '--tb=short',
                    '--disable-warnings'
                ],
                capture_output=True,
                text=True,
                timeout=300  # 5 minutes timeout
            )

            print(result.stdout)
            if result.stderr:
                print("STDERR:", result.stderr)

            return result.returncode == 0, result.stdout

        except subprocess.TimeoutExpired:
            return False, "API tests timed out after 5 minutes"
        except Exception as e:
            return False, f"API test execution error: {e}"

    def run_all_tests(self) -> bool:
        """Run all tests"""
        print("🧪 SupplyGraph Comprehensive Testing Suite")
        print("=" * 60)

        # Check dependencies
        if not self.check_dependencies():
            return False

        # Setup environment
        if not self.setup_test_environment():
            return False

        # Run database tests
        db_success, db_output = self.run_database_tests()
        if not db_success:
            print(f"❌ Database tests failed")
        else:
            print("✅ Database tests passed")

        # Start AI Engine for API tests
        if not self.start_ai_engine():
            print("⚠️  AI Engine not available, skipping API tests")
            return db_success

        # Run API tests
        api_success, api_output = self.run_api_tests()
        if not api_success:
            print(f"❌ API tests failed")
        else:
            print("✅ API tests passed")

        # Overall success
        overall_success = db_success and api_success

        print("\n" + "=" * 60)
        if overall_success:
            print("🎉 ALL TESTS PASSED!")
        else:
            print("❌ SOME TESTS FAILED")
            print("   Check the logs above for details")

        return overall_success

    def cleanup(self):
        """Clean up after testing"""
        print("\n🧹 Cleaning up...")

        # Optionally stop AI Engine
        # subprocess.run(['docker', 'compose', 'stop', 'ai-engine'], cwd=self.project_root)

        print("✅ Cleanup completed")


def signal_handler(signum, frame):
    """Handle interrupt signals"""
    print("\n\n🛑 Testing interrupted")
    sys.exit(1)


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='SupplyGraph Test Runner')
    parser.add_argument('--db-only', action='store_true', help='Run only database tests')
    parser.add_argument('--api-only', action='store_true', help='Run only API tests')
    parser.add_argument('--setup-only', action='store_true', help='Run only setup')
    parser.add_argument('--cleanup', action='store_true', help='Cleanup after testing')

    args = parser.parse_args()

    # Set up signal handling
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    runner = TestRunner()

    try:
        if args.setup_only:
            return runner.setup_test_environment()

        if args.db_only:
            runner.check_dependencies()
            runner.setup_test_environment()
            return runner.run_database_tests()[0]

        if args.api_only:
            runner.check_dependencies()
            runner.start_ai_engine()
            return runner.run_api_tests()[0]

        # Run all tests
        success = runner.run_all_tests()

        if args.cleanup:
            runner.cleanup()

        return success

    except KeyboardInterrupt:
        print("\n\n🛑 Testing cancelled by user")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False
    finally:
        if not args.setup_only:
            runner.cleanup()


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)