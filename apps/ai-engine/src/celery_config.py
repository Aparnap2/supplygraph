"""
Production-ready Celery configuration using Valkey as broker
Optimized for AGUI workloads and concurrent task processing.
"""
import os
import logging
from celery import Celery
from kombu import Queue, Exchange
from kombu.transport.redis import Transport
from typing import Dict, Any, Optional

# Configure logging
logger = logging.getLogger(__name__)

# Celery configuration optimized for Valkey
CELERY_CONFIG = {
    # Broker configuration for Valkey (Redis-compatible)
    'broker_url': os.getenv('CELERY_BROKER_URL', 'valkey://localhost:6379/0'),
    'result_backend': os.getenv('CELERY_RESULT_BACKEND', 'valkey://localhost:6379/0'),

    # Transport-specific settings for Valkey
    'broker_transport_options': {
        # Connection settings optimized for AGUI workloads
        'max_connections': 50,  # High concurrency
        'max_connections_per_pool': 10,
        'connection_pool_kwargs': {
            'socket_timeout': 5.0,
            'socket_connect_timeout': 2.0,
            'socket_keepalive': True,
            'health_check_interval': 15.0,
        },

        # Visibility timeout (important for long-running AI tasks)
        'visibility_timeout': 3600,  # 1 hour for AI processing

        # Retry and reliability settings
        'retry_policy': {
            'max_retries': 3,
            'interval_start': 0,
            'interval_step': 0.2,
            'interval_max': 0.2,
        },

        # Reliability settings
        'ack_late': True,
        'reject_on_worker_lost': True,
        'task_reject_on_worker_lost': True,
        'worker_prefetch_multiplier': 1,  # For AGUI real-time responsiveness

        # Performance optimizations
        'compression': 'gzip',  # Compress large task payloads
        'transport_options': {
            'visibility_timeout': 3600,
            'retry_policy': {
                'timeout': 5.0
            }
        }
    },

    # Result backend settings
    'result_backend_transport_options': {
        'master_name': 'mymaster',
        'socket_timeout': 5.0,
        'socket_connect_timeout': 2.0,
        'retry_on_timeout': True,
    },

    # Task routing for AGUI workloads
    'task_routes': {
        'src.tasks.workflow_tasks.*': {'queue': 'workflow'},
        'src.tasks.websocket_tasks.*': {'queue': 'websocket'},
        'src.tasks.email_tasks.*': {'queue': 'email'},
        'src.tasks.monitoring_tasks.*': {'queue': 'monitoring'},
        'src.tasks.background_tasks.*': {'queue': 'background'},
    },

    # Queue definitions for different AGUI workload types
    'task_default_queue': 'default',
    'task_queues': (
        Queue('default', Exchange('default'), routing_key='default',
              queue_arguments={'x-max-priority': 5}),

        # High-priority WebSocket and real-time tasks
        Queue('websocket', Exchange('websocket'), routing_key='websocket',
              queue_arguments={'x-max-priority': 10}),

        # AI workflow tasks (can be long-running)
        Queue('workflow', Exchange('workflow'), routing_key='workflow',
              queue_arguments={'x-max-priority': 7, 'x-message-ttl': 3600000}),

        # Email tasks (lower priority)
        Queue('email', Exchange('email'), routing_key='email',
              queue_arguments={'x-max-priority': 3}),

        # Monitoring and health checks
        Queue('monitoring', Exchange('monitoring'), routing_key='monitoring',
              queue_arguments={'x-max-priority': 8}),

        # Background maintenance tasks
        Queue('background', Exchange('background'), routing_key='background',
              queue_arguments={'x-max-priority': 2}),
    ),

    # Worker configuration for AGUI workloads
    'worker_prefetch_multiplier': 1,  # Real-time responsiveness
    'task_acks_late': True,
    'task_reject_on_worker_lost': True,
    'task_ignore_result': False,  # Store results for AGUI state management
    'result_expires': 3600,  # 1 hour result expiry
    'result_serializer': 'json',
    'task_serializer': 'json',
    'accept_content': ['json'],
    'enable_utc': True,
    'timezone': 'UTC',

    # Concurrency settings optimized for AGUI
    'worker_concurrency': int(os.getenv('CELERY_WORKER_CONCURRENCY', '4')),
    'worker_disable_rate_limits': False,
    'worker_max_tasks_per_child': 1000,
    'worker_max_memory_per_child': 200000,  # 200MB limit

    # Monitoring and observability
    'worker_send_task_events': True,
    'task_send_sent_event': True,
    'task_track_started': True,

    # Error handling and retries
    'task_default_retry_delay': 60,  # 1 minute
    'task_default_max_retries': 3,
    'task_default_retry_policy': {
        'max_retries': 3,
        'interval_start': 0,
        'interval_step': 0.2,
        'interval_max': 0.2,
    },

    # Beat scheduler for periodic tasks
    'beat_schedule': {
        'cleanup-expired-sessions': {
            'task': 'src.tasks.session_tasks.cleanup_expired_sessions',
            'schedule': 300.0,  # Every 5 minutes
        },
        'health-check': {
            'task': 'src.tasks.monitoring_tasks.health_check',
            'schedule': 60.0,  # Every minute
        },
        'cleanup-expired-workflows': {
            'task': 'src.tasks.workflow_tasks.cleanup_expired_workflows',
            'schedule': 900.0,  # Every 15 minutes
        },
        'update-metrics': {
            'task': 'src.tasks.monitoring_tasks.update_metrics',
            'schedule': 30.0,  # Every 30 seconds
        },
    },
}

def create_celery_app(name: str = 'supplygraph-ai-engine') -> Celery:
    """
    Create and configure a Celery application optimized for Valkey
    """
    app = Celery(name)

    # Apply configuration
    app.conf.update(CELERY_CONFIG)

    # Auto-discover tasks
    app.autodiscover_tasks(['src.tasks'])

    # Configure logging for Celery
    app.conf.update(
        worker_log_color=False,
        worker_log_format='[%(asctime)s: %(levelname)s/%(processName)s] %(message)s',
        worker_task_log_format='[%(asctime)s: %(levelname)s/%(processName)s][%(task_name)s(%(task_id)s)] %(message)s',
    )

    logger.info(f"Celery app '{name}' configured with Valkey broker")

    return app

# Create default Celery instance
celery_app = create_celery_app()

# Utility functions for specific AGUI task types

def send_realtime_task(task_name: str, *args, **kwargs):
    """
    Send a high-priority real-time task for AGUI interactions
    """
    return celery_app.send_task(
        task_name,
        args=args,
        kwargs=kwargs,
        queue='websocket',
        priority=10,
        expires=60  # 1 minute expiry for real-time tasks
    )

def send_workflow_task(task_name: str, *args, **kwargs):
    """
    Send a workflow task for AI processing
    """
    return celery_app.send_task(
        task_name,
        args=args,
        kwargs=kwargs,
        queue='workflow',
        priority=7,
        expires=3600  # 1 hour expiry for workflow tasks
    )

def send_email_task(task_name: str, *args, **kwargs):
    """
    Send an email task (lower priority)
    """
    return celery_app.send_task(
        task_name,
        args=args,
        kwargs=kwargs,
        queue='email',
        priority=3,
        expires=1800  # 30 minutes expiry for email tasks
    )

def send_monitoring_task(task_name: str, *args, **kwargs):
    """
    Send a monitoring task (high priority for health)
    """
    return celery_app.send_task(
        task_name,
        args=args,
        kwargs=kwargs,
        queue='monitoring',
        priority=8,
        expires=300  # 5 minutes expiry for monitoring
    )

def send_background_task(task_name: str, *args, **kwargs):
    """
    Send a background maintenance task (low priority)
    """
    return celery_app.send_task(
        task_name,
        args=args,
        kwargs=kwargs,
        queue='background',
        priority=2,
        expires=7200  # 2 hours expiry for background tasks
    )

# Task decorators for different priorities
def realtime_task(func):
    """Decorator for real-time WebSocket tasks"""
    func.bind = celery_app.task(
        name=f'websocket.{func.__name__}',
        queue='websocket',
        priority=10,
        bind=True,
        autoretry_for=(Exception,),
        retry_kwargs={'max_retries': 2, 'countdown': 5}
    )
    return func

def workflow_task(func):
    """Decorator for AI workflow tasks"""
    func.bind = celery_app.task(
        name=f'workflow.{func.__name__}',
        queue='workflow',
        priority=7,
        bind=True,
        autoretry_for=(Exception,),
        retry_kwargs={'max_retries': 3, 'countdown': 60}
    )
    return func

def email_task(func):
    """Decorator for email tasks"""
    func.bind = celery_app.task(
        name=f'email.{func.__name__}',
        queue='email',
        priority=3,
        bind=True,
        autoretry_for=(Exception,),
        retry_kwargs={'max_retries': 5, 'countdown': 300}
    )
    return func

def monitoring_task(func):
    """Decorator for monitoring tasks"""
    func.bind = celery_app.task(
        name=f'monitoring.{func.__name__}',
        queue='monitoring',
        priority=8,
        bind=True,
        autoretry_for=(Exception,),
        retry_kwargs={'max_retries': 1, 'countdown': 10}
    )
    return func

def background_task(func):
    """Decorator for background tasks"""
    func.bind = celery_app.task(
        name=f'background.{func.__name__}',
        queue='background',
        priority=2,
        bind=True,
        autoretry_for=(Exception,),
        retry_kwargs={'max_retries': 3, 'countdown': 600}
    )
    return func

# Health check and monitoring functions
async def get_celery_health() -> Dict[str, Any]:
    """Get Celery health status"""
    try:
        # Check if broker is accessible
        inspect = celery_app.control.inspect()

        # Get active workers
        stats = inspect.stats()
        active = inspect.active()

        return {
            'healthy': bool(stats and active),
            'workers': len(stats) if stats else 0,
            'active_tasks': sum(len(tasks) for tasks in (active or {}).values()),
            'broker_url': celery_app.conf.broker_url,
            'result_backend': celery_app.conf.result_backend
        }

    except Exception as e:
        logger.error(f"Celery health check failed: {e}")
        return {
            'healthy': False,
            'error': str(e),
            'broker_url': celery_app.conf.broker_url,
            'result_backend': celery_app.conf.result_backend
        }

async def get_queue_stats() -> Dict[str, Any]:
    """Get queue statistics for monitoring"""
    try:
        inspect = celery_app.control.inspect()

        # Get active queues and their lengths
        active_queues = inspect.active_queues()
        if not active_queues:
            return {}

        # Aggregate stats by queue
        queue_stats = {}
        for worker, queues in (active_queues or {}).items():
            for queue_info in queues:
                queue_name = queue_info['name']
                if queue_name not in queue_stats:
                    queue_stats[queue_name] = {
                        'workers': 0,
                        'consumers': 0
                    }
                queue_stats[queue_name]['workers'] += 1
                queue_stats[queue_name]['consumers'] += queue_info.get('consumers', 0)

        return queue_stats

    except Exception as e:
        logger.error(f"Failed to get queue stats: {e}")
        return {}

# Cleanup function for graceful shutdown
async def cleanup_celery():
    """Cleanup Celery connections"""
    try:
        # Close broker connection
        celery_app.close()
        logger.info("Celery connections closed")
    except Exception as e:
        logger.error(f"Error closing Celery connections: {e}")