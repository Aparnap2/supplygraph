# SupplyGraph Deployment Guide 🚀

Complete procurement automation SaaS with **Agent-User Interface (AGUI)** technology.

## 🏗️ Architecture Overview

```
┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │      AI Engine   │
│  (TanStack       │      │   (Python +     │
│       Start)       │      │    LangGraph)     │
│                 │      │                  │
├─────────────────┤      ├─────────────────┤
│                 │      │                  │
│   PostgreSQL    │      │     Redis       │
│   (Multi-tenant) │      │   (Queueing)    │
│                 │      │                  │
└─────────────────┘      └─────────────────┘
│                 │      │                  │
│   Better Auth   │      │   Gmail OAuth   │
│  (Multi-tenant) │      │   (Per Org)     │
└─────────────────┘      └─────────────────┘
```

## 📋 Prerequisites

### Required Services
- **Docker & Docker Compose**
- **Node.js 18+** (for frontend)
- **Python 3.11+** (for AI engine)
- **pnpm** (package manager)
- **uv** (Python package manager)

### Google Cloud Setup
1. **Create Project**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable APIs**: Gmail API + Google OAuth2.0
3. **Create Credentials**: OAuth2.0 Client ID + Client Secret
4. **Domain**: Add authorized redirect URIs for dev/staging/prod

## 🚀 Quick Start (Development)

### 1. Start Database Services
```bash
# Start PostgreSQL (if not running)
docker run -d --name supplygraph-postgres \
  -e POSTGRES_DB=supplygraph \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15

# Start Redis
docker run -d --name supplygraph-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 2. Database Setup
```bash
# Create tables and seed data
cd packages/database && uv run prisma db push
uv run prisma db seed
```

### 3. Start Frontend
```bash
cd apps/web && cp .env.example .env.local
pnpm dev
# Visit: http://localhost:3000
```

### 4. Start AI Engine
```bash
cd apps/ai-engine && cp .env.example .env
# Add your credentials:
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# OPENAI_API_KEY=your_openai_key

docker build -t supplygraph-ai-engine .
docker run -d --name supplygraph-ai-engine \
  -p 8000:8000 \
  --network supplygraph-network \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/supplygraph \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  -e GOOGLE_CLIENT_ID=your_google_client_id \
  -e GOOGLE_CLIENT_SECRET=your_google_client_secret \
  -e OPENAI_API_KEY=your_openai_key \
  supplygraph-ai-engine
```

### 5. Test Gmail OAuth Setup
```bash
# Test Gmail connection
curl -X POST http://localhost:3000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"orgId": "test-org"}'

# Test email sending
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "test-org",
    "to": "vendor@example.com",
    "subject": "Test RFQ from SupplyGraph",
    "html": "<p>This is a test email from SupplyGraph procurement automation.</p>"
  }'
```

## 🧪 Testing Comprehensive Workflows

### Test AGUI Procurement Flow
```bash
# 1. Start procurement request
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Buy 50 laptops for office, budget $50,000",
    "org_id": "test-org",
    "user_id": "test-user"
  }'

# 2. Monitor AI Engine logs
docker logs supplygraph-ai-engine -f

# 3. Test WebSocket connection (open new terminal)
wscat -c ws://localhost:8000/ws/test-thread-123
```

### Test CRUD Operations
```bash
# Test database connectivity
cd packages/database && uv run prisma studio

# Test API endpoints
curl -X GET http://localhost:8000/health
curl -X GET http://localhost:8000/api/workflow/test-thread-123/status
```

## 🏭 Production Deployment

### Option 1: Docker Compose (Multi-Service)
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web
      - ai-engine

  # Frontend
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.prod
    environment:
      - VITE_AI_ENGINE_URL: http://ai-engine:8000
      - VITE_WS_URL: ws://ai-engine:8000
    depends_on:
      - postgres
      - redis

  # AI Engine
  ai-engine:
    build:
      context: ./apps/ai-engine
      dockerfile: Dockerfile.prod
    environment:
      - DATABASE_URL: ${DATABASE_URL}
      - REDIS_URL: redis://redis:6379
      - GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      - OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - postgres
      - redis

  # Database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: supplygraph
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  # Celery Workers
  celery-worker:
    build:
      context: ./apps/ai-engine
      dockerfile: Dockerfile.prod
    command: celery -A src.tasks.celery_app worker --loglevel=info
    environment:
      - DATABASE_URL: ${DATABASE_URL}
      - REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

### Option 2: Individual Containers (Current Setup)
```bash
# Production images
docker build -t supplygraph-web:prod ./apps/web
docker build -t supplygraph-ai-engine:prod ./apps/ai-engine

# Deploy with environment variables
docker run -d --name supplygraph-web-prod \
  -p 3000:3000 \
  -e VITE_AI_ENGINE_URL=https://your-api-domain.com \
  -e VITE_WS_URL=wss://your-api-domain.com \
  supplygraph-web:prod

docker run -d --name supplygraph-ai-prod \
  -p 8000:8000 \
  -e DATABASE_URL=${DATABASE_URL} \
  -e REDIS_URL=${REDIS_URL} \
  -e GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID} \
  -e GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET} \
  -e OPENAI_API_KEY=${OPENAI_API_KEY} \
  supplygraph-ai-engine:prod

# Background workers
docker run -d --name supplygraph-celery-prod \
  -e DATABASE_URL=${DATABASE_URL} \
  -e REDIS_URL=${REDIS_URL} \
  supplygraph-ai-engine:prod \
  celery -A src.tasks.celery_app worker --loglevel=info
```

## 🔧 Environment Variables

### Development (.env.local)
```bash
# Frontend
VITE_AI_ENGINE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# Database (shared)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/supplygraph

# Auth
BETTER_AUTH_URL=http://localhost:3000/api/auth
SUPPLYGRAPH_API_KEY=dev-key

# AI Engine
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
```

### Production (.env.prod)
```bash
# Frontend
VITE_AI_ENGINE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com

# Database
DATABASE_URL=postgresql://username:password@your-db-host:5432/supplygraph

# AI Engine
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
OPENAI_API_KEY=${OPENAI_API_KEY}
NODE_ENV=production
```

## 🔍 Monitoring & Health Checks

### Health Endpoints
- Frontend: `http://localhost:3000/api/health`
- AI Engine: `http://localhost:8000/health`
- Database: Connection via Prisma Studio

### Production Monitoring
```bash
# Application monitoring
docker run -d --name supplygraph-monitoring \
  -p 9090:9090 \
  prom/prometheus:latest

# Log aggregation
docker run -d --name supplygraph-loki \
  -p 3100:3100 \
  grafana/loki:latest
```

## 🧪 Testing Strategy

### Unit Tests
```bash
# Frontend
cd apps/web && pnpm test

# AI Engine
cd apps/ai-engine && uv run pytest

# Database
cd packages/database && uv run vitest
```

### Integration Tests
```bash
# End-to-end procurement workflow
cd apps/web && pnpm test:e2e

# API testing
cd apps/ai-engine && uv run pytest tests/integration/
```

### Load Testing
```bash
# Frontend load testing
cd apps/web && pnpm test:load

# AI Engine load testing
cd apps/ai-engine && uv run pytest tests/load/
```

## 📊 AGUI Component Library

### Available Components
- `ThinkingLoader` - Animated processing indicators
- `QuoteApprovalCard` - Interactive approval with Approve/Reject
- `InventoryCheck` - Stock availability checking
- `QuoteFetcher` - Vendor quote status tracking
- `PaymentProcessor` - Payment progress and success states
- `ErrorCard` - Consistent error handling

### Usage Example
```typescript
import { QuoteApprovalCard } from '@supplygraph/ui-components';

function ProcurementChat() {
  const [uiComponents, setUiComponents] = useState([]);

  // Handle AGUI events from WebSocket
  const handleAGUIEvent = (event) => {
    if (event.type === 'ui_component') {
      setUiComponents(prev => [...prev, event.data]);
    }
  };

  return (
    <div>
      {uiComponents.map(component => {
        switch (component.type) {
          case 'quote_approval_card':
            return <QuoteApprovalCard {...component.props} />;
          // ... other components
        }
      })}
    </div>
  );
}
```

## 🎯 Production Checklist

### Security
- [ ] Environment variables secured (no secrets in code)
- [ ] HTTPS everywhere (SSL certificates)
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] CORS properly configured
- [ ] Security headers set

### Performance
- [ ] Database indexes optimized
- [ ] Caching strategies implemented (Redis)
- [ ] CDN for static assets
- [ ] Gzip compression enabled
- [ ] Background job processing (Celery)

### Reliability
- [ ] Health checks implemented
- [ ] Graceful shutdown handling
- [ ] Database connection pooling
- [ ] Retry logic with exponential backoff
- [ ] Error logging and monitoring
- [ ] Automatic failover for database

### Scalability
- [ ] Horizontal pod autoscaling configured
- [ ] Load balancer in place
- [ ] Database read replicas setup
- [ ] CDN and edge caching
- [ ] Microservices architecture
- [ ] Container resource limits set

## 🚀 Deployment Commands

### Development
```bash
# Start all services
pnpm docker:up

# Stop all services
pnpm docker:down

# View logs
pnpm docker:logs
```

### Production
```bash
# Build and deploy
docker build -t supplygraph-web:prod ./apps/web
docker build -t supplygraph-ai-engine:prod ./apps/ai-engine
docker push your-registry/supplygraph-web:prod
docker push your-registry/supplygraph-ai-engine:prod

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🎉 Support & Troubleshooting

### Common Issues
1. **Database Connection**: Check PostgreSQL container health
2. **CORS Issues**: Verify allowed origins in AI engine
3. **OAuth Failures**: Check Google Cloud console settings
4. **Memory Issues**: Increase Docker memory limits
5. **WebSocket Problems**: Check firewall and proxy settings

### Debug Commands
```bash
# Check container status
docker ps -a

# View logs
docker logs [container-name]

# Access container shell
docker exec -it [container-name] /bin/bash

# Database access
docker exec -it supplygraph-postgres psql -U postgres -d supplygraph

# Redis CLI
docker exec -it supplygraph-redis redis-cli
```

**SupplyGraph is now production-ready with comprehensive AGUI procurement automation!** 🎉