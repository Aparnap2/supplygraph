#!/bin/bash

# SupplyGraph Infrastructure Validation Script
# Validates individual components without requiring API keys

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    ((TESTS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Test PostgreSQL
test_postgresql() {
    echo -e "\n${BLUE}=== Testing PostgreSQL ===${NC}"

    # Start PostgreSQL container
    log_info "Starting PostgreSQL test container..."
    docker run -d --name validate-postgres \
        -e POSTGRES_DB=supplygraph \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -p 5434:5432 \
        pgvector/pgvector:pg17 >/dev/null 2>&1

    # Wait for startup
    local count=0
    while [ $count -lt 30 ]; do
        if docker exec validate-postgres pg_isready -U postgres >/dev/null 2>&1; then
            break
        fi
        sleep 1
        ((count++))
    done

    # Test database connectivity
    if docker exec validate-postgres psql -U postgres -d supplygraph -c "SELECT version();" >/dev/null 2>&1; then
        log_success "PostgreSQL: Database connection"
    else
        log_error "PostgreSQL: Database connection"
    fi

    # Test vector extension
    if docker exec validate-postgres psql -U postgres -d supplygraph -c "CREATE EXTENSION IF NOT EXISTS vector;" >/dev/null 2>&1; then
        log_success "PostgreSQL: Vector extension"
    else
        log_error "PostgreSQL: Vector extension"
    fi

    # Test schema creation
    if docker exec validate-postgres psql -U postgres -d supplygraph -c "CREATE SCHEMA IF NOT EXISTS test_schema;" >/dev/null 2>&1; then
        log_success "PostgreSQL: Schema creation"
    else
        log_error "PostgreSQL: Schema creation"
    fi

    # Test CRUD operations
    docker exec -i validate-postgres psql -U postgres -d supplygraph >/dev/null 2>&1 << 'EOF'
    CREATE TABLE IF NOT EXISTS test_schema.test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
    );
    INSERT INTO test_schema.test_table (name) VALUES ('test') ON CONFLICT DO NOTHING;
    UPDATE test_schema.test_table SET name = 'updated' WHERE name = 'test';
EOF

    if [ $? -eq 0 ]; then
        log_success "PostgreSQL: CRUD operations"
    else
        log_error "PostgreSQL: CRUD operations"
    fi

    # Test vector operations
    if docker exec validate-postgres psql -U postgres -d supplygraph -c "
        CREATE TABLE IF NOT EXISTS test_schema.vectors (
            id SERIAL PRIMARY KEY,
            embedding vector(3)
        );
        INSERT INTO test_schema.vectors (embedding) VALUES ('[1,2,3]'::vector);
        SELECT 1 FROM test_schema.vectors LIMIT 1;" >/dev/null 2>&1; then
        log_success "PostgreSQL: Vector operations"
    else
        log_error "PostgreSQL: Vector operations"
    fi

    # Cleanup
    docker rm -f validate-postgres >/dev/null 2>&1
}

# Test Valkey
test_valkey() {
    echo -e "\n${BLUE}=== Testing Valkey ===${NC}"

    # Start Valkey container
    log_info "Starting Valkey test container..."
    docker run -d --name validate-valkey \
        -p 6380:6379 \
        valkey/valkey:alpine3.22 >/dev/null 2>&1

    # Wait for startup
    local count=0
    while [ $count -lt 30 ]; do
        if docker exec validate-valkey valkey-cli ping >/dev/null 2>&1; then
            break
        fi
        sleep 1
        ((count++))
    done

    # Test basic operations
    if docker exec validate-valkey valkey-cli set test_key "test_value" >/dev/null 2>&1; then
        log_success "Valkey: SET operation"
    else
        log_error "Valkey: SET operation"
    fi

    if [ "$(docker exec validate-valkey valkey-cli get test_key 2>/dev/null)" = "test_value" ]; then
        log_success "Valkey: GET operation"
    else
        log_error "Valkey: GET operation"
    fi

    # Test data types
    if docker exec validate-valkey valkey-cli hmset user:1 name "Test User" email "test@example.com" >/dev/null 2>&1; then
        log_success "Valkey: Hash operations"
    else
        log_error "Valkey: Hash operations"
    fi

    if docker exec validate-valkey valkey-cli lpush list_test item1 item2 >/dev/null 2>&1; then
        log_success "Valkey: List operations"
    else
        log_error "Valkey: List operations"
    fi

    # Test performance
    local start_time=$(date +%s%N)
    for i in {1..50}; do
        docker exec validate-valkey valkey-cli set "perf_$i" "value_$i" >/dev/null 2>&1
    done
    local end_time=$(date +%s%N)
    local duration=$((($end_time - $start_time) / 1000000))

    if [ $duration -lt 1000 ]; then
        log_success "Valkey: Performance (50 ops in ${duration}ms)"
    else
        log_warning "Valkey: Performance (50 ops in ${duration}ms - slower than expected)"
    fi

    # Cleanup
    docker rm -f validate-valkey >/dev/null 2>&1
}

# Test AI Engine Image
test_ai_engine_image() {
    echo -e "\n${BLUE}=== Testing AI Engine Image ===${NC}"

    if docker images | grep -q "supplygraph-ai-engine"; then
        log_success "AI Engine: Image found"

        # Check image size
        local image_size=$(docker images supplygraph-ai-engine --format "{{.Size}}")
        log_info "AI Engine: Image size is ${image_size}"

        # Test image can run (will fail without env vars, but container should start)
        log_info "Testing image can be instantiated..."
        if docker run --rm --name test-ai-engine \
            -e DATABASE_URL=postgresql://test:test@localhost:5432/test \
            -e REDIS_URL=redis://localhost:6379 \
            supplygraph-ai-engine:latest \
            python -c "import sys; print('Python environment:', sys.version)" >/dev/null 2>&1; then
            log_success "AI Engine: Python environment"
        else
            log_error "AI Engine: Python environment"
        fi
    else
        log_error "AI Engine: Image not found. Run: docker build -t supplygraph-ai-engine ./apps/ai-engine"
    fi
}

# Test Network Configuration
test_network() {
    echo -e "\n${BLUE}=== Testing Network Configuration ===${NC}"

    if docker network ls | grep -q "supplygraph-network"; then
        log_success "Network: supplygraph-network exists"
    else
        log_warning "Network: supplygraph-network not found (will be created on startup)"
    fi

    # Test inter-container communication
    log_info "Testing inter-container communication..."
    docker run -d --name test-net-1 alpine sleep 100 >/dev/null 2>&1
    docker run -d --name test-net-2 alpine sleep 100 >/dev/null 2>&1
    docker network create test-network >/dev/null 2>&1
    docker network connect test-network test-net-1
    docker network connect test-network test-net-2

    if docker exec test-net-1 ping -c 1 test-net-2 >/dev/null 2>&1; then
        log_success "Network: Inter-container communication"
    else
        log_error "Network: Inter-container communication"
    fi

    # Cleanup
    docker network rm test-network >/dev/null 2>&1
    docker rm -f test-net-1 test-net-2 >/dev/null 2>&1
}

# Main function
main() {
    echo -e "\n${BLUE}SupplyGraph Infrastructure Validation${NC}"
    echo "===================================="

    # Check Docker
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running"
        exit 1
    fi
    log_success "Docker is running"

    # Run tests
    test_postgresql
    test_valkey
    test_ai_engine_image
    test_network

    # Summary
    echo -e "\n${BLUE}====================================${NC}"
    echo -e "${BLUE}Validation Summary${NC}"
    echo -e "${BLUE}====================================${NC}"

    echo -e "\nTests passed: ${GREEN}${TESTS_PASSED}${NC}"
    echo -e "Tests failed: ${RED}${TESTS_FAILED}${NC}"

    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "\n${GREEN}✓ All validation tests passed!${NC}"
        echo -e "\nYour infrastructure is ready. To start all services:"
        echo -e "${YELLOW}./start-services.sh${NC}"
        exit 0
    else
        echo -e "\n${RED}✗ Some tests failed. Please review the errors above.${NC}"
        exit 1
    fi
}

# Run main function
main "$@"