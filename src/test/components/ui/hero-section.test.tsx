import React from 'react'
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils'
import { HeroSection } from '@/components/ui/hero-section'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('HeroSection', () => {
  it('should render main headline and content', () => {
    render(<HeroSection />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /From Developer to \$100K Digital Product Creator in 12 Months/i
    )
    expect(screen.getByText(/Without Abandoning Your Code/i)).toBeInTheDocument()
    expect(screen.getByText(/Learn the exact framework/i)).toBeInTheDocument()
  })

  it('should render social proof metrics', () => {
    render(<HeroSection />)
    
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('Developers Helped')).toBeInTheDocument()
    expect(screen.getByText('$2.3M+')).toBeInTheDocument()
    expect(screen.getByText('Revenue Generated')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('Success Rate')).toBeInTheDocument()
    expect(screen.getByText('12mo')).toBeInTheDocument()
    expect(screen.getByText('Avg. Time to $100K')).toBeInTheDocument()
  })

  it('should render email capture form', () => {
    render(<HeroSection />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('placeholder', 'Enter your email address')
    expect(submitButton).toBeInTheDocument()
  })

  it('should render trust indicators', () => {
    render(<HeroSection />)
    
    expect(screen.getByText(/no spam, unsubscribe anytime/i)).toBeInTheDocument()
    expect(screen.getByText(/7-day free email course/i)).toBeInTheDocument()
    expect(screen.getByText(/join 10,000\+ developers/i)).toBeInTheDocument()
  })

  it('should validate email input', async () => {
    render(<HeroSection />)
    
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    // Submit without email
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it('should validate email format', async () => {
    render(<HeroSection />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('should handle successful form submission with custom handler', async () => {
    const mockOnEmailSubmit = vi.fn().mockResolvedValue(undefined)
    
    render(<HeroSection onEmailSubmit={mockOnEmailSubmit} />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    // Should show loading state
    expect(screen.getByText(/joining/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    
    await waitFor(() => {
      expect(mockOnEmailSubmit).toHaveBeenCalledWith('test@example.com')
    })
  })

  it('should handle default form submission without custom handler', async () => {
    render(<HeroSection />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    // Should show loading state
    expect(screen.getByText(/joining/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/thanks! check your email/i)).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Form should be reset
    expect(emailInput).toHaveValue('')
  })

  it('should handle form submission errors', async () => {
    const mockOnEmailSubmit = vi.fn().mockRejectedValue(new Error('Submission failed'))
    
    render(<HeroSection onEmailSubmit={mockOnEmailSubmit} />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
    
    // Button should be enabled again after error
    expect(submitButton).not.toBeDisabled()
  })

  it('should disable form during submission', async () => {
    const mockOnEmailSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<HeroSection onEmailSubmit={mockOnEmailSubmit} />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    expect(emailInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
    
    await waitFor(() => {
      expect(mockOnEmailSubmit).toHaveBeenCalled()
    })
  })

  it('should have proper accessibility attributes', () => {
    render(<HeroSection />)
    
    const form = screen.getByLabelText(/email signup form/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    expect(form).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('autoComplete', 'email')
    expect(emailInput).toHaveAttribute('autoCapitalize', 'none')
    expect(emailInput).toHaveAttribute('autoCorrect', 'off')
    expect(emailInput).toHaveAttribute('spellCheck', 'false')
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('should show error state on email input when validation fails', async () => {
    render(<HeroSection />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    fireEvent.change(emailInput, { target: { value: 'invalid' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('should handle keyboard navigation', () => {
    render(<HeroSection />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    // Tab to email input
    emailInput.focus()
    expect(document.activeElement).toBe(emailInput)
    
    // Tab to submit button
    fireEvent.keyDown(emailInput, { key: 'Tab' })
    submitButton.focus()
    expect(document.activeElement).toBe(submitButton)
  })

  it('should clear submit message when form is resubmitted', async () => {
    render(<HeroSection />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    // First submission with valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/thanks! check your email/i)).toBeInTheDocument()
    })
    
    // Second submission should clear previous message
    fireEvent.change(emailInput, { target: { value: 'another@example.com' } })
    fireEvent.click(submitButton)
    
    expect(screen.queryByText(/thanks! check your email/i)).not.toBeInTheDocument()
  })

  it('should render with custom className', () => {
    render(<HeroSection className="custom-hero-class" />)
    
    const section = screen.getByRole('region')
    expect(section).toHaveClass('custom-hero-class')
  })

  it('should have proper heading structure', () => {
    render(<HeroSection />)
    
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveAttribute('id', 'hero-heading')
    
    const section = screen.getByLabelledBy('hero-heading')
    expect(section).toBeInTheDocument()
  })

  it('should handle multiple rapid submissions', async () => {
    const mockOnEmailSubmit = vi.fn().mockResolvedValue(undefined)
    
    render(<HeroSection onEmailSubmit={mockOnEmailSubmit} />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    // Click multiple times rapidly
    fireEvent.click(submitButton)
    fireEvent.click(submitButton)
    fireEvent.click(submitButton)
    
    // Should only submit once
    await waitFor(() => {
      expect(mockOnEmailSubmit).toHaveBeenCalledTimes(1)
    })
  })

  it('should maintain focus management during form state changes', async () => {
    render(<HeroSection />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /get free guide/i })
    
    emailInput.focus()
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    // During submission, focus should remain manageable
    expect(document.activeElement).toBeTruthy()
    
    await waitFor(() => {
      expect(screen.getByText(/thanks! check your email/i)).toBeInTheDocument()
    })
  })
})