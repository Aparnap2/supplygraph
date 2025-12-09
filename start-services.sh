#!/bin/bash

# SupplyGraph Services Startup Script
# Starts all required services in the correct order with proper configuration

set -e

# Configuration
NETWORK_NAME="supplygraph-network"
PROJECT_NAME="supplygraph"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    if [ -f ".env" ]; then
        source .env
    fi

    if [ -z "$OPENAI_API_KEY" ]; then
        log_warning "OPENAI_API_KEY not found in environment. AI Engine will require this key."
        log_warning "Set it in your .env file or export it before running this script."
    fi
}

# Cleanup function
cleanup() {
    log_info "Cleaning up containers on interrupt..."
    docker stop ${PROJECT_NAME}-postgres ${PROJECT_NAME}-valkey ${PROJECT_NAME}-ai-engine 2>/dev/null || true
    docker rm ${PROJECT_NAME}-postgres ${PROJECT_NAME}-valkey ${PROJECT_NAME}-ai-engine 2>/dev/null || true
    exit 0
}

# Set trap for cleanup on interrupt
trap cleanup SIGINT SIGTERM

# Main function
main() {
    log_info "Starting SupplyGraph Services..."

    # Check environment
    check_env_vars

    # Create network if it doesn't exist
    if ! docker network ls | grep -q ${NETWORK_NAME}; then
        log_info "Creating network: ${NETWORK_NAME}"
        docker network create ${NETWORK_NAME}
    fi

    # Start PostgreSQL
    log_info "Starting PostgreSQL database..."
    docker run -d \
        --name ${PROJECT_NAME}-postgres \
        --network ${NETWORK_NAME} \
        -e POSTGRES_DB=supplygraph \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -p 5432:5432 \
        -v ${PROJECT_NAME}-postgres-data:/var/lib/postgresql/data \
        --health-cmd="pg_isready -U postgres" \
        --health-interval=10s \
        --health-timeout=5s \
        --health-retries=5 \
        --restart unless-stopped \
        pgvector/pgvector:pg17

    # Wait for PostgreSQL to be healthy
    log_info "Waiting for PostgreSQL to be ready..."
    while ! docker exec ${PROJECT_NAME}-postgres pg_isready -U postgres >/dev/null 2>&1; do
        sleep 1
    done
    log_success "PostgreSQL is ready!"

    # Initialize database schema
    log_info "Initializing database schema..."
    docker exec -i ${PROJECT_NAME}-postgres psql -U postgres -d supplygraph <<-EOF
        -- Enable vector extension
        CREATE EXTENSION IF NOT EXISTS vector;

        -- Create tenant schema
        CREATE SCHEMA IF NOT EXISTS tenants;

        -- Create tables if they don't exist
        CREATE TABLE IF NOT EXISTS tenants.tenants (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tenants.products (
            id SERIAL PRIMARY KEY,
            tenant_id INTEGER REFERENCES tenants.tenants(id),
            name VARCHAR(255) NOT NULL,
            sku VARCHAR(100),
            price DECIMAL(10, 2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tenants.products_embeddings (
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES tenants.products(id),
            embedding vector(1536),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create indexes for performance
        CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON tenants.products(tenant_id);
        CREATE INDEX IF NOT EXISTS idx_products_embeddings_product_id ON tenants.products_embeddings(product_id);
EOF
    log_success "Database schema initialized!"

    # Start Valkey
    log_info "Starting Valkey cache..."
    docker run -d \
        --name ${PROJECT_NAME}-valkey \
        --network ${NETWORK_NAME} \
        -p 6379:6379 \
        -v ${PROJECT_NAME}-valkey-data:/data \
        --health-cmd="valkey-cli ping" \
        --health-interval=10s \
        --health-timeout=5s \
        --health-retries=5 \
        --restart unless-stopped \
        valkey/valkey:alpine3.22

    # Wait for Valkey to be healthy
    log_info "Waiting for Valkey to be ready..."
    while ! docker exec ${PROJECT_NAME}-valkey valkey-cli ping >/dev/null 2>&1; do
        sleep 1
    done
    log_success "Valkey is ready!"

    # Check if AI Engine image exists
    if ! docker images | grep -q "supplygraph-ai-engine"; then
        log_error "AI Engine image not found. Please build it first with:"
        log_error "docker build -t supplygraph-ai-engine ./apps/ai-engine"
        exit 1
    fi

    # Start AI Engine
    log_info "Starting AI Engine..."
    docker run -d \
        --name ${PROJECT_NAME}-ai-engine \
        --network ${NETWORK_NAME} \
        -p 8000:8000 \
        -e DATABASE_URL=postgresql://postgres:postgres@${PROJECT_NAME}-postgres:5432/supplygraph \
        -e VALKEY_URL=redis://${PROJECT_NAME}-valkey:6379 \
        -e REDIS_URL=redis://${PROJECT_NAME}-valkey:6379 \
        -e NODE_ENV=production \
        -e OPENAI_API_KEY=${OPENAI_API_KEY} \
        -v $(pwd)/apps/ai-engine:/app \
        -v /app/__pycache__ \
        --health-cmd="curl -f http://localhost:8000/health || exit 1" \
        --health-interval=30s \
        --health-timeout=10s \
        --health-retries=3 \
        --restart unless-stopped \
        supplygraph-ai-engine:latest

    # Wait for AI Engine to be healthy (with timeout)
    log_info "Waiting for AI Engine to be ready..."
    AI_ENGINE_TIMEOUT=60
    AI_ENGINE_COUNT=0

    while [ $AI_ENGINE_COUNT -lt $AI_ENGINE_TIMEOUT ]; do
        if curl -f http://localhost:8000/health >/dev/null 2>&1; then
            log_success "AI Engine is ready!"
            break
        fi
        sleep 1
        ((AI_ENGINE_COUNT++))

        if [ $AI_ENGINE_COUNT -eq $AI_ENGINE_TIMEOUT ]; then
            log_error "AI Engine failed to start within ${AI_ENGINE_TIMEOUT} seconds"
            log_error "Check logs with: docker logs ${PROJECT_NAME}-ai-engine"
            exit 1
        fi
    done

    # Display service status
    echo -e "\n${GREEN}===================================${NC}"
    echo -e "${GREEN}All services started successfully!${NC}"
    echo -e "${GREEN}===================================${NC}"

    echo -e "\n${BLUE}Service URLs:${NC}"
    echo "PostgreSQL: localhost:5432"
    echo "Valkey: localhost:6379"
    echo "AI Engine API: http://localhost:8000"
    echo "API Documentation: http://localhost:8000/docs"

    echo -e "\n${BLUE}Container Status:${NC}"
    docker ps --filter "name=${PROJECT_NAME}-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

    echo -e "\n${BLUE}Useful Commands:${NC}"
    echo "View AI Engine logs: docker logs -f ${PROJECT_NAME}-ai-engine"
    echo "View PostgreSQL logs: docker logs -f ${PROJECT_NAME}-postgres"
    echo "View Valkey logs: docker logs -f ${PROJECT_NAME}-valkey"
    echo "Stop all services: docker stop \$(docker ps -q --filter \"name=${PROJECT_NAME}-\")"
    echo "Remove all containers: docker rm -f \$(docker ps -a -q --filter \"name=${PROJECT_NAME}-\")"

    echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"

    # Keep script running
    while true; do
        sleep 1
    done
}

# Run main function
main "$@"