#!/usr/bin/env python3
"""Test script to verify how dotenv handles quoted values"""

import os
from dotenv import load_dotenv

# Load the environment variables from ai-service
load_dotenv("/home/aparna/Desktop/supplygraph_mvp/apps/ai-service/.env")

def test_db_url_loading():
    db_url = os.getenv("DATABASE_URL")
    print(f"Loaded DATABASE_URL: '{db_url}'")
    print(f"Type: {type(db_url)}")
    print(f"Length: {len(db_url)}")
    
    # Check if it has quotes
    if db_url.startswith('"') and db_url.endswith('"'):
        print("WARNING: DATABASE_URL still has quotes!")
        db_url_clean = db_url.strip('"\'')
        print(f"After cleaning quotes: '{db_url_clean}'")
    else:
        print("No quotes detected")
        db_url_clean = db_url
    
    # Now test the regex
    import re
    match = re.match(r"postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)", db_url_clean)
    
    if match:
        user, password, host, port, database = match.groups()
        print("✓ Regex matched successfully!")
        print(f"  User: {user}")
        print(f"  Password: {password}")
        print(f"  Host: {host}")
        print(f"  Port: {port}")
        print(f"  Database: {database}")
    else:
        print("✗ Regex failed to match!")

if __name__ == "__main__":
    test_db_url_loading()