"""Configuration management for the AI Service."""

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )
    
    # Application
    environment: str = Field(default="development", description="Environment: development, staging, production")
    host: str = Field(default="0.0.0.0", description="Host to bind the server")
    port: int = Field(default=8000, description="Port to bind the server")
    log_level: str = Field(default="INFO", description="Logging level")
    
    # Security
    allowed_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001"],
        description="Allowed CORS origins"
    )
    allowed_hosts: List[str] = Field(
        default=["localhost", "127.0.0.1", "0.0.0.0"],
        description="Allowed hosts for TrustedHostMiddleware"
    )
    
    # Database
    database_url: str = Field(
        default="postgresql://dev:devpass@localhost:5432/supplygraph",
        description="PostgreSQL database URL"
    )
    
    # Redis/Valkey
    redis_url: str = Field(
        default="redis://localhost:6379",
        description="Redis/Valkey URL for caching and queues"
    )
    
    # OpenAI/LLM Configuration
    openai_api_key: str = Field(default="", description="OpenAI API key")
    openai_base_url: str = Field(
        default="http://localhost:11434/v1",
        description="OpenAI-compatible API base URL (for Ollama)"
    )
    llm_model: str = Field(default="llama3.2", description="LLM model to use")
    
    # Gmail API
    gmail_client_id: str = Field(default="", description="Gmail OAuth client ID")
    gmail_client_secret: str = Field(default="", description="Gmail OAuth client secret")
    gmail_redirect_uri: str = Field(
        default="http://localhost:8000/auth/gmail/callback",
        description="Gmail OAuth redirect URI"
    )
    
    # Multi-tenant
    tenant_header_name: str = Field(
        default="X-Tenant-ID",
        description="Header name for tenant identification"
    )
    
    # Celery
    celery_broker_url: str = Field(
        default="redis://localhost:6379/0",
        description="Celery broker URL"
    )
    celery_result_backend: str = Field(
        default="redis://localhost:6379/0",
        description="Celery result backend URL"
    )
    
    # Workflow Configuration
    workflow_checkpoint_ttl: int = Field(
        default=86400,  # 24 hours
        description="Workflow checkpoint TTL in seconds"
    )
    max_workflow_retries: int = Field(
        default=3,
        description="Maximum number of workflow retries"
    )
    
    # Email Processing
    email_batch_size: int = Field(
        default=10,
        description="Number of emails to process in a batch"
    )
    email_processing_interval: int = Field(
        default=300,  # 5 minutes
        description="Email processing interval in seconds"
    )


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()