# SupplyGraph - AI-Powered Procurement Automation

![SupplyGraph Logo](apps/web/public/logo192.png)

**SupplyGraph** is a cutting-edge, multi-tenant SaaS platform that automates the "Procurement-to-Pay" cycle for SMEs using AI-driven workflows, real-time collaboration, and intelligent decision-making.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-repo/supplygraph.git
cd supplygraph

# Install dependencies
pnpm install
cd apps/ai-engine && uv sync
cd ../web && pnpm install
cd ../../

# Start the full stack with Docker
pnpm docker:dev
```

## 🏗️ Architecture Overview

SupplyGraph uses a **Sidecar Architecture** combining:

- **Frontend/BFF**: TanStack Start (React + Vite)
- **AI Engine**: Python FastAPI + LangGraph
- **Authentication**: Better Auth (Multi-tenancy)
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: WebSockets + Celery Workers
- **Caching**: Valkey (Redis-compatible)

```
+----------------+     HTTPS/WebSocket     +---------------------+
|                |   -------------------->  |                     |
|   User         |                          |   TanStack Start    |
|  (Browser)     |                          |    (Node.js)        |
|                |                          |                     |
+----------------+                          +----------+----------+
                                                      |
                                                      | Auth & Session
                                                      v
+---------------------+          Data Access       +-----------+
|                     |   <----------------------  |           |
|   Better Auth       |                          |  Prisma   |
|                     |                          |   ORM     |
+---------------------+                          +-----+-----+
                                                  |
                                                  v
+---------------------+     gRPC/HTTP      +---------------------+
|                     |   <--------------  |                     |
|   FastAPI           |                    |   LangGraph        |
|   + LangGraph       |   Async Tasks      |   Service          |
|                     |  ----------------> |                     |
+----------+----------+                    +----------+----------+
           |                                         |
           | LLM Routing                              | Postgres
           v                                         v
+---------------------+                    +---------------------+
|                     |                    |                     |
|   LiteLLM Proxy     |                    |   Database          |
|                     |                    |                     |
+---------------------+                    +---------------------+
           |
           v
+---------------------+
|                     |
|   External APIs     |
|   (Stripe, Gmail)   |
|                     |
+---------------------+
```

## 🎯 Key Features

### 1. **Multi-Tenant Workspace Isolation**
- Users belong to Organizations (Better Auth)
- All data is keyed by `orgId` for complete isolation
- Role-based access control (RBAC)

### 2. **Smart Data Ingestion**
- Drag-and-drop CSV/Excel upload
- AI-powered column mapping and data cleaning
- Automatic schema detection

### 3. **Agentic Negotiation**
- AI agents communicate with vendors via email (Celery tasks)
- Real-time quote comparison and analysis
- Automated vendor follow-ups

### 4. **AGUI (Agent-Generated UI) Approval**
- AI doesn't just return text - it generates interactive UI components
- Human-in-the-loop approval workflows
- Dynamic component rendering based on workflow state

### 5. **Procurement State Machine**
- LangGraph-powered workflow automation
- Visual state transitions with interrupts for human approval
- Persistent thread state with Postgres checkpointer

## 📦 Project Structure

```
supplygraph/
├── apps/
│   ├── web/                  # TanStack Start frontend
│   │   ├── src/              # React components and routes
│   │   ├── prisma/           # Database schema and migrations
│   │   └── tests/            # Frontend tests
│   └── ai-engine/            # Python AI service
│       ├── src/              # FastAPI app and LangGraph workflows
│       ├── tests/            # Python tests
│       └── Dockerfile        # Container configuration
├── packages/                 # Shared libraries
├── docker-compose.yml        # Service orchestration
├── package.json              # Monorepo configuration
└── README.md                 # This file
```

## 🔧 Technology Stack

### Frontend
- **Framework**: TanStack Start (React 19 + Vite)
- **Routing**: TanStack Router
- **UI**: shadcn/ui + Tailwind CSS
- **State**: TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Auth**: Better Auth with multi-tenancy

### Backend (AI Engine)
- **Framework**: FastAPI
- **AI Orchestration**: LangGraph
- **LLM Integration**: LangChain + LiteLLM
- **Async Tasks**: Celery with Valkey broker
- **Database**: Prisma ORM + PostgreSQL
- **Real-time**: WebSockets

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL 15
- **Cache/Queue**: Valkey (Redis-compatible)
- **Email Testing**: Mailpit
- **Database Admin**: pgAdmin

## 🚀 Development Setup

### Prerequisites
- Docker + Docker Compose
- Node.js 20+
- Python 3.11+
- pnpm 8+
- uv (Python package manager)

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/supplygraph

# AI Engine
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key
NODE_ENV=development

# Auth
BETTER_AUTH_SECRET=your-secret-key
```

### Running the Stack

```bash
# Start all services
pnpm docker:dev

# Access services:
# - Web App: http://localhost:3000
# - AI Engine: http://localhost:8000
# - Mailpit: http://localhost:8025
# - pgAdmin: http://localhost:5050
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run frontend tests only
pnpm test:web

# Run AI engine tests only
pnpm test:ai

# Run tests in watch mode
pnpm test:watch
```

## 🤖 AI Workflow Architecture

SupplyGraph uses **LangGraph** to orchestrate complex procurement workflows:

### Workflow States
1. **Ingest Request**: Parse user's unstructured request
2. **Check Inventory**: Query database for current stock
3. **Fetch Quotes**: Trigger Celery tasks to email vendors
4. **Normalize Quotes**: Compare received quotes
5. **Human Approval**: Pause and render approval UI component
6. **Execute Payment**: Call Stripe API

### AGUI Protocol
The AI engine doesn't return plain text - it generates **UI events**:

```json
{
  "type": "ui_render",
  "component": "QuoteApprovalCard",
  "props": {
    "vendor": "Acme Corp",
    "amount": "$12,500",
    "savings": "12%",
    "items": [...]
  }
}
```

The frontend dynamically imports and renders the specified component.

## 📊 Database Schema

Key models include:
- **User**: Authentication and profile data
- **Organization**: Multi-tenant workspace
- **Member**: User-organization relationships
- **ProcurementRequest**: Main workflow entity with LangGraph thread ID
- **Product**: Inventory management
- **Vendor**: Supplier information

## 🔒 Security Features

- **Multi-tenancy**: Complete data isolation by `orgId`
- **Role-based access**: Fine-grained permissions
- **JWT Authentication**: Secure API access
- **Input Validation**: Zod schemas for all API endpoints
- **Rate Limiting**: Protection against abuse
- **Secure Storage**: Encrypted credentials

## 🛠️ Deployment

### Local Development
```bash
pnpm docker:dev
```

### Production Build
```bash
# Build frontend
pnpm build

# Build AI engine
pnpm build:ai

# Create Docker images
docker-compose build
```

### Production Deployment
- Use `docker-compose.prod.yml` for production configuration
- Set up reverse proxy (Nginx/Traefik) for routing
- Configure proper SSL certificates
- Set up monitoring and logging

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Core functionality (90%+ coverage)
- **Integration Tests**: Service interactions
- **E2E Tests**: User workflows with Playwright
- **Performance Tests**: Load testing
- **Accessibility Tests**: a11y compliance

### Running Tests
```bash
# All tests
pnpm test

# Specific test suites
pnpm test:web
pnpm test:ai
pnpm test:e2e
```

## 📚 Documentation

- [PRD & Architecture](prd.md) - Detailed technical specifications
- [Database Setup](DATABASE-SETUP.md) - Database configuration guide
- [Deployment Guide](DEPLOYMENT-GUIDE.md) - Production deployment instructions
- [Test Plan](test-plan.md) - Comprehensive testing strategy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [x] Core procurement workflow
- [x] Multi-tenant authentication
- [x] AGUI component system
- [x] Vendor negotiation automation
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Multi-language support
- [ ] ERP system integrations

---

**SupplyGraph** - Transforming procurement from paperwork to intelligent automation! 🚀