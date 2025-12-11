#!/bin/bash
# Dev Environment Setup - Individual Docker Containers
# Following PRD: Focus on core features only

set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# =============================================================================
# START CORE SERVICES INDIVIDUALLY
# =============================================================================
main() {
    log "🚀 Starting SupplyGraph Dev Environment (Individual Containers)..."
    
    # Create .env if not exists
    if [[ ! -f ".env" ]]; then
        cp .env.simple .env
        log_warning "Please edit .env with your API keys"
    fi
    
    # Start PostgreSQL
    log "Starting PostgreSQL..."
    docker run -d \
        --name supplygraph-postgres \
        -e POSTGRES_USER=supplygraph \
        -e POSTGRES_PASSWORD=supplygraph123 \
        -e POSTGRES_DB=supplygraph \
        -p 5432:5432 \
        -v postgres_data:/var/lib/postgresql/data \
        postgres:15-alpine || log_warning "PostgreSQL may already be running"
    
    # Wait for PostgreSQL
    log "Waiting for PostgreSQL..."
    sleep 5
    while ! docker exec supplygraph-postgres pg_isready -U supplygraph >/dev/null 2>&1; do
        sleep 2
    done
    log_success "PostgreSQL ready"
    
    # Start Redis/Valkey
    log "Starting Redis..."
    docker run -d \
        --name supplygraph-redis \
        -p 6379:6379 \
        -v redis_data:/data \
        valkey/valkey:7.2-alpine || log_warning "Redis may already be running"
    
    # Wait for Redis
    sleep 3
    if docker exec supplygraph-redis redis-cli ping | grep -q "PONG"; then
        log_success "Redis ready"
    else
        log_error "Redis failed to start"
    fi
    
    # Setup Database
    log "Setting up database..."
    cd apps/ai-service
    
    # Install dependencies
    uv sync
    
    # Run migrations
    export DATABASE_URL="postgresql://supplygraph:supplygraph123@localhost:5432/supplygraph"
    uv run python migrate.py || log_warning "Migrations may have already run"
    
    # Seed data
    uv run python seed.py || log_warning "Seeding may have already run"
    
    # Start AI Service
    log "Starting AI Service..."
    export DATABASE_URL="postgresql://supplygraph:supplygraph123@localhost:5432/supplygraph"
    export REDIS_URL="redis://localhost:6379/0"
    export OPENAI_API_KEY="${OPENAI_API_KEY:-sk-test-key}"
    export STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:-sk_test_key}"
    export JWT_SECRET_KEY="${JWT_SECRET_KEY:-dev-secret-key}"
    
    # Start in background
    nohup uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload > /tmp/ai-service.log 2>&1 &
    AI_PID=$!
    echo $AI_PID > /tmp/ai-service.pid
    
    # Wait for AI Service
    sleep 10
    if curl -f http://localhost:8000/health >/dev/null 2>&1; then
        log_success "AI Service ready"
    else
        log_error "AI Service failed to start"
    fi
    
    # Start Frontend
    log "Starting Frontend..."
    cd ../../web
    
    # Install dependencies
    pnpm install
    
    # Start in background
    export NEXT_PUBLIC_API_URL="http://localhost:8000"
    export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${STRIPE_PUBLISHABLE_KEY:-pk_test_key}"
    
    nohup pnpm dev > /tmp/web.log 2>&1 &
    WEB_PID=$!
    echo $WEB_PID > /tmp/web.pid
    
    # Wait for Frontend
    sleep 15
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        log_success "Frontend ready"
    else
        log_error "Frontend failed to start"
    fi
    
    log_success "🎉 SupplyGraph Dev Environment Ready!"
    echo ""
    echo "📍 Services Running:"
    echo "   • PostgreSQL:   localhost:5432"
    echo "   • Redis:        localhost:6379"
    echo "   • AI Service:   http://localhost:8000"
    echo "   • Frontend:     http://localhost:3000"
    echo "   • API Docs:     http://localhost:8000/docs"
    echo ""
    echo "🔧 Core Features (PRD):"
    echo "   • ✅ Create procurement requests"
    echo "   • ✅ Send RFQs to vendors"
    echo "   • ✅ Collect and normalize quotes"
    echo "   • ✅ Compare quotes and approve"
    echo "   • ✅ Process payments (Stripe test mode)"
    echo "   • ✅ Multi-tenant isolation"
    echo ""
    echo "📝 Test Core Workflow:"
    echo "   1. Visit http://localhost:3000"
    echo "   2. Create organization & user"
    echo "   3. Add vendors"
    echo "   4. Create procurement request"
    echo "   5. Send RFQs"
    echo "   6. Check quotes & approve"
    echo ""
    echo "🛑 Stop Services:"
    echo "   ./scripts/stop-dev.sh"
}

# Run setup
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi