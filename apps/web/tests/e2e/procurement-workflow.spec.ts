import { test, expect } from '@playwright/test'

test.describe('Procurement Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to procurement page
    await page.goto('/procurement')
  })

  test('should display procurement chat interface', async ({ page }) => {
    await expect(page.getByPlaceholder('Type your message...')).toBeVisible()
    await expect(page.getByText('SupplyGraph AI Assistant')).toBeVisible()
  })

  test('should handle user message submission', async ({ page }) => {
    const message = 'I need to order office supplies for our team'

    await page.getByPlaceholder('Type your message...').fill(message)
    await page.getByRole('button', { name: /send/i }).click()

    // Verify message appears in chat
    await expect(page.getByText(message)).toBeVisible()
  })

  test('should display ThinkingLoader during processing', async ({ page }) => {
    const message = 'Find quotes for office chairs'

    // Mock WebSocket for testing
    await page.evaluate(() => {
      const ws = new WebSocket('ws://localhost:8000/ws/test-thread')
      ws.send = () => {}
      ws.close = () => {}
    })

    await page.getByPlaceholder('Type your message...').fill(message)
    await page.getByRole('button', { name: /send/i }).click()

    // Simulate ThinkingLoader display
    await page.evaluate(() => {
      const event = new CustomEvent('ws-message', {
        detail: JSON.stringify({
          type: 'ui_render',
          component: 'ThinkingLoader',
          props: {
            status: 'Fetching vendor quotes...',
            stage: 'fetching',
            progress: 25
          }
        })
      })
      window.dispatchEvent(event)
    })

    await expect(page.getByText('Fetching vendor quotes...')).toBeVisible()
    await expect(page.getByText('25%')).toBeVisible()
  })

  test('should display QuoteApprovalCard and handle interactions', async ({ page }) => {
    // Simulate receiving a quote approval card
    await page.evaluate(() => {
      const event = new CustomEvent('ws-message', {
        detail: JSON.stringify({
          type: 'ui_render',
          component: 'QuoteApprovalCard',
          props: {
            vendor: 'Office Supply Co',
            items: [
              {
                name: 'Ergonomic Office Chair',
                quantity: 5,
                unit: 'units',
                unit_price: 299.99,
                total_price: 1499.95
              }
            ],
            total_amount: 1499.95,
            savings: '10%',
            delivery_time: '3-5 business days',
            quote_id: 'quote-123',
            org_id: 'org-456'
          }
        })
      })
      window.dispatchEvent(event)
    })

    await expect(page.getByText('Office Supply Co')).toBeVisible()
    await expect(page.getByText('$1,499.95')).toBeVisible()
    await expect(page.getByText('Save 10% compared to other quotes')).toBeVisible()

    // Test approve button
    await page.getByRole('button', { name: /Approve Quote/i }).click()

    // Verify API call was made (in real test, this would make actual API call)
    await expect(page.getByText('Processing...')).toBeVisible()
  })

  test('should handle multi-organization switching', async ({ page }) => {
    // Mock authentication with multiple organizations
    await page.addInitScript(() => {
      localStorage.setItem('user_session', JSON.stringify({
        id: 'user-123',
        email: 'test@example.com',
        organizations: [
          { id: 'org-1', name: 'Acme Corp', role: 'admin' },
          { id: 'org-2', name: 'Beta Inc', role: 'member' }
        ],
        currentOrganization: { id: 'org-1', name: 'Acme Corp', role: 'admin' }
      }))
    })

    await page.reload()

    // Find and click organization selector
    await page.getByLabel(/Organization/i).click()
    await page.getByText('Beta Inc').click()

    // Verify organization was switched
    await expect(page.getByText('Beta Inc')).toBeVisible()
  })
})