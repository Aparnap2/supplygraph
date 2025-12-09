import React, { useState, useEffect } from 'react'
import { AGUIChat } from '../components/AGUIChat'
import { CSVUploadModal } from '../components/CSVUploadModal'
import { createFileRoute } from '@tanstack/react-router'
import {
  FileSpreadsheet,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Package,
  Upload,
  DollarSign,
  ShoppingCart,
  Truck,
  FileText,
  BarChart3,
  ChevronRight,
  Star,
  Zap,
  Target,
  Award,
  Activity,
  Loader2
} from 'lucide-react'
import {
  getDashboardStats,
  getAIInsights,
  getProcurementRequests,
  uploadCSV,
  wsService,
  type DashboardStats,
  type AIInsight,
  type ProcurementRequest
} from '../lib/api'

// Enhanced mock data for demonstration
const mockRequests = [
  {
    id: '1',
    title: 'Office Laptops Q1 2024',
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: new Date('2024-01-15'),
    createdBy: 'John Doe',
    budget: 75000,
    description: '50 Dell Latitude laptops for new hires',
    category: 'IT Equipment',
    quotes: [
      { vendor: 'TechSource', amount: 72000, delivery: '2 weeks', rating: 4.5 },
      { vendor: 'OfficeSupply Co', amount: 73500, delivery: '1 week', rating: 4.2 }
    ],
    aiRecommendation: {
      vendor: 'TechSource',
      savings: '$3,000 (4%)',
      reasoning: 'Best value with good delivery time and high vendor rating'
    }
  },
  {
    id: '2',
    title: 'Warehouse Safety Equipment',
    status: 'NEGOTIATING',
    priority: 'CRITICAL',
    createdAt: new Date('2024-01-14'),
    createdBy: 'Jane Smith',
    budget: 25000,
    description: 'Safety helmets, gloves, and equipment',
    category: 'Safety',
    approvedQuotes: [
      { vendor: 'SafetyPro Inc', amount: 22500, savings: '10%', delivery: '3 days' },
      { vendor: 'Industrial Supply Co', amount: 23000, savings: '8%', delivery: '1 week' }
    ],
    negotiationStage: 'Final Review',
    nextAction: ' awaiting approval from Safety Manager'
  },
  {
    id: '3',
    title: 'Marketing Materials',
    status: 'APPROVED',
    priority: 'MEDIUM',
    createdAt: new Date('2024-01-13'),
    createdBy: 'Mike Johnson',
    budget: 15000,
    description: 'Brochures, banners, and promotional items',
    category: 'Marketing',
    approvedQuote: {
      vendor: 'PrintWorks',
      amount: 13500,
      savings: '10%',
      delivery: '5 days'
    },
    approvedBy: 'Sarah Chen',
    approvedAt: new Date('2024-01-14')
  },
  {
    id: '4',
    title: 'IT Infrastructure Upgrade',
    status: 'PAID',
    priority: 'HIGH',
    createdAt: new Date('2024-01-10'),
    createdBy: 'Sarah Wilson',
    budget: 100000,
    description: 'Server upgrade and cloud migration',
    category: 'IT Infrastructure',
    approvedQuote: {
      vendor: 'TechSolutions Pro',
      amount: 95000,
      savings: '5%',
      delivery: '2 weeks'
    },
    paidAt: new Date('2024-01-12'),
    invoiceId: 'INV-2024-0112'
  }
]

const mockVendors = [
  { id: 'v1', name: 'TechSource', category: 'IT Equipment', rating: 4.5, orders: 45, totalSpend: 250000 },
  { id: 'v2', name: 'SafetyPro Inc', category: 'Safety Equipment', rating: 4.8, orders: 23, totalSpend: 87000 },
  { id: 'v3', name: 'PrintWorks', category: 'Printing', rating: 4.2, orders: 67, totalSpend: 123000 },
  { id: 'v4', name: 'OfficeSupply Co', category: 'General', rating: 4.0, orders: 89, totalSpend: 198000 }
]

export const Route = createFileRoute('/')({
  component: ProcurementDashboard,
})

function ProcurementDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'vendors' | 'analytics' | 'chat'>('overview')
  const [selectedRequest, setSelectedRequest] = useState<ProcurementRequest | null>(null)
  const [showCSVModal, setShowCSVModal] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([])
  const [requests, setRequests] = useState<ProcurementRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const threadId = selectedRequest ? `req-${selectedRequest.id}` : 'new-procurement'

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Load dashboard stats
        const statsResponse = await getDashboardStats()
        if (statsResponse.success && statsResponse.data) {
          setDashboardStats(statsResponse.data)
        }

        // Load AI insights
        const insightsResponse = await getAIInsights()
        if (insightsResponse.success && insightsResponse.data) {
          setAIInsights(insightsResponse.data)
        }

        // Load requests
        const requestsResponse = await getProcurementRequests()
        if (requestsResponse.success && requestsResponse.data) {
          setRequests(requestsResponse.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Setup WebSocket connection
    wsService.connect().catch(console.error)

    // Listen for real-time updates
    wsService.on('request_update', (data: ProcurementRequest) => {
      setRequests(prev =>
        prev.map(req => req.id === data.id ? data : req)
      )
    })

    wsService.on('new_request', (data: ProcurementRequest) => {
      setRequests(prev => [data, ...prev])
    })

    // Cleanup
    return () => {
      wsService.disconnect()
    }
  }, [])

  // Handle CSV upload
  const handleCSVUpload = async (file: File) => {
    try {
      const fileContent = await file.text()
      const result = await uploadCSV(fileContent, file.name, file.type)

      if (result.success && result.data) {
        // Refresh requests list
        const requestsResponse = await getProcurementRequests()
        if (requestsResponse.success && requestsResponse.data) {
          setRequests(requestsResponse.data)
        }
        return result.data
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'NEGOTIATING':
        return <AlertCircle className="h-4 w-4" />
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50'
      case 'NEGOTIATING':
        return 'text-blue-600 bg-blue-50'
      case 'APPROVED':
        return 'text-green-600 bg-green-50'
      case 'PAID':
        return 'text-green-700 bg-green-100'
      case 'REJECTED':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-700 bg-red-50 border-red-200'
      case 'HIGH':
        return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'MEDIUM':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      case 'LOW':
        return 'text-gray-700 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (activeTab === 'chat' && selectedRequest) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedRequest.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {selectedRequest.description}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                  {getStatusIcon(selectedRequest.status)}
                  {selectedRequest.status}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedRequest.priority)}`}>
                  {selectedRequest.priority} PRIORITY
                </span>
                <span className="text-sm text-gray-500">
                  Budget: {formatCurrency(selectedRequest.budget)}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('overview')
                setSelectedRequest(null)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
        </header>

        <main className="flex-1">
          <AGUIChat threadId={threadId} wsUrl="ws://localhost:8000/ws" />
        </main>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading SupplyGraph...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                SupplyGraph
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                AI-Powered Procurement Automation Platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCSVModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Upload CSV/Excel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="h-4 w-4" />
                New Request
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'requests', label: 'Requests', icon: FileText },
              { id: 'vendors', label: 'Vendors', icon: Truck },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="px-8 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {dashboardStats?.totalRequests || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      +{dashboardStats?.requestsThisWeek || 0} this week
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Savings</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      ${((dashboardStats?.totalSavings || 0) / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {dashboardStats?.averageSavings || 0}% avg savings
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {dashboardStats?.inProgress || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Array.isArray(requests) ? requests.filter(r => r.status === 'PENDING').length : 0} pending approval
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">
                      {dashboardStats?.activeVendors || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">4.6 avg rating</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.length > 0 ? (
                  Array.isArray(aiInsights) ? aiInsights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="bg-white rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {insight.type === 'opportunity' && '🎯 '}
                        {insight.type === 'recommendation' && '💡 '}
                        {insight.type === 'alert' && '⚠️ '}
                        {insight.title}
                      </p>
                      <p className="text-xs text-gray-600">{insight.description}</p>
                      {insight.impact && (
                        <p className="text-xs text-blue-600 mt-1">Impact: {insight.impact}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Opportunity Alert</p>
                      <p className="text-xs text-gray-600">3 requests can be bundled for 15% additional savings</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Vendor Recommendation</p>
                      <p className="text-xs text-gray-600">TechSource offering 5% discount on bulk IT orders</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Approval Speed</p>
                      <p className="text-xs text-gray-600">Average approval time: 2.3 days (23% faster than last month)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Requests Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Procurement Requests</h2>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  View All <ChevronRight className="inline h-4 w-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Best Quote
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Savings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(requests) ? requests.slice(0, 5).map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.title}</div>
                            <div className="text-sm text-gray-500">{request.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(request.budget)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.bestQuote ? formatCurrency(request.bestQuote.amount) :
                           request.quotes && request.quotes.length > 0 ? formatCurrency(request.quotes[0].amount) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {request.bestQuote?.savings || request.aiRecommendation?.savings || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => {
                              setSelectedRequest(request)
                              setActiveTab('chat')
                            }}
                            className="text-blue-600 hover:text-blue-900 font-medium mr-2"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Procurement Requests</h2>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Filter
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Export
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(requests) ? requests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.title}</div>
                            <div className="text-sm text-gray-500">by {request.createdBy}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(request.budget)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => {
                              setSelectedRequest(request)
                              setActiveTab('chat')
                            }}
                            className="text-blue-600 hover:text-blue-900 font-medium mr-2"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Vendor Management</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Vendor
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                      <p className="text-sm text-gray-500">{vendor.category}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{vendor.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Orders</span>
                      <span className="font-medium">{vendor.orders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Spend</span>
                      <span className="font-medium">{formatCurrency(vendor.totalSpend)}</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Procurement Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Trend</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart visualization here</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart visualization here</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">89%</p>
                  <p className="text-sm text-gray-500">On-Time Delivery</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">12%</p>
                  <p className="text-sm text-gray-500">Average Savings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">2.3</p>
                  <p className="text-sm text-gray-500">Avg Approval Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">4.6</p>
                  <p className="text-sm text-gray-500">Vendor Rating</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSV Upload Modal */}
        <CSVUploadModal
          isOpen={showCSVModal}
          onClose={() => setShowCSVModal(false)}
          onUpload={handleCSVUpload}
          onSuccess={(requests) => {
            setShowCSVModal(false)
            setActiveTab('requests')
          }}
        />
      </main>
    </div>
  )
}