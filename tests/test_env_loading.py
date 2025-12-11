#!/usr/bin/env python3
"""Test script to verify exactly which env file is being loaded"""

import os
from dotenv import load_dotenv

def test_env_loading():
    # Clear any existing env var to test fresh loading
    if 'DATABASE_URL' in os.environ:
        del os.environ['DATABASE_URL']
    
    print("Before loading ai-service/.env:")
    print(f"DATABASE_URL in env: {'DATABASE_URL' in os.environ}")
    
    # Load the environment variables from ai-service
    load_dotenv("/home/aparna/Desktop/supplygraph_mvp/apps/ai-service/.env")
    
    print("\nAfter loading ai-service/.env:")
    db_url = os.getenv("DATABASE_URL")
    print(f"DATABASE_URL: '{db_url}'")
    
    # Let's also test loading the root .env
    if 'DATABASE_URL' in os.environ:
        del os.environ['DATABASE_URL']
    
    load_dotenv("/home/aparna/Desktop/supplygraph_mvp/.env")
    print(f"\nAfter loading root .env:")
    db_url_root = os.getenv("DATABASE_URL")
    print(f"DATABASE_URL: '{db_url_root}'")
    
    # Check current directory
    if 'DATABASE_URL' in os.environ:
        del os.environ['DATABASE_URL']
    
    load_dotenv()  # Current dir
    print(f"\nAfter loading current directory .env:")
    db_url_current = os.getenv("DATABASE_URL")
    print(f"DATABASE_URL: '{db_url_current}'")

if __name__ == "__main__":
    test_env_loading()