"""
Production monitoring and observability with OpenTelemetry, Prometheus, and comprehensive metrics
"""
import asyncio
import time
import logging
import json
import psutil
import gc
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable, Set
from dataclasses import dataclass, field
from enum import Enum
from contextlib import asynccontextmanager
import uuid
import threading
from collections import defaultdict, deque

from prometheus_client import Counter, Histogram, Gauge, Info, CollectorRegistry, generate_latest, CONTENT_TYPE_LATEST
from fastapi import Request, Response
from fastapi.routing import APIRoute
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import StreamingResponse

# OpenTelemetry imports
try:
    from opentelemetry import trace, metrics, baggage, context
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.metrics import MeterProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor
    from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
    from opentelemetry.exporter.jaeger.thrift import JaegerExporter
    from opentelemetry.exporter.prometheus import PrometheusMetricReader
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
    from opentelemetry.instrumentation.redis import RedisInstrumentor
    from opentelemetry.propagators.b3 import B3MultiFormat
    from opentelemetry.semconv.trace import SpanAttributes
    from opentelemetry.semconv.resource import ResourceAttributes
    from opentelemetry.sdk.resources import Resource

    OPENTELEMETRY_AVAILABLE = True
except ImportError:
    OPENTELEMETRY_AVAILABLE = False

import redis.asyncio as redis

# Configure logging
logger = logging.getLogger(__name__)

class MetricType(Enum):
    """Metric types for categorization"""
    COUNTER = "counter"
    HISTOGRAM = "histogram"
    GAUGE = "gauge"
    INFO = "info"

class AlertSeverity(Enum):
    """Alert severity levels"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

class HealthStatus(Enum):
    """Health check statuses"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"

@dataclass
class MetricDefinition:
    """Metric definition with metadata"""
    name: str
    description: str
    metric_type: MetricType
    labels: List[str] = field(default_factory=list)
    buckets: Optional[List[float]] = None  # For histograms
    unit: Optional[str] = None

@dataclass
class AlertDefinition:
    """Alert definition"""
    name: str
    description: str
    metric_name: str
    condition: str  # e.g., "metric > threshold"
    threshold: float
    severity: AlertSeverity
    duration: timedelta  # How long condition must persist
    enabled: bool = True

@dataclass
class HealthCheck:
    """Health check definition"""
    name: str
    description: str
    check_func: Callable[[], Any]
    timeout: float = 10.0
    critical: bool = True

class PerformanceMetrics:
    """System performance metrics collector"""

    def __init__(self):
        self.start_time = time.time()
        self.request_count = 0
        self.error_count = 0
        self.active_connections = 0
        self.processed_messages = 0

        # Memory tracking
        self._memory_samples = deque(maxlen=100)
        self._cpu_samples = deque(maxlen=100)

        # Rate tracking
        self._request_times = deque(maxlen=1000)
        self._error_times = deque(maxlen=1000)

    def record_request(self, duration: float, status_code: int):
        """Record a request"""
        self.request_count += 1
        self._request_times.append(time.time())

        if status_code >= 400:
            self.error_count += 1
            self._error_times.append(time.time())

    def record_message(self):
        """Record a processed message"""
        self.processed_messages += 1

    def record_connection(self, delta: int):
        """Record connection change"""
        self.active_connections += delta

    def get_system_metrics(self) -> Dict[str, Any]:
        """Get system performance metrics"""
        # Memory usage
        memory = psutil.virtual_memory()
        process = psutil.Process()

        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)

        # Network I/O
        network = psutil.net_io_counters()

        # Disk I/O
        disk = psutil.disk_io_counters()

        # Store samples for averages
        self._memory_samples.append(memory.percent)
        self._cpu_samples.append(cpu_percent)

        # Calculate rates
        now = time.time()
        recent_requests = sum(1 for t in self._request_times if now - t < 60)
        recent_errors = sum(1 for t in self._error_times if now - t < 60)

        return {
            "uptime_seconds": now - self.start_time,
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent,
                "used": memory.used,
                "process_memory": process.memory_info().rss
            },
            "cpu": {
                "percent": cpu_percent,
                "count": psutil.cpu_count(),
                "load_avg": list(psutil.getloadavg()) if hasattr(psutil, 'getloadavg') else None
            },
            "network": {
                "bytes_sent": network.bytes_sent,
                "bytes_recv": network.bytes_recv,
                "packets_sent": network.packets_sent,
                "packets_recv": network.packets_recv
            },
            "disk": {
                "read_bytes": disk.read_bytes if disk else 0,
                "write_bytes": disk.write_bytes if disk else 0,
                "read_count": disk.read_count if disk else 0,
                "write_count": disk.write_count if disk else 0
            },
            "application": {
                "total_requests": self.request_count,
                "total_errors": self.error_count,
                "active_connections": self.active_connections,
                "processed_messages": self.processed_messages,
                "requests_per_minute": recent_requests,
                "errors_per_minute": recent_errors,
                "error_rate": recent_errors / max(recent_requests, 1),
                "avg_memory_percent": sum(self._memory_samples) / len(self._memory_samples) if self._memory_samples else 0,
                "avg_cpu_percent": sum(self._cpu_samples) / len(self._cpu_samples) if self._cpu_samples else 0
            }
        }

class AlertManager:
    """Alert management system"""

    def __init__(self, redis_client: Optional[redis.Redis] = None):
        self.redis_client = redis_client
        self.alert_definitions: Dict[str, AlertDefinition] = {}
        self.alert_states: Dict[str, Dict[str, Any]] = {}
        self.alert_callbacks: List[Callable[[str, Dict[str, Any]], None]] = []

    def add_alert(self, alert: AlertDefinition):
        """Add alert definition"""
        self.alert_definitions[alert.name] = alert

    def add_alert_callback(self, callback: Callable[[str, Dict[str, Any]], None]):
        """Add alert callback"""
        self.alert_callbacks.append(callback)

    async def evaluate_alerts(self, metrics: Dict[str, Any]):
        """Evaluate all alert conditions"""
        current_time = datetime.utcnow()

        for alert_name, alert in self.alert_definitions.items():
            if not alert.enabled:
                continue

            try:
                # Extract metric value
                metric_value = self._extract_metric_value(metrics, alert.metric_name)
                if metric_value is None:
                    continue

                # Evaluate condition
                condition_met = self._evaluate_condition(
                    metric_value, alert.condition, alert.threshold
                )

                # Get current alert state
                alert_state = self.alert_states.get(alert_name, {
                    "active": False,
                    "first_triggered": None,
                    "last_triggered": None,
                    "count": 0
                })

                if condition_met:
                    if not alert_state["active"]:
                        # New alert
                        alert_state["active"] = True
                        alert_state["first_triggered"] = current_time
                        alert_state["count"] = 1
                    else:
                        alert_state["count"] += 1

                    alert_state["last_triggered"] = current_time

                    # Check if alert duration is met
                    duration_met = (
                        current_time - alert_state["first_triggered"]
                    ) >= alert.duration

                    if duration_met:
                        await self._trigger_alert(alert_name, alert, metric_value)

                else:
                    if alert_state["active"]:
                        # Alert resolved
                        await self._resolve_alert(alert_name, alert)

                    # Reset state
                    alert_state["active"] = False
                    alert_state["first_triggered"] = None
                    alert_state["count"] = 0

                self.alert_states[alert_name] = alert_state

            except Exception as e:
                logger.error(f"Failed to evaluate alert {alert_name}: {e}")

    async def _trigger_alert(self, alert_name: str, alert: AlertDefinition, value: float):
        """Trigger alert"""
        alert_data = {
            "name": alert_name,
            "description": alert.description,
            "severity": alert.severity.value,
            "metric": alert.metric_name,
            "value": value,
            "threshold": alert.threshold,
            "condition": alert.condition,
            "timestamp": datetime.utcnow().isoformat(),
            "state": self.alert_states.get(alert_name, {})
        }

        logger.warning(f"ALERT TRIGGERED: {alert_name} - {alert.description}")

        # Store in Redis
        if self.redis_client:
            try:
                await self.redis_client.lpush(
                    "alerts",
                    json.dumps(alert_data, default=str)
                )
                await self.redis_client.ltrim("alerts", 0, 999)  # Keep last 1000
            except Exception as e:
                logger.error(f"Failed to store alert in Redis: {e}")

        # Call callbacks
        for callback in self.alert_callbacks:
            try:
                callback(alert_name, alert_data)
            except Exception as e:
                logger.error(f"Alert callback failed: {e}")

    async def _resolve_alert(self, alert_name: str, alert: AlertDefinition):
        """Resolve alert"""
        logger.info(f"ALERT RESOLVED: {alert_name} - {alert.description}")

        resolution_data = {
            "name": alert_name,
            "resolved_at": datetime.utcnow().isoformat(),
            "state": self.alert_states.get(alert_name, {})
        }

        # Store in Redis
        if self.redis_client:
            try:
                await self.redis_client.lpush(
                    "alert_resolutions",
                    json.dumps(resolution_data, default=str)
                )
                await self.redis_client.ltrim("alert_resolutions", 0, 999)
            except Exception as e:
                logger.error(f"Failed to store alert resolution in Redis: {e}")

    def _extract_metric_value(self, metrics: Dict[str, Any], metric_name: str) -> Optional[float]:
        """Extract metric value using dot notation"""
        try:
            parts = metric_name.split('.')
            value = metrics
            for part in parts:
                value = value[part]
            return float(value)
        except (KeyError, TypeError, ValueError):
            return None

    def _evaluate_condition(self, value: float, condition: str, threshold: float) -> bool:
        """Evaluate alert condition"""
        if condition == ">":
            return value > threshold
        elif condition == ">=":
            return value >= threshold
        elif condition == "<":
            return value < threshold
        elif condition == "<=":
            return value <= threshold
        elif condition == "==":
            return value == threshold
        elif condition == "!=":
            return value != threshold
        else:
            return False

class PrometheusMetricsRegistry:
    """Prometheus metrics registry with custom metrics"""

    def __init__(self):
        self.registry = CollectorRegistry()
        self.metrics: Dict[str, Any] = {}
        self._setup_default_metrics()

    def _setup_default_metrics(self):
        """Setup default application metrics"""
        metric_definitions = [
            MetricDefinition(
                "http_requests_total",
                "Total HTTP requests",
                MetricType.COUNTER,
                ["method", "endpoint", "status_code"]
            ),
            MetricDefinition(
                "http_request_duration_seconds",
                "HTTP request duration",
                MetricType.HISTOGRAM,
                ["method", "endpoint"],
                buckets=[0.1, 0.5, 1.0, 2.5, 5.0, 10.0]
            ),
            MetricDefinition(
                "websocket_connections_active",
                "Active WebSocket connections",
                MetricType.GAUGE,
                ["thread_id", "user_id"]
            ),
            MetricDefinition(
                "workflow_executions_total",
                "Total workflow executions",
                MetricType.COUNTER,
                ["workflow_name", "status"]
            ),
            MetricDefinition(
                "workflow_duration_seconds",
                "Workflow execution duration",
                MetricType.HISTOGRAM,
                ["workflow_name"],
                buckets=[1.0, 5.0, 10.0, 30.0, 60.0, 300.0]
            ),
            MetricDefinition(
                "redis_connections_active",
                "Active Redis connections",
                MetricType.GAUGE
            ),
            MetricDefinition(
                "memory_usage_bytes",
                "Memory usage in bytes",
                MetricType.GAUGE
            ),
            MetricDefinition(
                "cpu_usage_percent",
                "CPU usage percentage",
                MetricType.GAUGE
            ),
            MetricDefinition(
                "errors_total",
                "Total errors",
                MetricType.COUNTER,
                ["error_type", "component"]
            )
        ]

        for metric_def in metric_definitions:
            self.create_metric(metric_def)

    def create_metric(self, definition: MetricDefinition):
        """Create Prometheus metric"""
        if definition.metric_type == MetricType.COUNTER:
            metric = Counter(
                definition.name,
                definition.description,
                labelnames=definition.labels,
                registry=self.registry
            )
        elif definition.metric_type == MetricType.HISTOGRAM:
            metric = Histogram(
                definition.name,
                definition.description,
                labelnames=definition.labels,
                buckets=definition.buckets,
                registry=self.registry
            )
        elif definition.metric_type == MetricType.GAUGE:
            metric = Gauge(
                definition.name,
                definition.description,
                labelnames=definition.labels,
                registry=self.registry
            )
        elif definition.metric_type == MetricType.INFO:
            metric = Info(
                definition.name,
                definition.description,
                labelnames=definition.labels,
                registry=self.registry
            )
        else:
            raise ValueError(f"Unsupported metric type: {definition.metric_type}")

        self.metrics[definition.name] = metric

    def record_http_request(self, method: str, endpoint: str, status_code: int, duration: float):
        """Record HTTP request metrics"""
        if "http_requests_total" in self.metrics:
            self.metrics["http_requests_total"].labels(
                method=method,
                endpoint=endpoint,
                status_code=str(status_code)
            ).inc()

        if "http_request_duration_seconds" in self.metrics:
            self.metrics["http_request_duration_seconds"].labels(
                method=method,
                endpoint=endpoint
            ).observe(duration)

    def record_websocket_connection(self, thread_id: str, user_id: str, delta: int):
        """Record WebSocket connection change"""
        if "websocket_connections_active" in self.metrics:
            self.metrics["websocket_connections_active"].labels(
                thread_id=thread_id,
                user_id=user_id
            ).inc(delta)

    def record_workflow_execution(self, workflow_name: str, status: str, duration: float):
        """Record workflow execution"""
        if "workflow_executions_total" in self.metrics:
            self.metrics["workflow_executions_total"].labels(
                workflow_name=workflow_name,
                status=status
            ).inc()

        if "workflow_duration_seconds" in self.metrics:
            self.metrics["workflow_duration_seconds"].labels(
                workflow_name=workflow_name
            ).observe(duration)

    def record_error(self, error_type: str, component: str):
        """Record error"""
        if "errors_total" in self.metrics:
            self.metrics["errors_total"].labels(
                error_type=error_type,
                component=component
            ).inc()

    def update_system_metrics(self, metrics: Dict[str, Any]):
        """Update system metrics"""
        if "redis_connections_active" in self.metrics:
            self.metrics["redis_connections_active"].set(
                metrics.get("redis_connections", 0)
            )

        if "memory_usage_bytes" in self.metrics:
            self.metrics["memory_usage_bytes"].set(
                metrics.get("memory", {}).get("process_memory", 0)
            )

        if "cpu_usage_percent" in self.metrics:
            self.metrics["cpu_usage_percent"].set(
                metrics.get("cpu", {}).get("percent", 0)
            )

    def get_metrics(self) -> str:
        """Get Prometheus metrics string"""
        return generate_latest(self.registry).decode('utf-8')

class OpenTelemetryManager:
    """OpenTelemetry instrumentation manager"""

    def __init__(self, service_name: str, service_version: str,
                 jaeger_endpoint: Optional[str] = None,
                 prometheus_endpoint: Optional[str] = None):
        self.service_name = service_name
        self.service_version = service_version
        self.jaeger_endpoint = jaeger_endpoint
        self.prometheus_endpoint = prometheus_endpoint
        self.initialized = False

    def initialize(self):
        """Initialize OpenTelemetry"""
        if not OPENTELEMETRY_AVAILABLE:
            logger.warning("OpenTelemetry not available, skipping initialization")
            return

        try:
            # Create resource
            resource = Resource.create({
                ResourceAttributes.SERVICE_NAME: self.service_name,
                ResourceAttributes.SERVICE_VERSION: self.service_version,
            })

            # Initialize tracing
            if self.jaeger_endpoint:
                self._initialize_tracing(resource)

            # Initialize metrics
            if self.prometheus_endpoint:
                self._initialize_metrics(resource)

            # Set propagator
            trace.set_tracer_provider(TracerProvider(resource=resource))
            context.set_global_textmap(B3MultiFormat())

            self.initialized = True
            logger.info("OpenTelemetry initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize OpenTelemetry: {e}")

    def _initialize_tracing(self, resource: Resource):
        """Initialize distributed tracing"""
        trace_provider = TracerProvider(resource=resource)

        # Add Jaeger exporter
        jaeger_exporter = JaegerExporter(
            endpoint=self.jaeger_endpoint,
            collector_endpoint=self.jaeger_endpoint,
        )

        span_processor = BatchSpanProcessor(jaeger_exporter)
        trace_provider.add_span_processor(span_processor)

        trace.set_tracer_provider(trace_provider)

    def _initialize_metrics(self, resource: Resource):
        """Initialize metrics collection"""
        reader = PrometheusMetricReader()

        meter_provider = MeterProvider(metric_readers=[reader], resource=resource)
        metrics.set_meter_provider(meter_provider)

    def instrument_fastapi(self, app):
        """Instrument FastAPI application"""
        if not OPENTELEMETRY_AVAILABLE or not self.initialized:
            return

        try:
            FastAPIInstrumentor.instrument_app(app)
            logger.info("FastAPI instrumentation added")
        except Exception as e:
            logger.error(f"Failed to instrument FastAPI: {e}")

    def instrument_httpx(self):
        """Instrument HTTPX client"""
        if not OPENTELEMETRY_AVAILABLE or not self.initialized:
            return

        try:
            HTTPXClientInstrumentor().instrument()
            logger.info("HTTPX instrumentation added")
        except Exception as e:
            logger.error(f"Failed to instrument HTTPX: {e}")

    def instrument_redis(self):
        """Instrument Redis client"""
        if not OPENTELEMETRY_AVAILABLE or not self.initialized:
            return

        try:
            RedisInstrumentor().instrument()
            logger.info("Redis instrumentation added")
        except Exception as e:
            logger.error(f"Failed to instrument Redis: {e}")

    def create_span(self, name: str, kind: str = "internal") -> Any:
        """Create a new span"""
        if not OPENTELEMETRY_AVAILABLE or not self.initialized:
            return None

        tracer = trace.get_tracer(__name__)
        return tracer.start_span(name)

class ObservabilityManager:
    """
    Main observability manager combining all monitoring capabilities
    """

    def __init__(self,
                 service_name: str = "supplygraph-ai-engine",
                 service_version: str = "1.0.0",
                 redis_client: Optional[redis.Redis] = None,
                 jaeger_endpoint: Optional[str] = None,
                 prometheus_enabled: bool = True):

        self.service_name = service_name
        self.service_version = service_version
        self.redis_client = redis_client

        # Initialize components
        self.performance_metrics = PerformanceMetrics()
        self.alert_manager = AlertManager(redis_client)
        self.prometheus_registry = PrometheusMetricsRegistry()
        self.otel_manager = OpenTelemetryManager(
            service_name, service_version, jaeger_endpoint
        )

        # Health checks
        self.health_checks: Dict[str, HealthCheck] = {}

        # Setup default alerts
        self._setup_default_alerts()

        # Initialize OpenTelemetry
        if prometheus_enabled:
            self.otel_manager.initialize()

        # Background monitoring task
        self._monitoring_task: Optional[asyncio.Task] = None
        self._cleanup_task: Optional[asyncio.Task] = None
        self._shutdown = False

    def initialize(self):
        """Initialize all monitoring components"""
        # Start background tasks
        self._monitoring_task = asyncio.create_task(self._monitoring_loop())
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())

        logger.info("Observability manager initialized")

    def add_health_check(self, health_check: HealthCheck):
        """Add health check"""
        self.health_checks[health_check.name] = health_check

    async def check_health(self) -> Dict[str, Any]:
        """Perform health checks"""
        results = {}
        overall_status = HealthStatus.HEALTHY

        for name, health_check in self.health_checks.items():
            try:
                start_time = time.time()
                result = await asyncio.wait_for(
                    health_check.check_func(),
                    timeout=health_check.timeout
                )
                duration = time.time() - start_time

                results[name] = {
                    "status": HealthStatus.HEALTHY.value,
                    "message": "OK",
                    "duration": duration,
                    "critical": health_check.critical
                }

            except asyncio.TimeoutError:
                results[name] = {
                    "status": HealthStatus.UNHEALTHY.value,
                    "message": "Timeout",
                    "critical": health_check.critical
                }
                if health_check.critical:
                    overall_status = HealthStatus.UNHEALTHY

            except Exception as e:
                results[name] = {
                    "status": HealthStatus.UNHEALTHY.value,
                    "message": str(e),
                    "critical": health_check.critical
                }
                if health_check.critical:
                    overall_status = HealthStatus.UNHEALTHY

        # Add system metrics to health check
        system_metrics = self.performance_metrics.get_system_metrics()
        if system_metrics["application"]["error_rate"] > 0.1:  # 10% error rate
            overall_status = HealthStatus.DEGRADED

        return {
            "status": overall_status.value,
            "version": self.service_version,
            "timestamp": datetime.utcnow().isoformat(),
            "uptime": system_metrics["uptime_seconds"],
            "checks": results,
            "system": {
                "memory_percent": system_metrics["memory"]["percent"],
                "cpu_percent": system_metrics["cpu"]["percent"],
                "error_rate": system_metrics["application"]["error_rate"],
                "active_connections": system_metrics["application"]["active_connections"]
            }
        }

    def create_monitoring_middleware(self) -> BaseHTTPMiddleware:
        """Create monitoring middleware for FastAPI"""
        return MonitoringMiddleware(self)

    async def get_metrics(self) -> Dict[str, Any]:
        """Get comprehensive metrics"""
        system_metrics = self.performance_metrics.get_system_metrics()
        prometheus_metrics = self.prometheus_registry.get_metrics()

        # Get alert states
        active_alerts = [
            {"name": name, **state}
            for name, state in self.alert_manager.alert_states.items()
            if state.get("active", False)
        ]

        return {
            "system": system_metrics,
            "prometheus": prometheus_metrics,
            "alerts": {
                "active_count": len(active_alerts),
                "active_alerts": active_alerts,
                "total_definitions": len(self.alert_manager.alert_definitions)
            },
            "health": await self.check_health(),
            "collection": {
                "total_requests": self.performance_metrics.request_count,
                "total_errors": self.performance_metrics.error_count,
                "processed_messages": self.performance_metrics.processed_messages,
                "uptime_seconds": system_metrics["uptime_seconds"]
            }
        }

    def _setup_default_alerts(self):
        """Setup default alert definitions"""
        default_alerts = [
            AlertDefinition(
                "high_error_rate",
                "Error rate is above threshold",
                "application.error_rate",
                ">",
                0.05,  # 5% error rate
                AlertSeverity.WARNING,
                timedelta(minutes=5)
            ),
            AlertDefinition(
                "high_memory_usage",
                "Memory usage is above threshold",
                "memory.percent",
                ">",
                85.0,  # 85% memory usage
                AlertSeverity.WARNING,
                timedelta(minutes=2)
            ),
            AlertDefinition(
                "critical_memory_usage",
                "Critical memory usage",
                "memory.percent",
                ">",
                95.0,  # 95% memory usage
                AlertSeverity.CRITICAL,
                timedelta(minutes=1)
            ),
            AlertDefinition(
                "high_cpu_usage",
                "CPU usage is above threshold",
                "cpu.percent",
                ">",
                80.0,  # 80% CPU usage
                AlertSeverity.WARNING,
                timedelta(minutes=5)
            ),
            AlertDefinition(
                "no_active_connections",
                "No active WebSocket connections",
                "application.active_connections",
                "==",
                0,
                AlertSeverity.WARNING,
                timedelta(minutes=10)
            )
        ]

        for alert in default_alerts:
            self.alert_manager.add_alert(alert)

    async def _monitoring_loop(self):
        """Background monitoring loop"""
        while not self._shutdown:
            try:
                # Get system metrics
                system_metrics = self.performance_metrics.get_system_metrics()

                # Update Prometheus metrics
                self.prometheus_registry.update_system_metrics(system_metrics)

                # Evaluate alerts
                await self.alert_manager.evaluate_alerts(system_metrics)

                # Store metrics in Redis for historical tracking
                if self.redis_client:
                    await self._store_metrics(system_metrics)

            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")

            await asyncio.sleep(30)  # Monitor every 30 seconds

    async def _cleanup_loop(self):
        """Background cleanup loop"""
        while not self._shutdown:
            try:
                # Force garbage collection
                gc.collect()

                # Clean up old metrics in Redis
                if self.redis_client:
                    await self._cleanup_old_metrics()

            except Exception as e:
                logger.error(f"Error in cleanup loop: {e}")

            await asyncio.sleep(300)  # Cleanup every 5 minutes

    async def _store_metrics(self, metrics: Dict[str, Any]):
        """Store metrics in Redis"""
        try:
            timestamp = int(time.time())
            key = f"metrics:{timestamp}"

            await self.redis_client.hset(
                key,
                mapping={
                    "timestamp": timestamp,
                    "data": json.dumps(metrics, default=str)
                }
            )

            # Set expiration (7 days)
            await self.redis_client.expire(key, 7 * 24 * 3600)

            # Maintain only recent metrics (cleanup will handle old ones)
            await self.redis_client.zadd(
                "metrics_index",
                {key: timestamp}
            )

        except Exception as e:
            logger.error(f"Failed to store metrics: {e}")

    async def _cleanup_old_metrics(self):
        """Clean up old metrics in Redis"""
        try:
            # Remove metrics older than 7 days
            cutoff_time = int(time.time()) - (7 * 24 * 3600)

            await self.redis_client.zremrangebyscore(
                "metrics_index",
                "-inf",
                cutoff_time
            )

        except Exception as e:
            logger.error(f"Failed to cleanup old metrics: {e}")

    async def shutdown(self):
        """Shutdown observability manager"""
        logger.info("Shutting down observability manager...")
        self._shutdown = True

        # Cancel background tasks
        for task in [self._monitoring_task, self._cleanup_task]:
            if task and not task.done():
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass

        logger.info("Observability manager shutdown complete")

class MonitoringMiddleware(BaseHTTPMiddleware):
    """Middleware for HTTP request monitoring"""

    def __init__(self, observability_manager: ObservabilityManager):
        super().__init__()
        self.observability_manager = observability_manager

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process request with monitoring"""
        start_time = time.time()

        # Extract endpoint name
        endpoint = request.url.path
        if hasattr(request, 'route') and isinstance(request.route, APIRoute):
            endpoint = request.route.path

        # Process request
        response = await call_next(request)

        # Calculate duration
        duration = time.time() - start_time

        # Record metrics
        self.observability_manager.performance_metrics.record_request(
            duration, response.status_code
        )

        self.observability_manager.prometheus_registry.record_http_request(
            request.method, endpoint, response.status_code, duration
        )

        # Add performance headers
        response.headers["X-Process-Time"] = str(duration)
        response.headers["X-Request-ID"] = getattr(request.state, 'request_id', 'unknown')

        return response

# Utility functions

def setup_correlation_id():
    """Middleware to add correlation ID to requests"""
    async def add_correlation_id(request: Request, call_next: Callable):
        correlation_id = request.headers.get("X-Correlation-ID") or str(uuid.uuid4())
        request.state.correlation_id = correlation_id
        request.state.request_id = correlation_id

        response = await call_next(request)
        response.headers["X-Correlation-ID"] = correlation_id
        return response

    return add_correlation_id

@asynccontextmanager
async def span_context(name: str, attributes: Optional[Dict[str, str]] = None):
    """Context manager for span creation"""
    if not OPENTELEMETRY_AVAILABLE:
        yield
        return

    tracer = trace.get_tracer(__name__)
    with tracer.start_as_current_span(name) as span:
        if attributes:
            for key, value in attributes.items():
                span.set_attribute(key, value)
        yield

def create_application_health_checks(redis_client: redis.Redis,
                                   circuit_breakers: Dict[str, Any] = None) -> List[HealthCheck]:
    """Create standard health checks for the application"""
    health_checks = [
        HealthCheck(
            name="redis",
            description="Redis connection check",
            check_func=lambda: redis_client.ping(),
            timeout=5.0,
            critical=True
        ),
        HealthCheck(
            name="memory",
            description="Memory usage check",
            check_func=lambda: psutil.virtual_memory().percent < 95,
            timeout=1.0,
            critical=True
        ),
        HealthCheck(
            name="disk_space",
            description="Disk space check",
            check_func=lambda: psutil.disk_usage('/').percent < 90,
            timeout=1.0,
            critical=False
        )
    ]

    # Add circuit breaker health checks
    if circuit_breakers:
        for name, circuit_breaker in circuit_breakers.items():
            health_checks.append(HealthCheck(
                name=f"circuit_breaker_{name}",
                description=f"Circuit breaker {name} status",
                check_func=lambda cb=circuit_breaker: cb.state.value != "open",
                timeout=1.0,
                critical=True
            ))

    return health_checks

# Global observability instance
_observability_manager: Optional[ObservabilityManager] = None

def get_observability_manager() -> Optional[ObservabilityManager]:
    """Get global observability manager"""
    return _observability_manager

def set_observability_manager(manager: ObservabilityManager):
    """Set global observability manager"""
    global _observability_manager
    _observability_manager = manager