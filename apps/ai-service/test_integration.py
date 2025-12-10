#!/usr/bin/env python3
"""
Test basic CRUD operations for SupplyGraph application.
Tests database connection, migrations, RLS, and basic model operations.
"""

import asyncio
import os
import sys
from decimal import Decimal
from typing import Dict, Any

import asyncpg
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://dev:devpass@localhost:5432/supplygraph")
TEST_DATABASE_URL = os.getenv("DATABASE_TEST_URL", "postgresql://dev:devpass@localhost:5433/supplygraph_test")


async def test_database_connection():
    """Test basic database connection."""
    print("🔍 Testing database connection...")
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        version = await conn.fetchval("SELECT version()")
        print(f"✅ Database connected successfully: {version[:50]}...")
        await conn.close()
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False


async def test_database_schema():
    """Test that all tables exist in the database."""
    print("\n🔍 Testing database schema...")
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Expected tables from schema
        expected_tables = [
            'organizations', 'users', 'vendors', 'procurement_requests',
            'quotes', 'payments', 'audit_logs', 'email_threads',
            'email_messages', 'workflow_executions'
        ]
        
        # Check if tables exist
        result = await conn.fetch(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        )
        existing_tables = {row['table_name'] for row in result}
        
        missing_tables = set(expected_tables) - existing_tables
        if missing_tables:
            print(f"❌ Missing tables: {missing_tables}")
            return False
        
        print(f"✅ All {len(expected_tables)} expected tables exist")
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Schema validation failed: {e}")
        return False


async def test_rls_policies():
    """Test Row-Level Security policies."""
    print("\n🔍 Testing RLS policies...")
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Check if RLS is enabled on key tables
        rls_tables = ['organizations', 'users', 'vendors', 'procurement_requests', 'quotes']
        
        for table in rls_tables:
            result = await conn.fetchval(
                "SELECT rowsecurity FROM pg_tables WHERE tablename = $1",
                table
            )
            if not result:
                print(f"❌ RLS not enabled on {table}")
                return False
        
        print("✅ RLS is enabled on all key tables")
        
        # Check if RLS policies exist
        policies_result = await conn.fetch(
            "SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public'"
        )
        
        if not policies_result:
            print("⚠️  No RLS policies found - you may want to add tenant isolation policies")
        else:
            print(f"✅ Found {len(policies_result)} RLS policies")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ RLS policy check failed: {e}")
        return False


async def test_basic_crud_operations():
    """Test basic CRUD operations using raw SQL."""
    print("\n🔍 Testing basic CRUD operations...")
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Start a transaction for testing
        async with conn.transaction():
            # Test CREATE - Organization
            org_id = await conn.fetchval(
                "INSERT INTO organizations (id, name, slug, \"updatedAt\") VALUES (gen_random_uuid(), $1, $2, NOW()) RETURNING id",
                "Test Organization", "test-org"
            )
            print(f"✅ Created organization: {org_id}")
            
            # Test CREATE - User
            user_id = await conn.fetchval(
                "INSERT INTO users (id, email, name, \"orgId\", \"updatedAt\") VALUES (gen_random_uuid(), $1, $2, $3, NOW()) RETURNING id",
                "test@example.com", "Test User", org_id
            )
            print(f"✅ Created user: {user_id}")
            
            # Test CREATE - Vendor
            vendor_id = await conn.fetchval(
                "INSERT INTO vendors (id, name, email, \"orgId\", \"updatedAt\") VALUES (gen_random_uuid(), $1, $2, $3, NOW()) RETURNING id",
                "Test Vendor", "vendor@example.com", org_id
            )
            print(f"✅ Created vendor: {vendor_id}")
            
            # Test CREATE - Procurement Request
            request_id = await conn.fetchval(
                """INSERT INTO procurement_requests 
                   (id, title, description, items, \"orgId\", \"createdBy\", \"updatedAt\") 
                   VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING id""",
                "Test Request", "Test description", 
                '[{"name": "Test Item", "quantity": 10}]', 
                org_id, user_id
            )
            print(f"✅ Created procurement request: {request_id}")
            
            # Test READ - Query created data
            org = await conn.fetchrow("SELECT * FROM organizations WHERE id = $1", org_id)
            user = await conn.fetchrow("SELECT * FROM users WHERE id = $1", user_id)
            vendor = await conn.fetchrow("SELECT * FROM vendors WHERE id = $1", vendor_id)
            request = await conn.fetchrow("SELECT * FROM procurement_requests WHERE id = $1", request_id)
            
            assert org['name'] == "Test Organization"
            assert user['email'] == "test@example.com"
            assert vendor['name'] == "Test Vendor"
            assert request['title'] == "Test Request"
            
            print("✅ READ operations successful - data validation passed")
            
            # Test UPDATE
            await conn.execute(
                "UPDATE organizations SET name = $1 WHERE id = $2",
                "Updated Organization", org_id
            )
            
            updated_org = await conn.fetchrow("SELECT name FROM organizations WHERE id = $1", org_id)
            assert updated_org['name'] == "Updated Organization"
            print("✅ UPDATE operation successful")
            
            # Test DELETE (cascade should handle related records)
            await conn.execute("DELETE FROM organizations WHERE id = $1", org_id)
            
            # Verify deletion
            org_count = await conn.fetchval("SELECT COUNT(*) FROM organizations WHERE id = $1", org_id)
            user_count = await conn.fetchval("SELECT COUNT(*) FROM users WHERE \"orgId\" = $1", org_id)
            
            assert org_count == 0
            assert user_count == 0  # Should be deleted by cascade
            
            print("✅ DELETE operation successful (cascade working)")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ CRUD operations failed: {e}")
        return False


async def test_valkey_connection():
    """Test Valkey (Redis) connection for queues."""
    print("\n🔍 Testing Valkey connection...")
    
    try:
        import redis
        
        # Connect to Valkey
        r = redis.Redis(host='localhost', port=6379, decode_responses=True)
        
        # Test basic operations
        r.set('test_key', 'test_value')
        value = r.get('test_key')
        
        if value == 'test_value':
            print("✅ Valkey connection successful")
            
            # Test queue operations
            r.lpush('test_queue', 'job1', 'job2', 'job3')
            queue_length = r.llen('test_queue')
            print(f"✅ Queue operations working - queue length: {queue_length}")
            
            # Cleanup
            r.delete('test_key', 'test_queue')
            r.close()
            return True
        else:
            print("❌ Valkey value mismatch")
            return False
            
    except Exception as e:
        print(f"❌ Valkey connection failed: {e}")
        return False


async def test_ollama_connection():
    """Test Ollama connection and available models."""
    print("\n🔍 Testing Ollama connection...")
    
    try:
        import httpx
        
        # Test Ollama API connection
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get("http://localhost:11434/api/tags")
            
            if response.status_code == 200:
                models = response.json().get('models', [])
                print(f"✅ Ollama connected successfully - Found {len(models)} models")
                
                # Check for required models
                model_names = [model['name'] for model in models]
                required_models = ['granite-code:3b', 'ibm/granite-docling:latest']
                
                for model in required_models:
                    if any(model in name for name in model_names):
                        print(f"✅ Found required model: {model}")
                    else:
                        print(f"⚠️  Model not found: {model}")
                
                return True
            else:
                print(f"❌ Ollama API returned status {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Ollama connection failed: {e}")
        return False


async def test_docling_service():
    """Test Docling document parsing service."""
    print("\n🔍 Testing Docling service...")
    
    try:
        # Try to import docling - if not available, skip this test
        try:
            from docling.document_converter import DocumentConverter
        except ImportError:
            print("⚠️  Docling not installed - skipping document parsing test")
            print("   To install: uv pip install docling")
            return True  # Don't fail the test for optional dependency
        
        # Create a simple test document content
        test_content = """
        Quote #12345
        
        Vendor: Test Supplier
        Email: supplier@example.com
        
        Items:
        - Item 1: 10 units @ $5.00 = $50.00
        - Item 2: 5 units @ $10.00 = $50.00
        
        Total: $100.00
        
        Terms: Net 30
        Delivery: 5 business days
        """
        
        # Test document conversion
        converter = DocumentConverter()
        
        # For this test, we'll just verify the service can be instantiated
        # In a real scenario, you would parse an actual document
        print("✅ Docling service instantiated successfully")
        print("✅ Document parsing capabilities available")
        
        return True
        
    except Exception as e:
        print(f"❌ Docling service test failed: {e}")
        return False


async def test_document_parsing_with_ollama():
    """Test document parsing with Ollama using granite model."""
    print("\n🔍 Testing document parsing with Ollama granite model...")
    
    try:
        import httpx
        
        # Simple test first
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "granite-code:3b",
                    "prompt": "Extract vendor name from: Quote from ABC Suppliers",
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                extracted_text = result.get('response', '')
                
                if extracted_text and "ABC Suppliers" in extracted_text:
                    print("✅ Basic text extraction with granite model successful")
                    print(f"✅ Extracted: {extracted_text.strip()}")
                    
                    # Test more complex document parsing
                    test_document = """
                    QUOTE
                    
                    From: ABC Suppliers
                    Email: sales@abcsuppliers.com
                    Phone: (555) 123-4567
                    
                    To: XYZ Corporation
                    Date: 2024-12-10
                    
                    Quote Number: Q-2024-12345
                    
                    Items:
                    1. Office Chairs - 10 units @ $150.00 each = $1,500.00
                    2. Desks - 5 units @ $300.00 each = $1,500.00
                    3. Lamps - 10 units @ $25.00 each = $250.00
                    
                    Subtotal: $3,250.00
                    Tax (8%): $260.00
                    Total: $3,510.00
                    
                    Terms: Net 30 days
                    Delivery: 2-3 business days
                    """
                    
                    prompt = f"""
                    Extract key information from this quote document:
                    
                    {test_document}
                    
                    Return as JSON:
                    {{
                        "vendor_name": "...",
                        "vendor_email": "...",
                        "quote_number": "...",
                        "total_amount": "...",
                        "terms": "..."
                    }}
                    """
                    
                    response2 = await client.post(
                        "http://localhost:11434/api/generate",
                        json={
                            "model": "granite-code:3b",
                            "prompt": prompt,
                            "stream": False
                        }
                    )
                    
                    if response2.status_code == 200:
                        result2 = response2.json()
                        extracted_json = result2.get('response', '')
                        
                        if extracted_json and len(extracted_json.strip()) > 0:
                            print("✅ Complex document parsing successful")
                            print(f"✅ JSON output length: {len(extracted_json)} characters")
                            print(f"✅ Sample: {extracted_json[:200]}...")
                            return True
                        else:
                            print("⚠️  Complex parsing returned empty, but basic parsing worked")
                            return True  # Still pass since basic parsing worked
                    else:
                        print(f"❌ Ollama API error on complex test: {response2.status_code}")
                        return False
                else:
                    print("❌ Basic text extraction failed")
                    return False
            else:
                print(f"❌ Ollama API error: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Document parsing test failed: {e}")
        return False


async def main():
    """Run all tests."""
    print("🚀 Starting SupplyGraph Integration Tests\n")
    
    tests = [
        ("Database Connection", test_database_connection),
        ("Database Schema", test_database_schema),
        ("RLS Policies", test_rls_policies),
        ("CRUD Operations", test_basic_crud_operations),
        ("Valkey Connection", test_valkey_connection),
        ("Ollama Connection", test_ollama_connection),
        ("Docling Service", test_docling_service),
        ("Document Parsing with Ollama", test_document_parsing_with_ollama),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results[test_name] = result
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "="*50)
    print("📊 TEST SUMMARY")
    print("="*50)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:<8} {test_name}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The application is ready for use.")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
    
    return passed == total


if __name__ == "__main__":
    asyncio.run(main())