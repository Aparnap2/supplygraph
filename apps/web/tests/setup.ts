import { vi } from 'vitest'
import { config } from '@tanstack/react-router'
import { JSDOM } from 'jsdom'

// Setup JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
})

// Set global variables
global.document = dom.window.document
global.window = dom.window as any
global.HTMLElement = dom.window.HTMLElement
global.HTMLAnchorElement = dom.window.HTMLAnchorElement
global.HTMLButtonElement = dom.window.HTMLButtonElement
global.HTMLDivElement = dom.window.HTMLDivElement
global.HTMLFormElement = dom.window.HTMLFormElement
global.HTMLInputElement = dom.window.HTMLInputElement
global.HTMLLabelElement = dom.window.HTMLLabelElement
global.HTMLSpanElement = dom.window.HTMLSpanElement

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock WebSocket
class MockWebSocket {
  static OPEN = 1
  static CONNECTING = 0
  static CLOSING = 2
  static CLOSED = 3

  readyState = MockWebSocket.OPEN
  eventListeners: Record<string, Function[]> = {}

  constructor(url: string) {
    // Store constructor calls for testing
    MockWebSocket.instances.push(this)
    MockWebSocket.lastUrl = url
  }

  static instances: MockWebSocket[] = []
  static lastUrl?: string

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
    this.lastSentData = data
  }

  lastSentData?: string

  close() {
    this.readyState = MockWebSocket.CLOSED
  }

  // Helper to simulate events
  dispatchEvent(event: Event) {
    const eventType = event.type
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType].forEach(callback => callback(event))
    }
  }

  // Helper to simulate connection open
  simulateOpen() {
    this.readyState = MockWebSocket.OPEN
    const event = new Event('open')
    this.dispatchEvent(event)
  }

  // Helper to simulate receiving a message
  simulateMessage(data: any) {
    const event = new MessageEvent('message', { data: JSON.stringify(data) })
    this.dispatchEvent(event)
  }
}

global.WebSocket = vi.fn().mockImplementation((url) => new MockWebSocket(url)) as any
global.MessageEvent = class MockMessageEvent extends Event {
  constructor(type: string, options: any = {}) {
    super(type)
    Object.assign(this, options)
  }
} as any

// Export MockWebSocket for tests
export { MockWebSocket }

// Mock fetch
global.fetch = vi.fn()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
})

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn(() => 'mock-url'),
})

// Mock URL.revokeObjectURL
Object.defineProperty(URL, 'revokeObjectURL', {
  value: vi.fn(),
})