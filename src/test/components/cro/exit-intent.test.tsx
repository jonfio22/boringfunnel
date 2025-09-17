import React from 'react'
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils'
import { ExitIntent } from '@/components/cro/exit-intent'
import { mockAnalytics, mockLocalStorage, triggerMouseLeave } from '../../test-utils'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('ExitIntent', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>

  beforeEach(() => {
    localStorageMock = mockLocalStorage()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not show modal initially', () => {
    render(<ExitIntent />)
    
    expect(screen.queryByText(/wait! don't miss out/i)).not.toBeInTheDocument()
  })

  it('should show modal on mouse leave at top of page', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    expect(screen.getByText(/wait! don't miss out/i)).toBeInTheDocument()
    expect(screen.getByText(/get our exclusive guide/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter your email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get my free guide/i })).toBeInTheDocument()
  })

  it('should track analytics when modal opens', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    expect(mockAnalytics.trackExitIntent).toHaveBeenCalledWith('mouse_leave', 'page_top')
    expect(mockAnalytics.trackModalInteraction).toHaveBeenCalledWith('open', 'exit_intent', 'mouse_leave')
  })

  it('should not show modal if already shown within cooldown period', () => {
    const recentTime = Date.now() - (12 * 60 * 60 * 1000) // 12 hours ago
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'exit-intent-shown') return JSON.stringify(true)
      if (key === 'exit-intent-time') return JSON.stringify(recentTime)
      return null
    })
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    expect(screen.queryByText(/wait! don't miss out/i)).not.toBeInTheDocument()
  })

  it('should show modal if cooldown period has passed', () => {
    const oldTime = Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'exit-intent-shown') return JSON.stringify(true)
      if (key === 'exit-intent-time') return JSON.stringify(oldTime)
      return null
    })
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    expect(screen.getByText(/wait! don't miss out/i)).toBeInTheDocument()
  })

  it('should close modal when close button is clicked', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    expect(screen.getByText(/wait! don't miss out/i)).toBeInTheDocument()
    
    const closeButton = screen.getByLabelText(/close modal/i)
    fireEvent.click(closeButton)
    
    expect(mockAnalytics.trackModalInteraction).toHaveBeenCalledWith('close', 'exit_intent')
    expect(screen.queryByText(/wait! don't miss out/i)).not.toBeInTheDocument()
  })

  it('should close modal when backdrop is clicked', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    const backdrop = screen.getByRole('dialog').previousSibling as HTMLElement
    fireEvent.click(backdrop)
    
    expect(mockAnalytics.trackModalInteraction).toHaveBeenCalledWith('close', 'exit_intent')
    expect(screen.queryByText(/wait! don't miss out/i)).not.toBeInTheDocument()
  })

  it('should close modal when Escape key is pressed', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    expect(screen.getByText(/wait! don't miss out/i)).toBeInTheDocument()
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(screen.queryByText(/wait! don't miss out/i)).not.toBeInTheDocument()
  })

  it('should handle email submission', () => {
    const mockOnSubmit = vi.fn()
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent onSubmit={mockOnSubmit} />)
    
    triggerMouseLeave()
    
    const emailInput = screen.getByPlaceholderText(/enter your email address/i)
    const submitButton = screen.getByRole('button', { name: /get my free guide/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com')
    expect(mockAnalytics.trackEmailSubmission).toHaveBeenCalledWith(
      'exit_intent_form',
      'exit_intent_modal',
      expect.objectContaining({
        email_domain: 'example.com',
        timestamp: expect.any(Number),
      })
    )
    expect(mockAnalytics.trackModalInteraction).toHaveBeenCalledWith('submit', 'exit_intent')
  })

  it('should not submit form with empty email', () => {
    const mockOnSubmit = vi.fn()
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent onSubmit={mockOnSubmit} />)
    
    triggerMouseLeave()
    
    const submitButton = screen.getByRole('button', { name: /get my free guide/i })
    fireEvent.click(submitButton)
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
    expect(screen.queryByText(/wait! don't miss out/i)).not.toBeInTheDocument()
  })

  it('should use custom props', () => {
    const customProps = {
      title: 'Custom Title',
      subtitle: 'Custom Subtitle',
      offerText: 'Custom Offer',
      buttonText: 'Custom Button',
      cooldownHours: 48,
    }
    
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent {...customProps} />)
    
    triggerMouseLeave()
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Custom Offer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'exit-intent-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'exit-intent-description')
    
    const emailInput = screen.getByLabelText(/email address/i)
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('autoComplete', 'email')
    
    const closeButton = screen.getByLabelText(/close modal/i)
    expect(closeButton).toBeInTheDocument()
  })

  it('should focus email input when modal opens', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    const emailInput = screen.getByPlaceholderText(/enter your email address/i)
    expect(document.activeElement).toBe(emailInput)
  })

  it('should trap focus within modal', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    const emailInput = screen.getByPlaceholderText(/enter your email address/i)
    const submitButton = screen.getByRole('button', { name: /get my free guide/i })
    const closeButton = screen.getByLabelText(/close modal/i)
    
    // Tab forward from close button should go to email input
    closeButton.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(emailInput)
    
    // Shift+Tab from email input should go to close button
    emailInput.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(closeButton)
  })

  it('should save state to localStorage when shown', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'exit-intent-shown',
      JSON.stringify(true)
    )
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'exit-intent-time',
      JSON.stringify(expect.any(Number))
    )
  })

  it('should handle form submission without onSubmit prop', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    triggerMouseLeave()
    
    const emailInput = screen.getByPlaceholderText(/enter your email address/i)
    const submitButton = screen.getByRole('button', { name: /get my free guide/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    // Should still track analytics
    expect(mockAnalytics.trackEmailSubmission).toHaveBeenCalled()
    expect(mockAnalytics.trackModalInteraction).toHaveBeenCalledWith('submit', 'exit_intent')
    
    // Modal should close
    expect(screen.queryByText(/wait! don't miss out/i)).not.toBeInTheDocument()
  })

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    
    const { unmount } = render(<ExitIntent />)
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function))
  })

  it('should not show modal on server side', () => {
    Object.defineProperty(window, 'document', {
      value: undefined,
      writable: true,
    })
    
    render(<ExitIntent />)
    
    // Should not crash and should not show modal
    expect(screen.queryByText(/wait! don't miss out/i)).not.toBeInTheDocument()
  })

  it('should handle rapid mouse leave events', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<ExitIntent />)
    
    // Trigger multiple mouse leave events
    triggerMouseLeave()
    triggerMouseLeave()
    triggerMouseLeave()
    
    // Should only show one modal
    expect(screen.getAllByText(/wait! don't miss out/i)).toHaveLength(1)
    
    // Should only track analytics once
    expect(mockAnalytics.trackExitIntent).toHaveBeenCalledTimes(1)
  })
})