// Simple Gmail API service for SupplyGraph
// This is a simplified version that works with the current setup

import { google } from 'googleapis'

export interface EmailMessage {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  text?: string
  html?: string
  attachments?: Array<{
    filename: string
    content: string | Buffer
    encoding?: string
  }>
}

export interface GmailCredentials {
  accessToken: string
  refreshToken?: string
  expiryDate?: Date
  email: string
  organizationId: string
}

export class GmailSimpleService {
  private oauth2Client: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.SERVER_URL || 'http://localhost:3000'}/api/auth/google/callback`
    )
  }

  // Store Gmail credentials temporarily (in-memory for development)
  // In production, this should be encrypted and stored in database
  private static credentialsStore: Map<string, GmailCredentials> = new Map()

  // Store or update Gmail OAuth tokens for an organization
  async storeGmailCredentials(credentials: GmailCredentials): Promise<void> {
    GmailSimpleService.credentialsStore.set(credentials.organizationId, credentials)
    console.log(`Gmail credentials stored for organization: ${credentials.organizationId}`)
  }

  // Get Gmail credentials for an organization
  async getGmailCredentials(orgId: string): Promise<GmailCredentials | null> {
    return GmailSimpleService.credentialsStore.get(orgId) || null
  }

  // Check if token is expired or will expire soon (within 5 minutes)
  private isTokenExpired(expiryDate?: Date): boolean {
    if (!expiryDate) return true
    const now = new Date()
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)
    return expiryDate <= fiveMinutesFromNow
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiryDate: Date }> {
    this.oauth2Client.setCredentials({ refresh_token: refreshToken })

    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken()
      return {
        accessToken: credentials.access_token!,
        expiryDate: new Date(credentials.expiry_date!)
      }
    } catch (error) {
      console.error('Failed to refresh access token:', error)
      throw new Error('Failed to refresh Gmail access token')
    }
  }

  // Get valid access token (refresh if necessary)
  async getValidAccessToken(orgId: string): Promise<string> {
    const credentials = await this.getGmailCredentials(orgId)
    if (!credentials) {
      throw new Error(`No Gmail credentials found for organization ${orgId}`)
    }

    if (this.isTokenExpired(credentials.expiryDate)) {
      if (!credentials.refreshToken) {
        throw new Error('No refresh token available - user needs to re-authenticate')
      }

      const { accessToken, expiryDate } = await this.refreshAccessToken(credentials.refreshToken)

      // Update stored credentials with new access token
      await this.storeGmailCredentials({
        ...credentials,
        accessToken,
        expiryDate
      })

      return accessToken
    }

    return credentials.accessToken
  }

  // Send email using Gmail API
  async sendEmail(orgId: string, message: EmailMessage): Promise<{ messageId: string; threadId: string }> {
    try {
      const accessToken = await this.getValidAccessToken(orgId)

      // Create Gmail API client
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })
      this.oauth2Client.setCredentials({ access_token: accessToken })

      // Prepare email message
      const emailParts = []

      // Headers
      emailParts.push(`To: ${Array.isArray(message.to) ? message.to.join(', ') : message.to}`)
      if (message.cc) {
        emailParts.push(`Cc: ${Array.isArray(message.cc) ? message.cc.join(', ') : message.cc}`)
      }
      if (message.bcc) {
        emailParts.push(`Bcc: ${Array.isArray(message.bcc) ? message.bcc.join(', ') : message.bcc}`)
      }
      emailParts.push(`Subject: ${message.subject}`)
      emailParts.push('MIME-Version: 1.0')

      // Content
      if (message.html && message.text) {
        // Multipart message with both HTML and text
        const boundary = `boundary_${Date.now()}`
        emailParts.push(`Content-Type: multipart/alternative; boundary="${boundary}"`)
        emailParts.push('')
        emailParts.push(`--${boundary}`)
        emailParts.push('Content-Type: text/plain; charset=UTF-8')
        emailParts.push('Content-Transfer-Encoding: 7bit')
        emailParts.push('')
        emailParts.push(message.text)
        emailParts.push('')
        emailParts.push(`--${boundary}`)
        emailParts.push('Content-Type: text/html; charset=UTF-8')
        emailParts.push('Content-Transfer-Encoding: 7bit')
        emailParts.push('')
        emailParts.push(message.html)
        emailParts.push('')
        emailParts.push(`--${boundary}--`)
      } else if (message.html) {
        // HTML only
        emailParts.push('Content-Type: text/html; charset=UTF-8')
        emailParts.push('Content-Transfer-Encoding: 7bit')
        emailParts.push('')
        emailParts.push(message.html)
      } else {
        // Plain text only
        emailParts.push('Content-Type: text/plain; charset=UTF-8')
        emailParts.push('Content-Transfer-Encoding: 7bit')
        emailParts.push('')
        emailParts.push(message.text || '')
      }

      const rawMessage = emailParts.join('\n')
      const encodedMessage = Buffer.from(rawMessage).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

      // Send the message
      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      })

      return {
        messageId: response.data.id!,
        threadId: response.data.threadId!
      }
    } catch (error) {
      console.error('Failed to send email via Gmail API:', error)
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Get user profile info from Gmail
  async getGmailProfile(orgId: string): Promise<{ email: string; name: string }> {
    const accessToken = await this.getValidAccessToken(orgId)

    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })
    this.oauth2Client.setCredentials({ access_token: accessToken })

    try {
      const response = await gmail.users.getProfile({ userId: 'me' })
      const people = google.people({ version: 'v1', auth: this.oauth2Client })

      // Get user's name from People API
      const profileResponse = await people.people.get({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses'
      })

      const name = profileResponse.data.names?.[0]?.displayName || 'Unknown'
      const email = profileResponse.data.emailAddresses?.[0]?.value || response.data.emailAddress || ''

      return { email, name }
    } catch (error) {
      console.error('Failed to get Gmail profile:', error)
      throw new Error('Failed to retrieve Gmail profile')
    }
  }

  // Initialize OAuth flow - returns Google Auth URL
  getAuthUrl(orgId: string): string {
    const scopes = [
      'openid',
      'profile',
      'email',
      'https://www.googleapis.com/auth/gmail.send'
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
      state: orgId, // Pass organization ID in state parameter
      redirect_uri: `${process.env.SERVER_URL || 'http://localhost:3000'}/api/auth/google/callback`
    })
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string, orgId: string): Promise<GmailCredentials> {
    this.oauth2Client.setCredentials({ code })

    try {
      const { credentials } = await this.oauth2Client.getToken(code)

      // Get user info
      const response = await google.gmail({ version: 'v1', auth: this.oauth2Client }).users.getProfile({ userId: 'me' })
      const email = response.data.emailAddress || 'unknown@gmail.com'

      const gmailCredentials: GmailCredentials = {
        accessToken: credentials.access_token!,
        refreshToken: credentials.refresh_token,
        expiryDate: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined,
        email: email,
        organizationId: orgId
      }

      // Store credentials
      await this.storeGmailCredentials(gmailCredentials)

      return gmailCredentials
    } catch (error) {
      console.error('Failed to exchange code for tokens:', error)
      throw new Error('Failed to complete Gmail OAuth flow')
    }
  }
}

// Singleton instance
export const gmailSimpleService = new GmailSimpleService()

// Helper function for sending procurement emails
export async function sendProcurementEmail(orgId: string, vendorEmail: string, subject: string, content: string) {
  const emailMessage: EmailMessage = {
    to: vendorEmail,
    subject: subject,
    html: content,
    text: content.replace(/<[^>]*>/g, '') // Strip HTML for plain text version
  }

  try {
    const result = await gmailSimpleService.sendEmail(orgId, emailMessage)
    return {
      success: true,
      messageId: result.messageId,
      threadId: result.threadId
    }
  } catch (error) {
    console.error('Failed to send procurement email:', error)
    throw error
  }
}