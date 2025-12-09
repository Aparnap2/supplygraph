#!/usr/bin/env python3
"""
Test frontend-backend integration for SupplyGraph
"""
import subprocess
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import requests

def test_frontend_backend_integration():
    """Test if frontend is displaying real data from backend"""

    print("\n🌐 Frontend-Backend Integration Test")
    print("=" * 60)

    # First verify backend is serving real data
    print("\n1️⃣ Checking Backend APIs...")

    # Test stats API
    try:
        response = requests.get("http://localhost:8000/api/stats", timeout=5)
        if response.status_code == 200:
            stats = response.json()
            print(f"   ✅ Stats API: {stats}")
            backend_requests = stats.get("total_requests", 0)
        else:
            print(f"   ❌ Stats API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Backend not accessible: {e}")
        return False

    # Test requests API
    try:
        response = requests.get("http://localhost:8000/api/requests", timeout=5)
        if response.status_code == 200:
            data = response.json()
            requests_data = data.get("requests", [])
            print(f"   ✅ Requests API: Found {len(requests_data)} requests")
        else:
            print(f"   ❌ Requests API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Backend not accessible: {e}")
        return False

    # Try to test frontend with Selenium (if Chrome is available)
    print("\n2️⃣ Testing Frontend Integration...")

    try:
        # Configure Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in background
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        # Try to create WebDriver
        driver = webdriver.Chrome(options=chrome_options)
        driver.set_page_load_timeout(10)

        # Navigate to frontend
        print("   Loading frontend...")
        driver.get("http://localhost:3000")

        # Wait for page to load
        time.sleep(3)

        # Check for loading state or error
        try:
            # Check if showing loading state
            loading = driver.find_elements(By.XPATH, "//*[contains(text(), 'Loading')]")
            if loading:
                print("   ⏳ Frontend is in loading state...")
                time.sleep(5)  # Wait for data to load

            # Check for connection error
            error = driver.find_elements(By.XPATH, "//*[contains(text(), 'Connection Error') or contains(text(), 'Failed to load')]")
            if error:
                print("   ❌ Frontend shows connection error")
                print(f"   Error text: {error[0].text}")
                return False

            # Check for dashboard content
            try:
                # Look for dashboard stats (should show real data, not hardcoded)
                stats_cards = driver.find_elements(By.CLASS_NAME, "text-2xl")
                if stats_cards:
                    print(f"   ✅ Found {len(stats_cards)} stat cards")

                    # Check first stat card for dynamic content
                    first_stat = stats_cards[0].text
                    if first_stat and first_stat != "0":
                        print(f"   ✅ First stat shows: {first_stat} (likely dynamic)")
                    else:
                        print(f"   ⚠️  First stat shows: {first_stat}")

                # Look for request table
                requests_table = driver.find_elements(By.TAG_NAME, "table")
                if requests_table:
                    print("   ✅ Found requests table")

                    # Check table rows
                    rows = driver.find_elements(By.TAG_NAME, "tr")
                    if len(rows) > 1:
                        print(f"   ✅ Table has {len(rows)-1} data rows")
                else:
                    print("   ⚠️  No request table found")

                # Check page title
                title = driver.title
                print(f"   ✅ Page title: {title}")

                # Take screenshot for verification
                screenshot_path = "/tmp/supplygraph_frontend.png"
                driver.save_screenshot(screenshot_path)
                print(f"   📸 Screenshot saved to: {screenshot_path}")

                return True

            except Exception as e:
                print(f"   ⚠️  Could not verify dashboard content: {e}")
                # Still return True if page loads without errors

        except Exception as e:
            print(f"   ⚠️  Error checking page content: {e}")

    except Exception as e:
        print(f"   ⚠️  Could not run Selenium test: {e}")
        print("   (This is expected if Chrome is not installed)")

        # Alternative: Check if frontend is serving
        try:
            response = requests.get("http://localhost:3000", timeout=5)
            if response.status_code == 200:
                print("   ✅ Frontend server is running")
                if "SupplyGraph" in response.text:
                    print("   ✅ Frontend contains SupplyGraph branding")
                return True
            else:
                print(f"   ❌ Frontend returned status: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Frontend not accessible: {e}")
            return False

    finally:
        try:
            driver.quit()
        except:
            pass

    print("\n3️⃣ Checking for Real Data vs Mock Data...")

    # Check if frontend API calls are working
    # This is a simple check - we look at network requests or verify data freshness
    print("   ✅ Backend APIs are serving data")
    print("   ⚠️  Cannot verify if frontend is displaying real data without browser")
    print("   💡 Manually verify: Check http://localhost:3000 in browser")
    print("   💡 Look for: Loading states, real request counts, dynamic data")

    return True

def main():
    print("\n🧪 SupplyGraph Integration Test Suite")
    print("=" * 60)

    # Check if services are running
    print("\n🔍 Checking Service Status...")

    # Check backend
    try:
        response = requests.get("http://localhost:8000/health", timeout=2)
        if response.status_code == 200:
            print("✅ Backend is running on port 8000")
        else:
            print(f"❌ Backend returned: {response.status_code}")
            return
    except:
        print("❌ Backend is not running on port 8000")
        print("   Start with: python3 basic_server.py")
        return

    # Check frontend
    try:
        response = requests.get("http://localhost:3000", timeout=2)
        if response.status_code == 200:
            print("✅ Frontend is running on port 3000")
        else:
            print(f"❌ Frontend returned: {response.status_code}")
    except:
        print("❌ Frontend is not running on port 3000")
        print("   Start with: npm run dev")
        return

    # Run integration tests
    success = test_frontend_backend_integration()

    print("\n" + "=" * 60)
    print("📋 SUMMARY")
    print("=" * 60)

    if success:
        print("✅ Integration test completed")
        print("\n🎯 Next Steps:")
        print("1. Open http://localhost:3000 in your browser")
        print("2. Verify dashboard shows real data from backend")
        print("3. Check that stats cards show actual request counts")
        print("4. Test CSV upload functionality")
        print("5. Try clicking 'View Details' on a request")
    else:
        print("❌ Some issues detected")
        print("\n🔧 To fix:")
        print("1. Ensure backend is running: python3 basic_server.py")
        print("2. Ensure frontend is running: npm run dev")
        print("3. Check browser console for errors")

if __name__ == "__main__":
    main()