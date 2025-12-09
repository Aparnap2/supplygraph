#!/bin/bash

# Gmail OAuth Setup Script for SupplyGraph
# This script sets up the database tables and initializes Gmail OAuth integration

set -e

echo "🚀 Setting up Gmail OAuth integration for SupplyGraph..."

# Navigate to the web app directory
cd "$(dirname "$0")/.."

# Check if we have the required environment variables
echo "📋 Checking environment variables..."

if [ -f ".env.local" ]; then
    if grep -q "your-google-client-id-here" .env.local; then
        echo "⚠️  WARNING: Please update GOOGLE_CLIENT_ID in .env.local with your actual Google Client ID"
    fi

    if grep -q "your-google-client-secret-here" .env.local; then
        echo "⚠️  WARNING: Please update GOOGLE_CLIENT_SECRET in .env.local with your actual Google Client Secret"
    fi
else
    echo "❌ ERROR: .env.local file not found. Please create it with the required environment variables."
    exit 1
fi

# Install required dependencies if not already installed
echo "📦 Installing dependencies..."
pnpm install

# Run database migrations
echo "🗄️  Setting up database tables..."

# Run Better Auth tables migration
echo "   - Creating Better Auth tables..."
psql "$DATABASE_URL" -f prisma/migrations/better_auth_tables.sql || {
    echo "⚠️  Note: Better Auth tables may already exist or there was an issue. Continuing..."
}

# Run Gmail credentials migration
echo "   - Creating Gmail credentials table..."
psql "$DATABASE_URL" -f prisma/migrations/add_gmail_credentials.sql || {
    echo "⚠️  Note: Gmail credentials table may already exist or there was an issue. Continuing..."
}

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm db:generate

echo ""
echo "✅ Gmail OAuth integration setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to Google Cloud Console: https://console.cloud.google.com/"
echo "2. Create a new project or select existing one"
echo "3. Enable the Gmail API"
echo "4. Create OAuth 2.0 credentials:"
echo "   - Application type: Web application"
echo "   - Authorized redirect URIs: http://localhost:3000/api/auth/google/callback"
echo "5. Copy Client ID and Client Secret to your .env.local file"
echo "6. Update your Google OAuth consent screen with required scopes:"
echo "   - openid"
echo "   - profile"
echo "   - email"
echo "   - https://www.googleapis.com/auth/gmail.send"
echo ""
echo "🔗 Useful URLs:"
echo "   - Google Cloud Console: https://console.cloud.google.com/"
echo "   - Gmail API: https://console.cloud.google.com/apis/library/gmail.googleapis.com"
echo "   - OAuth Credentials: https://console.cloud.google.com/apis/credentials"
echo ""
echo "🚀 After setting up credentials, you can:"
echo "   - Test OAuth flow: http://localhost:3000/api/auth/google"
echo "   - Check email configuration: http://localhost:3000/api/email?orgId=your-org-id"
echo ""