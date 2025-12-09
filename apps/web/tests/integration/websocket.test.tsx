import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AGUIChat } from '../../src/components/AGUIChat'
import { MockWebSocket } from '../setup'

describe('WebSocket Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    MockWebSocket.instances = []
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up any open connections
    MockWebSocket.instances.forEach(ws => ws.close())
  })

  it('should establish WebSocket connection on mount', () => {
    render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)

    expect(MockWebSocket.instances).toHaveLength(1)
    expect(MockWebSocket.lastUrl).toBe('ws://localhost:8000')
  })

  it('should update connection status when WebSocket opens', async () => {
    const { container } = render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)

    const ws = MockWebSocket.instances[0]

    // Initially disconnected
    expect(screen.getByText('Disconnected')).toBeInTheDocument()

    // Simulate connection open
    ws.simulateOpen()

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument()
    })
  })

  it('should render components when receiving AGUI events', async () => {
    render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)

    const ws = MockWebSocket.instances[0]
    ws.simulateOpen()

    // Send ThinkingLoader event
    ws.simulateMessage({
      type: 'ui_render',
      component: 'ThinkingLoader',
      props: {
        status: 'Processing your request...',
        stage: 'analyzing',
        progress: 50
      }
    })

    await waitFor(() => {
      expect(screen.getByText('Processing your request...')).toBeInTheDocument()
      expect(screen.getByText('50%')).toBeInTheDocument()
    })
  })

  it('should handle multiple AGUI components in sequence', async () => {
    render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)

    const ws = MockWebSocket.instances[0]
    ws.simulateOpen()

    // Send ThinkingLoader
    ws.simulateMessage({
      type: 'ui_render',
      component: 'ThinkingLoader',
      props: {
        status: 'Analyzing requirements...',
        stage: 'analyzing'
      }
    })

    await waitFor(() => {
      expect(screen.getByText('Analyzing requirements...')).toBeInTheDocument()
    })

    // Send QuoteApprovalCard
    ws.simulateMessage({
      type: 'ui_render',
      component: 'QuoteApprovalCard',
      props: {
        vendor: 'Office Supply Co',
        items: [],
        total_amount: 1000,
        delivery_time: '3 days',
        quote_id: 'quote-456',
        org_id: 'org-789'
      }
    })

    await waitFor(() => {
      expect(screen.getByText('Office Supply Co')).toBeInTheDocument()
      expect(screen.getByText('$1,000.00')).toBeInTheDocument()
    })
  })

  it('should send user actions when buttons are clicked', async () => {
    const user = userEvent.setup()
    render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)

    const ws = MockWebSocket.instances[0]
    ws.simulateOpen()

    // Send QuoteApprovalCard with buttons
    ws.simulateMessage({
      type: 'ui_render',
      component: 'QuoteApprovalCard',
      props: {
        vendor: 'Test Vendor',
        items: [],
        total_amount: 500,
        quote_id: 'quote-123',
        org_id: 'org-456'
      }
    })

    await waitFor(() => {
      expect(screen.getByText('Test Vendor')).toBeInTheDocument()
    })

    // Click approve button
    const approveButton = screen.getByRole('button', { name: /Approve Quote/i })
    await user.click(approveButton)

    // Verify WebSocket message was sent
    expect(ws.lastSentData).toBe(JSON.stringify({
      type: 'user_action',
      action: 'APPROVED',
      threadId: 'test-thread'
    }))
  })

  it('should handle WebSocket errors gracefully', async () => {
    render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)

    const ws = MockWebSocket.instances[0]

    // Simulate WebSocket error
    ws.dispatchEvent(new Event('error'))

    await waitFor(() => {
      expect(screen.getByText('Connection error')).toBeInTheDocument()
    })
  })

  it('should attempt to reconnect on WebSocket close', async () => {
    render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)

    const ws = MockWebSocket.instances[0]
    const initialCount = MockWebSocket.instances.length

    // Simulate connection close
    ws.close()
    ws.dispatchEvent(new CloseEvent('close'))

    // Check if a new WebSocket instance is created for reconnection
    await waitFor(() => {
      expect(MockWebSocket.instances.length).toBeGreaterThan(initialCount)
    })
  })

  it('should handle malformed messages', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)

    const ws = MockWebSocket.instances[0]
    ws.simulateOpen()

    // Send malformed JSON
    ws.dispatchEvent(new MessageEvent('message', { data: 'invalid json{' }))

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to parse WebSocket message:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })
})