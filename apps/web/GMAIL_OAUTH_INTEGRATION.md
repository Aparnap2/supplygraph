# Gmail OAuth Integration for SupplyGraph

This document explains how to set up and use Gmail OAuth integration to replace SMTP functionality in SupplyGraph using Better Auth.

## Overview

The Gmail OAuth integration allows organizations to connect their own Gmail accounts for sending procurement emails, vendor negotiations, and other communications. Each organization can connect their own Gmail account, ensuring proper multi-tenant isolation.

## Architecture

```
┌─────────────────┐    OAuth 2.0    ┌─────────────────┐    Gmail API    ┌─────────────────┐
│   SupplyGraph   │ ◄──────────────► │  Google Auth    │ ◄──────────────► │    Gmail API    │
│   Web App       │                 │   Server        │                 │                 │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
       │                                    │                                  │
       │ Better Auth Session Management      │ Token Storage                   │
       │                                    │                                  │
       ▼                                    ▼                                  ▼
┌─────────────────┐                 ┌─────────────────┐                 ┌─────────────────┐
│ PostgreSQL      │                 │ Gmail Tokens    │                 │   Email         │
│ - Users         │                 │ Per Organization │                 │   Sending       │
│ - Sessions      │                 │ - Access Token  │                 │                 │
│ - Accounts      │                 │ - Refresh Token │                 │                 │
│ - Org Members   │                 │ - Expiry Dates  │                 │                 │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
```

## Key Features

- **Multi-tenant Support**: Each organization connects their own Gmail account
- **OAuth 2.0 Integration**: Secure authentication using Google OAuth
- **Automatic Token Refresh**: Handles token expiration automatically
- **Better Auth Integration**: Uses Better Auth for user authentication
- **API Endpoints**: RESTful API for email sending and configuration

## Required Scopes

The Google OAuth integration requires the following scopes:

- `openid` - Basic user profile information
- `profile` - User's profile information
- `email` - User's email address
- `https://www.googleapis.com/auth/gmail.send` - Permission to send emails

## Setup Instructions

### 1. Google Cloud Console Setup

1. **Create/Select Project**: Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable Gmail API**: Navigate to "APIs & Services" → "Library" → Search "Gmail API" → Enable
3. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Web application"
   - Add Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/google/callback`
     - Production: `https://your-domain.com/api/auth/google/callback`
   - Copy Client ID and Client Secret

4. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" → "OAuth consent screen"
   - Add the required scopes:
     - `openid`
     - `profile`
     - `email`
     - `https://www.googleapis.com/auth/gmail.send`

### 2. Environment Configuration

Update your `.env.local` file:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-actual-google-client-id"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"

# Server configuration
SERVER_URL="http://localhost:3000"  # or your production URL
```

### 3. Database Setup

Run the setup script to create required database tables:

```bash
cd apps/web
chmod +x scripts/setup-gmail-oauth.sh
./scripts/setup-gmail-oauth.sh
```

Or manually run the migrations:

```bash
psql $DATABASE_URL -f prisma/migrations/better_auth_tables.sql
psql $DATABASE_URL -f prisma/migrations/add_gmail_credentials.sql
```

## API Endpoints

### Email API

#### Send Email
```
POST /api/email
Content-Type: application/json

{
  "orgId": "organization-id",
  "to": "vendor@example.com",
  "subject": "Procurement Request",
  "html": "<p>Your email content here</p>",
  "text": "Your plain text content here"
}
```

#### Check Gmail Configuration
```
GET /api/email?orgId=organization-id

Response:
{
  "configured": true,
  "email": "connected-gmail@example.com",
  "name": "John Doe",
  "message": "Gmail is configured and ready"
}
```

### Authentication API

#### Google OAuth Flow
```
GET /api/auth/google

# This redirects to Google OAuth and then back to:
GET /api/auth/google/callback?code=...&state=...&orgId=...
```

## Usage Examples

### Sending a Procurement Email

```typescript
import { gmailService, EmailMessage } from '@/lib/gmail-service'

const message: EmailMessage = {
  to: 'vendor@example.com',
  subject: 'RFQ: Office Supplies',
  html: `
    <h2>Request for Quotation</h2>
    <p>Dear Vendor,</p>
    <p>We would like to request quotes for the following items:</p>
    <ul>
      <li>Office Chairs (10 units)</li>
      <li>Standing Desks (5 units)</li>
      <li>Monitors (15 units)</li>
    </ul>
    <p>Please provide your best pricing and delivery timeline.</p>
    <p>Thank you!</p>
  `
}

try {
  const result = await gmailService.sendEmail('org-123', message)
  console.log('Email sent:', result.messageId)
} catch (error) {
  console.error('Failed to send email:', error)
}
```

### Checking Email Configuration

```typescript
// Check if Gmail is configured for an organization
const response = await fetch('/api/email?orgId=org-123')
const config = await response.json()

if (config.configured) {
  console.log(`Gmail configured for ${config.email}`)
} else {
  console.log('Gmail not configured - requires authentication')
}
```

## Error Handling

The API provides specific error codes for different scenarios:

- `GMAIL_NOT_CONFIGURED` - No Gmail credentials stored for organization
- `TOKEN_REFRESH_FAILED` - Token refresh failed, requires re-authentication
- `VALIDATION_ERROR` - Invalid request data
- `EMAIL_SEND_FAILED` - Gmail API error when sending email

## Security Considerations

### Token Security

- **Development**: Tokens stored as-is in database
- **Production**: Tokens should be encrypted before storage
- **Refresh Tokens**: Stored securely for automatic token refresh

### Multi-tenant Isolation

- Each organization has separate Gmail credentials
- OAuth state includes organization ID
- Tokens are stored with organization association
- API calls require valid organization ID

### OAuth Security

- Use secure redirect URIs in production
- Validate OAuth state parameter
- Implement PKCE for additional security
- Rotate client secrets periodically

## Database Schema

### Gmail Credentials Table

```sql
CREATE TABLE gmail_credentials (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_gmail_credentials_organization
    FOREIGN KEY (organization_id)
    REFERENCES "organization"(id)
    ON DELETE CASCADE
);
```

### Better Auth Tables

- `user` - User accounts
- `account` - Social provider accounts (Google)
- `session` - User sessions
- `verification` - Verification tokens

## Troubleshooting

### Common Issues

1. **OAuth Callback Error**: Check redirect URI in Google Cloud Console
2. **Token Refresh Failed**: User needs to re-authenticate
3. **Gmail API Quota Exceeded**: Monitor API usage and quotas
4. **Organization Not Found**: Verify organization exists and user has access

### Debug Commands

```bash
# Check Gmail credentials for an organization
psql $DATABASE_URL -c "SELECT * FROM gmail_credentials WHERE organization_id = 'your-org-id'"

# Check Better Auth tables
psql $DATABASE_URL -c "SELECT * FROM account WHERE provider_id = 'google'"

# Check user sessions
psql $DATABASE_URL -c "SELECT * FROM session WHERE expires_at > NOW()"
```

## Testing

### Unit Tests

Test individual components:

```typescript
import { gmailService } from '@/lib/gmail-service'

// Test email sending
const result = await gmailService.sendEmail('test-org', {
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email'
})
```

### Integration Tests

Test complete OAuth flow:

1. Start development server: `pnpm dev`
2. Navigate to OAuth endpoint: `http://localhost:3000/api/auth/google?orgId=test-org`
3. Complete Google OAuth flow
4. Verify tokens stored in database
5. Test email sending via API

### Production Testing

1. Deploy to staging environment
2. Test with real Gmail accounts
3. Verify email delivery
4. Monitor token refresh behavior
5. Load test email sending

## Monitoring and Logging

### Key Metrics

- OAuth success/failure rates
- Token refresh frequency
- Email send success rates
- API response times

### Logging

The implementation includes comprehensive logging:

```typescript
console.log(`Email sent successfully via Gmail API:`, {
  messageId: result.messageId,
  threadId: result.threadId,
  orgId: validatedData.orgId,
  to: emailMessage.to,
  subject: emailMessage.subject
})
```

### Error Monitoring

Monitor for common errors:
- OAuth token failures
- Gmail API quota exceeded
- Network connectivity issues
- Invalid email addresses

## Migration from SMTP

### Before Migration

```typescript
// Old SMTP implementation
await sendEmailViaSMTP({
  to: 'vendor@example.com',
  subject: 'Subject',
  body: 'Email body'
})
```

### After Migration

```typescript
// New Gmail API implementation
await gmailService.sendEmail('org-123', {
  to: 'vendor@example.com',
  subject: 'Subject',
  html: '<p>Email body</p>',
  text: 'Email body'
})
```

### Migration Steps

1. Set up Gmail OAuth integration
2. Update email sending code to use Gmail API
3. Remove SMTP configuration
4. Update environment variables
5. Test with existing procurement workflows
6. Deploy changes
7. Monitor for any issues

## Support

For issues related to:

- **Gmail OAuth Setup**: Check Google Cloud Console documentation
- **Better Auth**: Refer to Better Auth documentation
- **SupplyGraph Integration**: Create an issue in the project repository

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Better Auth Documentation](https://better-auth.com/docs)
- [Google Cloud Console](https://console.cloud.google.com/)