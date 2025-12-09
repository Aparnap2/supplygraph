/**
 * Server-side Better Auth configuration
 * This file handles server-side auth with Prisma adapter
 * Works around ES module issues by using server-side only imports
 */

import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { organization } from "better-auth/plugins/organization"
import { google } from "better-auth/providers/google"

// Server-side Prisma import - works in Node.js environment
let prisma: any

// Dynamic import to handle ES module issues
async function getPrismaClient() {
  try {
    // Try dynamic import first
    const { PrismaClient } = await import('@prisma/client')
    return new PrismaClient()
  } catch (error) {
    console.error('Failed to import Prisma client:', error)
    // Fallback for development
    const { PrismaClient } = require('@prisma/client')
    return new PrismaClient()
  }
}

// Initialize auth with proper error handling
export const auth = betterAuth({
  database: async () => {
    const client = await getPrismaClient()
    return prismaAdapter(client, {
      provider: "postgresql",
      usePlural: false,
    })
  },
  providers: [
    google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      scopes: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify'
      ]
    })
  ],
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        // Use Gmail service for sending emails
        try {
          const { createGmailService } = await import('~/lib/gmail-service')
          const gmailService = await createGmailService(data.user.id)
          
          await gmailService.sendEmail({
            to: data.email,
            subject: `Invitation to join ${data.organization.name}`,
            body: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">You're invited!</h2>
                <p>You've been invited to join <strong>${data.organization.name}</strong> on SupplyGraph.</p>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <p>Click the link below to accept the invitation:</p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/invite/${data.invitation.id}"
                     style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Accept Invitation
                  </a>
                </div>
                <p style="color: #64748b; font-size: 14px;">This invitation expires in 7 days.</p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 14px;">This is an automated message from SupplyGraph.</p>
              </div>
            `
          })
          
          return { success: true }
        } catch (error) {
          console.error('Failed to send invitation email:', error)
          return { success: false, error: error.message }
        }
      }
    })
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  account: {
    accountLinkExpiration: 60 * 60 // 1 hour
  },
  callbacks: {
    async signIn({ user, account }) {
      // Store Google OAuth tokens for Gmail access
      if (account?.provider === 'google' && account?.access_token && account?.refresh_token) {
        try {
          const prisma = await getPrismaClient()
          
          // Upsert Gmail credentials
          await prisma.gmailCredentials.upsert({
            where: { userId: user.id },
            update: {
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiryDate: account.expires_at ? new Date(account.expires_at * 1000) : new Date(Date.now() + 3600 * 1000)
            },
            create: {
              userId: user.id,
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiryDate: account.expires_at ? new Date(account.expires_at * 1000) : new Date(Date.now() + 3600 * 1000)
            }
          })
          
          console.log('Gmail credentials stored for user:', user.id)
        } catch (error) {
          console.error('Failed to store Gmail credentials:', error)
        }
      }
      
      return { user }
    }
  }
})

// Export auth client for server-side usage
export const authClient = auth

// Helper function to get auth session in server context
export async function getServerSession(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    return session
  } catch (error) {
    console.error('Failed to get server session:', error)
    return null
  }
}

// Helper function to get user with organization in server context
export async function getServerUserWithOrg(request: Request) {
  try {
    const session = await getServerSession(request)
    if (!session?.user?.id) {
      return null
    }

    // Get user with organization
    const prisma = await getPrismaClient()
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          include: {
            organization: true
          }
        }
      }
    })

    return user
  } catch (error) {
    console.error('Failed to get server user with org:', error)
    return null
  }
}