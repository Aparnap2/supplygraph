"""
Production-ready comprehensive logging and alerting system
"""
import json
import logging
import sys
import traceback
import asyncio
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional, Union, TextIO
from dataclasses import dataclass, field, asdict
from enum import Enum
from pathlib import Path
import uuid
import threading
from contextlib import asynccontextmanager
import socket
import os
import platform

import structlog
from loguru import logger
import redis.asyncio as redis
from prometheus_client import Counter

# Configure logging
logging.basicConfig(level=logging.INFO)

class LogLevel(Enum):
    """Log levels with numerical values"""
    TRACE = 5
    DEBUG = 10
    INFO = 20
    WARNING = 30
    ERROR = 40
    CRITICAL = 50

class LogCategory(Enum):
    """Log categories for filtering and analysis"""
    SYSTEM = "system"
    REQUEST = "request"
    RESPONSE = "response"
    WEBSOCKET = "websocket"
    WORKFLOW = "workflow"
    DATABASE = "database"
    CACHE = "cache"
    AUTH = "auth"
    SECURITY = "security"
    PERFORMANCE = "performance"
    BUSINESS = "business"
    EXTERNAL = "external"
    ERROR = "error"
    AUDIT = "audit"

class AlertChannel(Enum):
    """Alert notification channels"""
    SLACK = "slack"
    EMAIL = "email"
    WEBHOOK = "webhook"
    PAGERDUTY = "pagerduty"
    TEAMS = "teams"
    DISCORD = "discord"

@dataclass
class LogEntry:
    """Structured log entry"""
    timestamp: str
    level: str
    category: str
    message: str
    request_id: Optional[str] = None
    correlation_id: Optional[str] = None
    user_id: Optional[str] = None
    org_id: Optional[str] = None
    session_id: Optional[str] = None
    component: Optional[str] = None
    function: Optional[str] = None
    line_number: Optional[int] = None
    file_name: Optional[str] = None
    thread_id: Optional[str] = None
    process_id: Optional[int] = None
    host_name: Optional[str] = None
    service_name: Optional[str] = None
    service_version: Optional[str] = None
    environment: Optional[str] = None
    duration: Optional[float] = None
    status_code: Optional[int] = None
    error_type: Optional[str] = None
    error_code: Optional[str] = None
    stack_trace: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    source_ip: Optional[str] = None
    user_agent: Optional[str] = None
    trace_id: Optional[str] = None
    span_id: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        data = asdict(self)
        # Ensure all values are JSON serializable
        for key, value in data.items():
            if value is None:
                data[key] = None
        return data

    def to_json(self) -> str:
        """Convert to JSON string"""
        return json.dumps(self.to_dict(), default=str)

@dataclass
class AlertRule:
    """Alert rule definition"""
    name: str
    description: str
    log_level: LogLevel
    category: LogCategory
    condition: str  # Log message pattern or field condition
    threshold: int = 1  # Number of occurrences
    time_window: int = 300  # Time window in seconds
    channels: List[AlertChannel] = field(default_factory=list)
    enabled: bool = True
    cooldown: int = 600  # Cooldown period in seconds
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class LogConfiguration:
    """Logging configuration"""
    service_name: str
    service_version: str
    environment: str
    log_level: LogLevel = LogLevel.INFO
    enable_structured_logging: bool = True
    enable_json_output: bool = True
    enable_file_logging: bool = True
    file_path: Optional[str] = None
    max_file_size: int = 100 * 1024 * 1024  # 100MB
    backup_count: int = 5
    enable_redis_logging: bool = True
    redis_key_prefix: str = "logs"
    enable_console_logging: bool = True
    enable_performance_logging: bool = True
    log_sql_queries: bool = False
    log_http_requests: bool = True
    log_websocket_events: bool = True
    sensitive_fields: List[str] = field(default_factory=lambda: [
        "password", "token", "secret", "key", "credential",
        "authorization", "cookie", "session", "csrf"
    ])

class StructuredLogger:
    """
    Production-ready structured logger with advanced features:
    - JSON formatted logs
    - Context propagation
    - Sensitive data filtering
    - Performance tracking
    - Alerting integration
    - Multiple output destinations
    """

    def __init__(self, config: LogConfiguration, redis_client: Optional[redis.Redis] = None):
        self.config = config
        self.redis_client = redis_client

        # Context storage for log correlation
        self._context = threading.local()
        self._context_stack = []

        # Alert rules
        self.alert_rules: Dict[str, AlertRule] = {}
        self.alert_states: Dict[str, Dict[str, Any]] = {}

        # Metrics
        self.log_metrics = Counter(
            'log_entries_total',
            'Total log entries',
            ['level', 'category', 'component']
        )

        # Performance tracking
        self.performance_logs: List[Dict[str, Any]] = []
        self.max_performance_logs = 1000

        # Initialize structlog
        self._setup_structlog()

        # Setup log handlers
        self._setup_handlers()

    def _setup_structlog(self):
        """Setup structlog processors"""
        processors = [
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
        ]

        if self.config.enable_json_output:
            processors.append(structlog.processors.JSONRenderer())
        else:
            processors.append(structlog.dev.ConsoleRenderer())

        structlog.configure(
            processors=processors,
            wrapper_class=structlog.stdlib.BoundLogger,
            logger_factory=structlog.stdlib.LoggerFactory(),
            cache_logger_on_first_use=True,
        )

    def _setup_handlers(self):
        """Setup log handlers"""
        # Remove default handlers
        logger.remove()

        # Console handler
        if self.config.enable_console_logging:
            logger.add(
                sys.stderr,
                format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level} | {name}:{function}:{line} | {message}",
                level=self.config.log_level.name,
                colorize=True,
                backtrace=True,
                diagnose=True
            )

        # File handler
        if self.config.enable_file_logging and self.config.file_path:
            log_path = Path(self.config.file_path)
            log_path.parent.mkdir(parents=True, exist_ok=True)

            logger.add(
                self.config.file_path,
                format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level} | {name}:{function}:{line} | {message}",
                level=self.config.log_level.name,
                rotation=f"{self.config.max_file_size} B",
                retention=self.config.backup_count,
                compression="zip",
                backtrace=True,
                diagnose=True
            )

    def bind_context(self, **kwargs) -> 'StructuredLogger':
        """Bind context to logger"""
        # Store context in thread-local storage
        if not hasattr(self._context, 'data'):
            self._context.data = {}

        self._context.data.update(kwargs)
        return self

    def push_context(self, **kwargs) -> 'StructuredLogger':
        """Push new context onto stack"""
        current_context = self._get_current_context()
        new_context = {**current_context, **kwargs}
        self._context_stack.append(current_context)
        self._context.data = new_context
        return self

    def pop_context(self) -> 'StructuredLogger':
        """Pop context from stack"""
        if self._context_stack:
            self._context.data = self._context_stack.pop()
        return self

    def _get_current_context(self) -> Dict[str, Any]:
        """Get current context"""
        return getattr(self._context, 'data', {})

    def _filter_sensitive_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Filter sensitive data from log entries"""
        if not data:
            return data

        filtered_data = {}
        for key, value in data.items():
            key_lower = key.lower()
            if any(sensitive in key_lower for sensitive in self.config.sensitive_fields):
                filtered_data[key] = "***REDACTED***"
            elif isinstance(value, dict):
                filtered_data[key] = self._filter_sensitive_data(value)
            elif isinstance(value, list):
                filtered_data[key] = [
                    self._filter_sensitive_data(item) if isinstance(item, dict) else item
                    for item in value
                ]
            else:
                filtered_data[key] = value

        return filtered_data

    def _create_log_entry(self,
                         level: LogLevel,
                         category: LogCategory,
                         message: str,
                         **kwargs) -> LogEntry:
        """Create structured log entry"""
        context = self._get_current_context()

        # Extract system information
        exc_info = kwargs.pop('exc_info', None)
        stack_trace = None
        if exc_info:
            stack_trace = ''.join(traceback.format_exception(*exc_info))

        # Get calling frame information
        frame = None
        if kwargs.get('include_frame', True):
            frame = sys._getframe(2)  # Skip current frame and caller
            while frame:
                # Skip internal logging frames
                if not any(skip in frame.f_code.co_filename for skip in ['logging.py', 'structlog']):
                    break
                frame = frame.f_back

        log_entry = LogEntry(
            timestamp=datetime.now(timezone.utc).isoformat(),
            level=level.name,
            category=category.value,
            message=message,
            request_id=context.get('request_id') or kwargs.get('request_id'),
            correlation_id=context.get('correlation_id') or kwargs.get('correlation_id'),
            user_id=context.get('user_id') or kwargs.get('user_id'),
            org_id=context.get('org_id') or kwargs.get('org_id'),
            session_id=context.get('session_id') or kwargs.get('session_id'),
            component=context.get('component') or kwargs.get('component'),
            function=frame.f_code.co_name if frame else kwargs.get('function'),
            line_number=frame.f_lineno if frame else kwargs.get('line_number'),
            file_name=frame.f_code.co_filename if frame else kwargs.get('file_name'),
            thread_id=str(threading.get_ident()),
            process_id=os.getpid(),
            host_name=socket.gethostname(),
            service_name=self.config.service_name,
            service_version=self.config.service_version,
            environment=self.config.environment,
            duration=kwargs.get('duration'),
            status_code=kwargs.get('status_code'),
            error_type=kwargs.get('error_type'),
            error_code=kwargs.get('error_code'),
            stack_trace=stack_trace,
            metadata=self._filter_sensitive_data(kwargs.get('metadata', {})),
            tags=kwargs.get('tags', []),
            source_ip=kwargs.get('source_ip'),
            user_agent=kwargs.get('user_agent'),
            trace_id=context.get('trace_id') or kwargs.get('trace_id'),
            span_id=context.get('span_id') or kwargs.get('span_id')
        )

        return log_entry

    async def _write_log(self, log_entry: LogEntry):
        """Write log entry to all configured outputs"""
        # Update metrics
        self.log_metrics.labels(
            level=log_entry.level,
            category=log_entry.category,
            component=log_entry.component or 'unknown'
        ).inc()

        # Log to console/file (already handled by loguru)
        if self.config.enable_json_output:
            # Add structured logging
            structlog.get_logger().info(
                log_entry.message,
                **log_entry.to_dict()
            )

        # Write to Redis
        if self.config.enable_redis_logging and self.redis_client:
            try:
                await self._write_to_redis(log_entry)
            except Exception as e:
                # Don't let Redis logging failures break the application
                logger.error(f"Failed to write log to Redis: {e}")

        # Check for alerts
        await self._check_alerts(log_entry)

        # Track performance logs
        if (log_entry.category == LogCategory.PERFORMANCE.value and
            self.config.enable_performance_logging):
            self._track_performance_log(log_entry)

    async def _write_to_redis(self, log_entry: LogEntry):
        """Write log entry to Redis"""
        log_key = f"{self.config.redis_key_prefix}:{datetime.now().strftime('%Y%m%d')}"
        log_data = {
            "timestamp": log_entry.timestamp,
            "data": log_entry.to_json()
        }

        # Use Redis stream for structured logs
        await self.redis_client.xadd(log_key, log_data)

        # Set expiration for old log streams (30 days)
        await self.redis_client.expire(log_key, 30 * 24 * 3600)

    async def _check_alerts(self, log_entry: LogEntry):
        """Check if log entry triggers any alert rules"""
        try:
            for rule_name, rule in self.alert_rules.items():
                if not rule.enabled:
                    continue

                # Check if log entry matches rule
                if self._matches_alert_rule(log_entry, rule):
                    await self._trigger_alert(rule_name, rule, log_entry)

        except Exception as e:
            logger.error(f"Failed to check alerts: {e}")

    def _matches_alert_rule(self, log_entry: LogEntry, rule: AlertRule) -> bool:
        """Check if log entry matches alert rule"""
        # Check log level
        if log_entry.level != rule.log_level.name:
            return False

        # Check category
        if log_entry.category != rule.category.value:
            return False

        # Check condition (simple message match for now)
        if rule.condition and rule.condition.lower() not in log_entry.message.lower():
            return False

        return True

    async def _trigger_alert(self, rule_name: str, rule: AlertRule, log_entry: LogEntry):
        """Trigger alert for rule"""
        current_time = datetime.now(timezone.utc)
        alert_state = self.alert_states.get(rule_name, {
            "count": 0,
            "first_triggered": None,
            "last_triggered": None,
            "last_sent": None
        })

        # Update alert state
        alert_state["count"] += 1
        alert_state["last_triggered"] = current_time

        if not alert_state["first_triggered"]:
            alert_state["first_triggered"] = current_time

        # Check if we should send alert
        time_since_first = (current_time - alert_state["first_triggered"]).total_seconds()
        cooldown_expired = (
            not alert_state["last_sent"] or
            (current_time - alert_state["last_sent"]).total_seconds() >= rule.cooldown
        )

        if (time_since_first >= rule.time_window and
            alert_state["count"] >= rule.threshold and
            cooldown_expired):

            alert_data = {
                "rule_name": rule_name,
                "description": rule.description,
                "log_level": rule.log_level.name,
                "category": rule.category.value,
                "count": alert_state["count"],
                "time_window": rule.time_window,
                "threshold": rule.threshold,
                "first_triggered": alert_state["first_triggered"].isoformat(),
                "last_triggered": alert_state["last_triggered"].isoformat(),
                "sample_log": log_entry.to_dict(),
                "timestamp": current_time.isoformat()
            }

            await self._send_alert(rule, alert_data)
            alert_state["last_sent"] = current_time

        self.alert_states[rule_name] = alert_state

    async def _send_alert(self, rule: AlertRule, alert_data: Dict[str, Any]):
        """Send alert through configured channels"""
        logger.warning(f"ALERT TRIGGERED: {rule.name} - {rule.description}")

        # Store alert in Redis
        if self.redis_client:
            try:
                await self.redis_client.lpush(
                    "alerts",
                    json.dumps(alert_data, default=str)
                )
                await self.redis_client.ltrim("alerts", 0, 999)  # Keep last 1000
            except Exception as e:
                logger.error(f"Failed to store alert in Redis: {e}")

        # Send to alert channels (placeholder for actual implementations)
        for channel in rule.channels:
            try:
                if channel == AlertChannel.SLACK:
                    await self._send_slack_alert(alert_data)
                elif channel == AlertChannel.EMAIL:
                    await self._send_email_alert(alert_data)
                elif channel == AlertChannel.WEBHOOK:
                    await self._send_webhook_alert(alert_data)
                # Add other channels as needed
            except Exception as e:
                logger.error(f"Failed to send alert to {channel.value}: {e}")

    async def _send_slack_alert(self, alert_data: Dict[str, Any]):
        """Send alert to Slack (placeholder)"""
        # Implement Slack webhook integration
        logger.info(f"Slack alert would be sent: {alert_data['rule_name']}")

    async def _send_email_alert(self, alert_data: Dict[str, Any]):
        """Send alert via email (placeholder)"""
        # Implement email integration
        logger.info(f"Email alert would be sent: {alert_data['rule_name']}")

    async def _send_webhook_alert(self, alert_data: Dict[str, Any]):
        """Send alert to webhook (placeholder)"""
        # Implement webhook integration
        logger.info(f"Webhook alert would be sent: {alert_data['rule_name']}")

    def _track_performance_log(self, log_entry: LogEntry):
        """Track performance logs for analysis"""
        perf_data = {
            "timestamp": log_entry.timestamp,
            "component": log_entry.component,
            "function": log_entry.function,
            "duration": log_entry.duration,
            "message": log_entry.message,
            "metadata": log_entry.metadata
        }

        self.performance_logs.append(perf_data)

        # Keep only recent performance logs
        if len(self.performance_logs) > self.max_performance_logs:
            self.performance_logs.pop(0)

    # Public logging methods

    async def trace(self, message: str, category: LogCategory = LogCategory.SYSTEM, **kwargs):
        """Log trace message"""
        log_entry = self._create_log_entry(LogLevel.TRACE, category, message, **kwargs)
        await self._write_log(log_entry)

    async def debug(self, message: str, category: LogCategory = LogCategory.SYSTEM, **kwargs):
        """Log debug message"""
        log_entry = self._create_log_entry(LogLevel.DEBUG, category, message, **kwargs)
        await self._write_log(log_entry)

    async def info(self, message: str, category: LogCategory = LogCategory.SYSTEM, **kwargs):
        """Log info message"""
        log_entry = self._create_log_entry(LogLevel.INFO, category, message, **kwargs)
        await self._write_log(log_entry)

    async def warning(self, message: str, category: LogCategory = LogCategory.SYSTEM, **kwargs):
        """Log warning message"""
        log_entry = self._create_log_entry(LogLevel.WARNING, category, message, **kwargs)
        await self._write_log(log_entry)

    async def error(self, message: str, category: LogCategory = LogCategory.ERROR, **kwargs):
        """Log error message"""
        log_entry = self._create_log_entry(LogLevel.ERROR, category, message, **kwargs)
        await self._write_log(log_entry)

    async def critical(self, message: str, category: LogCategory = LogCategory.ERROR, **kwargs):
        """Log critical message"""
        log_entry = self._create_log_entry(LogLevel.CRITICAL, category, message, **kwargs)
        await self._write_log(log_entry)

    async def audit(self, message: str, **kwargs):
        """Log audit message (always INFO level)"""
        log_entry = self._create_log_entry(LogLevel.INFO, LogCategory.AUDIT, message, **kwargs)
        await self._write_log(log_entry)

    async def security(self, message: str, severity: str = "medium", **kwargs):
        """Log security event"""
        kwargs.setdefault("metadata", {})["severity"] = severity
        log_entry = self._create_log_entry(
            LogLevel.WARNING,
            LogCategory.SECURITY,
            message,
            **kwargs
        )
        await self._write_log(log_entry)

    # Convenience methods

    def add_alert_rule(self, rule: AlertRule):
        """Add alert rule"""
        self.alert_rules[rule.name] = rule

    def remove_alert_rule(self, rule_name: str):
        """Remove alert rule"""
        self.alert_rules.pop(rule_name, None)

    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics from logs"""
        if not self.performance_logs:
            return {}

        # Calculate basic statistics
        durations = [log["duration"] for log in self.performance_logs if log["duration"]]
        if not durations:
            return {}

        return {
            "total_requests": len(self.performance_logs),
            "avg_duration": sum(durations) / len(durations),
            "min_duration": min(durations),
            "max_duration": max(durations),
            "p50_duration": sorted(durations)[len(durations) // 2],
            "p95_duration": sorted(durations)[int(len(durations) * 0.95)],
            "p99_duration": sorted(durations)[int(len(durations) * 0.99)],
            "slow_requests": [log for log in self.performance_logs if log["duration"] and log["duration"] > 5.0]
        }

    async def search_logs(self,
                         query: Optional[str] = None,
                         level: Optional[str] = None,
                         category: Optional[str] = None,
                         start_time: Optional[datetime] = None,
                         end_time: Optional[datetime] = None,
                         limit: int = 100) -> List[Dict[str, Any]]:
        """Search logs in Redis"""
        if not self.redis_client:
            return []

        try:
            # Get log streams for the date range
            if not start_time:
                start_time = datetime.now(timezone.utc) - timedelta(hours=24)
            if not end_time:
                end_time = datetime.now(timezone.utc)

            results = []
            current_date = start_time.date()

            while current_date <= end_time.date():
                stream_key = f"{self.config.redis_key_prefix}:{current_date.strftime('%Y%m%d')}"

                try:
                    # Read from stream
                    entries = await self.redis_client.xread(
                        {stream_key: 0},
                        count=limit,
                        block=1000
                    )

                    for stream, log_entries in entries:
                        for log_id, fields in log_entries:
                            try:
                                log_data = json.loads(fields["data"])
                                log_timestamp = datetime.fromisoformat(log_data["timestamp"].replace('Z', '+00:00'))

                                # Apply filters
                                if start_time and log_timestamp < start_time:
                                    continue
                                if end_time and log_timestamp > end_time:
                                    continue
                                if level and log_data.get("level") != level:
                                    continue
                                if category and log_data.get("category") != category:
                                    continue
                                if query and query.lower() not in log_data.get("message", "").lower():
                                    continue

                                results.append(log_data)
                                if len(results) >= limit:
                                    break

                            except (json.JSONDecodeError, KeyError, ValueError):
                                continue

                        if len(results) >= limit:
                            break

                except Exception:
                    # Stream might not exist
                    pass

                current_date += timedelta(days=1)

            return results[:limit]

        except Exception as e:
            logger.error(f"Failed to search logs: {e}")
            return []

    async def cleanup_old_logs(self, days_to_keep: int = 30):
        """Clean up old log streams"""
        if not self.redis_client:
            return

        try:
            cutoff_date = datetime.now(timezone.utc).date() - timedelta(days=days_to_keep)
            pattern = f"{self.config.redis_key_prefix}:*"

            keys = await self.redis_client.keys(pattern)
            deleted_count = 0

            for key in keys:
                try:
                    # Extract date from key
                    date_part = key.decode().split(':')[-1]
                    key_date = datetime.strptime(date_part, '%Y%m%d').date()

                    if key_date < cutoff_date:
                        await self.redis_client.delete(key)
                        deleted_count += 1

                except (ValueError, IndexError):
                    continue

            logger.info(f"Cleaned up {deleted_count} old log streams")

        except Exception as e:
            logger.error(f"Failed to cleanup old logs: {e}")

@asynccontextmanager
async def performance_logger(logger_instance: StructuredLogger,
                            operation: str,
                            component: Optional[str] = None,
                            category: LogCategory = LogCategory.PERFORMANCE):
    """Context manager for performance logging"""
    start_time = asyncio.get_event_loop().time()

    try:
        yield
        duration = asyncio.get_event_loop().time() - start_time

        await logger_instance.info(
            f"Operation completed: {operation}",
            category=category,
            component=component,
            duration=duration,
            function=operation,
            metadata={"operation": operation, "duration": duration}
        )

    except Exception as e:
        duration = asyncio.get_event_loop().time() - start_time

        await logger_instance.error(
            f"Operation failed: {operation}",
            category=LogCategory.ERROR,
            component=component,
            duration=duration,
            function=operation,
            error_type=type(e).__name__,
            metadata={"operation": operation, "duration": duration, "error": str(e)},
            exc_info=True
        )
        raise

# Global logger instance
_logger_instance: Optional[StructuredLogger] = None

def initialize_logging(config: LogConfiguration,
                      redis_client: Optional[redis.Redis] = None) -> StructuredLogger:
    """Initialize global logging system"""
    global _logger_instance
    _logger_instance = StructuredLogger(config, redis_client)

    # Setup default alert rules
    _logger_instance.add_alert_rule(AlertRule(
        name="high_error_rate",
        description="High error rate detected",
        log_level=LogLevel.ERROR,
        category=LogCategory.ERROR,
        condition="error",
        threshold=10,
        time_window=300,  # 5 minutes
        channels=[AlertChannel.SLACK],
        cooldown=1800  # 30 minutes
    ))

    _logger_instance.add_alert_rule(AlertRule(
        name="security_violation",
        description="Security violation detected",
        log_level=LogLevel.WARNING,
        category=LogCategory.SECURITY,
        condition="security",
        threshold=1,
        time_window=60,  # 1 minute
        channels=[AlertChannel.SLACK, AlertChannel.EMAIL],
        cooldown=600  # 10 minutes
    ))

    return _logger_instance

def get_logger() -> Optional[StructuredLogger]:
    """Get global logger instance"""
    return _logger_instance

async def log_request(logger_instance: StructuredLogger,
                      request: Any,
                      response: Optional[Any] = None,
                      duration: Optional[float] = None,
                      error: Optional[Exception] = None):
    """Log HTTP request/response"""
    metadata = {
        "method": request.method,
        "url": str(request.url),
        "path": request.url.path,
        "query_params": dict(request.query_params),
        "headers": dict(request.headers),
        "client_ip": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent")
    }

    if response:
        metadata.update({
            "status_code": response.status_code,
            "response_headers": dict(response.headers)
        })

    if error:
        await logger_instance.error(
            f"Request failed: {request.method} {request.url.path}",
            category=LogCategory.REQUEST,
            error_type=type(error).__name__,
            status_code=getattr(response, 'status_code', 500),
            duration=duration,
            metadata=metadata,
            exc_info=True
        )
    else:
        await logger_instance.info(
            f"Request completed: {request.method} {request.url.path}",
            category=LogCategory.REQUEST,
            status_code=response.status_code if response else 200,
            duration=duration,
            metadata=metadata
        )

# Utility functions for log analysis

def create_log_query(
    level: Optional[str] = None,
    category: Optional[str] = None,
    message_contains: Optional[str] = None,
    component: Optional[str] = None,
    user_id: Optional[str] = None,
    org_id: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None
) -> Dict[str, Any]:
    """Create log search query"""
    query = {}

    if level:
        query["level"] = level
    if category:
        query["category"] = category
    if message_contains:
        query["message_contains"] = message_contains
    if component:
        query["component"] = component
    if user_id:
        query["user_id"] = user_id
    if org_id:
        query["org_id"] = org_id
    if start_time:
        query["start_time"] = start_time.isoformat()
    if end_time:
        query["end_time"] = end_time.isoformat()

    return query

def calculate_log_metrics(logs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate metrics from log entries"""
    if not logs:
        return {}

    # Basic counts
    level_counts = {}
    category_counts = {}
    error_types = {}

    for log in logs:
        # Count by level
        level = log.get("level", "UNKNOWN")
        level_counts[level] = level_counts.get(level, 0) + 1

        # Count by category
        category = log.get("category", "unknown")
        category_counts[category] = category_counts.get(category, 0) + 1

        # Count error types
        error_type = log.get("error_type")
        if error_type:
            error_types[error_type] = error_types.get(error_type, 0) + 1

    # Calculate rates
    total_logs = len(logs)
    error_logs = level_counts.get("ERROR", 0) + level_counts.get("CRITICAL", 0)
    error_rate = error_logs / total_logs if total_logs > 0 else 0

    return {
        "total_logs": total_logs,
        "error_rate": error_rate,
        "level_distribution": level_counts,
        "category_distribution": category_counts,
        "error_types": error_types,
        "time_range": {
            "start": min(log["timestamp"] for log in logs),
            "end": max(log["timestamp"] for log in logs)
        }
    }