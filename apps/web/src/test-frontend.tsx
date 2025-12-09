import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

function TestFrontend() {
  const [aiEngineStatus, setAiEngineStatus] = useState<string>('Testing...')
  const [workflowResult, setWorkflowResult] = useState<any>(null)
  const [webSocketStatus, setWebSocketStatus] = useState<string>('Disconnected')

  // Test AI Engine connection
  useEffect(() => {
    const testAIEngine = async () => {
      try {
        const response = await fetch('http://localhost:8000/health')
        if (response.ok) {
          const data = await response.json()
          setAiEngineStatus(`✅ Connected: ${JSON.stringify(data.details)}`)
        } else {
          setAiEngineStatus(`❌ Error: ${response.status}`)
        }
      } catch (error) {
        setAiEngineStatus(`❌ Failed: ${error}`)
      }
    }

    testAIEngine()
  }, [])

  // Test procurement workflow
  const testWorkflow = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/test/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'I need to purchase 25 laptops for my team',
          org_id: 'test-org-123',
          user_id: 'test-user-456'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setWorkflowResult(data)
      } else {
        setWorkflowResult({ error: `HTTP ${response.status}` })
      }
    } catch (error) {
      setWorkflowResult({ error: error.message })
    }
  }

  // Test WebSocket connection
  const testWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8000/ws')

      ws.onopen = () => {
        setWebSocketStatus('✅ Connected')

        // Send test message
        ws.send(JSON.stringify({
          type: 'test_connection',
          data: { message: 'Hello from frontend' }
        }))
      }

      ws.onmessage = (event) => {
        console.log('WebSocket message:', event.data)
      }

      ws.onerror = (error) => {
        setWebSocketStatus(`❌ Error: ${error}`)
      }

      ws.onclose = () => {
        setWebSocketStatus('Disconnected')
      }

      // Close after 5 seconds
      setTimeout(() => {
        ws.close()
      }, 5000)

    } catch (error) {
      setWebSocketStatus(`❌ Failed: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SupplyGraph Frontend Testing</h1>

        {/* AI Engine Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">AI Engine Connection</h2>
          <p className="text-sm font-mono bg-gray-100 p-3 rounded">
            {aiEngineStatus}
          </p>
        </div>

        {/* Workflow Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Procurement Workflow Test</h2>
          <button
            onClick={testWorkflow}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Start Workflow
          </button>

          {workflowResult && (
            <div className="bg-gray-100 p-4 rounded font-mono text-sm">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(workflowResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* WebSocket Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">WebSocket Connection</h2>
          <button
            onClick={testWebSocket}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mb-4"
          >
            Test WebSocket
          </button>

          <p className="text-sm font-mono bg-gray-100 p-3 rounded">
            Status: {webSocketStatus}
          </p>
        </div>

        {/* AGUI Component Examples */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">AGUI Component Examples</h2>

          {/* Thinking Loader */}
          <div className="border rounded p-4 mb-4">
            <h3 className="font-semibold mb-2">Thinking Loader Component</h3>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Analyzing your request...</span>
            </div>
          </div>

          {/* Quote Approval Card */}
          <div className="border rounded p-4 mb-4">
            <h3 className="font-semibold mb-2">Quote Approval Card</h3>
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">TechCorp</h4>
                  <p className="text-sm text-gray-600">Vendor Quote</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  Best Price
                </span>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span>Laptop x50</span>
                  <span>$60,000</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>$60,000</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                  Approve
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                  Reject
                </button>
              </div>
            </div>
          </div>

          {/* Inventory Check */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Inventory Check Component</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="text-sm">Laptop</span>
                <div className="text-right">
                  <span className="text-sm font-semibold">Current: 0</span>
                  <span className="text-sm text-red-600 ml-2">Need: 50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/test-frontend')({
  component: TestFrontend,
})