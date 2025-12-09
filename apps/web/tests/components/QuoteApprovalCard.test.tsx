import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuoteApprovalCard } from '../../../packages/ui-components/src/components/QuoteApprovalCard'

const mockQuoteProps = {
  vendor: 'Test Vendor Corp',
  items: [
    {
      name: 'Office Paper A4',
      quantity: 1000,
      unit: 'sheets',
      unit_price: 0.05,
      total_price: 50.00
    },
    {
      name: 'Ink Cartridges Black',
      quantity: 10,
      unit: 'units',
      unit_price: 25.00,
      total_price: 250.00
    }
  ],
  total_amount: 300.00,
  savings: '15%',
  delivery_time: '2-3 business days',
  quote_id: 'quote-123',
  org_id: 'org-456',
  valid_until: '2024-12-31T23:59:59Z'
}

describe('QuoteApprovalCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render quote information correctly', () => {
    render(<QuoteApprovalCard {...mockQuoteProps} />)

    expect(screen.getByText('Quote for Approval')).toBeInTheDocument()
    expect(screen.getByText('Vendor: Test Vendor Corp')).toBeInTheDocument()
    expect(screen.getByText('$300.00')).toBeInTheDocument()
    expect(screen.getByText('Save 15% compared to other quotes')).toBeInTheDocument()
  })

  it('should display items list correctly', () => {
    render(<QuoteApprovalCard {...mockQuoteProps} />)

    expect(screen.getByText('Items (2)')).toBeInTheDocument()
    expect(screen.getByText('Office Paper A4')).toBeInTheDocument()
    expect(screen.getByText('1000 sheets')).toBeInTheDocument()
    expect(screen.getByText('$0.05 each')).toBeInTheDocument()
    expect(screen.getByText('$50.00 total')).toBeInTheDocument()
    expect(screen.getByText('Ink Cartridges Black')).toBeInTheDocument()
    expect(screen.getByText('10 units')).toBeInTheDocument()
    expect(screen.getByText('$25.00 each')).toBeInTheDocument()
    expect(screen.getByText('$250.00 total')).toBeInTheDocument()
  })

  it('should display delivery and validity information', () => {
    render(<QuoteApprovalCard {...mockQuoteProps} />)

    expect(screen.getByText('Delivery: 2-3 business days')).toBeInTheDocument()
    expect(screen.getByText('Valid until: 12/31/2024')).toBeInTheDocument()
  })

  it('should handle approve button click', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })

    render(<QuoteApprovalCard {...mockQuoteProps} />)

    const approveButton = screen.getByRole('button', { name: /Approve Quote/i })
    await user.click(approveButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/workflow/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: 'quote-123',
          action: 'approve',
          data: {
            approved_quote_id: 'quote-123',
            org_id: 'org-456',
          }
        })
      })
    })
  })

  it('should handle reject button click', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })

    render(<QuoteApprovalCard {...mockQuoteProps} />)

    const rejectButton = screen.getByRole('button', { name: /Reject Quote/i })
    await user.click(rejectButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/workflow/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: 'quote-123',
          action: 'reject',
          data: {
            rejected_quote_id: 'quote-123',
            reason: 'User rejected'
          }
        })
      })
    })
  })

  it('should show processing state while API call is in progress', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<QuoteApprovalCard {...mockQuoteProps} />)

    const approveButton = screen.getByRole('button', { name: /Approve Quote/i })
    await user.click(approveButton)

    expect(screen.getByText('Processing...')).toBeInTheDocument()
    expect(approveButton).toBeDisabled()
  })

  it('should handle API error gracefully', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

    render(<QuoteApprovalCard {...mockQuoteProps} />)

    const approveButton = screen.getByRole('button', { name: /Approve Quote/i })
    await user.click(approveButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error approving quote:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('should format currency correctly', () => {
    render(<QuoteApprovalCard {...mockQuoteProps} />)

    expect(screen.getByText('$300.00')).toBeInTheDocument()
    expect(screen.getByText('$0.05 each')).toBeInTheDocument()
    expect(screen.getByText('$50.00 total')).toBeInTheDocument()
    expect(screen.getByText('$25.00 each')).toBeInTheDocument()
    expect(screen.getByText('$250.00 total')).toBeInTheDocument()
  })

  it('should render without optional fields', () => {
    const propsWithoutOptional = {
      ...mockQuoteProps,
      savings: undefined,
      valid_until: undefined
    }

    render(<QuoteApprovalCard {...propsWithoutOptional} />)

    expect(screen.queryByText(/Save/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Valid until/)).not.toBeInTheDocument()
  })
})