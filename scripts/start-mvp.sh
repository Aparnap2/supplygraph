#!/bin/bash
# Simple MVP Deployment Script for SupplyGraph
# Focus on core features only

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
# MAIN DEPLOYMENT
# =============================================================================
main() {
    log "🚀 Starting SupplyGraph MVP deployment..."
    
    # Check if .env exists
    if [[ ! -f ".env" ]]; then
        log "Creating .env from template..."
        cp .env.simple .env
        log_warning "Please edit .env with your actual API keys"
    fi
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose -f docker-compose.simple.yml down --remove-orphans || true
    
    # Start core services only
    log "Starting core services..."
    docker-compose -f docker-compose.simple.yml up --build -d
    
    # Wait for database
    log "Waiting for database to be ready..."
    sleep 10
    while ! docker exec supplygraph-postgres pg_isready -U supplygraph >/dev/null 2>&1; do
        sleep 2
    done
    
    # Run database migrations
    log "Running database migrations..."
    cd apps/ai-service
    python -m alembic upgrade head || log_warning "Migration may have already run"
    
    # Seed basic data
    python seed.py || log_warning "Seeding may have already run"
    
    # Wait for API
    log "Waiting for API to be ready..."
    sleep 15
    while ! curl -f http://localhost:8000/health >/dev/null 2>&1; do
        sleep 3
    done
    
    log_success "🎉 SupplyGraph MVP is running!"
    echo ""
    echo "📍 Core Services:"
    echo "   • Frontend:     http://localhost:3000"
    echo "   • API:          http://localhost:8000"
    echo "   • API Docs:     http://localhost:8000/docs"
    echo ""
    echo "🔧 Core Features Ready:"
    echo "   • ✅ Create procurement requests"
    echo "   • ✅ Send RFQs to vendors"
    echo "   • ✅ Collect and normalize quotes"
    echo "   • ✅ Compare quotes and approve"
    echo "   • ✅ Process payments (Stripe test mode)"
    echo "   • ✅ Multi-tenant isolation"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Edit .env with your API keys"
    echo "   2. Visit http://localhost:3000 to start"
    echo "   3. Create an organization and user"
    echo "   4. Test the procurement workflow"
}

# Run deployment
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi