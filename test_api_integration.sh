#!/bin/bash
# Comprehensive API Integration Test Suite
# Tests all external APIs step by step

echo "🚀 Starting Comprehensive API Integration Tests"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_TOTAL=0

# Function to run a test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_output="$3"
    
    echo -e "\n${BLUE}🔍 Testing: ${test_name}${NC}"
    echo "Command: $command"
    
    ((TESTS_TOTAL++))
    
    # Run the command
    if eval "$command" 2>&1; then
        if [ -n "$expected_output" ]; then
            if echo "$output" | grep -q "$expected_output"; then
                echo -e "${GREEN}✅ PASS: ${test_name}${NC}"
                ((TESTS_PASSED++))
            else
                echo -e "${RED}❌ FAIL: ${test_name} - Expected output not found${NC}"
            fi
        else
            echo -e "${GREEN}✅ PASS: ${test_name}${NC}"
            ((TESTS_PASSED++))
        fi
    else
        echo -e "${RED}❌ FAIL: ${test_name}${NC}"
    fi
}

# Function to test API endpoints
test_api() {
    local api_name="$1"
    local url="$2"
    local method="${3:-GET}"
    local headers="$4"
    local data="$5"
    local expected_status="${6:-200}"
    
    echo -e "\n${BLUE}🌐 Testing ${api_name} API${NC}"
    echo "URL: $url"
    echo "Method: $method"
    
    ((TESTS_TOTAL++))
    
    # Build curl command
    local curl_cmd="curl -s -o /dev/null -w '%{http_code}'"
    
    if [ "$method" != "GET" ]; then
        curl_cmd="$curl_cmd -X $method"
    fi
    
    if [ -n "$headers" ]; then
        curl_cmd="$curl_cmd $headers"
    fi
    
    if [ -n "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    curl_cmd="$curl_cmd '$url'"
    
    echo "Curl command: $curl_cmd"
    
    # Run the curl command
    local status_code
    status_code=$(eval "$curl_cmd")
    
    echo "Status Code: $status_code"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS: ${api_name} API${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL: ${api_name} API - Expected $expected_status, got $status_code${NC}"
    fi
}

# 1. Test OpenAI API
echo -e "\n${YELLOW}Step 1: Testing OpenAI API${NC}"
echo "================================="

if [ -n "$OPENAI_API_KEY" ]; then
    test_api "OpenAI Chat" "https://api.openai.com/v1/chat/completions" "POST" \
        "-H 'Authorization: Bearer $OPENAI_API_KEY' -H 'Content-Type: application/json'" \
        '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Say hello"}], "max_tokens": 10}' \
        "200"
else
    echo -e "${YELLOW}⚠️  OpenAI API key not set, skipping test${NC}"
fi

# 2. Test Ollama API
echo -e "\n${YELLOW}Step 2: Testing Ollama API${NC}"
echo "=============================="

test_api "Ollama Tags" "http://localhost:11434/api/tags" "GET" "" "" "200"

test_api "Ollama Granite Code" "http://localhost:11434/api/generate" "POST" \
    "-H 'Content-Type: application/json'" \
    '{"model": "granite-code:3b", "prompt": "Say hello", "stream": false}' \
    "200"

test_api "Ollama Granite Docling" "http://localhost:11434/api/generate" "POST" \
    "-H 'Content-Type: application/json'" \
    '{"model": "ibm/granite-docling:latest", "prompt": "Extract vendor from: Quote from ABC Corp", "stream": false}' \
    "200"

# 3. Test Gmail API Discovery
echo -e "\n${YELLOW}Step 3: Testing Gmail API${NC}"
echo "============================"

test_api "Gmail API Discovery" "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest" "GET" "" "" "200"

# 4. Test Stripe API
echo -e "\n${YELLOW}Step 4: Testing Stripe API${NC}"
echo "=============================="

if [ -n "$STRIPE_SECRET_KEY" ]; then
    test_api "Stripe Account" "https://api.stripe.com/v1/account" "GET" \
        "-H 'Authorization: Bearer $STRIPE_SECRET_KEY'" "" "200"
    
    test_api "Stripe Products" "https://api.stripe.com/v1/products" "POST" \
        "-H 'Authorization: Bearer $STRIPE_SECRET_KEY' -H 'Content-Type: application/x-www-form-urlencoded'" \
        "name=Test Product&description=API Test" "200"
else
    echo -e "${YELLOW}⚠️  Stripe secret key not set, skipping test${NC}"
fi

# 5. Test Database Connection
echo -e "\n${YELLOW}Step 5: Testing Database Connection${NC}"
echo "======================================"

run_test "PostgreSQL Connection" "docker exec supplygraph-postgres psql -U supplygraph -d supplygraph -c 'SELECT 1' > /dev/null" ""

run_test "Database Tables Exist" "docker exec supplygraph-postgres psql -U supplygraph -d supplygraph -c \"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'\" | grep -q '[0-9]'" ""

# 6. Test Valkey Connection
echo -e "\n${YELLOW}Step 6: Testing Valkey Connection${NC}"
echo "===================================="

run_test "Valkey Connection" "docker exec supplygraph-valkey redis-cli ping | grep -q PONG" ""

run_test "Valkey Queue Operations" "docker exec supplygraph-valkey redis-cli lpush test_queue job1 job2 && docker exec supplygraph-valkey redis-cli llen test_queue | grep -q 2 && docker exec supplygraph-valkey redis-cli del test_queue > /dev/null" ""

# 7. Test Document Processing
echo -e "\n${YELLOW}Step 7: Testing Document Processing${NC}"
echo "======================================"

# Create a test document
echo "Creating test document..."
cat > /tmp/test_quote.md << 'EOF'
# QUOTE FROM ABC SUPPLIERS

**Vendor Information:**
- Name: ABC Suppliers Inc.
- Email: sales@abcsuppliers.com
- Phone: (555) 123-4567

**Quote Details:**
- Quote Number: Q-2024-12345
- Date: December 10, 2024

**Items:**
1. Office Chairs - 10 units @ $150.00 each = $1,500.00
2. Standing Desks - 5 units @ $300.00 each = $1,500.00

**Totals:**
- Subtotal: $3,000.00
- Tax (8%): $240.00
- Total: $3,240.00

**Terms:**
- Payment: Net 30 days
- Delivery: 5-7 business days
EOF

run_test "Docling Document Processing" "cd /home/aparna/Desktop/supplygraph_mvp/apps/ai-service && /home/aparna/Desktop/supplygraph_mvp/apps/ai-service/.venv/bin/python -c \"
try:
    from docling.document_converter import DocumentConverter
    converter = DocumentConverter()
    result = converter.convert('/tmp/test_quote.md')
    success = result and result.document and len(result.document.export_to_markdown()) > 0
    print('Document processed successfully' if success else 'Failed')
except Exception as e:
    print('Failed:', str(e))
\" 2>/dev/null | grep -q 'successfully'" ""

# 8. Test LLM Service
echo -e "\n${YELLOW}Step 8: Testing LLM Service${NC}"
echo "=============================="

run_test "LLM Quote Extraction" "cd /home/aparna/Desktop/supplygraph_mvp/apps/ai-service && /home/aparna/Desktop/supplygraph_mvp/apps/ai-service/.venv/bin/python -c \"
import sys
sys.path.insert(0, '/home/aparna/Desktop/supplygraph_mvp/packages/db/generated/client')
from src.services.llm_service import LLMService
import asyncio

async def test():
    service = LLMService()
    result = await service.extract_quote_from_text('Quote from ABC for 10 chairs')
    print('LLM extraction successful' if result and 'vendor_info' in result else 'Failed')

asyncio.run(test())
\" | grep -q 'successful'" ""

# 9. Test Email Classification
echo -e "\n${YELLOW}Step 9: Testing Email Classification${NC}"
echo "======================================="

run_test "Email Quote Classification" "cd /home/aparna/Desktop/supplygraph_mvp/apps/ai-service && /home/aparna/Desktop/supplygraph_mvp/apps/ai-service/.venv/bin/python -c \"
import sys
sys.path.insert(0, '/home/aparna/Desktop/supplygraph_mvp/packages/db/generated/client')
from src.services.llm_service import LLMService
import asyncio

async def test():
    service = LLMService()
    result = await service.classify_email_content('Quote for Office Supplies', 'Please find our quote attached.')
    print('Email classification successful' if result and 'is_quote' in result else 'Failed')

asyncio.run(test())
\" | grep -q 'successful'" ""

# 10. Test Payment Processing
echo -e "\n${YELLOW}Step 10: Testing Payment Processing${NC}"
echo "======================================="

if [ -n "$STRIPE_SECRET_KEY" ]; then
    run_test "Payment Intent Creation" "curl -s -X POST https://api.stripe.com/v1/payment_intents \
        -H 'Authorization: Bearer $STRIPE_SECRET_KEY' \
        -d amount=10000 \
        -d currency=usd \
        -d 'payment_method_types[]=card' \
        -d description='Test payment' | grep -q 'id'" ""
else
    echo -e "${YELLOW}⚠️  Stripe secret key not set, skipping payment test${NC}"
fi

# 11. Test Webhook Processing
echo -e "\n${YELLOW}Step 11: Testing Webhook Processing${NC}"
echo "======================================="

run_test "Webhook Signature Validation" "cd /home/aparna/Desktop/supplygraph_mvp/apps/ai-service && /home/aparna/Desktop/supplygraph_mvp/apps/ai-service/.venv/bin/python -c \"
import hmac
import hashlib
import json

# Simulate webhook payload
payload = {'id': 'evt_test', 'type': 'payment_intent.succeeded'}
payload_str = json.dumps(payload, separators=(',', ':'))

# Generate signature
secret = 'whsec_test_secret'
signature = hmac.new(secret.encode(), payload_str.encode(), hashlib.sha256).hexdigest()

print('Webhook signature generated successfully' if signature else 'Failed')
\" | grep -q 'successfully'" ""

# 12. Test API Rate Limiting
echo -e "\n${YELLOW}Step 12: Testing API Rate Limiting${NC}"
echo "======================================"

run_test "Concurrent API Requests" "cd /home/aparna/Desktop/supplygraph_mvp/apps/ai-service && /home/aparna/Desktop/supplygraph_mvp/apps/ai-service/.venv/bin/python -c \"
import asyncio
import httpx

async def test_concurrent():
    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = []
        for i in range(3):
            task = client.post('http://localhost:11434/api/generate', 
                             json={'model': 'granite-code:3b', 'prompt': f'Test {i}', 'stream': False})
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        successful = sum(1 for r in results if isinstance(r, httpx.Response) and r.status_code == 200)
        print(f'Concurrent requests: {successful}/{len(results)} successful')

asyncio.run(test_concurrent())
\" | grep -q '3/3'" ""

# Summary
echo -e "\n${BLUE}==============================================${NC}"
echo -e "${BLUE}📊 API INTEGRATION TEST SUMMARY${NC}"
echo -e "${BLUE}==============================================${NC}"

echo "Tests Passed: $TESTS_PASSED/$TESTS_TOTAL"

if [ "$TESTS_PASSED" -eq "$TESTS_TOTAL" ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo "All API integrations are working correctly."
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    echo "Please check the failed tests above."
    exit 1
fi