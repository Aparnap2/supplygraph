"""
Production-ready LangGraph state management with Valkey integration
"""
import asyncio
import json
import pickle
import gzip
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Union, Type, TypeVar, Generic
from dataclasses import dataclass, field, asdict
from enum import Enum
import uuid
import logging

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langgraph.checkpoint.base import BaseCheckpointSaver, checkpoint, SerializerProtocol
from langgraph.checkpoint.base import Checkpoint, CheckpointMetadata
import redis.asyncio as redis
import asyncio_atexit
from .valkey_manager import get_valkey_manager

# Configure logging
logger = logging.getLogger(__name__)

T = TypeVar('T')

class StateCompression(Enum):
    """State compression methods"""
    NONE = "none"
    GZIP = "gzip"
    BROTLI = "brotli"
    LZ4 = "lz4"

class StateVersion(Enum):
    """State versioning for migrations"""
    V1_0_0 = "1.0.0"
    V1_1_0 = "1.1.0"
    V1_2_0 = "1.2.0"
    CURRENT = V1_2_0

@dataclass
class StateMetadata:
    """Extended state metadata"""
    # Core metadata
    thread_id: str
    checkpoint_id: str
    checkpoint_ns: str
    checkpoint_ts: str

    # Extended metadata
    org_id: Optional[str] = None
    user_id: Optional[str] = None
    workflow_name: Optional[str] = None
    workflow_version: str = "1.0.0"
    state_version: StateVersion = StateVersion.CURRENT

    # State tracking
    node_count: int = 0
    message_count: int = 0
    ui_component_count: int = 0
    execution_time: float = 0.0
    memory_usage: int = 0

    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None

    # State quality
    corruption_detected: bool = False
    corruption_hash: Optional[str] = None
    backup_checkpoint_id: Optional[str] = None

    # Performance metrics
    serialization_time: float = 0.0
    compression_time: float = 0.0
    storage_time: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary with proper serialization"""
        data = asdict(self)
        # Convert datetime objects to ISO strings
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat() if value else None
            elif isinstance(value, StateVersion):
                data[key] = value.value
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'StateMetadata':
        """Create from dictionary with proper deserialization"""
        # Convert ISO strings back to datetime
        for key, value in data.items():
            if key.endswith('_at') and value and isinstance(value, str):
                try:
                    data[key] = datetime.fromisoformat(value)
                except ValueError:
                    data[key] = None
            elif key == 'state_version' and value:
                data[key] = StateVersion(value)

        return cls(**data)

class StateCorruptionError(Exception):
    """State corruption detected error"""
    def __init__(self, checkpoint_id: str, corruption_type: str):
        self.checkpoint_id = checkpoint_id
        self.corruption_type = corruption_type
        super().__init__(f"State corruption detected in {checkpoint_id}: {corruption_type}")

class StateMigrationError(Exception):
    """State migration error"""
    def __init__(self, from_version: str, to_version: str, reason: str):
        self.from_version = from_version
        self.to_version = to_version
        self.reason = reason
        super().__init__(f"Failed to migrate state from {from_version} to {to_version}: {reason}")

class RedisStateSerializer(SerializerProtocol):
    """Advanced state serializer with compression and validation"""

    def __init__(self,
                 compression: StateCompression = StateCompression.GZIP,
                 validate_checksum: bool = True,
                 max_size: int = 10 * 1024 * 1024):  # 10MB
        self.compression = compression
        self.validate_checksum = validate_checksum
        self.max_size = max_size

    def dumps(self, obj: Any) -> bytes:
        """Serialize object with compression and validation"""
        try:
            # Serialize using pickle (fastest for complex objects)
            data = pickle.dumps(obj, protocol=pickle.HIGHEST_PROTOCOL)

            # Validate size
            if len(data) > self.max_size:
                raise ValueError(f"Serialized data size {len(data)} exceeds limit {self.max_size}")

            # Apply compression
            if self.compression == StateCompression.GZIP:
                data = gzip.compress(data, compresslevel=6)
            elif self.compression == StateCompression.BROTLI:
                try:
                    import brotli
                    data = brotli.compress(data, quality=5)
                except ImportError:
                    logger.warning("Brotli not available, falling back to gzip")
                    data = gzip.compress(data, compresslevel=6)
            elif self.compression == StateCompression.LZ4:
                try:
                    import lz4.frame
                    data = lz4.frame.compress(data, compression_level=5)
                except ImportError:
                    logger.warning("LZ4 not available, falling back to gzip")
                    data = gzip.compress(data, compresslevel=6)

            # Add checksum for validation
            if self.validate_checksum:
                checksum = hashlib.sha256(data).hexdigest()
                data = checksum.encode() + b'|' + data

            return data

        except Exception as e:
            raise ValueError(f"Serialization failed: {e}")

    def loads(self, data: bytes) -> Any:
        """Deserialize object with validation"""
        try:
            # Validate and remove checksum
            if self.validate_checksum:
                if b'|' not in data:
                    raise ValueError("Missing checksum in serialized data")

                stored_checksum, serialized_data = data.split(b'|', 1)
                calculated_checksum = hashlib.sha256(serialized_data).hexdigest()

                if stored_checksum.decode() != calculated_checksum:
                    raise ValueError("Checksum mismatch - data corruption detected")

                data = serialized_data
            else:
                data = data

            # Decompress if needed
            if self.compression == StateCompression.GZIP:
                data = gzip.decompress(data)
            elif self.compression == StateCompression.BROTLI:
                try:
                    import brotli
                    data = brotli.decompress(data)
                except ImportError:
                    logger.warning("Brotli not available, assuming gzip")
                    data = gzip.decompress(data)
            elif self.compression == StateCompression.LZ4:
                try:
                    import lz4.frame
                    data = lz4.frame.decompress(data)
                except ImportError:
                    logger.warning("LZ4 not available, assuming gzip")
                    data = gzip.decompress(data)

            # Deserialize
            return pickle.loads(data)

        except Exception as e:
            raise ValueError(f"Deserialization failed: {e}")

class RedisCheckpointSaver(BaseCheckpointSaver):
    """
    Production-ready Valkey checkpoint saver with advanced features:
    - State compression
    - Versioning and migration
    - Corruption detection
    - Backup and recovery
    - Performance monitoring
    - Concurrent workflow handling
    - Optimized for AGUI workloads
    """

    def __init__(self,
                 redis_client: redis.Redis,
                 prefix: str = "checkpoint:",
                 serializer: Optional[SerializerProtocol] = None,
                 ttl: Optional[int] = None,  # Auto-expire checkpoints
                 backup_ttl: Optional[int] = None,
                 max_checkpoints_per_thread: int = 100,
                 enable_compression: bool = True,
                 enable_validation: bool = True):

        self.redis_client = redis_client
        self.prefix = prefix
        self.serializer = serializer or RedisStateSerializer()
        self.ttl = ttl
        self.backup_ttl = backup_ttl or ttl * 2 if ttl else None
        self.max_checkpoints_per_thread = max_checkpoints_per_thread
        self.enable_compression = enable_compression
        self.enable_validation = enable_validation

        # Performance metrics
        self.metrics = {
            "puts": 0,
            "gets": 0,
            "lists": 0,
            "put_time": 0.0,
            "get_time": 0.0,
            "list_time": 0.0,
            "serialization_time": 0.0,
            "compression_time": 0.0,
            "corruptions_detected": 0,
            "migrations_performed": 0
        }

        # Register cleanup
        asyncio_atexit.register(self.close)

    async def put(self,
                  config: Dict[str, Any],
                  checkpoint: Checkpoint,
                  metadata: CheckpointMetadata,
                  new_versions: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Store checkpoint with comprehensive error handling and monitoring
        """
        start_time = asyncio.get_event_loop().time()

        try:
            thread_id = config.get("configurable", {}).get("thread_id", "default")
            checkpoint_id = checkpoint.get("id")

            if not checkpoint_id:
                checkpoint_id = str(uuid.uuid4())
                checkpoint["id"] = checkpoint_id

            # Prepare extended metadata
            extended_metadata = StateMetadata(
                thread_id=thread_id,
                checkpoint_id=checkpoint_id,
                checkpoint_ns=config.get("configurable", {}).get("checkpoint_ns", ""),
                checkpoint_ts=checkpoint.get("ts", str(datetime.utcnow().timestamp())),
                org_id=config.get("configurable", {}).get("org_id"),
                user_id=config.get("configurable", {}).get("user_id"),
                workflow_name=config.get("configurable", {}).get("workflow_name"),
                node_count=len([k for k in checkpoint.keys() if k != "id"]),
                message_count=len(checkpoint.get("channel_values", {}).get("messages", [])),
                ui_component_count=len(checkpoint.get("channel_values", {}).get("ui", [])),
                expires_at=datetime.utcnow() + timedelta(seconds=self.ttl) if self.ttl else None
            )

            # Serialize state
            serialization_start = asyncio.get_event_loop().time()
            serialized_state = self.serializer.dumps(checkpoint)
            serialization_time = asyncio.get_event_loop().time() - serialization_start

            # Store main checkpoint
            storage_start = asyncio.get_event_loop().time()

            checkpoint_key = f"{self.prefix}{thread_id}:{checkpoint_id}"
            backup_key = f"{self.prefix}{thread_id}:{checkpoint_id}:backup"

            # Create backup first (atomic operation)
            if self.backup_ttl:
                try:
                    existing_data = await self.redis_client.get(checkpoint_key)
                    if existing_data:
                        await self.redis_client.setex(
                            backup_key,
                            self.backup_ttl,
                            existing_data
                        )
                        extended_metadata.backup_checkpoint_id = f"{checkpoint_id}:backup"
                except Exception as e:
                    logger.warning(f"Failed to create backup for {checkpoint_id}: {e}")

            # Store main checkpoint with metadata
            state_data = {
                "checkpoint": serialized_state,
                "metadata": json.dumps(extended_metadata.to_dict()),
                "new_versions": json.dumps(new_versions or {})
            }

            await self.redis_client.hset(checkpoint_key, mapping=state_data)

            if self.ttl:
                await self.redis_client.expire(checkpoint_key, self.ttl)

            storage_time = asyncio.get_event_loop().time() - storage_start

            # Update thread checkpoint list (with LRU trimming)
            await self._update_thread_checkpoints(thread_id, checkpoint_id)

            # Update metrics
            self.metrics["puts"] += 1
            self.metrics["put_time"] += asyncio.get_event_loop().time() - start_time
            self.metrics["serialization_time"] += serialization_time
            self.metrics["storage_time"] += storage_time

            logger.debug(f"Stored checkpoint {checkpoint_id} for thread {thread_id} "
                        f"({len(serialized_state)} bytes, {serialization_time:.3f}s)")

            return checkpoint

        except Exception as e:
            logger.error(f"Failed to store checkpoint: {e}")
            raise

    async def get(self, config: Dict[str, Any]) -> Optional[Checkpoint]:
        """
        Retrieve checkpoint with corruption detection and recovery
        """
        start_time = asyncio.get_event_loop().time()

        try:
            thread_id = config.get("configurable", {}).get("thread_id", "default")
            checkpoint_id = config.get("configurable", {}).get("checkpoint_id")

            if not checkpoint_id:
                # Get latest checkpoint for thread
                checkpoints = await self.list(config)
                if checkpoints:
                    checkpoint_id = checkpoints[0]["checkpoint"]["id"]
                else:
                    return None

            checkpoint_key = f"{self.prefix}{thread_id}:{checkpoint_id}"

            # Retrieve checkpoint data
            get_start = asyncio.get_event_loop().time()
            checkpoint_data = await self.redis_client.hgetall(checkpoint_key)
            get_time = asyncio.get_event_loop().time() - get_start

            if not checkpoint_data:
                return None

            # Deserialize and validate
            deserialization_start = asyncio.get_event_loop().time()

            try:
                serialized_checkpoint = checkpoint_data["checkpoint"]
                checkpoint = self.serializer.loads(serialized_checkpoint)

                # Validate checkpoint structure
                if self.enable_validation:
                    await self._validate_checkpoint(checkpoint, checkpoint_data)

            except Exception as e:
                logger.error(f"Checkpoint corruption detected for {checkpoint_id}: {e}")

                # Try backup recovery
                if await self._try_recovery_from_backup(thread_id, checkpoint_id):
                    return await self.get(config)  # Retry after recovery
                else:
                    self.metrics["corruptions_detected"] += 1
                    raise StateCorruptionError(checkpoint_id, str(e))

            deserialization_time = asyncio.get_event_loop().time() - deserialization_start

            # Update metrics
            self.metrics["gets"] += 1
            self.metrics["get_time"] += asyncio.get_event_loop().time() - start_time
            self.metrics["deserialization_time"] = deserialization_time

            logger.debug(f"Retrieved checkpoint {checkpoint_id} for thread {thread_id} "
                        f"({get_time:.3f}s retrieve, {deserialization_time:.3f}s deserialize)")

            return checkpoint

        except StateCorruptionError:
            raise
        except Exception as e:
            logger.error(f"Failed to retrieve checkpoint: {e}")
            return None

    async def list(self,
                   config: Dict[str, Any],
                   limit: int = 10,
                   before: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        List checkpoints for a thread with pagination
        """
        start_time = asyncio.get_event_loop().time()

        try:
            thread_id = config.get("configurable", {}).get("thread_id", "default")
            list_key = f"{self.prefix}{thread_id}:checkpoints"

            # Get checkpoint IDs from the thread's checkpoint list
            if before:
                # Get checkpoints before a specific ID
                checkpoint_ids = await self.redis_client.zrevrangebyscore(
                    list_key,
                    f"({before}",
                    "-inf",
                    start=0,
                    num=limit,
                    withscores=True
                )
            else:
                # Get latest checkpoints
                checkpoint_ids = await self.redis_client.zrevrange(
                    list_key,
                    start=0,
                    num=limit,
                    withscores=True
                )

            checkpoints = []
            for checkpoint_id, score in checkpoint_ids:
                checkpoint_id = checkpoint_id.decode() if isinstance(checkpoint_id, bytes) else checkpoint_id
                checkpoint_key = f"{self.prefix}{thread_id}:{checkpoint_id}"

                # Get checkpoint data without deserializing (for performance)
                checkpoint_data = await self.redis_client.hgetall(checkpoint_key)
                if checkpoint_data:
                    try:
                        metadata = json.loads(checkpoint_data.get("metadata", "{}"))
                        checkpoints.append({
                            "checkpoint": {"id": checkpoint_id, "ts": score},
                            "metadata": metadata
                        })
                    except Exception as e:
                        logger.warning(f"Failed to parse metadata for {checkpoint_id}: {e}")

            # Update metrics
            self.metrics["lists"] += 1
            self.metrics["list_time"] += asyncio.get_event_loop().time() - start_time

            return checkpoints

        except Exception as e:
            logger.error(f"Failed to list checkpoints: {e}")
            return []

    async def delete(self, config: Dict[str, Any]) -> None:
        """Delete checkpoint with cleanup"""
        try:
            thread_id = config.get("configurable", {}).get("thread_id", "default")
            checkpoint_id = config.get("configurable", {}).get("checkpoint_id")

            if not checkpoint_id:
                return

            checkpoint_key = f"{self.prefix}{thread_id}:{checkpoint_id}"
            backup_key = f"{self.prefix}{thread_id}:{checkpoint_id}:backup"
            list_key = f"{self.prefix}{thread_id}:checkpoints"

            # Delete checkpoint and backup
            await self.redis_client.delete(checkpoint_key, backup_key)

            # Remove from thread list
            await self.redis_client.zrem(list_key, checkpoint_id)

            logger.debug(f"Deleted checkpoint {checkpoint_id} for thread {thread_id}")

        except Exception as e:
            logger.error(f"Failed to delete checkpoint: {e}")

    async def get_metrics(self) -> Dict[str, Any]:
        """Get performance metrics"""
        total_time = self.metrics["put_time"] + self.metrics["get_time"] + self.metrics["list_time"]
        total_operations = self.metrics["puts"] + self.metrics["gets"] + self.metrics["lists"]

        return {
            **self.metrics,
            "total_time": total_time,
            "total_operations": total_operations,
            "avg_time_per_operation": total_time / max(total_operations, 1),
            "serialization_ratio": self.metrics["serialization_time"] / max(total_time, 1),
            "corruption_rate": self.metrics["corruptions_detected"] / max(self.metrics["gets"], 1)
        }

    async def cleanup_expired_checkpoints(self, max_age_seconds: int = 86400) -> int:
        """Clean up expired checkpoints"""
        try:
            # Get all checkpoint keys
            keys = await self.redis_client.keys(f"{self.prefix}*")

            expired_count = 0
            current_time = datetime.utcnow()

            for key in keys:
                try:
                    # Check if key has TTL
                    ttl = await self.redis_client.ttl(key)

                    if ttl == -1:  # No TTL set, check metadata
                        checkpoint_data = await self.redis_client.hget(key, "metadata")
                        if checkpoint_data:
                            metadata = json.loads(checkpoint_data)
                            expires_at = metadata.get("expires_at")
                            if expires_at:
                                expires_at = datetime.fromisoformat(expires_at)
                                if current_time > expires_at:
                                    await self.redis_client.delete(key)
                                    expired_count += 1
                except Exception as e:
                    logger.warning(f"Failed to check expiration for key {key}: {e}")

            logger.info(f"Cleaned up {expired_count} expired checkpoints")
            return expired_count

        except Exception as e:
            logger.error(f"Failed to cleanup expired checkpoints: {e}")
            return 0

    # Private methods

    async def _update_thread_checkpoints(self, thread_id: str, checkpoint_id: str):
        """Update thread checkpoint list with LRU trimming"""
        try:
            list_key = f"{self.prefix}{thread_id}:checkpoints"

            # Add to sorted set with timestamp as score
            await self.redis_client.zadd(
                list_key,
                {checkpoint_id: float(asyncio.get_event_loop().time())}
            )

            # Trim to max checkpoints per thread
            await self.redis_client.zremrangebyrank(
                list_key,
                0,
                -(self.max_checkpoints_per_thread + 1)
            )

            # Set TTL on the list
            if self.ttl:
                await self.redis_client.expire(list_key, self.ttl)

        except Exception as e:
            logger.warning(f"Failed to update thread checkpoints: {e}")

    async def _validate_checkpoint(self, checkpoint: Dict[str, Any],
                                   checkpoint_data: Dict[str, bytes]):
        """Validate checkpoint structure and integrity"""
        # Basic structure validation
        if not isinstance(checkpoint, dict):
            raise ValueError("Checkpoint must be a dictionary")

        if "id" not in checkpoint:
            raise ValueError("Checkpoint missing required 'id' field")

        # Validate metadata if present
        if "metadata" in checkpoint_data:
            try:
                metadata = json.loads(checkpoint_data["metadata"])
                stored_checksum = metadata.get("corruption_hash")

                if stored_checksum:
                    # Calculate current checksum
                    checkpoint_copy = checkpoint.copy()
                    checkpoint_copy.pop("corruption_hash", None)  # Remove hash if present
                    current_hash = hashlib.sha256(
                        json.dumps(checkpoint_copy, sort_keys=True, default=str).encode()
                    ).hexdigest()

                    if current_hash != stored_checksum:
                        raise ValueError("Checkpoint checksum mismatch")

            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid checkpoint metadata: {e}")

    async def _try_recovery_from_backup(self, thread_id: str, checkpoint_id: str) -> bool:
        """Try to recover checkpoint from backup"""
        try:
            backup_key = f"{self.prefix}{thread_id}:{checkpoint_id}:backup"
            checkpoint_key = f"{self.prefix}{thread_id}:{checkpoint_id}"

            # Get backup data
            backup_data = await self.redis_client.hgetall(backup_key)
            if not backup_data:
                return False

            # Restore from backup
            await self.redis_client.hset(checkpoint_key, mapping=backup_data)
            if self.ttl:
                await self.redis_client.expire(checkpoint_key, self.ttl)

            logger.info(f"Recovered checkpoint {checkpoint_id} from backup")
            return True

        except Exception as e:
            logger.error(f"Failed to recover checkpoint from backup: {e}")
            return False

    async def close(self):
        """Cleanup resources"""
        try:
            if self.redis_client:
                await self.redis_client.close()
        except Exception as e:
            logger.error(f"Failed to close Redis checkpoint saver: {e}")

class ConcurrentWorkflowManager:
    """
    Manager for concurrent workflow execution with state isolation
    """

    def __init__(self,
                 redis_client: redis.Redis,
                 max_concurrent_per_org: int = 10,
                 max_concurrent_per_user: int = 5,
                 checkpoint_ttl: int = 3600):  # 1 hour

        self.redis_client = redis_client
        self.max_concurrent_per_org = max_concurrent_per_org
        self.max_concurrent_per_user = max_concurrent_per_user
        self.checkpoint_ttl = checkpoint_ttl

        # Tracking keys
        self.org_workflows_key = "workflow_counts:org"
        self.user_workflows_key = "workflow_counts:user"
        self.active_workflows_key = "active_workflows"

    async def can_start_workflow(self, org_id: str, user_id: str) -> bool:
        """Check if workflow can be started based on limits"""
        try:
            # Check org limit
            org_count = await self.redis_client.hget(self.org_workflows_key, org_id)
            org_count = int(org_count or 0)

            if org_count >= self.max_concurrent_per_org:
                return False

            # Check user limit
            user_count = await self.redis_client.hget(self.user_workflows_key, user_id)
            user_count = int(user_count or 0)

            if user_count >= self.max_concurrent_per_user:
                return False

            return True

        except Exception as e:
            logger.error(f"Failed to check workflow limits: {e}")
            return True  # Allow on error

    async def register_workflow(self, thread_id: str, org_id: str, user_id: str) -> bool:
        """Register a new workflow"""
        try:
            if not await self.can_start_workflow(org_id, user_id):
                return False

            # Add to active workflows
            workflow_data = {
                "thread_id": thread_id,
                "org_id": org_id,
                "user_id": user_id,
                "started_at": datetime.utcnow().isoformat()
            }

            await self.redis_client.hset(
                self.active_workflows_key,
                thread_id,
                json.dumps(workflow_data)
            )

            # Update counts
            await self.redis_client.hincrby(self.org_workflows_key, org_id, 1)
            await self.redis_client.hincrby(self.user_workflows_key, user_id, 1)

            # Set TTL for workflow registration
            await self.redis_client.expire(self.active_workflows_key, self.checkpoint_ttl)

            return True

        except Exception as e:
            logger.error(f"Failed to register workflow: {e}")
            return False

    async def unregister_workflow(self, thread_id: str) -> None:
        """Unregister a completed workflow"""
        try:
            # Get workflow data
            workflow_data = await self.redis_client.hget(self.active_workflows_key, thread_id)
            if not workflow_data:
                return

            workflow_info = json.loads(workflow_data)
            org_id = workflow_info.get("org_id")
            user_id = workflow_info.get("user_id")

            # Remove from active workflows
            await self.redis_client.hdel(self.active_workflows_key, thread_id)

            # Update counts
            if org_id:
                await self.redis_client.hincrby(self.org_workflows_key, org_id, -1)
            if user_id:
                await self.redis_client.hincrby(self.user_workflows_key, user_id, -1)

        except Exception as e:
            logger.error(f"Failed to unregister workflow: {e}")

    async def get_active_workflows(self, org_id: Optional[str] = None,
                                 user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get active workflows, optionally filtered by org or user"""
        try:
            all_workflows = await self.redis_client.hgetall(self.active_workflows_key)

            workflows = []
            for thread_id, workflow_data in all_workflows.items():
                try:
                    workflow_info = json.loads(workflow_data)

                    # Apply filters
                    if org_id and workflow_info.get("org_id") != org_id:
                        continue
                    if user_id and workflow_info.get("user_id") != user_id:
                        continue

                    workflow_info["thread_id"] = thread_id
                    workflows.append(workflow_info)

                except json.JSONDecodeError:
                    continue

            return workflows

        except Exception as e:
            logger.error(f"Failed to get active workflows: {e}")
            return []

    async def cleanup_stale_workflows(self, max_age_seconds: int = 7200) -> int:
        """Clean up stale workflow registrations"""
        try:
            all_workflows = await self.redis_client.hgetall(self.active_workflows_key)

            current_time = datetime.utcnow()
            stale_count = 0

            for thread_id, workflow_data in all_workflows.items():
                try:
                    workflow_info = json.loads(workflow_data)
                    started_at = datetime.fromisoformat(workflow_info["started_at"])

                    if (current_time - started_at).total_seconds() > max_age_seconds:
                        await self.unregister_workflow(thread_id)
                        stale_count += 1

                except (json.JSONDecodeError, ValueError, KeyError):
                    # Invalid workflow data, remove it
                    await self.redis_client.hdel(self.active_workflows_key, thread_id)
                    stale_count += 1

            logger.info(f"Cleaned up {stale_count} stale workflow registrations")
            return stale_count

        except Exception as e:
            logger.error(f"Failed to cleanup stale workflows: {e}")
            return 0

# Utility functions for state management

async def create_state_manager(redis_connection_string: str,
                             **kwargs) -> RedisCheckpointSaver:
    """Create and initialize Valkey checkpoint saver"""
    # Use optimized Valkey connection for state management
    valkey_manager = await get_valkey_manager()
    redis_client = await get_state_redis()  # Uses specialized state pool

    # Test connection
    await redis_client.ping()

    return RedisCheckpointSaver(redis_client, **kwargs)

async def create_workflow_manager(redis_connection_string: str,
                                 **kwargs) -> ConcurrentWorkflowManager:
    """Create and initialize concurrent workflow manager with Valkey"""
    # Use optimized Valkey connection for workflow management
    valkey_manager = await get_valkey_manager()
    redis_client = await get_state_redis()  # Uses specialized state pool

    # Test connection
    await redis_client.ping()

    return ConcurrentWorkflowManager(redis_client, **kwargs)

def generate_state_hash(state: Dict[str, Any]) -> str:
    """Generate hash for state integrity validation"""
    state_copy = state.copy()
    state_copy.pop("integrity_hash", None)  # Remove hash if present

    return hashlib.sha256(
        json.dumps(state_copy, sort_keys=True, default=str).encode()
    ).hexdigest()

def add_integrity_hash(state: Dict[str, Any]) -> Dict[str, Any]:
    """Add integrity hash to state"""
    state["integrity_hash"] = generate_state_hash(state)
    return state

def verify_integrity_hash(state: Dict[str, Any]) -> bool:
    """Verify state integrity using hash"""
    if "integrity_hash" not in state:
        return False  # No hash to verify

    stored_hash = state["integrity_hash"]
    calculated_hash = generate_state_hash(state)

    return stored_hash == calculated_hash