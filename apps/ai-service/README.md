# SupplyGraph AI Service

FastAPI backend service with LangGraph workflow orchestration for intelligent procurement automation.

## Features

- **LangGraph Workflows**: Sophisticated procurement lifecycle management
- **Document Processing**: Intelligent quote extraction using Docling + LLM
- **Gmail Integration**: Automated vendor communication
- **Multi-tenant**: Row-level security with Prisma
- **Real-time Processing**: Async workflows with checkpointing

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   FastAPI       │    │   LangGraph      │    │   Services      │
│   - REST API    │───▶│   - Workflows    │───▶│   - Gmail       │
│   - Validation  │    │   - State Mgmt   │    │   - Docling     │
│   - Auth        │    │   - Checkpoints  │    │   - LLM         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Database      │    │   Redis/Valkey   │    │   External APIs │
│   - PostgreSQL  │    │   - Queues       │    │   - Gmail API   │
│   - Prisma ORM  │    │   - Cache        │    │   - OpenAI      │
│   - RLS         │    │   - Sessions     │    │   - Stripe      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Workflows

### 1. Procurement Workflow
**States**: `CREATED → QUOTES_REQUESTED → QUOTES_RECEIVED → APPROVED → PAID → COMPLETED`

- Validates procurement requests
- Selects appropriate vendors
- Sends RFQ emails via Gmail
- Monitors vendor responses
- Processes approvals and payments

### 2. Quote Processing Workflow
**States**: `RECEIVED → EXTRACTED → NORMALIZED → VALIDATED → STORED`

- Extracts quotes from emails/documents using Docling
- Normalizes data with LLM intelligence
- Validates against original requirements
- Stores structured quote data

### 3. Email Processing Workflow
**States**: `MONITOR → FETCH → CLASSIFY → PROCESS → STORE`

- Monitors Gmail for new messages
- Classifies emails (quotes vs. other)
- Triggers quote processing workflows
- Maintains email audit trail

## Quick Start

### Prerequisites

1. **Python 3.11+** with `uv` package manager
2. **PostgreSQL** database running
3. **Redis/Valkey** for caching and queues
4. **Ollama** for local LLM (or OpenAI API key)

### Installation

```bash
# Install dependencies
cd apps/ai-service
uv sync

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
cd ../../packages/db
pnpm install
pnpm db:generate

# Run database migrations
pnpm db:push

# Seed database (optional)
pnpm db:seed
```

### Development

```bash
# Start the service
cd apps/ai-service
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Or use the main.py directly
uv run python src/main.py
```

### Testing

```bash
# Run tests
uv run pytest

# Run with coverage
uv run pytest --cov=src --cov-report=html
```

## API Endpoints

### Health Checks
- `GET /health/` - Basic health check
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### Workflows
- `POST /api/v1/workflows/start` - Start a workflow
- `GET /api/v1/workflows/{id}/status` - Get workflow status
- `POST /api/v1/workflows/{id}/resume` - Resume workflow
- `POST /api/v1/workflows/{id}/cancel` - Cancel workflow

### Procurement
- `POST /api/v1/procurement/start` - Start procurement workflow
- `POST /api/v1/procurement/{id}/approve` - Approve quote
- `GET /api/v1/procurement/{id}/status` - Get procurement status

### Quotes
- `POST /api/v1/quotes/process-email` - Process quote from email
- `POST /api/v1/quotes/process-document` - Process uploaded document
- `GET /api/v1/quotes/{id}` - Get quote details
- `GET /api/v1/quotes/request/{id}` - Get quotes for request

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://dev:devpass@localhost:5432/supplygraph` |
| `REDIS_URL` | Redis/Valkey connection string | `redis://localhost:6379` |
| `OPENAI_BASE_URL` | LLM API base URL | `http://localhost:11434/v1` |
| `OPENAI_API_KEY` | LLM API key | `ollama` |
| `LLM_MODEL` | Model name to use | `llama3.2` |
| `GMAIL_CLIENT_ID` | Gmail OAuth client ID | - |
| `GMAIL_CLIENT_SECRET` | Gmail OAuth client secret | - |
| `ENVIRONMENT` | Environment (development/production) | `development` |
| `LOG_LEVEL` | Logging level | `INFO` |

### Multi-tenant Setup

The service uses header-based tenant identification:

```bash
curl -H "X-Tenant-ID: org_123" http://localhost:8000/api/v1/procurement/start
```

All database operations are automatically scoped to the tenant via RLS policies.

## Development Guide

### Adding New Workflows

1. Create workflow class in `src/workflows/`
2. Inherit from `BaseWorkflow`
3. Implement `_setup_graph()` method
4. Add routing functions
5. Register in `WorkflowManager`

Example:
```python
class MyWorkflow(BaseWorkflow):
    def _setup_graph(self):
        self.graph_builder.add_node("step1", self.step1)
        self.graph_builder.add_edge(START, "step1")
        self.graph_builder.add_edge("step1", END)
    
    async def step1(self, state: WorkflowState) -> WorkflowState:
        # Implementation
        return state
```

### Adding New Services

1. Create service class in `src/services/`
2. Add to `__init__.py`
3. Use in workflows or routers

### Testing Workflows

```python
import pytest
from src.workflows import MyWorkflow

@pytest.mark.asyncio
async def test_my_workflow():
    workflow = MyWorkflow()
    compiled = workflow.compile()
    
    initial_state = workflow.create_initial_state(
        workflow_id="test",
        org_id="test_org",
        entity_id="test_entity",
        entity_type="test",
        data={}
    )
    
    final_state = None
    async for state in compiled.astream(initial_state):
        final_state = state
    
    assert final_state["current_step"] == "completed"
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY . .

RUN pip install uv
RUN uv sync --frozen

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment-specific Configuration

- **Development**: Auto-reload, debug logging, local services
- **Staging**: Production-like setup with test data
- **Production**: Optimized settings, external services, monitoring

## Monitoring

### Structured Logging

All logs are structured JSON for easy parsing:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "logger": "ProcurementWorkflow",
  "message": "Workflow started",
  "workflow_id": "proc_123",
  "entity_id": "req_456"
}
```

### Health Checks

- Database connectivity
- Redis availability
- LLM service status
- Workflow execution health

### Metrics

- Workflow execution times
- Success/failure rates
- Quote processing accuracy
- Email processing volume

## Troubleshooting

### Common Issues

1. **Database Connection**: Check PostgreSQL is running and credentials are correct
2. **Redis Connection**: Ensure Redis/Valkey is accessible
3. **LLM Errors**: Verify Ollama is running or OpenAI API key is valid
4. **Gmail API**: Check OAuth credentials and permissions
5. **Workflow Failures**: Check logs for specific error messages

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=DEBUG

# Run with detailed output
uv run uvicorn src.main:app --reload --log-level debug
```

### Performance Tuning

- Adjust workflow checkpoint frequency
- Optimize database queries
- Configure Redis memory limits
- Tune LLM request timeouts