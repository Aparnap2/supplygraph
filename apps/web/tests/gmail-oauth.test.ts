/**
 * Gmail OAuth Integration Tests
 * Tests for Google OAuth2 authentication and Gmail API integration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GmailService } from '~/lib/gmail-service'

// Mock googleapis
vi.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: vi.fn().mockImplementation((clientId, clientSecret, redirectUri) => ({
        generateAuthUrl: vi.fn().mockReturnValue('https://accounts.google.com/oauth/authorize?test=true'),
        getToken: vi.fn().mockResolvedValue({
          tokens: {
            access_token: 'test_access_token',
            refresh_token: 'test_refresh_token',
            expiry_date: Date.now() + 3600000
          }
        }),
        setCredentials: vi.fn(),
        refreshAccessToken: vi.fn().mockResolvedValue({
          credentials: {
            access_token: 'new_access_token',
            expiry_date: Date.now() + 3600000
          }
        })
      })
    },
    gmail: vi.fn().mockReturnValue({
      users: {
        messages: {
          list: vi.fn().mockResolvedValue({
            data: {
              messages: [
                { id: 'msg1', threadId: 'thread1' },
                { id: 'msg2', threadId: 'thread2' }
              ],
              nextPageToken: 'next_page_token'
            }
          })
        },
        get: vi.fn().mockResolvedValue({
          data: {
            id: 'msg1',
            threadId: 'thread1',
            snippet: 'Test email snippet',
            payload: {
              headers: [
                { name: 'Subject', value: 'Test Subject' },
                { name: 'From', value: 'sender@example.com' },
                { name: 'To', value: 'recipient@example.com' }
              ],
              parts: [
                {
                  mimeType: 'text/html',
                  body: { data: Buffer.from('<p>Test email body</p>').toString('base64') }
                }
              ]
            }
          }
        }),
        send: vi.fn().mockResolvedValue({
          data: {
            id: 'sent_msg_id',
            threadId: 'sent_thread_id'
          }
        })
      }
    }
  }
}))

// Mock Prisma
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    gmailCredentials: {
      findUnique: vi.fn(),
      upsert: vi.fn()
    },
    $disconnect: vi.fn()
  }))
}))

describe('Gmail OAuth Integration', () => {
  let gmailService: GmailService

  beforeEach(() => {
    vi.clearAllMocks()
    gmailService = new GmailService({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      redirectUri: 'http://localhost:3000/auth/callback'
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('OAuth2 URL Generation', () => {
    it('should generate OAuth2 authorization URL', () => {
      const scopes = [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly'
      ]
      
      const authUrl = gmailService.getAuthUrl(scopes)
      
      expect(authUrl).toContain('accounts.google.com/oauth/authorize')
      expect(typeof authUrl).toBe('string')
    })

    it('should include required scopes in auth URL', () => {
      const scopes = [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly'
      ]
      
      const authUrl = gmailService.getAuthUrl(scopes)
      
      expect(authUrl).toContain('scope=')
      expect(authUrl).toContain('gmail.send')
      expect(authUrl).toContain('gmail.readonly')
    })
  })

  describe('Token Exchange', () => {
    it('should exchange authorization code for tokens', async () => {
      const code = 'test_authorization_code'
      
      const tokens = await gmailService.exchangeCodeForTokens(code)
      
      expect(tokens.accessToken).toBe('test_access_token')
      expect(tokens.refreshToken).toBe('test_refresh_token')
      expect(tokens.expiryDate).toBeInstanceOf(Date)
    })

    it('should handle invalid authorization code', async () => {
      const { google } = await import('googleapis')
      const mockOAuth2 = (google.auth.OAuth2 as any).mock.results[0].value
      mockOAuth2.getToken.mockRejectedValueOnce(new Error('Invalid code'))
      
      await expect(gmailService.exchangeCodeForTokens('invalid_code'))
        .rejects.toThrow('Failed to exchange code for tokens')
    })
  })

  describe('Token Refresh', () => {
    it('should refresh access token', async () => {
      // Set up initial credentials with refresh token
      const serviceWithRefresh = new GmailService({
        clientId: 'test_client_id',
        clientSecret: 'test_client_secret',
        redirectUri: 'http://localhost:3000/auth/callback',
        refreshToken: 'test_refresh_token'
      })
      
      const newToken = await serviceWithRefresh.refreshAccessToken()
      
      expect(newToken).toBe('new_access_token')
    })

    it('should handle missing refresh token', async () => {
      const serviceWithoutRefresh = new GmailService({
        clientId: 'test_client_id',
        clientSecret: 'test_client_secret',
        redirectUri: 'http://localhost:3000/auth/callback'
      })
      
      await expect(serviceWithoutRefresh.refreshAccessToken())
        .rejects.toThrow('No refresh token available')
    })
  })

  describe('Email Sending', () => {
    it('should send email successfully', async () => {
      const emailData = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        body: '<p>Test email body</p>'
      }
      
      const response = await gmailService.sendEmail(emailData)
      
      expect(response.success).toBe(true)
      expect(response.messageId).toBe('sent_msg_id')
      expect(response.threadId).toBe('sent_thread_id')
      expect(response.provider).toBe('gmail')
    })

    it('should handle email sending errors', async () => {
      const { google } = await import('googleapis')
      const mockGmail = (google.gmail as any).mock.results[0].value
      mockGmail.users.send.mockRejectedValueOnce(new Error('API quota exceeded'))
      
      const emailData = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        body: '<p>Test email body</p>'
      }
      
      const response = await gmailService.sendEmail(emailData)
      
      expect(response.success).toBe(false)
      expect(response.error).toContain('API quota exceeded')
      expect(response.provider).toBe('gmail')
    })

    it('should validate email data before sending', async () => {
      const invalidEmailData = {
        to: 'invalid-email',
        subject: '',
        body: 'Test body'
      }
      
      const response = await gmailService.sendEmail(invalidEmailData)
      
      expect(response.success).toBe(false)
      expect(response.error).toBeDefined()
    })
  })

  describe('Email Retrieval', () => {
    it('should retrieve email list', async () => {
      const result = await gmailService.getEmails({ maxResults: 10 })
      
      expect(result.messages).toHaveLength(2)
      expect(result.messages[0].id).toBe('msg1')
      expect(result.nextPageToken).toBe('next_page_token')
    })

    it('should retrieve single email by ID', async () => {
      const email = await gmailService.getEmailById('msg1')
      
      expect(email.id).toBe('msg1')
      expect(email.threadId).toBe('thread1')
      expect(email.subject).toBe('Test Subject')
      expect(email.from).toBe('sender@example.com')
      expect(email.to).toBe('recipient@example.com')
      expect(email.body).toBe('<p>Test email body</p>')
    })

    it('should handle email retrieval errors', async () => {
      const { google } = await import('googleapis')
      const mockGmail = (google.gmail as any).mock.results[0].value
      mockGmail.users.get.mockRejectedValueOnce(new Error('Email not found'))
      
      await expect(gmailService.getEmailById('nonexistent_id'))
        .rejects.toThrow('Failed to retrieve email')
    })
  })

  describe('Procurement Notifications', () => {
    it('should send quote received notification', async () => {
      const response = await gmailService.sendProcurementNotification(
        'user@example.com',
        'quote_received',
        {
          vendorName: 'Test Vendor',
          amount: '1500.00',
          items: [{ name: 'Item 1', quantity: 10 }]
        }
      )
      
      expect(response.success).toBe(true)
      expect(response.provider).toBe('gmail')
    })

    it('should send approval required notification', async () => {
      const response = await gmailService.sendProcurementNotification(
        'manager@example.com',
        'approval_required',
        {
          quoteId: 'QUOTE-123',
          vendorName: 'Test Vendor',
          amount: '2500.00',
          requestedBy: 'John Doe'
        }
      )
      
      expect(response.success).toBe(true)
      expect(response.provider).toBe('gmail')
    })

    it('should send order placed notification', async () => {
      const response = await gmailService.sendProcurementNotification(
        'user@example.com',
        'order_placed',
        {
          orderId: 'ORDER-456',
          vendorName: 'Test Vendor',
          amount: '1500.00',
          expectedDelivery: '2024-01-15'
        }
      )
      
      expect(response.success).toBe(true)
      expect(response.provider).toBe('gmail')
    })

    it('should send delivered notification', async () => {
      const response = await gmailService.sendProcurementNotification(
        'user@example.com',
        'delivered',
        {
          orderId: 'ORDER-456',
          deliveredDate: '2024-01-10',
          itemsReceived: '10 items'
        }
      )
      
      expect(response.success).toBe(true)
      expect(response.provider).toBe('gmail')
    })

    it('should handle unknown notification type', async () => {
      await expect(gmailService.sendProcurementNotification(
        'user@example.com',
        'unknown_type' as any,
        {}
      )).rejects.toThrow('Unknown email template type')
    })
  })

  describe('Credentials Management', () => {
    it('should return current credentials', () => {
      const credentials = gmailService.getCredentials()
      
      expect(credentials.clientId).toBe('test_client_id')
      expect(credentials.clientSecret).toBe('test_client_secret')
      expect(credentials.redirectUri).toBe('http://localhost:3000/auth/callback')
    })
  })
})