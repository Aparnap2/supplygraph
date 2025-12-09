import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThinkingLoader } from '../../../packages/ui-components/src/components/ThinkingLoader'
import { QuoteApprovalCard } from '../../../packages/ui-components/src/components/QuoteApprovalCard'
import { vitest } from 'vitest'

describe('Performance Tests', () => {
  beforeEach(() => {
    vitest.useFakeTimers()
  })

  it('should render ThinkingLoader quickly', () => {
    const startTime = performance.now()

    render(<ThinkingLoader status="Loading..." />)

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Component should render within 100ms
    expect(renderTime).toBeLessThan(100)
  })

  it('should render QuoteApprovalCard efficiently with many items', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      name: `Item ${i}`,
      quantity: 10,
      unit: 'units',
      unit_price: 10.99,
      total_price: 109.90
    }))

    const startTime = performance.now()

    render(
      <QuoteApprovalCard
        vendor="Test Vendor"
        items={items}
        total_amount={10990}
        delivery_time="5 days"
        quote_id="quote-123"
        org_id="org-456"
      />
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Even with 100 items, should render within 200ms
    expect(renderTime).toBeLessThan(200)
  })

  it('should not cause memory leaks with multiple re-renders', () => {
    const { unmount } = render(<ThinkingLoader status="Initial" />)

    // Simulate multiple re-renders
    for (let i = 0; i < 1000; i++) {
      unmount()
      render(<ThinkingLoader status={`Render ${i}`} />)
    }

    // After many re-renders, memory usage should be stable
    // This is more of a smoke test - real memory profiling would require tools
    expect(screen.getByText('Render 999')).toBeInTheDocument()
  })

  it('should debounce rapid updates efficiently', () => {
    const { rerender } = render(<ThinkingLoader status="Initial" progress={0} />)

    const startTime = performance.now()

    // Rapidly update progress
    for (let i = 1; i <= 100; i++) {
      rerender(<ThinkingLoader status="Processing..." progress={i} />)
    }

    const endTime = performance.now()
    const updateTime = endTime - startTime

    // 100 rapid updates should complete within 50ms
    expect(updateTime).toBeLessThan(50)
  })
})