/**
 * Email Service
 * Handles email sending functionality for procurement notifications
 */

import { z } from 'zod'

// Email validation schema
export const EmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
  from: z.string().email().optional(),
  replyTo: z.string().email().optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.string(), // Base64 encoded content
    contentType: z.string()
  })).optional()
})

export type EmailData = z.infer<typeof EmailSchema>

// Email response schema
export const EmailResponseSchema = z.object({
  success: z.boolean(),
  messageId: z.string().optional(),
  error: z.string().optional(),
  provider: z.string(),
  timestamp: z.string()
})

export type EmailResponse = z.infer<typeof EmailResponseSchema>

/**
 * Email service class for sending emails
 */
export class EmailService {
  private provider: 'resend' | 'sendgrid' | 'nodemailer'
  private apiKey: string
  private fromEmail: string

  constructor(
    provider: 'resend' | 'sendgrid' | 'nodemailer' = 'resend',
    apiKey: string = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || '',
    fromEmail: string = process.env.FROM_EMAIL || 'noreply@supplygraph.com'
  ) {
    this.provider = provider
    this.apiKey = apiKey
    this.fromEmail = fromEmail

    if (!this.apiKey) {
      console.warn('Email API key not configured. Emails will be logged only.')
    }
  }

  /**
   * Send email using configured provider
   */
  async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      // Validate email data
      const validatedData = EmailSchema.parse(emailData)
      
      // Log email for debugging
      console.log('Sending email:', {
        to: validatedData.to,
        subject: validatedData.subject,
        provider: this.provider,
        timestamp: new Date().toISOString()
      })

      // If no API key configured, log and return success
      if (!this.apiKey) {
        console.log('Email would be sent (no API key configured):', validatedData)
        return {
          success: true,
          messageId: `mock_${Date.now()}`,
          provider: this.provider,
          timestamp: new Date().toISOString()
        }
      }

      // Send email based on provider
      let result: EmailResponse

      switch (this.provider) {
        case 'resend':
          result = await this.sendWithResend(validatedData)
          break
        case 'sendgrid':
          result = await this.sendWithSendGrid(validatedData)
          break
        case 'nodemailer':
          result = await this.sendWithNodemailer(validatedData)
          break
        default:
          throw new Error(`Unsupported email provider: ${this.provider}`)
      }

      console.log('Email sent successfully:', result)
      return result

    } catch (error) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.provider,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Send email using Resend
   */
  private async sendWithResend(emailData: EmailData): Promise<EmailResponse> {
    // Dynamic import to avoid SSR issues
    const { default: Resend } = await import('resend')
    const resend = new Resend(this.apiKey)

    const { data, error } = await resend.emails.send({
      from: emailData.from || this.fromEmail,
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.body,
      replyTo: emailData.replyTo,
      attachments: emailData.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        type: att.contentType
      }))
    })

    if (error) {
      throw new Error(`Resend error: ${error.message}`)
    }

    return {
      success: true,
      messageId: data?.id,
      provider: 'resend',
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Send email using SendGrid
   */
  private async sendWithSendGrid(emailData: EmailData): Promise<EmailResponse> {
    // Dynamic import to avoid SSR issues
    const { default: SendGrid } = await import('@sendgrid/mail')
    SendGrid.setApiKey(this.apiKey)

    const msg = {
      to: emailData.to,
      from: emailData.from || this.fromEmail,
      subject: emailData.subject,
      html: emailData.body,
      replyTo: emailData.replyTo,
      attachments: emailData.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        type: att.contentType,
        disposition: 'attachment'
      }))
    }

    const [response] = await SendGrid.send(msg)

    return {
      success: true,
      messageId: response.headers['x-message-id'],
      provider: 'sendgrid',
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Send email using Nodemailer (SMTP)
   */
  private async sendWithNodemailer(emailData: EmailData): Promise<EmailResponse> {
    // Dynamic import to avoid SSR issues
    const { default: nodemailer } = await import('nodemailer')
    
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    const info = await transporter.sendMail({
      from: emailData.from || this.fromEmail,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.body,
      replyTo: emailData.replyTo,
      attachments: emailData.attachments?.map(att => ({
        filename: att.filename,
        content: Buffer.from(att.content, 'base64'),
        contentType: att.contentType
      }))
    })

    return {
      success: true,
      messageId: info.messageId,
      provider: 'nodemailer',
      timestamp: new Date().toISOString()
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
        subject: 'New Quote Received',
        body: `
          <h2>New Quote Received</h2>
          <p>A new quote has been received for your procurement request.</p>
          <ul>
            <li>Vendor: ${data.vendorName}</li>
            <li>Amount: $${data.amount}</li>
            <li>Items: ${data.items?.length || 0}</li>
          </ul>
          <p>Please review and approve the quote in your dashboard.</p>
        `
      },
      approval_required: {
        subject: 'Approval Required for Quote',
        body: `
          <h2>Approval Required</h2>
          <p>A quote requires your approval before proceeding.</p>
          <ul>
            <li>Quote ID: ${data.quoteId}</li>
            <li>Vendor: ${data.vendorName}</li>
            <li>Amount: $${data.amount}</li>
            <li>Requested by: ${data.requestedBy}</li>
          </ul>
          <p>Please review and approve in your dashboard.</p>
        `
      },
      order_placed: {
        subject: 'Order Placed Successfully',
        body: `
          <h2>Order Placed</h2>
          <p>Your order has been successfully placed.</p>
          <ul>
            <li>Order ID: ${data.orderId}</li>
            <li>Vendor: ${data.vendorName}</li>
            <li>Amount: $${data.amount}</li>
            <li>Expected Delivery: ${data.expectedDelivery}</li>
          </ul>
          <p>You will receive updates on the delivery status.</p>
        `
      },
      delivered: {
        subject: 'Order Delivered',
        body: `
          <h2>Order Delivered</h2>
          <p>Your order has been delivered successfully.</p>
          <ul>
            <li>Order ID: ${data.orderId}</li>
            <li>Delivered on: ${data.deliveredDate}</li>
            <li>Items received: ${data.itemsReceived}</li>
          </ul>
          <p>Please verify the delivery and update inventory.</p>
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
}

// Singleton instance
export const emailService = new EmailService()

// Convenience function
export const sendEmail = (emailData: EmailData) => emailService.sendEmail(emailData)