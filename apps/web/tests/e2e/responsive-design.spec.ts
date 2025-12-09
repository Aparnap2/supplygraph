import { test, expect, devices } from '@playwright/test'

const devicesToTest = [
  {
    name: 'Desktop',
    device: devices['Desktop Chrome']
  },
  {
    name: 'Tablet',
    device: devices['iPad Pro']
  },
  {
    name: 'Mobile',
    device: devices['iPhone 12']
  }
]

devicesToTest.forEach(({ name, device }) => {
  test.describe(`${name} Responsive Design`, () => {
    test.use({ ...device })

    test('should display correctly on different screen sizes', async ({ page }) => {
      await page.goto('/procurement')

      // Test main elements are visible
      await expect(page.getByPlaceholder('Type your message...')).toBeVisible()

      if (name === 'Mobile') {
        // On mobile, menu should be collapsed
        await expect(page.getByLabel(/menu/i)).toBeVisible()

        // Test mobile menu toggle
        await page.getByLabel(/menu/i).click()
        await expect(page.getByText(/Dashboard/i)).toBeVisible()
      } else {
        // On desktop/tablet, sidebar should be visible
        await expect(page.getByText(/Dashboard/i)).toBeVisible()
      }
    })

    test('QuoteApprovalCard should adapt to screen size', async ({ page }) => {
      await page.goto('/procurement')

      // Inject QuoteApprovalCard
      await page.evaluate(() => {
        const event = new CustomEvent('ws-message', {
          detail: JSON.stringify({
            type: 'ui_render',
            component: 'QuoteApprovalCard',
            props: {
              vendor: 'Test Vendor',
              items: [],
              total_amount: 500,
              savings: '5%',
              delivery_time: '2 days',
              quote_id: 'quote-123',
              org_id: 'org-456'
            }
          })
        })
        window.dispatchEvent(event)
      })

      const card = page.locator('.bg-white.border.border-gray-200.rounded-lg')
      await expect(card).toBeVisible()

      if (name === 'Mobile') {
        // On mobile, buttons should stack vertically
        const buttons = card.locator('button')
        await expect(buttons).toHaveCount(2)

        const firstButton = buttons.first()
        const boundingBox = await firstButton.boundingBox()
        if (boundingBox) {
          expect(boundingBox.width).toBeLessThan(400) // Should be full width on mobile
        }
      }
    })
  })
})