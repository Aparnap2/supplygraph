/**
 * Frontend Database Configuration
 * Client-side connection settings and API endpoints
 */

const config = {
  // API endpoints for database operations
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    endpoints: {
      // Authentication
      auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        register: '/auth/register',
        profile: '/auth/profile'
      },

      // Organizations
      organizations: {
        list: '/organizations',
        create: '/organizations',
        get: (id) => `/organizations/${id}`,
        update: (id) => `/organizations/${id}`,
        delete: (id) => `/organizations/${id}`,
        settings: (id) => `/organizations/${id}/settings`,
        members: (id) => `/organizations/${id}/members`
      },

      // Procurement
      procurement: {
        requests: '/procurement/requests',
        create: '/procurement/requests',
        get: (id) => `/procurement/requests/${id}`,
        update: (id) => `/procurement/requests/${id}`,
        delete: (id) => `/procurement/requests/${id}`,
        approve: (id) => `/procurement/requests/${id}/approve`,
        reject: (id) => `/procurement/requests/${id}/reject`,
        items: (id) => `/procurement/requests/${id}/items`,
        quotes: (id) => `/procurement/requests/${id}/quotes`
      },

      // Vendors
      vendors: {
        list: '/vendors',
        create: '/vendors',
        get: (id) => `/vendors/${id}`,
        update: (id) => `/vendors/${id}`,
        delete: (id) => `/vendors/${id}`,
        contacts: (id) => `/vendors/${id}/contacts`,
        contracts: (id) => `/vendors/${id}/contracts`
      },

      // Products
      products: {
        list: '/products',
        create: '/products',
        get: (id) => `/products/${id}`,
        update: (id) => `/products/${id}`,
        delete: (id) => `/products/${id}`,
        categories: '/products/categories'
      },

      // Quotes
      quotes: {
        list: '/quotes',
        create: '/quotes',
        get: (id) => `/quotes/${id}`,
        update: (id) => `/quotes/${id}`,
        delete: (id) => `/quotes/${id}`,
        accept: (id) => `/quotes/${id}/accept`,
        reject: (id) => `/quotes/${id}/reject`,
        items: (id) => `/quotes/${id}/items`
      },

      // AI Suggestions
      ai: {
        suggestions: '/ai/suggestions',
        apply: (id) => `/ai/suggestions/${id}/apply`,
        reject: (id) => `/ai/suggestions/${id}/reject`,
        analyze: (id) => `/ai/analyze/${id}`,
        vendorMatch: '/ai/vendor-match',
        priceOptimize: '/ai/price-optimize'
      },

      // Analytics
      analytics: {
        dashboard: '/analytics/dashboard',
        spending: '/analytics/spending',
        vendorPerformance: '/analytics/vendor-performance',
        procurementTrends: '/analytics/procurement-trends',
        savings: '/analytics/savings'
      },

      // Activity Feed
      activity: {
        feed: '/activity',
        organization: (id) => `/activity/organization/${id}`,
        user: (id) => `/activity/user/${id}`
      }
    }
  },

  // Real-time configuration
  realtime: {
    websocket: {
      url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
      reconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10
    },
    channels: {
      organization: (id) => `organization:${id}`,
      procurement: (id) => `procurement:${id}`,
      quotes: (id) => `quotes:${id}`,
      ai: (id) => `ai:${id}`,
      activity: (id) => `activity:${id}`
    }
  },

  // Database models structure for frontend usage
  models: {
    organization: {
      id: 'string',
      name: 'string',
      slug: 'string',
      description: 'string?',
      logo: 'string?',
      website: 'string?',
      createdAt: 'date',
      updatedAt: 'date'
    },

    user: {
      id: 'string',
      name: 'string?',
      email: 'string',
      role: 'ADMIN | USER',
      createdAt: 'date',
      updatedAt: 'date'
    },

    member: {
      id: 'string',
      organizationId: 'string',
      userId: 'string',
      role: 'OWNER | ADMIN | MANAGER | MEMBER | VIEWER',
      joinedAt: 'date',
      lastLoginAt: 'date?'
    },

    procurementRequest: {
      id: 'string',
      requestNumber: 'string',
      title: 'string',
      description: 'string?',
      organizationId: 'string',
      requesterId: 'string',
      departmentId: 'string?',
      status: 'DRAFT | SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED | NEGOTIATING | PENDING_PAYMENT | PAID | COMPLETED | CANCELLED',
      priority: 'LOW | MEDIUM | HIGH | URGENT',
      threadId: 'string',
      workflowState: 'object?',
      totalAmount: 'number?',
      currency: 'string',
      requiresApproval: 'boolean',
      approverId: 'string?',
      approvedAt: 'date?',
      neededBy: 'date?',
      createdAt: 'date',
      updatedAt: 'date',
      completedAt: 'date?'
    },

    procurementItem: {
      id: 'string',
      requestId: 'string',
      productId: 'string?',
      name: 'string',
      description: 'string?',
      quantity: 'number',
      unit: 'string',
      unitPrice: 'number?',
      totalPrice: 'number?',
      specifications: 'object?',
      status: 'PENDING | QUOTED | APPROVED | REJECTED | ORDERED | RECEIVED | CANCELLED',
      createdAt: 'date',
      updatedAt: 'date'
    },

    vendor: {
      id: 'string',
      name: 'string',
      email: 'string?',
      phone: 'string?',
      website: 'string?',
      description: 'string?',
      addressLine1: 'string?',
      addressLine2: 'string?',
      city: 'string?',
      state: 'string?',
      country: 'string?',
      postalCode: 'string?',
      taxId: 'string?',
      paymentTerms: 'string?',
      rating: 'number?',
      organizationId: 'string',
      tags: 'string[]',
      isActive: 'boolean',
      createdAt: 'date',
      updatedAt: 'date'
    },

    quote: {
      id: 'string',
      quoteNumber: 'string',
      requestId: 'string',
      vendorId: 'string',
      organizationId: 'string',
      status: 'DRAFT | SENT | RECEIVED | UNDER_REVIEW | ACCEPTED | REJECTED | EXPIRED',
      validUntil: 'date?',
      subtotal: 'number',
      tax: 'number',
      shipping: 'number',
      totalAmount: 'number',
      currency: 'string',
      terms: 'string?',
      notes: 'string?',
      attachments: 'string[]',
      responseDate: 'date?',
      respondedBy: 'string?',
      receivedVia: 'string?',
      aiGenerated: 'boolean',
      confidence: 'number?',
      createdAt: 'date',
      updatedAt: 'date'
    },

    product: {
      id: 'string',
      sku: 'string',
      name: 'string',
      description: 'string?',
      categoryId: 'string',
      organizationId: 'string',
      unit: 'string',
      unitPrice: 'number?',
      currentStock: 'number',
      minStock: 'number',
      maxStock: 'number?',
      reorderPoint: 'number?',
      supplier: 'string?',
      specifications: 'object?',
      images: 'string[]',
      tags: 'string[]',
      createdBy: 'string?',
      createdAt: 'date',
      updatedAt: 'date'
    },

    aiSuggestion: {
      id: 'string',
      type: 'VENDOR_MATCH | PRICE_OPTIMIZATION | BULK_PURCHASE | ALTERNATIVE_PRODUCT | RISK_MITIGATION | WORKFLOW_IMPROVEMENT',
      organizationId: 'string',
      requestId: 'string?',
      threadId: 'string?',
      title: 'string',
      description: 'string',
      data: 'object',
      confidence: 'number',
      reasoning: 'string?',
      status: 'PENDING | ACCEPTED | REJECTED | EXPIRED',
      appliedAt: 'date?',
      appliedBy: 'string?',
      model: 'string?',
      version: 'string?',
      createdAt: 'date',
      updatedAt: 'date'
    }
  },

  // Form validation schemas
  validation: {
    organization: {
      name: { required: true, minLength: 2, maxLength: 100 },
      slug: { required: true, minLength: 2, maxLength: 50, pattern: /^[a-z0-9-]+$/ },
      description: { maxLength: 500 },
      website: { pattern: /^https?:\/\/.+$/ },
      logo: { pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i }
    },

    procurementRequest: {
      title: { required: true, minLength: 5, maxLength: 200 },
      description: { maxLength: 2000 },
      priority: { required: true, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
      neededBy: { type: 'date', minDate: new Date() },
      totalAmount: { type: 'number', min: 0 }
    },

    vendor: {
      name: { required: true, minLength: 2, maxLength: 100 },
      email: { type: 'email' },
      phone: { pattern: /^[+]?[\d\s()-]+$/ },
      website: { pattern: /^https?:\/\/.+$/ },
      rating: { type: 'number', min: 0, max: 5 }
    },

    product: {
      name: { required: true, minLength: 2, maxLength: 100 },
      sku: { required: true, minLength: 2, maxLength: 50 },
      unitPrice: { type: 'number', min: 0 },
      currentStock: { type: 'number', min: 0 },
      minStock: { type: 'number', min: 0 },
      maxStock: { type: 'number', min: 0 }
    }
  },

  // Error handling configuration
  errorHandling: {
    retryAttempts: 3,
    retryDelay: 1000,
    timeoutMs: 30000,
    showErrorNotifications: true,
    logErrors: process.env.NODE_ENV === 'development'
  },

  // Cache configuration
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // maximum number of cached items
    keys: {
      organizations: 'organizations',
      vendors: 'vendors',
      products: 'products',
      procurementRequests: 'procurement_requests',
      quotes: 'quotes'
    }
  }
};

module.exports = config;