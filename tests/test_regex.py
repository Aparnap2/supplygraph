#!/usr/bin/env python3
"""Test script to verify the DATABASE_URL regex pattern works correctly"""

import re
import os
from dotenv import load_dotenv

# Load the environment variables
load_dotenv("/home/aparna/Desktop/supplygraph_mvp/.env")

def parse_database_url_test():
    db_url = os.getenv("DATABASE_URL")
    print(f"Testing DATABASE_URL: {db_url}")
    
    # Original regex from the test_mvp_api.py file
    match = re.match(r"postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)", db_url)
    
    if match:
        user, password, host, port, database = match.groups()
        print("✓ Regex matched successfully!")
        print(f"  User: {user}")
        print(f"  Password: {password}")
        print(f"  Host: {host}")
        print(f"  Port: {port}")
        print(f"  Database: {database}")
        
        # Test connecting with these values
        try:
            import psycopg2
            conn = psycopg2.connect(
                host=host,
                port=int(port),
                database=database,
                user=user,
                password=password,
            )
            print("✓ Successfully connected to database!")
            
            # Test if tables can be created
            cursor = conn.cursor()
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✓ Connected to PostgreSQL: {version[0]}")
            cursor.close()
            conn.close()
            
        except Exception as e:
            print(f"✗ Database connection failed: {e}")
            
    else:
        print("✗ Regex failed to match!")
        # Show the issue
        parsed_parts = db_url.split('@')
        print(f"  Parts split by '@': {parsed_parts}")

if __name__ == "__main__":
    parse_database_url_test()