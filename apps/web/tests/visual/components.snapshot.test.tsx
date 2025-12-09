import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThinkingLoader } from '../../../packages/ui-components/src/components/ThinkingLoader'
import { QuoteApprovalCard } from '../../../packages/ui-components/src/components/QuoteApprovalCard'

describe('Visual Regression Tests', () => {
  it('ThinkingLoader matches snapshot', () => {
    const { container } = render(
      <ThinkingLoader
        status="Analyzing requirements..."
        stage="analyzing"
        progress={45}
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('ThinkingLoader matches snapshot for each stage', () => {
    const stages = ['parsing', 'analyzing', 'fetching', 'processing'] as const

    stages.forEach(stage => {
      const { container } = render(
        <ThinkingLoader
          status="Loading..."
          stage={stage}
          progress={50}
        />
      )

      expect(container).toMatchSnapshot(`ThinkingLoader-${stage}`)
    })
  })

  it('QuoteApprovalCard matches snapshot', () => {
    const props = {
      vendor: 'Office Supply Co',
      items: [
        {
          name: 'Ergonomic Office Chair',
          quantity: 5,
          unit: 'units',
          unit_price: 299.99,
          total_price: 1499.95
        },
        {
          name: 'Standing Desk Converter',
          quantity: 3,
          unit: 'units',
          unit_price: 199.99,
          total_price: 599.97
        }
      ],
      total_amount: 2099.92,
      savings: '15%',
      delivery_time: '3-5 business days',
      quote_id: 'quote-123',
      org_id: 'org-456',
      valid_until: '2024-12-31T23:59:59Z'
    }

    const { container } = render(<QuoteApprovalCard {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('QuoteApprovalCard in processing state matches snapshot', () => {
    const props = {
      vendor: 'Test Vendor',
      items: [{ name: 'Test Item', quantity: 1, unit: 'unit', unit_price: 100, total_price: 100 }],
      total_amount: 100,
      delivery_time: '2 days',
      quote_id: 'quote-123',
      org_id: 'org-456'
    }

    const { container } = render(<QuoteApprovalCard {...props} />)

    // Simulate button click to show processing state
    const approveButton = screen.getByRole('button', { name: /Approve Quote/i })
    approveButton.click()

    expect(container).toMatchSnapshot('QuoteApprovalCard-processing')
  })
})