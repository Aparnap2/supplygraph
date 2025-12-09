# Gmail OAuth Integration TODO List

## Phase 1: Setup and Dependencies
- [ ] Install Better Auth with Google OAuth provider
- [ ] Install required dependencies (Google APIs, email libraries)
- [ ] Set up environment variables for Gmail OAuth
- [ ] Configure Google Cloud Console project

## Phase 2: Better Auth Configuration
- [ ] Create auth configuration with Google OAuth provider
- [ ] Set up Prisma adapter for Better Auth
- [ ] Configure organization plugin with multi-tenant support
- [ ] Create auth routes and middleware

## Phase 3: Gmail API Integration
- [ ] Set up Google API client for Gmail
- [ ] Create email service for Gmail API
- [ ] Implement OAuth token storage and refresh
- [ ] Create email sending functions

## Phase 4: Multi-tenant Implementation
- [ ] Implement organization-level OAuth connections
- [ ] Create OAuth connection management UI
- [ ] Set up per-organization email configuration
- [ ] Handle token refresh for multiple organizations

## Phase 5: Email Service Integration
- [ ] Replace SMTP email calls with Gmail API
- [ ] Update procurement workflow email notifications
- [ ] Create vendor negotiation email templates
- [ ] Implement email sending queue/background jobs

## Phase 6: Testing and Validation
- [ ] Test OAuth flow for individual organizations
- [ ] Test email sending with Gmail API
- [ ] Test vendor negotiation emails
- [ ] Test token refresh and error handling
- [ ] Verify multi-tenant isolation

## Files to Create/Modify:
- `/apps/web/src/lib/auth.ts` - Better Auth configuration
- `/apps/web/src/lib/email.ts` - Gmail API email service
- `/apps/web/.env.local` - Environment variables
- `/apps/web/src/routes/api/auth/` - Auth routes
- `/apps/web/src/routes/api/email/` - Email API routes
- `/apps/web/src/components/auth/` - Auth components
- `package.json` - Add dependencies