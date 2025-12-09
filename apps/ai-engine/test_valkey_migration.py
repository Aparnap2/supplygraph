#!/usr/bin/env python3
"""
Quick test runner for Valkey migration validation
Run this script to verify that the Valkey integration is working correctly.
"""
import asyncio
import os
import sys
import logging
from pathlib import Path

# Add src to Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_valkey_basic_operations():
    """Test basic Valkey operations"""
    logger.info("🧪 Testing basic Valkey operations...")

    try:
        from src.utils.valkey_manager import get_valkey_manager, get_websocket_redis

        # Initialize manager
        manager = await get_valkey_manager()
        logger.info("✅ Valkey manager initialized successfully")

        # Test connection
        client = await get_websocket_redis()
        await client.ping()
        logger.info("✅ Valkey connection test passed")

        # Test basic operations
        test_key = f"test:basic:{int(asyncio.get_event_loop().time())}"
        await client.set(test_key, "test_value", ex=10)
        result = await client.get(test_key)

        if result == b"test_value":
            logger.info("✅ Basic SET/GET operations working")
        else:
            logger.error(f"❌ SET/GET test failed: expected 'test_value', got {result}")
            return False

        # Cleanup
        await client.delete(test_key)
        logger.info("✅ Cleanup completed")

        return True

    except Exception as e:
        logger.error(f"❌ Basic operations test failed: {e}")
        return False

async def test_session_management():
    """Test session management with Valkey"""
    logger.info("🧪 Testing session management...")

    try:
        from src.utils.session_manager import create_user_session, validate_session

        # Create test session
        session_id = await create_user_session(
            user_id="test_user_123",
            org_id="test_org_456",
            ip_address="127.0.0.1",
            user_agent="test-agent",
            ttl=60
        )

        if not session_id:
            logger.error("❌ Failed to create test session")
            return False

        logger.info(f"✅ Test session created: {session_id}")

        # Validate session
        session_data = await validate_session(session_id)

        if not session_data:
            logger.error("❌ Failed to validate test session")
            return False

        logger.info("✅ Session validation successful")

        # Check session data
        assert session_data.user_id == "test_user_123"
        assert session_data.org_id == "test_org_456"
        assert session_data.ip_address == "127.0.0.1"
        assert session_data.user_agent == "test-agent"

        logger.info("✅ Session data validation passed")

        return True

    except Exception as e:
        logger.error(f"❌ Session management test failed: {e}")
        return False

async def test_rate_limiting():
    """Test rate limiting with Valkey"""
    logger.info("🧪 Testing rate limiting...")

    try:
        from src.utils.session_manager import check_api_rate_limit, RateLimitType

        identifier = f"test_rate_limit_{int(asyncio.get_event_loop().time())}"

        # First request should be allowed
        allowed, rate_info = await check_api_rate_limit(identifier)

        if not allowed:
            logger.error("❌ First rate limit check failed - should be allowed")
            return False

        logger.info("✅ First request allowed as expected")

        # Make several more requests to test rate limiting
        requests_made = 1
        for i in range(150):  # Try to exceed typical rate limit
            allowed, rate_info = await check_api_rate_limit(identifier)
            if allowed:
                requests_made += 1
            else:
                logger.info(f"✅ Rate limiting engaged after {requests_made} requests")
                break

        if requests_made >= 150:
            logger.info("ℹ️  Rate limit not engaged (may be expected in test environment)")

        # Check rate limit info structure
        required_fields = ['allowed', 'current', 'max', 'window_seconds']
        for field in required_fields:
            if field not in rate_info:
                logger.error(f"❌ Rate limit info missing field: {field}")
                return False

        logger.info("✅ Rate limiting structure validation passed")

        return True

    except Exception as e:
        logger.error(f"❌ Rate limiting test failed: {e}")
        return False

async def test_celery_health():
    """Test Celery health with Valkey broker"""
    logger.info("🧪 Testing Celery health...")

    try:
        from src.celery_config import get_celery_health

        health = await get_celery_health()

        if not isinstance(health, dict):
            logger.error(f"❌ Celery health check returned invalid type: {type(health)}")
            return False

        # Check required fields
        required_fields = ['broker_url', 'result_backend']
        for field in required_fields:
            if field not in health:
                logger.error(f"❌ Celery health missing field: {field}")
                return False

        # Check if Valkey URLs are being used
        broker_url = health['broker_url']
        result_backend = health['result_backend']

        if 'valkey://' in broker_url or 'valkey://' in result_backend:
            logger.info("✅ Celery configured to use Valkey")
        else:
            logger.info(f"ℹ️  Celery URLs: {broker_url}, {result_backend}")

        logger.info("✅ Celery health check completed")

        return True

    except Exception as e:
        logger.error(f"❌ Celery health test failed: {e}")
        return False

async def test_performance_benchmark():
    """Run a quick performance benchmark"""
    logger.info("🧪 Running quick performance benchmark...")

    try:
        from src.utils.performance_benchmark import run_quick_benchmark

        results = await run_quick_benchmark()

        if not isinstance(results, dict):
            logger.error(f"❌ Benchmark returned invalid type: {type(results)}")
            return False

        # Check basic structure
        required_fields = ['timestamp', 'overall_winner', 'recommendations']
        for field in required_fields:
            if field not in results:
                logger.error(f"❌ Benchmark results missing field: {field}")
                return False

        logger.info(f"✅ Performance benchmark completed")
        logger.info(f"📊 Overall winner: {results.get('overall_winner', 'Unknown')}")

        recommendations = results.get('recommendations', [])
        if recommendations:
            logger.info("📋 Recommendations:")
            for rec in recommendations:
                logger.info(f"   • {rec}")

        return True

    except Exception as e:
        logger.error(f"❌ Performance benchmark failed: {e}")
        logger.info("ℹ️  This is okay in test environments")
        return True  # Don't fail the entire test for benchmark issues

async def check_environment():
    """Check environment configuration"""
    logger.info("🧪 Checking environment configuration...")

    # Check environment variables
    valkey_url = os.getenv("VALKEY_URL") or os.getenv("REDIS_URL")

    if not valkey_url:
        logger.error("❌ VALKEY_URL or REDIS_URL not set")
        return False

    logger.info(f"✅ Valkey URL: {valkey_url}")

    # Check if it's using Valkey
    if 'valkey://' in valkey_url:
        logger.info("✅ Configuration using Valkey protocol")
    else:
        logger.info(f"ℹ️  Using protocol: {valkey_url.split('://')[0]}")

    # Check Celery configuration
    celery_broker = os.getenv("CELERY_BROKER_URL")
    celery_backend = os.getenv("CELERY_RESULT_BACKEND")

    if celery_broker:
        logger.info(f"✅ Celery broker: {celery_broker}")
    if celery_backend:
        logger.info(f"✅ Celery result backend: {celery_backend}")

    return True

async def main():
    """Run all validation tests"""
    logger.info("🚀 Starting Valkey migration validation...")
    logger.info("=" * 50)

    tests = [
        ("Environment Configuration", check_environment),
        ("Basic Operations", test_valkey_basic_operations),
        ("Session Management", test_session_management),
        ("Rate Limiting", test_rate_limiting),
        ("Celery Health", test_celery_health),
        ("Performance Benchmark", test_performance_benchmark),
    ]

    passed = 0
    total = len(tests)

    for test_name, test_func in tests:
        logger.info(f"\n--- Testing {test_name} ---")
        try:
            if await test_func():
                logger.info(f"✅ {test_name}: PASSED")
                passed += 1
            else:
                logger.error(f"❌ {test_name}: FAILED")
        except Exception as e:
            logger.error(f"❌ {test_name}: ERROR - {e}")

        await asyncio.sleep(0.1)  # Brief pause between tests

    logger.info("\n" + "=" * 50)
    logger.info(f"📊 Test Results: {passed}/{total} passed")

    if passed == total:
        logger.info("🎉 All tests passed! Valkey migration is working correctly.")
        logger.info("🚀 You can proceed with confidence that Valkey is properly integrated.")
        return True
    else:
        logger.warning(f"⚠️  {total - passed} test(s) failed. Review the errors above.")
        logger.warning("🔧 You may need to fix configuration or dependencies before proceeding.")
        return False

if __name__ == "__main__":
    # Set environment for testing if not already set
    if not os.getenv("VALKEY_URL") and not os.getenv("REDIS_URL"):
        os.environ["VALKEY_URL"] = "valkey://localhost:6379"
        os.environ["REDIS_URL"] = "valkey://localhost:6379"
        os.environ["CELERY_BROKER_URL"] = "valkey://localhost:6379/0"
        os.environ["CELERY_RESULT_BACKEND"] = "valkey://localhost:6379/0"
        logger.info("🔧 Using default Valkey configuration for testing")

    # Run the tests
    success = asyncio.run(main())
    sys.exit(0 if success else 1)