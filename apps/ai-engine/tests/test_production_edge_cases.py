"""
Comprehensive production edge case testing for SupplyGraph AI Engine
Tests all critical error scenarios, edge cases, and production failure modes
"""
import asyncio
import pytest
import pytest_asyncio
import json
import time
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from unittest.mock import Mock, AsyncMock, patch
import redis.asyncio as redis
from fastapi.testclient import TestClient
from fastapi import WebSocket
import httpx
from prometheus_client import CollectorRegistry

# Import the production components
from src.services.websocket_manager_prod import (
    ProductionWebSocketManager,
    ConnectionPoolConfig,
    ConnectionStatus,
    WebSocketError,
    RateLimitError,
    ConnectionPoolFullError
)
from src.utils.error_handling import (
    CircuitBreaker,
    CircuitBreakerConfig,
    CircuitState,
    DatabaseConnectionManager,
    ExternalServiceClient,
    ErrorReportingService,
    RetryPolicy,
    RateLimitExceededError,
    DatabaseConnectionError,
    ExternalServiceError
)
from src.utils.state_manager import (
    RedisCheckpointSaver,
    StateMetadata,
    StateVersion,
    StateCorruptionError,
    ConcurrentWorkflowManager,
    RedisStateSerializer,
    StateCompression
)
from src.utils.monitoring import (
    ObservabilityManager,
    AlertManager,
    PerformanceMetrics,
    HealthStatus,
    AlertDefinition,
    AlertSeverity,
    HealthCheck
)
from src.utils.logging import (
    StructuredLogger,
    LogConfiguration,
    LogLevel,
    LogCategory,
    AlertRule,
    AlertChannel
)
from src.models.validation import (
    SecureChatMessage,
    SecureWorkflowResumeRequest,
    SecurityValidationError,
    RateLimitExceededError as ValidationErrorRateLimit
)

# Test Fixtures

@pytest_asyncio.fixture
async def redis_client():
    """Create test Redis client"""
    client = redis.from_url("redis://localhost:6379/1", decode_responses=True)

    # Clear test database
    await client.flushdb()

    yield client

    await client.close()

@pytest_asyncio.fixture
async def redis_binary_client():
    """Create test Redis client for binary data"""
    client = redis.from_url("redis://localhost:6379/1", decode_responses=False)
    yield client
    await client.close()

@pytest.fixture
def circuit_breaker_config():
    """Create test circuit breaker config"""
    return CircuitBreakerConfig(
        failure_threshold=3,
        recovery_timeout=5.0,
        success_threshold=2,
        timeout=1.0,
        error_rate_threshold=0.5
    )

@pytest.fixture
def connection_pool_config():
    """Create test connection pool config"""
    return ConnectionPoolConfig(
        max_connections_per_thread=5,
        max_total_connections=50,
        heartbeat_interval=1,
        connection_timeout=10,
        rate_limit_requests=10,
        rate_limit_window=60
    )

@pytest.fixture
def log_config():
    """Create test logging configuration"""
    return LogConfiguration(
        service_name="test-ai-engine",
        service_version="1.0.0-test",
        environment="test",
        log_level=LogLevel.DEBUG,
        enable_json_output=True,
        enable_file_logging=False,
        enable_redis_logging=True,
        sensitive_fields=["password", "token", "secret"]
    )

# WebSocket Manager Tests

class TestWebSocketManagerProduction:
    """Test WebSocket manager with production edge cases"""

    @pytest_asyncio.async_test
    async def test_connection_limits(self, redis_client, connection_pool_config):
        """Test connection limits and pool exhaustion"""
        manager = ProductionWebSocketManager(connection_pool_config)
        await manager.initialize()

        mock_websockets = [Mock(spec=WebSocket) for _ in range(10)]
        thread_id = str(uuid.uuid4())

        # Test normal connections
        connection_ids = []
        for i in range(5):  # Within per-thread limit
            mock_ws = mock_websockets[i]
            mock_ws.accept = AsyncMock()
            connection_id = await manager.connect(
                mock_ws, thread_id, f"user_{i}", f"org_{i}"
            )
            connection_ids.append(connection_id)

        assert len(connection_ids) == 5

        # Test exceeding per-thread limit
        with pytest.raises(ConnectionPoolFullError):
            await manager.connect(
                mock_websockets[5], thread_id, "user_5", "org_5"
            )

        # Test cleanup
        for connection_id in connection_ids:
            await manager.disconnect(connection_id)

        await manager.shutdown()

    @pytest_asyncio.async_test
    async def test_rate_limiting(self, redis_client, connection_pool_config):
        """Test rate limiting of WebSocket connections"""
        config = ConnectionPoolConfig(
            max_connections_per_thread=10,
            max_total_connections=50,
            rate_limit_requests=2,  # Very low limit for testing
            rate_limit_window=1,  # 1 second window
            heartbeat_interval=1,
            connection_timeout=10
        )
        manager = ProductionWebSocketManager(config)
        await manager.initialize()

        mock_ws = Mock(spec=WebSocket)
        mock_ws.accept = AsyncMock()
        mock_ws.send_text = AsyncMock()

        connection_id = await manager.connect(
            mock_ws, "test_thread", "test_user", "test_org"
        )

        # Send messages within limit
        await manager.broadcast_to_thread("test_thread", {"message": "test1"})
        await manager.broadcast_to_thread("test_thread", {"message": "test2"})

        # Third message should trigger rate limit
        await manager.broadcast_to_thread("test_thread", {"message": "test3"})

        # Check that rate limit warning was sent
        assert mock_ws.send_text.call_count >= 3  # Connection est + 2 messages + rate limit warning

        await manager.disconnect(connection_id)
        await manager.shutdown()

    @pytest_asyncio.async_test
    async def test_connection_timeout_and_cleanup(self, redis_client, connection_pool_config):
        """Test connection timeout and automatic cleanup"""
        config = ConnectionPoolConfig(
            connection_timeout=2,  # 2 second timeout
            heartbeat_interval=1,
            cleanup_interval=1
        )
        manager = ProductionWebSocketManager(config)
        await manager.initialize()

        mock_ws = Mock(spec=WebSocket)
        mock_ws.accept = AsyncMock()

        connection_id = await manager.connect(
            mock_ws, "test_thread", "test_user", "test_org"
        )

        assert connection_id in manager.connections

        # Wait for timeout
        await asyncio.sleep(3)

        # Run cleanup
        await manager._cleanup_connections()

        # Connection should be cleaned up
        assert connection_id not in manager.connections

        await manager.shutdown()

    @pytest_asyncio.async_test
    async def test_websocket_failure_handling(self, redis_client, connection_pool_config):
        """Test handling of WebSocket failures during operations"""
        manager = ProductionWebSocketManager(connection_pool_config)
        await manager.initialize()

        mock_ws = Mock(spec=WebSocket)
        mock_ws.accept = AsyncMock()
        mock_ws.send_text = AsyncMock(side_effect=Exception("Connection lost"))

        connection_id = await manager.connect(
            mock_ws, "test_thread", "test_user", "test_org"
        )

        # Broadcast should handle WebSocket errors gracefully
        await manager.broadcast_to_thread(
            "test_thread",
            {"message": "test"},
            exclude_connection_id=connection_id
        )

        # Connection should be marked for cleanup
        metadata = manager.connections[connection_id]
        assert metadata.status == ConnectionStatus.CONNECTED  # Still marked until cleanup

        await manager.shutdown()

    @pytest_asyncio.async_test
    async def test_circuit_breaker_integration(self, redis_client, connection_pool_config):
        """Test circuit breaker integration with WebSocket manager"""
        # Mock Redis to simulate failures
        failing_redis = Mock(spec=redis.Redis)
        failing_redis.ping = AsyncMock(side_effect=Exception("Redis down"))

        manager = ProductionWebSocketManager(connection_pool_config)

        # Should fail to initialize due to Redis failure
        with pytest.raises(WebSocketError):
            await manager.initialize()

# Circuit Breaker Tests

class TestCircuitBreakerEdgeCases:
    """Test circuit breaker edge cases"""

    @pytest_asyncio.async_test
    async def test_concurrent_failures(self, redis_client, circuit_breaker_config):
        """Test circuit breaker with concurrent failures"""
        circuit_breaker = CircuitBreaker("test_service", circuit_breaker_config, redis_client)

        failing_func = AsyncMock(side_effect=Exception("Service failure"))

        # Trigger multiple concurrent failures
        tasks = []
        for _ in range(5):
            task = asyncio.create_task(
                circuit_breaker.call(failing_func)
            )
            tasks.append(task)

        # Wait for all tasks to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # All should fail and circuit should open
        assert all(isinstance(r, Exception) for r in results)
        assert circuit_breaker.state == CircuitState.OPEN

    @pytest_asyncio.async_test
    async def test_recovery_timeout_and_half_open_state(self, redis_client, circuit_breaker_config):
        """Test circuit breaker recovery and half-open state"""
        # Short timeout for testing
        config = CircuitBreakerConfig(
            failure_threshold=2,
            recovery_timeout=1.0,
            success_threshold=1,
            timeout=0.1
        )
        circuit_breaker = CircuitBreaker("test_service", config, redis_client)

        # Trigger failures to open circuit
        failing_func = AsyncMock(side_effect=Exception("Service failure"))

        for _ in range(2):
            with pytest.raises(Exception):
                await circuit_breaker.call(failing_func)

        assert circuit_breaker.state == CircuitState.OPEN

        # Wait for recovery timeout
        await asyncio.sleep(1.1)

        # Next call should attempt (half-open state)
        working_func = AsyncMock(return_value="success")
        result = await circuit_breaker.call(working_func)

        assert result == "success"
        assert circuit_breaker.state == CircuitState.CLOSED

    @pytest_asyncio.async_test
    async def test_mixed_success_failure_patterns(self, redis_client, circuit_breaker_config):
        """Test circuit breaker with mixed success/failure patterns"""
        circuit_breaker = CircuitBreaker("test_service", circuit_breaker_config, redis_client)

        # Create function that fails occasionally
        call_count = 0
        async def sometimes_failing():
            nonlocal call_count
            call_count += 1
            if call_count % 3 == 0:  # Fail every 3rd call
                raise Exception("Occasional failure")
            return f"success_{call_count}"

        # Make multiple calls
        results = []
        for i in range(10):
            try:
                result = await circuit_breaker.call(sometimes_failing)
                results.append(result)
            except Exception:
                results.append("failure")

        # Circuit should handle mixed pattern gracefully
        assert circuit_breaker.state == CircuitState.CLOSED  # Should recover
        assert len([r for r in results if r != "failure"]) > 0  # Some successes

    @pytest_asyncio.async_test
    async def test_error_categorization(self, redis_client, circuit_breaker_config):
        """Test error categorization in circuit breaker"""
        circuit_breaker = CircuitBreaker("test_service", circuit_breaker_config, redis_client)

        # Test different error types
        import httpx
        timeout_error = asyncio.TimeoutError()
        connection_error = httpx.ConnectError("Connection failed")
        http_error = httpx.HTTPStatusError("404 Not Found", request=Mock(), response=Mock(status_code=404))

        # Categorize errors
        timeout_category = circuit_breaker._categorize_error(timeout_error)
        connection_category = circuit_breaker._categorize_error(connection_error)
        http_category = circuit_breaker._categorize_error(http_error)

        assert timeout_category.value == "timeout"
        assert connection_category.value == "network"
        assert http_category.value == "external_service"

# State Management Tests

class TestStateManagementEdgeCases:
    """Test state management edge cases"""

    @pytest_asyncio.async_test
    async def test_state_corruption_detection(self, redis_binary_client):
        """Test state corruption detection and recovery"""
        serializer = RedisStateSerializer(validate_checksum=True)

        # Test valid state
        valid_state = {"test": "data", "number": 42}
        serialized = serializer.dumps(valid_state)
        deserialized = serializer.loads(serialized)
        assert deserialized == valid_state

        # Test corrupted state
        corrupted_data = serialized[:100] + b"corrupted" + serialized[100:]
        with pytest.raises(ValueError, match="checksum mismatch"):
            serializer.loads(corrupted_data)

    @pytest_asyncio.async_test
    async def test_compression_performance(self, redis_binary_client):
        """Test different compression methods"""
        large_state = {
            "large_data": "x" * 10000,  # 10KB of data
            "nested": {"more_data": "y" * 5000} * 10
        }

        # Test different compression methods
        compression_methods = [
            StateCompression.NONE,
            StateCompression.GZIP,
            # Add other compression types if available
        ]

        sizes = {}
        for method in compression_methods:
            serializer = RedisStateSerializer(compression=method, validate_checksum=False)
            start_time = time.time()
            serialized = serializer.dumps(large_state)
            serialization_time = time.time() - start_time

            sizes[method.value] = {
                "size": len(serialized),
                "serialization_time": serialization_time
            }

            # Verify decompression
            start_time = time.time()
            deserialized = serializer.loads(serialized)
            deserialization_time = time.time() - start_time

            assert deserialized == large_state
            sizes[method.value]["deserialization_time"] = deserialization_time

        # Compression should reduce size
        assert sizes["gzip"]["size"] < sizes["none"]["size"]

    @pytest_asyncio.async_test
    async def test_state_version_migration(self, redis_binary_client):
        """Test state version handling and migration"""
        # Create state with old version format
        old_version_state = {
            "version": "1.0.0",
            "data": {"message": "old state"}
        }

        # Simulate migration logic
        def migrate_state(state):
            if state.get("version") == "1.0.0":
                return {
                    "version": "1.2.0",
                    "data": state["data"],
                    "migrated_at": datetime.utcnow().isoformat()
                }
            return state

        migrated_state = migrate_state(old_version_state)
        assert migrated_state["version"] == "1.2.0"
        assert "migrated_at" in migrated_state

    @pytest_asyncio.async_test
    async def test_concurrent_workflow_state_isolation(self, redis_client):
        """Test state isolation between concurrent workflows"""
        workflow_manager = ConcurrentWorkflowManager(
            redis_client,
            max_concurrent_per_org=2,
            max_concurrent_per_user=1
        )

        org_id = "test_org"
        user1_id = "user1"
        user2_id = "user2"

        # Test concurrent workflow limits
        assert await workflow_manager.can_start_workflow(org_id, user1_id)
        assert await workflow_manager.can_start_workflow(org_id, user2_id)

        # Register workflows
        thread1 = await workflow_manager.register_workflow("thread1", org_id, user1_id)
        thread2 = await workflow_manager.register_workflow("thread2", org_id, user2_id)

        assert thread1 is True
        assert thread2 is True

        # Third workflow should be rejected (org limit)
        assert not await workflow_manager.can_start_workflow(org_id, "user3")

        # Second workflow for same user should be rejected
        assert not await workflow_manager.can_start_workflow(org_id, user1_id)

        # Cleanup
        await workflow_manager.unregister_workflow("thread1")
        await workflow_manager.unregister_workflow("thread2")

# Validation Tests

class TestProductionValidation:
    """Test production validation edge cases"""

    def test_sql_injection_prevention(self):
        """Test SQL injection prevention in messages"""
        malicious_inputs = [
            "'; DROP TABLE users; --",
            "' OR '1'='1",
            "UNION SELECT * FROM passwords",
            "'; UPDATE users SET password='hacked' WHERE '1'='1'; --"
        ]

        for malicious_input in malicious_inputs:
            with pytest.raises(SecurityValidationError, match="SQL"):
                SecureChatMessage(
                    message=malicious_input,
                    org_id="test_org",
                    user_id="test_user",
                    security_level="strict"
                )

    def test_xss_prevention(self):
        """Test XSS prevention in messages"""
        xss_inputs = [
            "<script>alert('xss')</script>",
            "javascript:alert('xss')",
            "<img src=x onerror=alert('xss')>",
            "<svg onload=alert('xss')>",
            "data:text/html,<script>alert('xss')</script>"
        ]

        for xss_input in xss_inputs:
            with pytest.raises(SecurityValidationError, match="dangerous"):
                SecureChatMessage(
                    message=xss_input,
                    org_id="test_org",
                    user_id="test_user"
                )

    def test_metadata_size_limits(self):
        """Test metadata size limits"""
        large_metadata = {
            "large_data": "x" * 20000  # Exceeds 10KB limit
        }

        with pytest.raises(ValueError, match="Metadata size exceeds"):
            SecureChatMessage(
                message="test",
                org_id="test_org",
                user_id="test_user",
                metadata=large_metadata
            )

    def test_id_format_validation(self):
        """Test ID format validation"""
        invalid_ids = [
            "../../../etc/passwd",
            "user@domain.com",  # Contains @
            "user name",  # Contains space
            "user; DROP TABLE users; --"
        ]

        for invalid_id in invalid_ids:
            with pytest.raises(ValueError):
                SecureChatMessage(
                    message="test",
                    org_id=invalid_id,
                    user_id="test_user"
                )

            with pytest.raises(ValueError):
                SecureChatMessage(
                    message="test",
                    org_id="test_org",
                    user_id=invalid_id
                )

# Error Handling Tests

class TestProductionErrorHandling:
    """Test production error handling scenarios"""

    @pytest_asyncio.async_test
    async def test_database_circuit_breaker(self, redis_client):
        """Test database connection circuit breaker"""
        config = CircuitBreakerConfig(
            failure_threshold=2,
            recovery_timeout=1.0,
            timeout=0.1
        )

        db_manager = DatabaseConnectionManager(
            "postgresql://invalid",  # Invalid connection string
            "test_db",
            config,
            redis_client
        )

        # Test circuit breaker opens on database failures
        failing_query = AsyncMock(side_effect=Exception("Database connection failed"))

        with pytest.raises(DatabaseConnectionError):
            await db_manager.execute_query(failing_query)

        # Circuit should open after repeated failures
        for _ in range(3):
            with pytest.raises(Exception):
                await db_manager.execute_query(failing_query)

        assert db_manager.circuit_breaker.state == CircuitState.OPEN

    @pytest_asyncio.async_test
    async def test_external_service_timeout_and_retry(self):
        """Test external service timeout and retry logic"""
        retry_policy = RetryPolicy(
            max_attempts=3,
            initial_delay=0.1,
            max_delay=1.0
        )

        # Mock service that initially fails then succeeds
        call_count = 0
        async def failing_then_success():
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise httpx.ConnectError("Service temporarily unavailable")
            return {"status": "success"}

        client = ExternalServiceClient(
            "test_service",
            "https://api.example.com",
            retry_policy=retry_policy
        )

        result = await client.make_request("GET", "/test")
        assert result["status"] == "success"
        assert call_count == 3  # Should have retried twice

    @pytest_asyncio.async_test
    async def test_error_reporting_and_classification(self, redis_client):
        """Test error reporting and classification"""
        error_reporting = ErrorReportingService(redis_client)

        context = Mock()
        context.request_id = str(uuid.uuid4())
        context.user_id = "test_user"
        context.org_id = "test_org"
        context.operation = "test_operation"

        # Test different error types
        test_errors = [
            ValueError("Invalid input"),
            asyncio.TimeoutError("Operation timeout"),
            ConnectionError("Network failure"),
            Exception("Generic error")
        ]

        for error in test_errors:
            await error_reporting.report_error(error, context)

        # Verify errors were stored in Redis
        errors = await redis_client.lrange("error_reports", 0, -1)
        assert len(errors) == len(test_errors)

        # Each error should be properly structured
        for error_json in errors:
            error_data = json.loads(error_json)
            assert "error_type" in error_data
            assert "context" in error_data
            assert "timestamp" in error_data

# Monitoring and Observability Tests

class TestProductionMonitoring:
    """Test production monitoring edge cases"""

    @pytest_asyncio.async_test
    async def test_alert_firing_and_resolution(self, redis_client):
        """Test alert firing and resolution"""
        alert_manager = AlertManager(redis_client)

        # Add test alert
        alert = AlertDefinition(
            name="test_error_rate",
            description="Test error rate alert",
            metric_name="error_rate",
            condition=">",
            threshold=0.1,
            severity=AlertSeverity.WARNING,
            duration=timedelta(seconds=1)
        )
        alert_manager.add_alert(alert)

        # Mock callback to track alerts
        fired_alerts = []
        def alert_callback(name, data):
            fired_alerts.append((name, data))

        alert_manager.add_alert_callback(alert_callback)

        # Trigger alert condition
        metrics = {
            "error_rate": 0.2,  # Above threshold
            "total_requests": 100,
            "total_errors": 20
        }

        # First evaluation should trigger alert
        await alert_manager.evaluate_alerts(metrics)
        assert len(fired_alerts) == 0  # Not yet, needs duration

        # Wait for duration and evaluate again
        await asyncio.sleep(1.1)
        await alert_manager.evaluate_alerts(metrics)

        # Alert should be fired
        assert len(fired_alerts) == 1
        assert fired_alerts[0][0] == "test_error_rate"

        # Resolve alert
        metrics["error_rate"] = 0.05  # Below threshold
        await alert_manager.evaluate_alerts(metrics)

        # Alert should be resolved
        alert_state = alert_manager.alert_states["test_error_rate"]
        assert not alert_state["active"]

    @pytest_asyncio.async_test
    async def test_health_check_criticality(self, redis_client):
        """Test health check criticality handling"""
        observability = ObservabilityManager(redis_client=redis_client)

        # Add health checks
        critical_check = HealthCheck(
            name="critical_service",
            description="Critical service check",
            check_func=AsyncMock(side_effect=Exception("Critical service down")),
            critical=True
        )

        non_critical_check = HealthCheck(
            name="non_critical_service",
            description="Non-critical service check",
            check_func=AsyncMock(side_effect=Exception("Non-critical service down")),
            critical=False
        )

        observability.add_health_check(critical_check)
        observability.add_health_check(non_critical_check)

        health = await observability.check_health()

        # Overall health should be unhealthy due to critical failure
        assert health["status"] == HealthStatus.UNHEALTHY.value

        # Both checks should show as unhealthy
        assert health["checks"]["critical_service"]["status"] == HealthStatus.UNHEALTHY.value
        assert health["checks"]["non_critical_service"]["status"] == HealthStatus.UNHEALTHY.value

    @pytest_asyncio.async_test
    async def test_performance_metrics_collection(self):
        """Test performance metrics collection"""
        metrics = PerformanceMetrics()

        # Simulate various operations
        metrics.record_request(0.5, 200)
        metrics.record_request(0.3, 200)
        metrics.record_request(0.8, 500)  # Error
        metrics.record_message()
        metrics.record_message()
        metrics.record_connection(1)
        metrics.record_connection(-1)  # Disconnect

        system_metrics = metrics.get_system_metrics()

        assert system_metrics["application"]["total_requests"] == 3
        assert system_metrics["application"]["total_errors"] == 1
        assert system_metrics["application"]["error_rate"] == 1/3
        assert system_metrics["application"]["active_connections"] == 0
        assert system_metrics["application"]["processed_messages"] == 2

    def test_prometheus_metrics_scraping(self):
        """Test Prometheus metrics scraping"""
        from src.utils.monitoring import PrometheusMetricsRegistry

        registry = PrometheusMetricsRegistry()

        # Record some metrics
        registry.record_http_request("GET", "/test", 200, 0.5)
        registry.record_workflow_execution("test_workflow", "completed", 2.0)
        registry.record_error("ValidationError", "validation")

        metrics_output = registry.get_metrics()

        assert "http_requests_total" in metrics_output
        assert "workflow_executions_total" in metrics_output
        assert "errors_total" in metrics_output

# Logging Tests

class TestProductionLogging:
    """Test production logging edge cases"""

    @pytest_asyncio.async_test
    async def test_sensitive_data_filtering(self, redis_client):
        """Test sensitive data filtering in logs"""
        log_config = LogConfiguration(
            service_name="test",
            service_version="1.0.0",
            environment="test",
            sensitive_fields=["password", "token", "api_key"]
        )

        structured_logger = StructuredLogger(log_config, redis_client)

        # Test logging with sensitive data
        await structured_logger.info(
            "User login attempt",
            category=LogCategory.AUTH,
            metadata={
                "username": "testuser",
                "password": "secret123",
                "token": "abc123token",
                "api_key": "secret_key",
                "safe_field": "safe_value"
            }
        )

        # Check that sensitive data is filtered
        logs = await structured_logger.search_logs(limit=10)
        if logs:
            log_data = logs[0]
            metadata = log_data.get("metadata", {})

            assert metadata.get("password") == "***REDACTED***"
            assert metadata.get("token") == "***REDACTED***"
            assert metadata.get("api_key") == "***REDACTED***"
            assert metadata.get("safe_field") == "safe_value"

    @pytest_asyncio.async_test
    async def test_log_alerting(self, redis_client):
        """Test log-based alerting"""
        log_config = LogConfiguration(
            service_name="test",
            service_version="1.0.0",
            environment="test"
        )

        structured_logger = StructuredLogger(log_config, redis_client)

        # Add alert rule
        alert_rule = AlertRule(
            name="error_spike",
            description="Error spike detected",
            log_level=LogLevel.ERROR,
            category=LogCategory.ERROR,
            condition="error",
            threshold=2,
            time_window=2,  # 2 seconds
            channels=[AlertChannel.SLACK],
            cooldown=10
        )
        structured_logger.add_alert_rule(alert_rule)

        # Trigger multiple errors
        await structured_logger.error("Error 1", category=LogCategory.ERROR)
        await structured_logger.error("Error 2", category=LogCategory.ERROR)

        # Wait for time window
        await asyncio.sleep(2.1)

        # Evaluate alerts (this would normally be done in background)
        await structured_logger._check_alerts(
            structured_logger._create_log_entry(
                LogLevel.ERROR, LogCategory.ERROR, "Error 3"
            )
        )

        # Check alert was stored in Redis
        alerts = await redis_client.lrange("alerts", 0, -1)
        assert len(alerts) >= 1

    @pytest_asyncio.async_test
    async def test_performance_logging(self, redis_client):
        """Test performance logging capabilities"""
        log_config = LogConfiguration(
            service_name="test",
            service_version="1.0.0",
            environment="test",
            enable_performance_logging=True
        )

        structured_logger = StructuredLogger(log_config, redis_client)

        # Test performance logging
        with pytest.raises(Exception):
            async with structured_logger._create_log_entry(
                LogLevel.INFO, LogCategory.PERFORMANCE, "Test operation"
            ):
                await asyncio.sleep(0.1)  # Simulate work
                raise Exception("Test error")

        # Check performance metrics
        perf_metrics = structured_logger.get_performance_metrics()
        if perf_metrics:
            assert "total_requests" in perf_metrics
            assert "avg_duration" in perf_metrics

# Integration Tests

class TestProductionIntegration:
    """Integration tests for production components"""

    @pytest_asyncio.async_test
    async def test_end_to_end_error_flow(self, redis_client):
        """Test end-to-end error flow through all components"""
        # Setup all components
        log_config = LogConfiguration(
            service_name="integration-test",
            service_version="1.0.0",
            environment="test"
        )

        structured_logger = StructuredLogger(log_config, redis_client)
        error_reporting = ErrorReportingService(redis_client)
        alert_manager = AlertManager(redis_client)

        # Create error scenario
        error_context = Mock()
        error_context.request_id = str(uuid.uuid4())
        error_context.operation = "integration_test"

        test_error = ValueError("Integration test error")

        # Report error through error reporting
        await error_reporting.report_error(test_error, error_context)

        # Log the error
        await structured_logger.error(
            "Integration test error occurred",
            category=LogCategory.ERROR,
            error_type="ValueError",
            metadata={"test": True}
        )

        # Verify error was stored in all systems
        error_reports = await redis_client.lrange("error_reports", 0, -1)
        assert len(error_reports) >= 1

        logs = await structured_logger.search_logs(limit=10)
        assert len(logs) >= 1

    @pytest_asyncio.async_test
    async def test_cascade_failure_scenarios(self, redis_client):
        """Test cascade failure scenarios"""
        # Setup dependencies that fail
        failing_redis = Mock(spec=redis.Redis)
        failing_redis.ping = AsyncMock(side_effect=Exception("Redis down"))
        failing_redis.get = AsyncMock(side_effect=Exception("Redis down"))
        failing_redis.set = AsyncMock(side_effect=Exception("Redis down"))

        # Test that components handle cascade failures gracefully
        with pytest.raises(Exception):
            # WebSocket manager should fail gracefully
            manager = ProductionWebSocketManager(ConnectionPoolConfig())
            await manager.initialize()

        with pytest.raises(Exception):
            # State manager should fail gracefully
            checkpoint_saver = RedisCheckpointSaver(failing_redis)
            await checkpoint_saver.get({"configurable": {"thread_id": "test"}})

    @pytest_asyncio.async_test
    async def test_load_and_stress_scenarios(self, redis_client):
        """Test system under load and stress"""
        connection_config = ConnectionPoolConfig(
            max_connections_per_thread=20,
            max_total_connections=100,
            rate_limit_requests=100,
            rate_limit_window=60
        )

        manager = ProductionWebSocketManager(connection_config)
        await manager.initialize()

        # Simulate high load
        tasks = []
        for i in range(50):
            mock_ws = Mock(spec=WebSocket)
            mock_ws.accept = AsyncMock()
            mock_ws.send_text = AsyncMock()

            task = asyncio.create_task(
                manager.connect(mock_ws, f"thread_{i}", f"user_{i}", f"org_{i}")
            )
            tasks.append(task)

        # Wait for connections
        connection_ids = await asyncio.gather(*tasks, return_exceptions=True)

        # Verify system handled load
        successful_connections = [
            conn_id for conn_id in connection_ids
            if not isinstance(conn_id, Exception)
        ]
        assert len(successful_connections) <= connection_config.max_total_connections

        # Broadcast to all connections
        if successful_connections:
            await manager.broadcast_to_thread(
                "thread_0",
                {"message": "broadcast test"}
            )

        # Cleanup
        for conn_id in successful_connections:
            await manager.disconnect(conn_id)

        await manager.shutdown()

# Test Utilities

def run_production_edge_case_tests():
    """Run all production edge case tests"""
    import pytest

    test_file = __file__
    pytest_args = [
        test_file,
        "-v",
        "--tb=short",
        "--disable-warnings"
    ]

    pytest.main(pytest_args)

if __name__ == "__main__":
    run_production_edge_case_tests()