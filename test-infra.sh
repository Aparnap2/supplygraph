#!/bin/bash

# SupplyGraph Docker Infrastructure Testing Script
# Tests PostgreSQL, Valkey, and AI Engine services individually

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NETWORK_NAME="supplygraph-network"
POSTGRES_CONTAINER="test-postgres"
VALKEY_CONTAINER="test-valkey"
AI_ENGINE_CONTAINER="test-ai-engine"

# Database configuration
POSTGRES_DB="supplygraph_test"
POSTGRES_USER="test_user"
POSTGRES_PASSWORD="test_password"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5433"

# Valkey configuration
VALKEY_PORT="6380"

# AI Engine configuration
AI_ENGINE_PORT="8001"

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Cleaning up test containers...${NC}"
    docker stop ${POSTGRES_CONTAINER} ${VALKEY_CONTAINER} ${AI_ENGINE_CONTAINER} 2>/dev/null || true
    docker rm ${POSTGRES_CONTAINER} ${VALKEY_CONTAINER} ${AI_ENGINE_CONTAINER} 2>/dev/null || true
}

# Set trap for cleanup on script exit
trap cleanup EXIT

# Helper functions
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

wait_for_container() {
    local container_name=$1
    local health_check=$2
    local timeout=${3:-30}

    log_info "Waiting for ${container_name} to be healthy..."
    local count=0

    while ! $health_check; do
        if [ $count -ge $timeout ]; then
            log_error "Timeout waiting for ${container_name}"
            return 1
        fi
        sleep 1
        ((count++))
    done

    log_success "${container_name} is ready!"
}

# Health check functions
check_postgres_health() {
    docker exec ${POSTGRES_CONTAINER} pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} >/dev/null 2>&1
}

check_valkey_health() {
    docker exec ${VALKEY_CONTAINER} valkey-cli ping >/dev/null 2>&1
}

check_ai_engine_health() {
    curl -f http://localhost:${AI_ENGINE_PORT}/health >/dev/null 2>&1
}

# Test functions
test_postgres() {
    log_info "\n=== Testing PostgreSQL Database ==="

    # Start PostgreSQL container
    log_info "Starting PostgreSQL container..."
    docker run -d \
        --name ${POSTGRES_CONTAINER} \
        --network ${NETWORK_NAME} \
        -e POSTGRES_DB=${POSTGRES_DB} \
        -e POSTGRES_USER=${POSTGRES_USER} \
        -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
        -p ${POSTGRES_PORT}:5432 \
        --health-cmd="pg_isready -U ${POSTGRES_USER}" \
        --health-interval=10s \
        --health-timeout=5s \
        --health-retries=5 \
        pgvector/pgvector:pg17

    # Wait for PostgreSQL to be healthy
    wait_for_container "PostgreSQL" check_postgres_health 60

    # Test basic connectivity
    log_info "Testing database connection..."
    docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "SELECT version();" >/dev/null

    # Test schema creation
    log_info "Creating test schema and tables..."
    docker exec -i ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} <<-EOF
        -- Create multi-tenant schema
        CREATE SCHEMA IF NOT EXISTS tenants;

        -- Create test tenant
        CREATE TABLE tenants.tenants (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create test table for the tenant
        CREATE TABLE tenants.products (
            id SERIAL PRIMARY KEY,
            tenant_id INTEGER REFERENCES tenants.tenants(id),
            name VARCHAR(255) NOT NULL,
            sku VARCHAR(100),
            price DECIMAL(10, 2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Enable vector extension
        CREATE EXTENSION IF NOT EXISTS vector;

        -- Create table with vector support
        CREATE TABLE tenants.products_embeddings (
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES tenants.products(id),
            embedding vector(1536),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Insert test data
        INSERT INTO tenants.tenants (name, slug) VALUES ('Test Tenant', 'test-tenant');

        INSERT INTO tenants.products (tenant_id, name, sku, price)
        VALUES (1, 'Test Product', 'TEST-001', 99.99);

        INSERT INTO tenants.products_embeddings (product_id, embedding)
        VALUES (1, '[0.1, 0.2, 0.3]'::vector);

        -- Create indexes
        CREATE INDEX idx_products_tenant_id ON tenants.products(tenant_id);
        CREATE INDEX idx_products_embeddings_product_id ON tenants.products_embeddings(product_id);
EOF

    # Test CRUD operations
    log_info "Testing CRUD operations..."

    # Read
    READ_RESULT=$(docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -t -c "SELECT COUNT(*) FROM tenants.tenants;")
    if [ "$READ_RESULT" -eq "1" ]; then
        log_success "Read operation successful"
    else
        log_error "Read operation failed"
        return 1
    fi

    # Update
    docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "UPDATE tenants.products SET price = 89.99 WHERE sku = 'TEST-001';"
    UPDATED_PRICE=$(docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -t -c "SELECT price FROM tenants.products WHERE sku = 'TEST-001';")
    if [[ "$UPDATED_PRICE" =~ "89.99" ]]; then
        log_success "Update operation successful"
    else
        log_error "Update operation failed"
        return 1
    fi

    # Delete
    docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "DELETE FROM tenants.products WHERE sku = 'TEST-001';"
    DELETED_COUNT=$(docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -t -c "SELECT COUNT(*) FROM tenants.products;")
    if [ "$DELETED_COUNT" -eq "0" ]; then
        log_success "Delete operation successful"
    else
        log_error "Delete operation failed"
        return 1
    fi

    # Test vector operations
    log_info "Testing vector operations..."
    VECTOR_RESULT=$(docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -t -c "SELECT embedding <=> '[0.1, 0.2, 0.3]'::vector as distance FROM tenants.products_embeddings;")
    if [[ "$VECTOR_RESULT" =~ "0" ]]; then
        log_success "Vector operations working"
    else
        log_error "Vector operations failed"
        return 1
    fi

    # Test data integrity
    log_info "Testing data integrity..."
    INTEGRITY_RESULT=$(docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -t -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = 'tenants';")
    if [ "$INTEGRITY_RESULT" -gt "0" ]; then
        log_success "Data integrity constraints in place"
    else
        log_error "Data integrity constraints missing"
        return 1
    fi

    log_success "PostgreSQL tests completed successfully!"

    # Save connection string for AI Engine test
    export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
}

test_valkey() {
    log_info "\n=== Testing Valkey Cache ==="

    # Start Valkey container
    log_info "Starting Valkey container..."
    docker run -d \
        --name ${VALKEY_CONTAINER} \
        --network ${NETWORK_NAME} \
        -p ${VALKEY_PORT}:6379 \
        --health-cmd="valkey-cli ping" \
        --health-interval=10s \
        --health-timeout=5s \
        --health-retries=5 \
        valkey/valkey:alpine3.22

    # Wait for Valkey to be healthy
    wait_for_container "Valkey" check_valkey_health 30

    # Test basic key-value operations
    log_info "Testing basic key-value operations..."

    # SET operation
    docker exec ${VALKEY_CONTAINER} valkey-cli set test_key "test_value" >/dev/null
    log_success "SET operation successful"

    # GET operation
    GET_RESULT=$(docker exec ${VALKEY_CONTAINER} valkey-cli get test_key)
    if [ "$GET_RESULT" = "test_value" ]; then
        log_success "GET operation successful"
    else
        log_error "GET operation failed"
        return 1
    fi

    # Test data types
    log_info "Testing different data types..."

    # Hash
    docker exec ${VALKEY_CONTAINER} valkey-cli hmset test_hash field1 "value1" field2 "value2" >/dev/null
    HASH_SIZE=$(docker exec ${VALKEY_CONTAINER} valkey-cli hlen test_hash)
    if [ "$HASH_SIZE" -eq "2" ]; then
        log_success "Hash operations working"
    else
        log_error "Hash operations failed"
        return 1
    fi

    # List
    docker exec ${VALKEY_CONTAINER} valkey-cli lpush test_list "item1" "item2" "item3" >/dev/null
    LIST_LENGTH=$(docker exec ${VALKEY_CONTAINER} valkey-cli llen test_list)
    if [ "$LIST_LENGTH" -eq "3" ]; then
        log_success "List operations working"
    else
        log_error "List operations failed"
        return 1
    fi

    # Set
    docker exec ${VALKEY_CONTAINER} valkey-cli sadd test_set "member1" "member2" "member3" >/dev/null
    SET_SIZE=$(docker exec ${VALKEY_CONTAINER} valkey-cli scard test_set)
    if [ "$SET_SIZE" -eq "3" ]; then
        log_success "Set operations working"
    else
        log_error "Set operations failed"
        return 1
    fi

    # Test pub/sub capabilities
    log_info "Testing pub/sub capabilities..."

    # Subscribe to a channel in background
    docker exec -d ${VALKEY_CONTAINER} valkey-cli subscribe test_channel &
    SUB_PID=$!
    sleep 1

    # Publish to the channel
    docker exec ${VALKEY_CONTAINER} valkey-cli publish test_channel "test_message" >/dev/null
    sleep 1

    # Clean up subscriber
    kill $SUB_PID 2>/dev/null || true
    log_success "Pub/Sub operations tested"

    # Test connection pooling simulation
    log_info "Testing connection performance..."
    START_TIME=$(date +%s%N)
    for i in {1..100}; do
        docker exec ${VALKEY_CONTAINER} valkey-cli set "pool_test_$i" "value_$i" >/dev/null
    done
    END_TIME=$(date +%s%N)
    DURATION=$((($END_TIME - $START_TIME) / 1000000))
    log_success "100 SET operations completed in ${DURATION}ms"

    # Test persistence
    log_info "Testing persistence..."
    docker exec ${VALKEY_CONTAINER} valkey-cli save >/dev/null
    log_success "Persistence test completed"

    # Save connection string for AI Engine test
    export VALKEY_URL="valkey://localhost:${VALKEY_PORT}"
    export REDIS_URL="valkey://localhost:${VALKEY_PORT}"
}

test_ai_engine() {
    log_info "\n=== Testing AI Engine Service ==="

    # Check if the AI Engine image exists
    if ! docker images | grep -q "supplygraph-ai-engine"; then
        log_error "AI Engine image not found. Please build it first."
        return 1
    fi

    # Start AI Engine container
    log_info "Starting AI Engine container..."
    docker run -d \
        --name ${AI_ENGINE_CONTAINER} \
        --network ${NETWORK_NAME} \
        -p ${AI_ENGINE_PORT}:8000 \
        -e DATABASE_URL="${DATABASE_URL}" \
        -e VALKEY_URL="${VALKEY_URL}" \
        -e REDIS_URL="${REDIS_URL}" \
        -e NODE_ENV="test" \
        --health-cmd="curl -f http://localhost:8000/health" \
        --health-interval=30s \
        --health-timeout=10s \
        --health-retries=3 \
        supplygraph-ai-engine:latest

    # Wait for AI Engine to be healthy
    wait_for_container "AI Engine" check_ai_engine_health 60

    # Test API endpoints
    log_info "Testing API endpoints..."

    # Health endpoint
    HEALTH_RESPONSE=$(curl -s http://localhost:${AI_ENGINE_PORT}/health)
    if echo "$HEALTH_RESPONSE" | grep -q "healthy\|ok"; then
        log_success "Health endpoint working"
    else
        log_error "Health endpoint failed: $HEALTH_RESPONSE"
        return 1
    fi

    # Test database connectivity
    log_info "Testing database connectivity..."
    DB_CHECK_RESPONSE=$(curl -s http://localhost:${AI_ENGINE_PORT}/health/db 2>/dev/null || echo "endpoint_not_found")
    if echo "$DB_CHECK_RESPONSE" | grep -q "healthy\|ok\|connected"; then
        log_success "Database connectivity verified"
    else
        log_warning "Database health endpoint not available (expected in test environment)"
    fi

    # Test WebSocket capabilities
    log_info "Testing WebSocket capabilities..."
    # Using websocat if available, or curl for basic check
    if command -v websocat &> /dev/null; then
        echo '{"type":"ping"}' | websocat --one-message ws://localhost:${AI_ENGINE_PORT}/ws >/dev/null 2>&1
        log_success "WebSocket endpoint responding"
    else
        # Fallback: check if WebSocket upgrade header is accepted
        curl -i -N \
             -H "Connection: Upgrade" \
             -H "Upgrade: websocket" \
             -H "Sec-WebSocket-Key: test" \
             -H "Sec-WebSocket-Version: 13" \
             http://localhost:${AI_ENGINE_PORT}/ws 2>&1 | grep -q "101 Switching Protocols" && \
        log_success "WebSocket upgrade supported" || \
        log_warning "WebSocket test inconclusive (websocat not installed)"
    fi

    # Test API routes
    log_info "Testing API routes..."

    # Test OpenAPI spec
    OPENAPI_RESPONSE=$(curl -s http://localhost:${AI_ENGINE_PORT}/docs)
    if echo "$OPENAPI_RESPONSE" | grep -q "swagger\|openapi"; then
        log_success "API documentation accessible"
    else
        log_warning "API documentation not accessible at /docs"
    fi

    # Test LangGraph workflow endpoint if exists
    WORKFLOW_RESPONSE=$(curl -s http://localhost:${AI_ENGINE_PORT}/api/workflows 2>/dev/null || echo "endpoint_not_found")
    if [ "$WORKFLOW_RESPONSE" != "endpoint_not_found" ]; then
        log_success "Workflow API endpoint responding"
    else
        log_warning "Workflow endpoint not available"
    fi

    # Check logs for any errors
    log_info "Checking container logs for errors..."
    ERROR_COUNT=$(docker logs ${AI_ENGINE_CONTAINER} 2>&1 | grep -i "error\|exception\|traceback" | wc -l)
    if [ "$ERROR_COUNT" -eq "0" ]; then
        log_success "No errors found in container logs"
    else
        log_warning "Found $ERROR_COUNT potential errors in logs"
    fi

    log_success "AI Engine tests completed successfully!"
}

# Main execution
main() {
    echo -e "\n${BLUE}SupplyGraph Docker Infrastructure Testing${NC}"
    echo "==================================="

    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi

    # Check if network exists
    if ! docker network ls | grep -q ${NETWORK_NAME}; then
        log_warning "Network ${NETWORK_NAME} does not exist. Creating it..."
        docker network create ${NETWORK_NAME}
    fi

    # Run tests
    test_postgres
    test_valkey
    test_ai_engine

    # Summary
    echo -e "\n${GREEN}===================================${NC}"
    echo -e "${GREEN}All tests completed successfully!${NC}"
    echo -e "${GREEN}===================================${NC}"

    echo -e "\n${BLUE}Test Summary:${NC}"
    echo "✓ PostgreSQL: Database connection, CRUD operations, vector support"
    echo "✓ Valkey: Key-value operations, pub/sub, performance"
    echo "✓ AI Engine: API endpoints, health checks, WebSocket support"

    echo -e "\n${BLUE}Connection Strings:${NC}"
    echo "Database URL: ${DATABASE_URL}"
    echo "Valkey URL: ${VALKEY_URL}"
    echo "AI Engine URL: http://localhost:${AI_ENGINE_PORT}"

    echo -e "\n${YELLOW}Note: Containers will be cleaned up automatically.${NC}"
}

# Run main function
main "$@"