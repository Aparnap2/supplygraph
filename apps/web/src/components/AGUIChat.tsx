import React, { useState, useEffect, useRef } from 'react'
import { getAGUIComponent, AGUIEvent } from '../lib/agui-registry.tsx'

interface Message {
  id: string
  type: 'text' | 'ui_render'
  content?: string
  component?: string
  props?: Record<string, any>
  timestamp: Date
}

interface AGUIChatProps {
  threadId: string
  wsUrl: string
}

export function AGUIChat({ threadId, wsUrl }: AGUIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket(`${wsUrl}/ws/${threadId}`)
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
      console.log('AGUI WebSocket connected')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // Handle different message types from backend
        if (data.type === 'ui_component' && data.data) {
          // Backend sends ui_component with nested data
          const newMessage: Message = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'ui_render',
            component: data.data.name, // LangGraph UI component name
            props: data.data.props,    // Component props
            timestamp: new Date()
          }
          setMessages(prev => [...prev, newMessage])
        } else if (data.type === 'message' && data.data) {
          // Regular text message
          const newMessage: Message = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'text',
            content: data.data.content,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, newMessage])
        } else if (data.type === 'connection_established') {
          // Connection confirmation
          console.log('WebSocket connection established for thread:', data.thread_id)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      console.log('AGUI WebSocket disconnected')
    }

    ws.onerror = (error) => {
      console.error('AGUI WebSocket error:', error)
    }

    return () => {
      ws.close()
    }
  }, [threadId, wsUrl])

  const handleUserAction = (action: string, data?: Record<string, any>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const userAction: AGUIEvent = {
        type: 'user_action',
        action,
        threadId,
        ...data
      }
      wsRef.current.send(JSON.stringify(userAction))
    }
  }

  const renderMessage = (message: Message) => {
    if (message.type === 'text' && message.content) {
      return (
        <div className="p-3 bg-blue-50 rounded-lg mb-2">
          <p className="text-sm text-gray-800">{message.content}</p>
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
      )
    }

    if (message.type === 'ui_render' && message.component && message.props) {
      const Component = getAGUIComponent(message.component)
      return (
        <div className="mb-4" key={message.id}>
          <Component 
            {...message.props} 
            onAction={(action: string) => handleUserAction(action, message.props)}
          />
          <span className="text-xs text-gray-500 block mt-2">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
      )
    }

    return null
  }

  return (
    <div className="flex flex-col h-full">
      {/* Connection Status */}
      <div className="p-2 border-b">
        <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(message => (
          <div key={message.id}>
            {renderMessage(message)}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 border rounded-lg"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              const newMessage: Message = {
                id: Math.random().toString(36).substr(2, 9),
                type: 'text',
                content: e.currentTarget.value,
                timestamp: new Date()
              }
              setMessages(prev => [...prev, newMessage])
              
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                  type: 'user_message',
                  content: e.currentTarget.value,
                  threadId
                }))
              }
              
              e.currentTarget.value = ''
            }
          }}
        />
      </div>
    </div>
  )
}