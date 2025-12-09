/**
 * Gmail Service
 * Handles email sending and receiving using Gmail API with OAuth2 authentication
 */

import { z } from 'zod'

// Email validation schema
export const EmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
  cc: z.string().email().optional(),
  bcc: z.string().email().optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.string(), // Base64 encoded content
    contentType: z.string()
  })).optional()
})

export type EmailData = z.infer<typeof EmailSchema>

// Gmail credentials schema
export const GmailCredentialsSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string().url(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiryDate: z.date().optional()
})

export type GmailCredentials = z.infer<typeof GmailCredentialsSchema>

// Email response schema
export const EmailResponseSchema = z.object({
  success: z.boolean(),
  messageId: z.string().optional(),
  threadId: z.string().optional(),
  error: z.string().optional(),
  provider: z.literal('gmail'),
  timestamp: z.string()
})

export type EmailResponse = z.infer<typeof EmailResponseSchema>

// Gmail message schema
export const GmailMessageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  snippet: z.string(),
  subject: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  date: z.string().optional(),
  body: z.string().optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    size: z.number(),
    attachmentId: z.string()
  })).optional()
})

export type GmailMessage = z.infer<typeof GmailMessageSchema>

/**
 * Gmail service class for sending and receiving emails
 */
export class GmailService {
  private oauth2Client: any
  private gmail: any
  private credentials: GmailCredentials

  constructor(credentials: GmailCredentials) {
    this.credentials = GmailCredentials.parse(credentials)
    this.initializeOAuth2Client()
  }

  /**
   * Initialize OAuth2 client
   */
  private async initializeOAuth2Client() {
    const { google } = await import('googleapis')
    
    this.oauth2Client = new google.auth.OAuth2(
      this.credentials.clientId,
      this.credentials.clientSecret,
      this.credentials.redirectUri
    )

    // Set credentials if available
    if (this.credentials.accessToken) {
      this.oauth2Client.setCredentials({
        access_token: this.credentials.accessToken,
        refresh_token: this.credentials.refreshToken
      })
    }

    // Initialize Gmail API
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })
  }

  /**
   * Generate OAuth2 authorization URL
   */
  getAuthUrl(scopes: string[] = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
  ]): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string
    refreshToken: string
    expiryDate: Date
  }> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code)
      
      if (!tokens.access_token || !tokens.refresh_token) {
        throw new Error('Invalid tokens received from Google')
      }

      // Set credentials on client
      this.oauth2Client.setCredentials(tokens)

      // Update credentials
      this.credentials.accessToken = tokens.access_token
      this.credentials.refreshToken = tokens.refresh_token
      this.credentials.expiryDate = tokens.expiry_date 
        ? new Date(tokens.expiry_date) 
        : new Date(Date.now() + 3600 * 1000) // 1 hour from now

      return {
        accessToken: this.credentials.accessToken,
        refreshToken: this.credentials.refreshToken,
        expiryDate: this.credentials.expiryDate
      }
    } catch (error) {
      throw new Error(`Failed to exchange code for tokens: ${error}`)
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.credentials.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken()
      
      if (!credentials.access_token) {
        throw new Error('Failed to refresh access token')
      }

      this.credentials.accessToken = credentials.access_token
      this.credentials.expiryDate = credentials.expiry_date 
        ? new Date(credentials.expiry_date) 
        : new Date(Date.now() + 3600 * 1000)

      return this.credentials.accessToken
    } catch (error) {
      throw new Error(`Failed to refresh access token: ${error}`)
    }
  }

  /**
   * Ensure valid access token
   */
  private async ensureValidToken(): Promise<void> {
    const now = new Date()
    const isExpired = this.credentials.expiryDate 
      ? this.credentials.expiryDate <= now 
      : false

    if (isExpired || !this.credentials.accessToken) {
      await this.refreshAccessToken()
    }
  }

  /**
   * Send email using Gmail API
   */
  async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      // Validate email data
      const validatedData = EmailSchema.parse(emailData)
      
      // Ensure we have a valid token
      await this.ensureValidToken()

      // Create email message
      const emailMessage = this.createEmailMessage(validatedData)
      
      // Send email
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: emailMessage
        }
      })

      console.log('Email sent successfully:', {
        messageId: response.data.id,
        threadId: response.data.threadId,
        to: validatedData.to,
        subject: validatedData.subject
      })

      return {
        success: true,
        messageId: response.data.id,
        threadId: response.data.threadId,
        provider: 'gmail',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'gmail',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Create email message in RFC 2822 format
   */
  private createEmailMessage(emailData: EmailData): string {
    const { google } = require('googleapis')
    
    // Create email headers
    const headers = [
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8'
    ]

    if (emailData.cc) {
      headers.push(`Cc: ${emailData.cc}`)
    }

    if (emailData.bcc) {
      headers.push(`Bcc: ${emailData.bcc}`)
    }

    // Create message
    const message = [
      ...headers,
      '',
      emailData.body
    ].join('\n')

    // Base64 encode the message
    return Buffer.from(message).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  /**
   * Get list of emails
   */
  async getEmails(options: {
    maxResults?: number
    query?: string
    pageToken?: string
  } = {}): Promise<{
    messages: GmailMessage[]
    nextPageToken?: string
  }> {
    try {
      await this.ensureValidToken()

      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults: options.maxResults || 10,
        q: options.query || '',
        pageToken: options.pageToken
      })

      if (!response.data.messages) {
        return { messages: [] }
      }

      // Get full message details
      const messages = await Promise.all(
        response.data.messages.map(async (msg: any) => {
          const fullMessage = await this.gmail.users.messages.get({
            userId: 'me',
            id: msg.id,
            format: 'full'
          })

          return this.parseGmailMessage(fullMessage.data)
        })
      )

      return {
        messages,
        nextPageToken: response.data.nextPageToken
      }
    } catch (error) {
      console.error('Failed to get emails:', error)
      throw new Error(`Failed to retrieve emails: ${error}`)
    }
  }

  /**
   * Parse Gmail message data
   */
  private parseGmailMessage(data: any): GmailMessage {
    const headers = data.payload?.headers || []
    
    const getHeader = (name: string) => {
      const header = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())
      return header?.value
    }

    // Extract email body
    let body = ''
    if (data.payload?.parts) {
      // Multipart message
      for (const part of data.payload.parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8')
          break
        } else if (part.mimeType === 'text/plain' && part.body?.data && !body) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8')
        }
      }
    } else if (data.payload?.body?.data) {
      // Single part message
      body = Buffer.from(data.payload.body.data, 'base64').toString('utf-8')
    }

    // Extract attachments
    const attachments = data.payload?.parts
      ?.filter((part: any) => part.filename && part.body?.attachmentId)
      ?.map((part: any) => ({
        filename: part.filename,
        size: part.body.size,
        attachmentId: part.body.attachmentId
      })) || []

    return {
      id: data.id,
      threadId: data.threadId,
      snippet: data.snippet || '',
      subject: getHeader('Subject'),
      from: getHeader('From'),
      to: getHeader('To'),
      date: getHeader('Date'),
      body,
      attachments
    }
  }

  /**
   * Get email by ID
   */
  async getEmailById(messageId: string): Promise<GmailMessage> {
    try {
      await this.ensureValidToken()

      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      })

      return this.parseGmailMessage(response.data)
    } catch (error) {
      console.error('Failed to get email:', error)
      throw new Error(`Failed to retrieve email: ${error}`)
    }
  }

  /**
   * Send procurement notification email
   */
  async sendProcurementNotification(
    to: string,
    type: 'quote_received' | 'approval_required' | 'order_placed' | 'delivered',
    data: any
  ): Promise<EmailResponse> {
    const templates = {
      quote_received: {
        subject: 'New Quote Received - SupplyGraph',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Quote Received</h2>
            <p>A new quote has been received for your procurement request.</p>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <h3>Quote Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Vendor:</strong> ${data.vendorName}</li>
                <li><strong>Amount:</strong> $${data.amount}</li>
                <li><strong>Items:</strong> ${data.items?.length || 0}</li>
              </ul>
            </div>
            <p>Please review and approve the quote in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/procurement" style="color: #2563eb;">dashboard</a>.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">This is an automated message from SupplyGraph.</p>
          </div>
        `
      },
      approval_required: {
        subject: 'Approval Required - SupplyGraph',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Approval Required</h2>
            <p>A quote requires your approval before proceeding.</p>
            <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc2626;">
              <h3>Quote Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Quote ID:</strong> ${data.quoteId}</li>
                <li><strong>Vendor:</strong> ${data.vendorName}</li>
                <li><strong>Amount:</strong> $${data.amount}</li>
                <li><strong>Requested by:</strong> ${data.requestedBy}</li>
              </ul>
            </div>
            <p>Please review and approve in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/procurement" style="color: #dc2626;">dashboard</a>.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">This is an automated message from SupplyGraph.</p>
          </div>
        `
      },
      order_placed: {
        subject: 'Order Placed Successfully - SupplyGraph',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Order Placed</h2>
            <p>Your order has been successfully placed.</p>
            <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #16a34a;">
              <h3>Order Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Order ID:</strong> ${data.orderId}</li>
                <li><strong>Vendor:</strong> ${data.vendorName}</li>
                <li><strong>Amount:</strong> $${data.amount}</li>
                <li><strong>Expected Delivery:</strong> ${data.expectedDelivery}</li>
              </ul>
            </div>
            <p>You will receive updates on the delivery status.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">This is an automated message from SupplyGraph.</p>
          </div>
        `
      },
      delivered: {
        subject: 'Order Delivered - SupplyGraph',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0891b2;">Order Delivered</h2>
            <p>Your order has been delivered successfully.</p>
            <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #0891b2;">
              <h3>Delivery Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Order ID:</strong> ${data.orderId}</li>
                <li><strong>Delivered on:</strong> ${data.deliveredDate}</li>
                <li><strong>Items received:</strong> ${data.itemsReceived}</li>
              </ul>
            </div>
            <p>Please verify the delivery and update inventory.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">This is an automated message from SupplyGraph.</p>
          </div>
        `
      }
    }

    const template = templates[type]
    if (!template) {
      throw new Error(`Unknown email template type: ${type}`)
    }

    return this.sendEmail({
      to,
      subject: template.subject,
      body: template.body
    })
  }

  /**
   * Get updated credentials
   */
  getCredentials(): GmailCredentials {
    return { ...this.credentials }
  }
}

// Factory function to create Gmail service with stored credentials
export const createGmailService = async (userId: string): Promise<GmailService> => {
  // Import Prisma dynamically to avoid ES module issues
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  try {
    // Get user's Gmail credentials from database
    const userCredentials = await prisma.gmailCredentials.findUnique({
      where: { userId }
    })

    if (!userCredentials) {
      throw new Error('Gmail credentials not found for user')
    }

    return new GmailService({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      accessToken: userCredentials.accessToken,
      refreshToken: userCredentials.refreshToken,
      expiryDate: userCredentials.expiryDate
    })
  } finally {
    await prisma.$disconnect()
  }
}

export default GmailService