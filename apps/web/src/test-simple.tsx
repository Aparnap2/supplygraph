import { createFileRoute } from '@tanstack/react-router'

function TestSimple() {
  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/')
      const data = await response.json()
      alert(`AI Engine Status: ${data.status}`)
    } catch (error) {
      alert(`Error: ${error}`)
    }
  }

  const testWorkflow = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/test/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'I need to purchase 10 laptops',
          org_id: 'test-org-123',
          user_id: 'test-user-456'
        })
      })
      const data = await response.json()
      alert(`Workflow Result: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      alert(`Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SupplyGraph Test Page</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Backend Connection Test</h2>
          <p className="mb-4">Test your connection to the AI Engine backend.</p>

          <div className="space-x-4">
            <button
              onClick={testConnection}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Test AI Engine Health
            </button>

            <button
              onClick={testWorkflow}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Test Procurement Workflow
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Test Instructions</h2>
          <ol className="list-decimal space-y-2">
            <li>Click "Test AI Engine Health" - should show "healthy"</li>
            <li>Click "Test Procurement Workflow" - should show workflow started</li>
            <li>Check browser console for additional information</li>
            <li>The AI Engine should be running on port 8000</li>
            <li>The frontend should be running on port 3000</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/test-simple')({
  component: TestSimple,
})