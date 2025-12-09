"""
Performance benchmarking for Redis vs Valkey comparison
Optimized for AGUI workload patterns and concurrent access
"""
import asyncio
import time
import json
import logging
import statistics
import uuid
from typing import Dict, Any, List, Optional, Tuple, Union
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import random

import redis.asyncio as redis
from .valkey_manager import get_valkey_manager

# Configure logging
logger = logging.getLogger(__name__)

@dataclass
class BenchmarkConfig:
    """Configuration for benchmark tests"""

    # Connection settings
    redis_url: str = "redis://localhost:6379"
    valkey_url: str = "valkey://localhost:6379"

    # Workload simulation
    concurrent_clients: int = 50
    operations_per_client: int = 100
    data_size: int = 1024  # bytes

    # Test duration
    warmup_duration: float = 30.0  # seconds
    benchmark_duration: float = 300.0  # 5 minutes

    # AGUI-specific patterns
    websocket_connections: int = 20
    workflow_checkpoints: int = 10
    session_operations: int = 30
    rate_limit_checks: int = 40

    # Data patterns
    key_prefix: str = "benchmark"
    json_data_size: int = 2048  # bytes
    binary_data_size: int = 4096  # bytes

@dataclass
class BenchmarkResult:
    """Results from a benchmark run"""

    test_name: str
    backend: str  # "redis" or "valkey"

    # Performance metrics
    total_operations: int = 0
    total_duration: float = 0.0
    operations_per_second: float = 0.0

    # Latency metrics
    avg_latency: float = 0.0
    min_latency: float = 0.0
    max_latency: float = 0.0
    p50_latency: float = 0.0
    p95_latency: float = 0.0
    p99_latency: float = 0.0

    # Error metrics
    error_count: int = 0
    error_rate: float = 0.0

    # Memory and connection metrics
    memory_usage: int = 0
    connection_count: int = 0

    # AGUI-specific metrics
    websocket_ops_per_sec: float = 0.0
    checkpoint_ops_per_sec: float = 0.0
    session_ops_per_sec: float = 0.0
    rate_limit_ops_per_sec: float = 0.0

    # Test metadata
    timestamp: datetime = field(default_factory=datetime.utcnow)
    test_duration: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            'test_name': self.test_name,
            'backend': self.backend,
            'total_operations': self.total_operations,
            'total_duration': self.total_duration,
            'operations_per_second': self.operations_per_second,
            'avg_latency': self.avg_latency,
            'min_latency': self.min_latency,
            'max_latency': self.max_latency,
            'p50_latency': self.p50_latency,
            'p95_latency': self.p95_latency,
            'p99_latency': self.p99_latency,
            'error_count': self.error_count,
            'error_rate': self.error_rate,
            'memory_usage': self.memory_usage,
            'connection_count': self.connection_count,
            'websocket_ops_per_sec': self.websocket_ops_per_sec,
            'checkpoint_ops_per_sec': self.checkpoint_ops_per_sec,
            'session_ops_per_sec': self.session_ops_per_sec,
            'rate_limit_ops_per_sec': self.rate_limit_ops_per_sec,
            'timestamp': self.timestamp.isoformat(),
            'test_duration': self.test_duration
        }

class PerformanceBenchmark:
    """
    Comprehensive performance benchmarking for Redis vs Valkey
    Simulates real AGUI workload patterns
    """

    def __init__(self, config: BenchmarkConfig):
        self.config = config
        self.redis_client: Optional[redis.Redis] = None
        self.valkey_client: Optional[redis.Redis] = None

        # Test data generation
        self.test_data = {
            'small': b'x' * 64,           # 64 bytes
            'medium': b'x' * 1024,         # 1KB
            'large': b'x' * 16384,         # 16KB
            'json': json.dumps({
                'id': str(uuid.uuid4()),
                'user_id': f"user_{random.randint(1, 1000)}",
                'thread_id': str(uuid.uuid4()),
                'timestamp': datetime.utcnow().isoformat(),
                'data': 'x' * 1500,  # ~1.5KB JSON payload
                'metadata': {
                    'client_version': '1.0.0',
                    'platform': 'AGUI',
                    'features': ['real-time', 'ai-workflows', 'collaborative']
                }
            }).encode()
        }

    async def initialize(self):
        """Initialize connections for benchmarking"""
        try:
            # Initialize Redis client
            self.redis_client = redis.from_url(
                self.config.redis_url,
                max_connections=self.config.concurrent_clients + 10,
                decode_responses=False
            )

            # Initialize Valkey client
            valkey_manager = await get_valkey_manager()
            self.valkey_client = await valkey_manager.get_redis_client("default")

            # Test connections
            await self.redis_client.ping()
            await self.valkey_client.ping()

            logger.info("Performance benchmark initialized with Redis and Valkey connections")

        except Exception as e:
            logger.error(f"Failed to initialize benchmark connections: {e}")
            raise

    async def warmup(self, duration: float = None):
        """Warm up both backends"""
        warmup_time = duration or self.config.warmup_duration
        logger.info(f"Warming up backends for {warmup_time} seconds")

        start_time = time.time()
        while time.time() - start_time < warmup_time:
            # Simple SET/GET operations for warmup
            key = f"warmup:{uuid.uuid4()}"
            value = self.test_data['small']

            # Redis warmup
            await self.redis_client.set(key, value, ex=10)
            await self.redis_client.get(key)

            # Valkey warmup
            await self.valkey_client.set(key, value, ex=10)
            await self.valkey_client.get(key)

            await asyncio.sleep(0.01)

        logger.info("Warmup completed")

    async def benchmark_basic_operations(self, backend: str) -> BenchmarkResult:
        """Benchmark basic SET/GET operations"""
        client = self.redis_client if backend == "redis" else self.valkey_client
        latencies = []
        errors = 0
        operations = 0

        logger.info(f"Starting basic operations benchmark for {backend}")

        start_time = time.time()
        test_end_time = start_time + self.config.benchmark_duration

        # Concurrent clients simulation
        tasks = []
        for client_id in range(self.config.concurrent_clients):
            task = asyncio.create_task(
                self._client_basic_ops(client_id, client, test_end_time, latencies)
            )
            tasks.append(task)

        # Wait for all clients to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Count errors
        for result in results:
            if isinstance(result, Exception):
                errors += 1
                logger.error(f"Client error: {result}")

        total_duration = time.time() - start_time
        total_operations = len(latencies)

        return self._create_benchmark_result(
            "basic_operations",
            backend,
            total_operations,
            total_duration,
            latencies,
            errors
        )

    async def _client_basic_ops(self, client_id: int, client: redis.Redis,
                              test_end_time: float, latencies: List[float]):
        """Simulate a client performing basic operations"""
        operations = 0

        while time.time() < test_end_time:
            try:
                # Mix of operations (70% GET, 30% SET)
                if operations % 10 < 7:
                    # GET operation
                    key = f"{self.config.key_prefix}:basic:{client_id}:{random.randint(1, 1000)}"
                    op_start = time.time()
                    await client.get(key)
                else:
                    # SET operation
                    key = f"{self.config.key_prefix}:basic:{client_id}:{operations}"
                    value = random.choice(list(self.test_data.values()))
                    op_start = time.time()
                    await client.set(key, value, ex=3600)

                latency = time.time() - op_start
                latencies.append(latency)
                operations += 1

                # Small delay to simulate realistic usage
                await asyncio.sleep(0.001)

            except Exception as e:
                logger.warning(f"Client {client_id} operation failed: {e}")
                # Don't append latency for failed operations

        return operations

    async def benchmark_websocket_operations(self, backend: str) -> BenchmarkResult:
        """Benchmark WebSocket connection management operations"""
        client = self.redis_client if backend == "redis" else self.valkey_client
        latencies = []
        errors = 0
        operations = 0

        logger.info(f"Starting WebSocket operations benchmark for {backend}")

        start_time = time.time()
        test_end_time = start_time + self.config.benchmark_duration

        # Simulate WebSocket connection lifecycle
        tasks = []
        for client_id in range(self.config.websocket_connections):
            task = asyncio.create_task(
                self._client_websocket_ops(client_id, client, test_end_time, latencies)
            )
            tasks.append(task)

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Count errors
        for result in results:
            if isinstance(result, Exception):
                errors += 1
                logger.error(f"WebSocket client error: {result}")

        total_duration = time.time() - start_time
        total_operations = len(latencies)

        result = self._create_benchmark_result(
            "websocket_operations",
            backend,
            total_operations,
            total_duration,
            latencies,
            errors
        )

        result.websocket_ops_per_sec = result.operations_per_second
        return result

    async def _client_websocket_ops(self, client_id: int, client: redis.Redis,
                                  test_end_time: float, latencies: List[float]):
        """Simulate WebSocket connection management"""
        connection_id = str(uuid.uuid4())
        operations = 0

        while time.time() < test_end_time:
            try:
                # Connection registration
                op_start = time.time()
                await client.hset(
                    f"ws:conn:{connection_id}",
                    mapping={
                        'client_id': str(client_id),
                        'connected_at': datetime.utcnow().isoformat(),
                        'last_heartbeat': datetime.utcnow().isoformat(),
                        'status': 'connected',
                        'thread_id': str(uuid.uuid4())
                    }
                )
                latencies.append(time.time() - op_start)

                # Heartbeat update
                op_start = time.time()
                await client.hset(
                    f"ws:conn:{connection_id}",
                    'last_heartbeat',
                    datetime.utcnow().isoformat()
                )
                latencies.append(time.time() - op_start)

                # State update
                op_start = time.time()
                state_data = {
                    'cursor_position': random.randint(0, 1000),
                    'active_components': random.randint(1, 10),
                    'last_action': 'typing'
                }
                await client.hset(
                    f"ws:conn:{connection_id}",
                    'state_data',
                    json.dumps(state_data)
                )
                latencies.append(time.time() - op_start)

                operations += 3

                # Simulate real-time activity
                await asyncio.sleep(0.05)  # 20 updates per second

            except Exception as e:
                logger.warning(f"WebSocket client {client_id} error: {e}")

        # Cleanup
        try:
            await client.delete(f"ws:conn:{connection_id}")
        except:
            pass

        return operations

    async def benchmark_workflow_checkpoints(self, backend: str) -> BenchmarkResult:
        """Benchmark LangGraph checkpoint operations"""
        client = self.redis_client if backend == "redis" else self.valkey_client
        latencies = []
        errors = 0
        operations = 0

        logger.info(f"Starting workflow checkpoint benchmark for {backend}")

        start_time = time.time()
        test_end_time = start_time + self.config.benchmark_duration

        # Simulate concurrent workflow executions
        tasks = []
        for workflow_id in range(self.config.workflow_checkpoints):
            task = asyncio.create_task(
                self._client_workflow_ops(workflow_id, client, test_end_time, latencies)
            )
            tasks.append(task)

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Count errors
        for result in results:
            if isinstance(result, Exception):
                errors += 1
                logger.error(f"Workflow client error: {result}")

        total_duration = time.time() - start_time
        total_operations = len(latencies)

        result = self._create_benchmark_result(
            "workflow_checkpoints",
            backend,
            total_operations,
            total_duration,
            latencies,
            errors
        )

        result.checkpoint_ops_per_sec = result.operations_per_second
        return result

    async def _client_workflow_ops(self, workflow_id: int, client: redis.Redis,
                                 test_end_time: float, latencies: List[float]):
        """Simulate workflow checkpoint operations"""
        thread_id = str(uuid.uuid4())
        operations = 0

        while time.time() < test_end_time:
            try:
                # Checkpoint save
                checkpoint_id = str(uuid.uuid4())
                checkpoint_data = {
                    'messages': [
                        {'type': 'human', 'content': f'Workflow step {operations}'},
                        {'type': 'ai', 'content': f'Response {operations}'}
                    ],
                    'state': {
                        'step': operations,
                        'completed': random.randint(0, 10),
                        'current_node': f'node_{random.randint(1, 5)}',
                        'metadata': {
                            'workflow_id': workflow_id,
                            'user_agent': 'AGUI-Benchmark',
                            'timestamp': datetime.utcnow().isoformat()
                        }
                    }
                }

                op_start = time.time()
                await client.hset(
                    f"checkpoint:{thread_id}:{checkpoint_id}",
                    mapping={
                        'checkpoint': json.dumps(checkpoint_data),
                        'metadata': json.dumps({
                            'thread_id': thread_id,
                            'checkpoint_id': checkpoint_id,
                            'workflow_name': 'procurement_benchmark',
                            'step': operations,
                            'created_at': datetime.utcnow().isoformat()
                        }),
                        'version': '1.2.0'
                    }
                )
                latencies.append(time.time() - op_start)

                # Checkpoint retrieval
                op_start = time.time()
                retrieved = await client.hgetall(f"checkpoint:{thread_id}:{checkpoint_id}")
                latencies.append(time.time() - op_start)

                if retrieved:
                    operations += 2

                # Simulate workflow processing time
                await asyncio.sleep(0.1)

            except Exception as e:
                logger.warning(f"Workflow client {workflow_id} error: {e}")

        return operations

    async def benchmark_session_operations(self, backend: str) -> BenchmarkResult:
        """Benchmark session management and rate limiting"""
        client = self.redis_client if backend == "redis" else self.valkey_client
        latencies = []
        errors = 0
        operations = 0

        logger.info(f"Starting session operations benchmark for {backend}")

        start_time = time.time()
        test_end_time = start_time + self.config.benchmark_duration

        # Simulate concurrent user sessions
        tasks = []
        for user_id in range(self.config.session_operations):
            task = asyncio.create_task(
                self._client_session_ops(user_id, client, test_end_time, latencies)
            )
            tasks.append(task)

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Count errors
        for result in results:
            if isinstance(result, Exception):
                errors += 1
                logger.error(f"Session client error: {result}")

        total_duration = time.time() - start_time
        total_operations = len(latencies)

        result = self._create_benchmark_result(
            "session_operations",
            backend,
            total_operations,
            total_duration,
            latencies,
            errors
        )

        result.session_ops_per_sec = result.operations_per_second
        return result

    async def _client_session_ops(self, user_id: int, client: redis.Redis,
                                test_end_time: float, latencies: List[float]):
        """Simulate session management operations"""
        session_id = str(uuid.uuid4())
        operations = 0

        while time.time() < test_end_time:
            try:
                # Session creation
                session_data = {
                    'user_id': f"user_{user_id}",
                    'session_id': session_id,
                    'created_at': datetime.utcnow().isoformat(),
                    'last_accessed': datetime.utcnow().isoformat(),
                    'ip_address': f"192.168.1.{random.randint(1, 254)}",
                    'user_agent': 'AGUI-Benchmark-Client/1.0',
                    'api_requests': operations,
                    'messages_sent': random.randint(0, 100),
                    'workflows_executed': random.randint(0, 20)
                }

                op_start = time.time()
                await client.hset(f"session:{session_id}", mapping=session_data)
                await client.expire(f"session:{session_id}", 3600)
                latencies.append(time.time() - op_start)

                # Session retrieval
                op_start = time.time()
                await client.hgetall(f"session:{session_id}")
                latencies.append(time.time() - op_start)

                # Rate limiting check (using sorted set for sliding window)
                now = int(time.time())
                op_start = time.time()
                await client.zadd(f"rate_limit:api:{user_id}", {str(now): now})
                await client.zremrangebyscore(f"rate_limit:api:{user_id}", 0, now - 60)
                await client.expire(f"rate_limit:api:{user_id}", 60)
                latencies.append(time.time() - op_start)

                operations += 3

                # Simulate user activity
                await asyncio.sleep(0.02)

            except Exception as e:
                logger.warning(f"Session client {user_id} error: {e}")

        # Cleanup
        try:
            await client.delete(f"session:{session_id}")
            await client.delete(f"rate_limit:api:{user_id}")
        except:
            pass

        return operations

    def _create_benchmark_result(self, test_name: str, backend: str,
                               total_operations: int, total_duration: float,
                               latencies: List[float], errors: int) -> BenchmarkResult:
        """Create a benchmark result from performance data"""

        if not latencies:
            return BenchmarkResult(
                test_name=test_name,
                backend=backend,
                error_count=errors,
                test_duration=total_duration
            )

        return BenchmarkResult(
            test_name=test_name,
            backend=backend,
            total_operations=total_operations,
            total_duration=total_duration,
            operations_per_second=total_operations / max(total_duration, 0.001),
            avg_latency=statistics.mean(latencies),
            min_latency=min(latencies),
            max_latency=max(latencies),
            p50_latency=statistics.median(latencies),
            p95_latency=sorted(latencies)[int(len(latencies) * 0.95)],
            p99_latency=sorted(latencies)[int(len(latencies) * 0.99)],
            error_count=errors,
            error_rate=errors / max(total_operations + errors, 1),
            test_duration=total_duration
        )

    async def run_comprehensive_benchmark(self) -> List[BenchmarkResult]:
        """Run all benchmarks comparing Redis vs Valkey"""
        logger.info("Starting comprehensive Redis vs Valkey benchmark")

        results = []

        # Initialize connections
        await self.initialize()

        # Warm up both backends
        await self.warmup()

        # Run benchmarks for both backends
        backends = ["redis", "valkey"]
        benchmark_functions = [
            self.benchmark_basic_operations,
            self.benchmark_websocket_operations,
            self.benchmark_workflow_checkpoints,
            self.benchmark_session_operations
        ]

        for backend in backends:
            logger.info(f"Running benchmarks for {backend}")

            for benchmark_func in benchmark_functions:
                try:
                    result = await benchmark_func(backend)
                    results.append(result)

                    logger.info(
                        f"{backend.upper()} {result.test_name}: "
                        f"{result.operations_per_second:.2f} ops/sec, "
                        f"avg latency: {result.avg_latency*1000:.2f}ms, "
                        f"error rate: {result.error_rate:.2%}"
                    )

                    # Clean up between benchmarks
                    await self._cleanup_test_data(backend)
                    await asyncio.sleep(5)  # Brief rest

                except Exception as e:
                    logger.error(f"Benchmark {benchmark_func.__name__} failed for {backend}: {e}")

        logger.info("Comprehensive benchmark completed")
        return results

    async def _cleanup_test_data(self, backend: str):
        """Clean up test data from backend"""
        client = self.redis_client if backend == "redis" else self.valkey_client

        try:
            # Clean up benchmark keys
            pattern = f"{self.config.key_prefix}:*"
            keys = await client.keys(pattern)
            if keys:
                await client.delete(*keys)

            # Clean up other test patterns
            test_patterns = [
                "ws:conn:*",
                "checkpoint:*",
                "session:*",
                "rate_limit:*"
            ]

            for pattern in test_patterns:
                keys = await client.keys(pattern)
                if keys:
                    await client.delete(*keys)

        except Exception as e:
            logger.warning(f"Cleanup failed for {backend}: {e}")

    async def compare_backends(self) -> Dict[str, Any]:
        """Run benchmarks and generate comparison report"""
        results = await self.run_comprehensive_benchmark()

        # Group results by test name
        comparisons = {}
        for result in results:
            if result.test_name not in comparisons:
                comparisons[result.test_name] = {}
            comparisons[result.test_name][result.backend] = result

        # Generate comparison metrics
        comparison_report = {
            'timestamp': datetime.utcnow().isoformat(),
            'test_duration': self.config.benchmark_duration,
            'config': {
                'concurrent_clients': self.config.concurrent_clients,
                'operations_per_client': self.config.operations_per_client,
                'websocket_connections': self.config.websocket_connections,
                'workflow_checkpoints': self.config.workflow_checkpoints,
                'session_operations': self.config.session_operations
            },
            'comparisons': {},
            'overall_winner': None,
            'recommendations': []
        }

        overall_improvement = 0
        test_count = 0

        for test_name, backend_results in comparisons.items():
            redis_result = backend_results.get('redis')
            valkey_result = backend_results.get('valkey')

            if redis_result and valkey_result:
                # Calculate improvements
                ops_improvement = ((valkey_result.operations_per_second - redis_result.operations_per_second)
                                  / max(redis_result.operations_per_second, 0.001)) * 100

                latency_improvement = ((redis_result.avg_latency - valkey_result.avg_latency)
                                    / max(redis_result.avg_latency, 0.001)) * 100

                error_improvement = ((redis_result.error_rate - valkey_result.error_rate)
                                   / max(redis_result.error_rate, 0.001)) * 100

                comparison_report['comparisons'][test_name] = {
                    'redis': redis_result.to_dict(),
                    'valkey': valkey_result.to_dict(),
                    'valkey_ops_improvement_pct': ops_improvement,
                    'valkey_latency_improvement_pct': latency_improvement,
                    'valkey_error_improvement_pct': error_improvement,
                    'winner': 'valkey' if ops_improvement > 0 else 'redis'
                }

                overall_improvement += ops_improvement
                test_count += 1

        # Determine overall winner
        if test_count > 0:
            avg_improvement = overall_improvement / test_count
            comparison_report['overall_winner'] = 'valkey' if avg_improvement > 0 else 'redis'
            comparison_report['avg_valkey_improvement_pct'] = avg_improvement

            # Generate recommendations
            if avg_improvement > 10:
                comparison_report['recommendations'].append(
                    "Valkey shows significant performance improvements (10%+) - recommended for production"
                )
            elif avg_improvement > 0:
                comparison_report['recommendations'].append(
                    "Valkey shows modest performance improvements - consider for new deployments"
                )
            else:
                comparison_report['recommendations'].append(
                    "Redis shows better performance in this benchmark - stick with current setup"
                )

        return comparison_report

# Utility functions for running benchmarks

async def run_redis_vs_valkey_benchmark(config: Optional[BenchmarkConfig] = None) -> Dict[str, Any]:
    """Run a complete Redis vs Valkey benchmark"""
    if config is None:
        config = BenchmarkConfig()

    benchmark = PerformanceBenchmark(config)
    return await benchmark.compare_backends()

async def run_quick_benchmark() -> Dict[str, Any]:
    """Run a quick benchmark for testing"""
    quick_config = BenchmarkConfig(
        concurrent_clients=10,
        operations_per_client=50,
        benchmark_duration=30.0,  # 30 seconds
        websocket_connections=5,
        workflow_checkpoints=3,
        session_operations=7
    )

    benchmark = PerformanceBenchmark(quick_config)
    return await benchmark.compare_backends()