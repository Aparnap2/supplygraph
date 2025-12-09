import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThinkingLoader } from '../../../packages/ui-components/src/components/ThinkingLoader'

describe('ThinkingLoader Component', () => {
  it('should render with default props', () => {
    render(<ThinkingLoader status="Loading..." />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should display different stages correctly', () => {
    const { rerender } = render(<ThinkingLoader status="Loading..." stage="parsing" />)
    expect(screen.getByText('Parsing your request...')).toBeInTheDocument()

    rerender(<ThinkingLoader status="Loading..." stage="analyzing" />)
    expect(screen.getByText('Analyzing requirements...')).toBeInTheDocument()

    rerender(<ThinkingLoader status="Loading..." stage="fetching" />)
    expect(screen.getByText('Fetching vendor quotes...')).toBeInTheDocument()

    rerender(<ThinkingLoader status="Loading..." stage="processing" />)
    expect(screen.getByText('Processing your data...')).toBeInTheDocument()
  })

  it('should display progress percentage and bar when progress is provided', () => {
    render(<ThinkingLoader status="Loading..." progress={45} />)

    expect(screen.getByText('45%')).toBeInTheDocument()

    const progressBar = document.querySelector('.h-full.bg-blue-500') as HTMLElement
    expect(progressBar).toHaveStyle({ width: '45%' })
  })

  it('should not display progress when progress is not provided', () => {
    render(<ThinkingLoader status="Loading..." />)

    expect(screen.queryByText('%')).not.toBeInTheDocument()
  })

  it('should render status text when provided', () => {
    render(<ThinkingLoader status="Analyzing inventory levels..." />)

    expect(screen.getByText('Analyzing inventory levels...')).toBeInTheDocument()
  })

  it('should have correct CSS classes and structure', () => {
    render(<ThinkingLoader status="Loading..." />)

    const container = screen.getByText('Loading...').closest('.flex.items-center.gap-3')
    expect(container).toHaveClass('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg')
  })

  it('should handle progress at boundaries', () => {
    const { rerender } = render(<ThinkingLoader status="Loading..." progress={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()

    rerender(<ThinkingLoader status="Loading..." progress={100} />)
    expect(screen.getByText('100%')).toBeInTheDocument()

    const progressBar = document.querySelector('.h-full.bg-blue-500') as HTMLElement
    expect(progressBar).toHaveStyle({ width: '100%' })
  })
})