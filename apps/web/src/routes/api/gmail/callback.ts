/**
 * Gmail OAuth Callback Route
 * Handles OAuth2 callback from Google and stores tokens
 */

import { createFileRoute } from '@tanstack/react-router'
import { GmailService } from '~/lib/gmail-service'
import { getServerSession } from '~/lib/auth.server'

export const Route = createFileRoute('/api/gmail/callback')({
  component: () => null,
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const code = url.searchParams.get('code')
          const state = url.searchParams.get('state')
          const error = url.searchParams.get('error')

          if (error) {
            console.error('OAuth error:', error)
            return new Response(JSON.stringify({ 
              error: 'OAuth authorization failed',
              details: error 
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            })
          }

          if (!code) {
            return new Response(JSON.stringify({ 
              error: 'Authorization code not provided' 
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            })
          }

          // Get session to identify user
          const session = await getServerSession(request)
          if (!session?.user) {
            return new Response(JSON.stringify({ 
              error: 'User not authenticated' 
            }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            })
          }

          // Initialize Gmail service
          const gmailService = new GmailService({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            redirectUri: process.env.GOOGLE_REDIRECT_URI!
          })

          // Exchange code for tokens
          const tokens = await gmailService.exchangeCodeForTokens(code)

          // Store tokens in database
          const { PrismaClient } = await import('@prisma/client')
          const prisma = new PrismaClient()

          try {
            await prisma.gmailCredentials.upsert({
              where: { userId: session.user.id },
              update: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiryDate: tokens.expiryDate
              },
              create: {
                userId: session.user.id,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiryDate: tokens.expiryDate
              }
            })

            console.log('Gmail credentials stored for user:', session.user.id)

            // Redirect to success page
            const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations?success=gmail&state=${state || ''}`
            
            return new Response(null, {
              status: 302,
              headers: {
                'Location': redirectUrl,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              }
            })
          } finally {
            await prisma.$disconnect()
          }
        } catch (error) {
          console.error('Gmail OAuth callback error:', error)
          
          // Redirect to error page
          const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations?error=gmail_oauth_failed`
          
          return new Response(null, {
            status: 302,
            headers: {
              'Location': redirectUrl,
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
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