#!/bin/bash

echo "=== Quick Infrastructure Test ==="

# Test PostgreSQL
echo -e "\n1. Testing PostgreSQL..."
docker run -d --name test-pg -e POSTGRES_DB=test -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres pgvector/pgvector:pg17
sleep 5

if docker exec test-pg pg_isready -U postgres >/dev/null 2>&1; then
    echo "✅ PostgreSQL: Connection OK"
    docker exec test-pg psql -U postgres -d test -c "CREATE EXTENSION IF NOT EXISTS vector;" >/dev/null 2>&1 && echo "✅ PostgreSQL: Vector extension OK"
    docker exec test-pg psql -U postgres -d test -c "SELECT '[1,2,3]'::vector;" >/dev/null 2>&1 && echo "✅ PostgreSQL: Vector operations OK"
else
    echo "❌ PostgreSQL: Failed"
fi

# Test Valkey
echo -e "\n2. Testing Valkey..."
docker run -d --name test-valkey valkey/valkey:alpine3.22
sleep 2

if docker exec test-valkey valkey-cli ping >/dev/null 2>&1; then
    echo "✅ Valkey: Connection OK"
    docker exec test-valkey valkey-cli set test "value" >/dev/null 2>&1 && echo "✅ Valkey: Basic operations OK"
    docker exec test-valkey valkey-cli hmset user name "Test User" >/dev/null 2>&1 && echo "✅ Valkey: Hash operations OK"
else
    echo "❌ Valkey: Failed"
fi

# Check AI Engine image
echo -e "\n3. Checking AI Engine image..."
if docker images | grep -q "supplygraph-ai-engine"; then
    echo "✅ AI Engine: Image exists"
    docker images supplygraph-ai-engine --format "Size: {{.Size}}"
else
    echo "❌ AI Engine: Image not found"
fi

# Cleanup
echo -e "\n4. Cleaning up..."
docker rm -f test-pg test-valkey >/dev/null 2>&1

echo -e "\n=== Test Complete ==="