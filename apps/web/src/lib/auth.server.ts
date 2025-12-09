// Server-side Better Auth configuration for TanStack Start
// This file is excluded from the client bundle

import { betterAuth } from "better-auth"
import { google } from "better-auth/social"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db.server"

export const auth = betterAuth({
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/supplygraph",
  },
  // Use the Prisma adapter with our server-side client
  adapter: prismaAdapter(db, {
    provider: "postgres",
  }),
  emailAndPassword: {
    enabled: false, // We're using Google OAuth only
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: true,
      redirectUri: `${process.env.SERVER_URL || 'http://localhost:3000'}/api/auth/callback/google`,
      scope: [
        'openid',
        'profile',
        'email',
        'https://www.googleapis.com/auth/gmail.send'
      ],
      accessType: 'offline', // Important for refresh tokens
      prompt: 'consent', // Force consent to get refresh token
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          console.log("Creating user:", user)
          return user
        },
        after: async (user) => {
          console.log("User created:", user)
          // Store organization association if provided
          if (user.email) {
            // Auto-associate with organization based on email domain or other logic
            // This is where you'd implement multi-tenant user assignment
          }
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          console.log("Session created:", session)
        },
      },
    },
  },
  // Custom error handling
  errorHandling: {
    onInvalidCredentials: () => {
      return {
        error: "Invalid credentials",
        message: "The email or password you entered is incorrect",
      }
    },
  },
})

export type Session = typeof auth.$Infer.Session

// Helper functions for multi-tenant auth
export async function createOrganizationAccount(orgId: string, userId: string, role: string = 'member') {
  return await db.organizationMembership.create({
    data: {
      organizationId: orgId,
      userId: userId,
      role: role
    }
  })
}

export async function getUserOrganizations(userId: string) {
  return await db.organizationMembership.findMany({
    where: { userId },
    include: {
      organization: true
    }
  })
}

export async function validateOrgAccess(userId: string, orgId: string): Promise<boolean> {
  const membership = await db.organizationMembership.findFirst({
    where: {
      userId,
      organizationId: orgId
    }
  })
  return !!membership
}