// API service for SupplyGraph frontend-backend communication
// Handles all HTTP requests to the Python backend

const API_BASE_URL = 'http://localhost:8000'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
}

// Generic API wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Request failed',
      timestamp: new Date().toISOString()
    }
  }
}

// Dashboard Statistics
export interface DashboardStats {
  totalRequests: number
  totalSavings: number
  inProgress: number
  activeVendors: number
  requestsThisWeek: number
  averageSavings: number
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return apiRequest<DashboardStats>('/api/stats')
}

// AI Insights
export interface AIInsight {
  id: string
  type: 'opportunity' | 'recommendation' | 'alert'
  title: string
  description: string
  impact: string
}

export async function getAIInsights(): Promise<ApiResponse<AIInsight[]>> {
  return apiRequest<AIInsight[]>('/api/ai-insights')
}

// Procurement Requests
export interface ProcurementRequest {
  id: string
  title: string
  description: string
  category: string
  status: 'PENDING' | 'NEGOTIATING' | 'APPROVED' | 'PAID' | 'REJECTED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  budget: number
  createdBy: string
  createdAt: string
  updatedAt?: string
  approvedBy?: string
  approvedAt?: string
  bestQuote?: {
    vendor: string
    amount: number
    savings: string
    delivery: string
  }
  quotes?: Array<{
    vendor: string
    amount: number
    delivery: string
    rating: number
  }>
  aiRecommendation?: {
    vendor: string
    savings: string
    reasoning: string
  }
}

export async function getProcurementRequests(): Promise<ApiResponse<ProcurementRequest[]>> {
  return apiRequest<ProcurementRequest[]>('/api/requests')
}

export async function getProcurementRequest(id: string): Promise<ApiResponse<ProcurementRequest>> {
  return apiRequest<ProcurementRequest>(`/api/requests/${id}`)
}

// CSV Upload
export interface CSVUploadRequest {
  fileContent: string
  fileName: string
  fileType: string
}

export interface CSVUploadResponse {
  success: boolean
  message: string
  requests?: ProcurementRequest[]
  totalItems?: number
  totalValue?: number
  error?: string
}

export async function uploadCSV(fileContent: string, fileName: string, fileType: string): Promise<ApiResponse<CSVUploadResponse>> {
  return apiRequest<CSVUploadResponse>('/api/upload-csv', {
    method: 'POST',
    body: JSON.stringify({
      fileContent,
      fileName,
      fileType
    })
  })
}

// Email Service
export interface EmailRequest {
  to: string
  subject: string
  body: string
  cc?: string
  bcc?: string
  attachments?: Array<{
    filename: string
    content: string
    contentType?: string
  }>
}

export interface EmailResponse {
  success: boolean
  messageId?: string
  status?: string
  error?: string
  timestamp: string
}

export async function sendEmail(email: EmailRequest): Promise<ApiResponse<EmailResponse>> {
  return apiRequest<EmailResponse>('/api/email', {
    method: 'POST',
    body: JSON.stringify(email)
  })
}

// WebSocket connection for real-time updates
export class WebSocketService {
  private ws: WebSocket | null = null
  private messageHandlers: Map<string, (data: any) => void> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(private url: string = 'ws://localhost:8000/ws') {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            const { type, payload } = data

            const handler = this.messageHandlers.get(type)
            if (handler) {
              handler(payload)
            } else {
              console.log('Received message with no handler:', data)
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.attemptReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

      setTimeout(() => {
        this.connect().catch(console.error)
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  on(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler)
  }

  off(type: string) {
    this.messageHandlers.delete(type)
  }

  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else {
      console.error('WebSocket not connected')
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// Global WebSocket instance
export const wsService = new WebSocketService()