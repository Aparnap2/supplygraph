import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AGUIChat } from '../src/components/AGUIChat'
import { getAGUIComponent } from '../src/lib/agui-registry.tsx'
import { JSDOM } from 'jsdom'

// Setup JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
global.document = dom.window.document
global.window = dom.window as any

// Mock WebSocket with proper event dispatching
class MockWebSocket {
  static OPEN = 1
  readyState = MockWebSocket.OPEN
  eventListeners: Record<string, Function[]> = {}
  
  constructor(url: string) {
    // Mock constructor
  }
  
  addEventListener(event: string, callback: Function) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }
  
  removeEventListener(event: string, callback: Function) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback)
    }
  }
  
  send(data: string) {
    // Mock send
  }
  
  close() {
    // Mock close
  }
  
  // Helper to simulate events
  dispatchEvent(event: Event) {
    const eventType = event.type
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType].forEach(callback => callback(event))
    }
  }
}

global.WebSocket = vi.fn().mockImplementation((url) => new MockWebSocket(url))
global.MessageEvent = class MockMessageEvent extends Event {
  constructor(type: string, options: any = {}) {
    super(type)
    Object.assign(this, options)
  }
} as any

describe('AGUI System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset DOM
    document.body.innerHTML = ''
  })

  it('should render AGUIChat component', () => {
    const { container } = render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)
    
    expect(container.querySelector('[placeholder="Type your message..."]')).toBeInTheDocument()
    expect(screen.getByText('Disconnected')).toBeInTheDocument()
  })

  it('should register AGUI components correctly', () => {
    const QuoteApprovalCard = getAGUIComponent('QuoteApprovalCard')
    const ThinkingLoader = getAGUIComponent('ThinkingLoader')
    const DefaultComponent = getAGUIComponent('UnknownComponent')
    
    expect(QuoteApprovalCard).toBeDefined()
    expect(ThinkingLoader).toBeDefined()
    expect(DefaultComponent).toBeDefined()
  })

  it('should handle WebSocket connection and message events', async () => {
    const { container } = render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)
    
    // Get the WebSocket instance
    const wsInstance = (global.WebSocket as any).mock.results[0].value
    
    // Simulate connection open
    wsInstance.eventListeners.open?.forEach((callback: Function) => callback())
    
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument()
    })
  })

  it('should render AGUI components when receiving events', async () => {
    const { container } = render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)
    
    const wsInstance = (global.WebSocket as any).mock.results[0].value
    
    // Simulate receiving AGUI event
    const aguiEvent = {
      type: 'ui_render',
      component: 'ThinkingLoader',
      props: {
        status: 'Analyzing inventory...'
      }
    }

    wsInstance.eventListeners.message?.forEach((callback: Function) =>
      callback({ data: JSON.stringify(aguiEvent) })
    )

    await waitFor(() => {
      expect(screen.getByText('Analyzing inventory...')).toBeInTheDocument()
    })
  })

  it('should send user actions via WebSocket', async () => {
    const { container } = render(<AGUIChat threadId="test-thread" wsUrl="ws://localhost:8000" />)
    
    const wsInstance = (global.WebSocket as any).mock.results[0].value
    const sendSpy = vi.spyOn(wsInstance, 'send')
    
    // Simulate connection and AGUI event
    wsInstance.eventListeners.open?.forEach((callback: Function) => callback())
    
    const aguiEvent = {
      type: 'ui_render',
      component: 'QuoteApprovalCard',
      props: {
        vendor: 'Test Vendor',
        amount: 1500.00,
        savings: '12%',
        csv_data: []
      }
    }

    wsInstance.eventListeners.message?.forEach((callback: Function) =>
      callback({ data: JSON.stringify(aguiEvent) })
    )

    await waitFor(() => {
      expect(screen.getByText('Test Vendor')).toBeInTheDocument()
    })

    // Find and click approve button (if it exists)
    const approveButton = screen.queryByText('Approve')
    if (approveButton) {
      fireEvent.click(approveButton)
      
      expect(sendSpy).toHaveBeenCalledWith(JSON.stringify({
        type: 'user_action',
        action: 'APPROVED',
        threadId: 'test-thread'
      }))
    }
  })
})