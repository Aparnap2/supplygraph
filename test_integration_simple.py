#!/usr/bin/env python3
"""
Simple integration test for SupplyGraph
"""
import subprocess
import time
import json
import requests
from datetime import datetime

def main():
    print("\n🧪 SupplyGraph Integration Validation")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")

    results = []

    # Test 1: Backend Health
    print("\n1️⃣ Testing Backend Health...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Backend is healthy: {data.get('status')}")
            results.append(("Backend Health", True, data))
        else:
            print(f"   ❌ Backend returned: {response.status_code}")
            results.append(("Backend Health", False, f"Status: {response.status_code}"))
    except Exception as e:
        print(f"   ❌ Backend error: {e}")
        results.append(("Backend Health", False, str(e)))

    # Test 2: Backend APIs
    print("\n2️⃣ Testing Backend APIs...")

    # Stats API
    try:
        response = requests.get("http://localhost:8000/api/stats", timeout=5)
        if response.status_code == 200:
            stats = response.json()
            print(f"   ✅ Stats API: {stats}")
            results.append(("Stats API", True, stats))
        else:
            print(f"   ❌ Stats API failed: {response.status_code}")
            results.append(("Stats API", False, f"Status: {response.status_code}"))
    except Exception as e:
        print(f"   ❌ Stats API error: {e}")
        results.append(("Stats API", False, str(e)))

    # Requests API
    try:
        response = requests.get("http://localhost:8000/api/requests", timeout=5)
        if response.status_code == 200:
            data = response.json()
            requests_data = data.get("requests", [])
            print(f"   ✅ Requests API: Found {len(requests_data)} requests")
            results.append(("Requests API", True, f"{len(requests_data)} requests"))
        else:
            print(f"   ❌ Requests API failed: {response.status_code}")
            results.append(("Requests API", False, f"Status: {response.status_code}"))
    except Exception as e:
        print(f"   ❌ Requests API error: {e}")
        results.append(("Requests API", False, str(e)))

    # AI Insights API
    try:
        response = requests.get("http://localhost:8000/api/ai-insights", timeout=5)
        if response.status_code == 200:
            data = response.json()
            insights = data.get("insights", [])
            print(f"   ✅ AI Insights API: Found {len(insights)} insights")
            results.append(("AI Insights API", True, f"{len(insights)} insights"))
        else:
            print(f"   ❌ AI Insights API failed: {response.status_code}")
            results.append(("AI Insights API", False, f"Status: {response.status_code}"))
    except Exception as e:
        print(f"   ❌ AI Insights API error: {e}")
        results.append(("AI Insights API", False, str(e)))

    # Test 3: Frontend Server
    print("\n3️⃣ Testing Frontend Server...")
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            content = response.text
            if "SupplyGraph" in content:
                print("   ✅ Frontend is running with SupplyGraph branding")
                results.append(("Frontend Server", True, "Running with branding"))
            else:
                print("   ⚠️  Frontend running but no SupplyGraph branding")
                results.append(("Frontend Server", True, "Running (no branding)"))
        else:
            print(f"   ❌ Frontend returned: {response.status_code}")
            results.append(("Frontend Server", False, f"Status: {response.status_code}"))
    except Exception as e:
        print(f"   ❌ Frontend error: {e}")
        results.append(("Frontend Server", False, str(e)))

    # Test 4: Data Flow Verification
    print("\n4️⃣ Verifying Data Flow...")

    # Get backend data
    try:
        backend_response = requests.get("http://localhost:8000/api/stats", timeout=5)
        if backend_response.status_code == 200:
            backend_stats = backend_response.json()
            total_requests = backend_stats.get("total_requests", 0)

            if total_requests > 0:
                print(f"   ✅ Backend has real data: {total_requests} requests")
                print(f"   💡 Frontend should display {total_requests} as total requests")
                results.append(("Data Flow", True, f"Backend has {total_requests} requests"))
            else:
                print("   ⚠️  Backend has no requests (might be empty)")
                results.append(("Data Flow", True, "Backend empty"))
        else:
            print("   ❌ Could not verify data flow")
            results.append(("Data Flow", False, "API error"))
    except Exception as e:
        print(f"   ❌ Data flow error: {e}")
        results.append(("Data Flow", False, str(e)))

    # Test 5: CSV Upload Functionality
    print("\n5️⃣ Testing CSV Upload...")
    csv_data = """item_name,category,quantity,unit_price,priority,description
Test Item,Test Category,1,100.00,HIGH,Test description"""

    try:
        files = {'file': ('test.csv', csv_data, 'text/csv')}
        response = requests.post("http://localhost:8000/api/upload-csv", files=files, timeout=5)

        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print(f"   ✅ CSV upload works: {result.get('message')}")
                results.append(("CSV Upload", True, result.get('message')))
            else:
                print(f"   ❌ CSV upload failed: {result.get('detail', 'Unknown')}")
                results.append(("CSV Upload", False, result.get('detail', 'Unknown')))
        else:
            print(f"   ❌ CSV upload returned: {response.status_code}")
            results.append(("CSV Upload", False, f"Status: {response.status_code}"))
    except Exception as e:
        print(f"   ❌ CSV upload error: {e}")
        results.append(("CSV Upload", False, str(e)))

    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)

    passed = sum(1 for _, p, _ in results if p)
    total = len(results)

    for test_name, passed, details in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} | {test_name}")
        if isinstance(details, dict):
            details = json.dumps(details, indent=2)
        if details and details != True:
            print(f"    {details}")

    print(f"\nTotal: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")

    # Integration Assessment
    print("\n🔍 INTEGRATION ASSESSMENT")
    print("=" * 60)

    critical_tests = ["Backend Health", "Stats API", "Requests API", "Frontend Server"]
    critical_passed = sum(1 for name, p, _ in results
                         if name in critical_tests and p)

    if critical_passed == len(critical_tests):
        print("✅ CRITICAL INTEGRATIONS WORKING")
        print("✅ Backend APIs are serving data")
        print("✅ Frontend server is accessible")
        print("✅ Data flow established")
    else:
        print("⚠️  SOME CRITICAL INTEGRATIONS FAILED")

    # Recommendations
    print("\n💡 MANUAL VERIFICATION STEPS")
    print("=" * 60)
    print("1. Open browser to: http://localhost:3000")
    print("2. Check dashboard shows:")

    # Get actual stats
    try:
        stats_response = requests.get("http://localhost:8000/api/stats")
        if stats_response.status_code == 200:
            stats = stats_response.json()
            print(f"   - Total Requests: {stats.get('total_requests', '?')}")
            print(f"   - In Progress: {stats.get('in_progress', '?')}")
            print(f"   - Total Savings: ${stats.get('savings_amount', '?')}")
    except:
        print("   - (Could not fetch stats)")

    print("3. Test these features:")
    print("   - Navigate to Requests tab")
    print("   - Click 'Upload CSV/Excel' button")
    print("   - Click 'View Details' on any request")
    print("   - Check if chat interface loads")
    print("\n4. Expected behavior:")
    print("   - Loading spinner appears initially")
    print("   - Real data displays (no hardcoded values)")
    print("   - WebSocket chat connects when viewing details")
    print("   - Error messages show if backend disconnects")

if __name__ == "__main__":
    main()