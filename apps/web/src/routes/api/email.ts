/**
 * Email API Route
 * Handles email sending functionality using Google OAuth + Gmail API
 */

import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { EmailSchema, EmailResponseSchema } from '~/lib/gmail-service'
import { createGmailService } from '~/lib/gmail-service'
import { getServerSession } from '~/lib/auth.server'

// Server function for sending email
export const sendEmail = createServerFn({ method: 'POST' })
  .inputValidator(EmailSchema)
  .handler(async ({ data }) => {
    try {
      // Get user session from request context
      const request = new Request('https://api.internal/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In a real implementation, we'd get this from the request context
          // For now, we'll need to pass session data differently
        }
      })
      
      const session = await getServerSession(request)
      if (!session?.user) {
        return {
          success: false,
          error: 'Unauthorized - No valid session found',
          timestamp: new Date().toISOString()
        }
      }

      // Get Gmail service for authenticated user
      const gmailService = await createGmailService(session.user.id)

      // Send email using Gmail API
      const gmailResponse = await gmailService.sendEmail(data)

      // Return standardized response
      return {
        success: gmailResponse.success,
        messageId: gmailResponse.messageId,
        threadId: gmailResponse.threadId,
        error: gmailResponse.error,
        provider: 'gmail',
        timestamp: gmailResponse.timestamp
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
        provider: 'gmail',
        timestamp: new Date().toISOString()
      }
    }
  })

// GET endpoint - check email service status
export const Route = createFileRoute('/api/email')({
  component: () => null,
  loader: async () => {
    return {
      status: 'healthy',
      service: 'Google OAuth + Gmail API',
      version: '1.0.0',
      authentication: 'Google OAuth2',
      emailProvider: 'Gmail API',
      endpoints: {
        send: 'POST /api/email',
        status: 'GET /api/email',
        oauth: 'GET /api/gmail/auth',
        callback: 'GET /api/gmail/callback'
      },
      features: [
        'Google OAuth2 authentication',
        'Gmail API integration',
        'Email sending',
        'Email receiving',
        'Attachment support',
        'Multi-tenant support'
      ],
      timestamp: new Date().toISOString()
    }
  }
})

// Export server function for use in components
export { sendEmail }