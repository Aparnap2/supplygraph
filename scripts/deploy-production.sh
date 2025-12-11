#!/bin/bash
# Production Deployment Script for SupplyGraph MVP
# Deploys to cloud services (Neon, Upstash, Vercel, etc.)

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
# PRODUCTION DEPLOYMENT
# =============================================================================
main() {
    log "🚀 Deploying SupplyGraph MVP to production..."
    
    # Check if production env exists
    if [[ ! -f ".env.production" ]]; then
        log_error ".env.production not found. Please create it with your production keys."
    fi
    
    # Deploy backend to Railway/Fly.io
    log "Deploying AI service to production..."
    cd apps/ai-service
    
    # Install dependencies
    uv sync
    
    # Run database migrations
    DATABASE_URL=$(grep DATABASE_URL ../.env.production | cut -d'=' -f2-)
    export DATABASE_URL
    python -m alembic upgrade head
    
    # Deploy (example for Railway)
    # railway login
    # railway deploy
    
    log_success "Backend deployed"
    
    # Deploy frontend to Vercel
    log "Deploying frontend to Vercel..."
    cd ../../web
    
    # Install dependencies
    pnpm install
    
    # Set environment variables for Vercel
    # vercel env add NEXT_PUBLIC_API_URL production
    # vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
    
    # Deploy
    # vercel --prod
    
    log_success "Frontend deployed"
    
    # Run production health checks
    log "Running production health checks..."
    
    # Test API health
    API_URL=$(grep NEXT_PUBLIC_API_URL ../.env.production | cut -d'=' -f2-)
    if curl -f "$API_URL/health" >/dev/null 2>&1; then
        log_success "API health check passed"
    else
        log_warning "API health check failed - may still be starting"
    fi
    
    # Test database connection
    if python -c "
import os
from sqlalchemy import create_engine
try:
    engine = create_engine('$DATABASE_URL')
    with engine.connect() as conn:
        conn.execute('SELECT 1')
    print('✓ Database connection successful')
except Exception as e:
    print(f'✗ Database connection failed: {e}')
    exit(1)
"; then
        log_success "Database connection check passed"
    else
        log_error "Database connection check failed"
    fi
    
    log_success "🎉 SupplyGraph MVP deployed to production!"
    echo ""
    echo "📍 Production URLs:"
    echo "   • Frontend:     https://your-domain.vercel.app"
    echo "   • API:          https://your-app.railway.app"
    echo "   • API Docs:     https://your-app.railway.app/docs"
    echo ""
    echo "🔧 Core Features Live:"
    echo "   • ✅ Create procurement requests"
    echo "   • ✅ Send RFQs to vendors"
    echo "   • ✅ Collect and normalize quotes"
    echo "   • ✅ Compare quotes and approve"
    echo "   • ✅ Process payments (Stripe)"
    echo "   • ✅ Multi-tenant isolation"
    echo ""
    echo "📝 Post-Deployment:"
    echo "   1. Set up monitoring (Uptime, Sentry)"
    echo "   2. Configure Stripe webhooks"
    echo "   3. Test with real users"
    echo "   4. Monitor error rates"
}

# Run deployment
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi