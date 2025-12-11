#!/bin/bash
# Stop Dev Environment Services

set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Stop services
main() {
    log "🛑 Stopping SupplyGraph Dev Environment..."
    
    # Stop AI Service
    if [[ -f /tmp/ai-service.pid ]]; then
        AI_PID=$(cat /tmp/ai-service.pid)
        if kill -0 $AI_PID 2>/dev/null; then
            kill $AI_PID
            log_success "AI Service stopped"
        fi
        rm -f /tmp/ai-service.pid
    fi
    
    # Stop Frontend
    if [[ -f /tmp/web.pid ]]; then
        WEB_PID=$(cat /tmp/web.pid)
        if kill -0 $WEB_PID 2>/dev/null; then
            kill $WEB_PID
            log_success "Frontend stopped"
        fi
        rm -f /tmp/web.pid
    fi
    
    # Stop Docker containers
    docker stop supplygraph-postgres supplygraph-redis 2>/dev/null || true
    docker rm supplygraph-postgres supplygraph-redis 2>/dev/null || true
    
    log_success "All services stopped"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi