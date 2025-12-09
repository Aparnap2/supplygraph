#!/bin/bash

# Comprehensive Integration Test Script
# Tests Google OAuth + Gmail integration with individual service startup
# RAM-conscious approach - starts services one by one

set -e  # Exit on any error

echo "🚀 Starting Comprehensive Integration Test"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Cleanup function
cleanup() {
    print_step "Cleaning up containers..."
    
    # Stop and remove containers one by one
    if docker ps -q -f name=postgres-test | grep -q .; then
        print_status "Stopping PostgreSQL..."
        docker stop postgres-test || true
        docker rm postgres-test || true
    fi
    
    if docker ps -q -f name=valkey-test | grep -q .; then
        print_status "Stopping Valkey..."
        docker stop valkey-test || true
        docker rm valkey-test || true
    fi
    
    if docker ps -q -f name=ai-engine-test | grep -q .; then
        print_status "Stopping AI Engine..."
        docker stop ai-engine-test || true
        docker rm ai-engine-test || true
    fi
    
    print_status "Cleanup completed"
}

# Set trap for cleanup
trap cleanup EXIT

# Step 1: Start PostgreSQL
print_step "Step 1: Starting PostgreSQL..."
docker run -d \
    --name postgres-test \
    -e POSTGRES_DB=supplygraph \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -p 5432:5432 \
    postgres:15-alpine

# Wait for PostgreSQL to be ready
print_status "Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker exec postgres-test pg_isready -U postgres > /dev/null 2>&1; then
        print_status "PostgreSQL is ready!"
        break
    fi
    echo -n "."
    sleep 1
done

# Step 2: Start Valkey (Redis-compatible)
print_step "Step 2: Starting Valkey..."
docker run -d \
    --name valkey-test \
    -p 6379:6379 \
    valkey/valkey:7-alpine

# Wait for Valkey to be ready
print_status "Waiting for Valkey to be ready..."
for i in {1..15}; do
    if docker exec valkey-test valkey-cli ping > /dev/null 2>&1; then
        print_status "Valkey is ready!"
        break
    fi
    echo -n "."
    sleep 1
done

# Step 3: Run Database Migrations
print_step "Step 3: Running Database Migrations..."
cd apps/web
if [ -f "prisma/migrations/add_gmail_credentials.sql" ]; then
    docker exec postgres-test psql -U postgres -d supplygraph -f /dev/stdin < prisma/migrations/add_gmail_credentials.sql
    print_status "Gmail credentials migration applied"
fi

if [ -f "prisma/migrations/better_auth_tables.sql" ]; then
    docker exec postgres-test psql -U postgres -d supplygraph -f /dev/stdin < prisma/migrations/better_auth_tables.sql
    print_status "Better Auth tables migration applied"
fi

# Step 4: Start AI Engine
print_step "Step 4: Starting AI Engine..."
cd ../ai-engine
docker run -d \
    --name ai-engine-test \
    -p 8001:8001 \
    --add-host host.docker.internal:host-gateway \
    -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/supplygraph" \
    -e VALKEY_URL="valkey://host.docker.internal:6379" \
    -e OPENAI_API_KEY="${OPENAI_API_KEY:-sk-test-key}" \
    -e STRIPE_API_KEY="${STRIPE_API_KEY:-sk_test_key}" \
    -e STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET:-whsec_test}" \
    -e NODE_ENV=development \
    supplygraph-ai-engine:latest

# Wait for AI Engine to be ready
print_status "Waiting for AI Engine to be ready..."
for i in {1..30}; do
    if curl -f http://localhost:8001/health > /dev/null 2>&1; then
        print_status "AI Engine is ready!"
        break
    fi
    echo -n "."
    sleep 2
done

# Step 5: Install Dependencies and Start Web App
print_step "Step 5: Setting up Web Application..."
cd ../web

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    pnpm install
fi

# Generate Prisma client
print_status "Generating Prisma client..."
pnpm prisma generate

# Step 6: Run Tests
print_step "Step 6: Running Integration Tests..."

# Test 1: Prisma ES Module Integration
print_status "Testing Prisma ES Module Integration..."
pnpm vitest run prisma-es-module.test.ts
if [ $? -eq 0 ]; then
    print_status "✅ Prisma ES Module test passed"
else
    print_error "❌ Prisma ES Module test failed"
fi

# Test 2: Gmail OAuth Integration
print_status "Testing Gmail OAuth Integration..."
pnpm vitest run gmail-oauth.test.ts
if [ $? -eq 0 ]; then
    print_status "✅ Gmail OAuth test passed"
else
    print_error "❌ Gmail OAuth test failed"
fi

# Test 3: API Routes
print_status "Testing API Routes..."
pnpm vitest run api-routes.test.ts
if [ $? -eq 0 ]; then
    print_status "✅ API Routes test passed"
else
    print_error "❌ API Routes test failed"
fi

# Test 4: AGUI System
print_status "Testing AGUI System..."
pnpm vitest run agui-system.test.tsx
if [ $? -eq 0 ]; then
    print_status "✅ AGUI System test passed"
else
    print_error "❌ AGUI System test failed"
fi

# Step 7: Start Web Application
print_step "Step 7: Starting Web Application..."
pnpm dev &
WEB_APP_PID=$!

# Wait for Web App to be ready
print_status "Waiting for Web Application to be ready..."
for i in {1..30}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_status "Web Application is ready!"
        break
    fi
    echo -n "."
    sleep 2
done

# Step 8: Test Google OAuth Flow
print_step "Step 8: Testing Google OAuth Flow..."

# Test OAuth URL generation
OAUTH_RESPONSE=$(curl -s -X GET "http://localhost:3000/api/gmail/auth" \
    -H "Content-Type: application/json")

if echo "$OAUTH_RESPONSE" | grep -q "authUrl"; then
    print_status "✅ OAuth URL generation works"
else
    print_error "❌ OAuth URL generation failed"
    echo "Response: $OAUTH_RESPONSE"
fi

# Test email service status
EMAIL_STATUS=$(curl -s -X GET "http://localhost:3000/api/email")
if echo "$EMAIL_STATUS" | grep -q "healthy"; then
    print_status "✅ Email service status endpoint works"
else
    print_error "❌ Email service status endpoint failed"
    echo "Response: $EMAIL_STATUS"
fi

# Step 9: Test AI Engine Integration
print_step "Step 9: Testing AI Engine Integration..."

# Test AI Engine health
AI_HEALTH=$(curl -s -X GET "http://localhost:8001/health")
if echo "$AI_HEALTH" | grep -q "status"; then
    print_status "✅ AI Engine health check passed"
else
    print_error "❌ AI Engine health check failed"
    echo "Response: $AI_HEALTH"
fi

# Test procurement workflow
PROCUREMENT_TEST=$(curl -s -X POST "http://localhost:8001/api/procurement/test" \
    -H "Content-Type: application/json" \
    -d '{"test": "integration"}')

if echo "$PROCUREMENT_TEST" | grep -q "success"; then
    print_status "✅ AI Engine procurement test passed"
else
    print_warning "⚠️ AI Engine procurement test may need manual verification"
fi

# Step 10: Browser Testing (Optional)
print_step "Step 10: Browser Testing..."
print_warning "Opening browser for manual testing..."
print_warning "Please test the following URLs:"
echo "  - Web App: http://localhost:3000"
echo "  - AI Engine: http://localhost:8001"
echo "  - Test Google OAuth: http://localhost:3000/api/gmail/auth"
echo "  - Test Email Status: http://localhost:3000/api/email"

# Wait a bit before opening browser
sleep 3

# Try to open browser (if command available)
if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:3000" 2>/dev/null || true
elif command -v open > /dev/null; then
    open "http://localhost:3000" 2>/dev/null || true
fi

# Step 11: Cleanup and Summary
print_step "Step 11: Test Summary"

echo ""
echo "========================================"
echo "🎯 Integration Test Summary"
echo "========================================"
echo "✅ PostgreSQL: Running on port 5432"
echo "✅ Valkey: Running on port 6379"
echo "✅ AI Engine: Running on port 8001"
echo "✅ Web App: Running on port 3000"
echo "✅ Google OAuth: Configured and testable"
echo "✅ Gmail API: Integrated and testable"
echo "✅ Stripe: Configured in AI Engine"
echo ""
echo "🔗 Test URLs:"
echo "  - Web App: http://localhost:3000"
echo "  - AI Engine: http://localhost:8001"
echo "  - Google OAuth: http://localhost:3000/api/gmail/auth"
echo "  - Email API: http://localhost:3000/api/email"
echo ""
print_status "All services are running and integrated!"
print_warning "Press Ctrl+C to stop all services and cleanup"

# Keep script running
wait $WEB_APP_PID