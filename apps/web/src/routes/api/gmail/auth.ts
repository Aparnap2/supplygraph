/**
 * Gmail OAuth Authentication Routes
 * Handles Google OAuth2 flow for Gmail integration
 */

import { createFileRoute } from '@tanstack/react-router'
import { GmailService, GmailCredentialsSchema } from '~/lib/gmail-service'
import { getServerSession } from '~/lib/auth.server'

// Generate OAuth URL
export const Route = createFileRoute('/api/gmail/auth')({
  component: () => null,
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getServerSession(request)
          if (!session?.user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            })
          }

          const gmailService = new GmailService({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            redirectUri: process.env.GOOGLE_REDIRECT_URI!
          })

          const authUrl = gmailService.getAuthUrl()

          return new Response(JSON.stringify({ authUrl }), {
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
          })
        } catch (error) {
          console.error('Error generating auth URL:', error)
          return new Response(JSON.stringify({ 
            error: 'Failed to generate authentication URL' 
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      },

      OPTIONS: async () => {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        })
      }
    }
  }
})