import React from 'react'
import { render, screen, fireEvent, waitFor } from '../test-utils'
import { ContactForm } from '@/components/ui/contact-form'
import { HeroSection } from '@/components/ui/hero-section'
import { mockAnalytics, mockLocalStorage } from '../test-utils'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('Form Submission Integration', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>

  beforeEach(() => {
    localStorageMock = mockLocalStorage()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('ContactForm Integration', () => {
    it('should complete full form submission flow', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      render(<ContactForm />)
      
      // Fill out form completely
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const companyInput = screen.getByLabelText(/company/i)
      const messageInput = screen.getByLabelText(/message/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(companyInput, { target: { value: 'ACME Corp' } })
      fireEvent.change(messageInput, { target: { value: 'This is a test message about our project needs.' } })
      
      // Verify form state during input
      expect(nameInput).toHaveValue('John Doe')
      expect(emailInput).toHaveValue('john@example.com')
      expect(companyInput).toHaveValue('ACME Corp')
      expect(messageInput).toHaveValue('This is a test message about our project needs.')
      
      // Auto-save should be working
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'contact-form-name',
          JSON.stringify('John Doe')
        )
      })
      
      // Submit form
      fireEvent.click(submitButton)
      
      // Should show loading state
      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
      
      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
      }, { timeout: 2000 })
      
      // Verify form data was submitted correctly
      expect(consoleSpy).toHaveBeenCalledWith('Form data:', {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'ACME Corp',
        message: 'This is a test message about our project needs.'
      })
      
      // Form should be reset and localStorage cleared
      expect(nameInput).toHaveValue('')
      expect(emailInput).toHaveValue('')
      expect(companyInput).toHaveValue('')
      expect(messageInput).toHaveValue('')
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('contact-form-name', JSON.stringify(''))
      expect(localStorageMock.setItem).toHaveBeenCalledWith('contact-form-email', JSON.stringify(''))
      expect(localStorageMock.setItem).toHaveBeenCalledWith('contact-form-company', JSON.stringify(''))
      
      consoleSpy.mockRestore()
    })

    it('should handle form validation errors gracefully', async () => {
      render(<ContactForm />)
      
      const submitButton = screen.getByRole('button', { name: /send message/i })
      
      // Try to submit empty form
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/message is required/i)).toBeInTheDocument()
      })
      
      // Fill only name and try again
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/message is required/i)).toBeInTheDocument()
      })
      
      // Add invalid email
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
        expect(screen.getByText(/message is required/i)).toBeInTheDocument()
      })
      
      // Fix email and add message
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Valid message' } })
      fireEvent.click(submitButton)
      
      // Should now submit successfully
      await waitFor(() => {
        expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should preserve form data across page reloads (localStorage persistence)', () => {
      // Simulate saved data
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'contact-form-name') return JSON.stringify('John Doe')
        if (key === 'contact-form-email') return JSON.stringify('john@example.com')
        if (key === 'contact-form-company') return JSON.stringify('ACME Corp')
        return null
      })
      
      render(<ContactForm />)
      
      // Form should be pre-filled
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('ACME Corp')).toBeInTheDocument()
      
      // Should show welcome back message
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    })
  })

  describe('HeroSection Integration', () => {
    it('should handle email signup flow with custom handler', async () => {
      const mockEmailHandler = vi.fn().mockResolvedValue(undefined)
      
      render(<HeroSection onEmailSubmit={mockEmailHandler} />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free guide/i })
      
      // Enter email and submit
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      fireEvent.click(submitButton)
      
      // Should show loading state
      expect(screen.getByText(/joining/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
      expect(emailInput).toBeDisabled()
      
      await waitFor(() => {
        expect(mockEmailHandler).toHaveBeenCalledWith('user@example.com')
      })
      
      // Note: Success state handling depends on parent component
      // since onEmailSubmit typically redirects
    })

    it('should handle default email signup flow', async () => {
      render(<HeroSection />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free guide/i })
      
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      fireEvent.click(submitButton)
      
      // Should show loading state
      expect(screen.getByText(/joining/i)).toBeInTheDocument()
      
      // Wait for default success message
      await waitFor(() => {
        expect(screen.getByText(/thanks! check your email/i)).toBeInTheDocument()
      }, { timeout: 2000 })
      
      // Form should be reset
      expect(emailInput).toHaveValue('')
    })

    it('should validate email in hero section', async () => {
      render(<HeroSection />)
      
      const submitButton = screen.getByRole('button', { name: /get free guide/i })
      
      // Submit without email
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      })
      
      // Submit with invalid email
      const emailInput = screen.getByLabelText(/email address/i)
      fireEvent.change(emailInput, { target: { value: 'invalid' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
      
      // Input should show error state
      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    })

    it('should handle submission errors gracefully', async () => {
      const mockEmailHandler = vi.fn().mockRejectedValue(new Error('Network error'))
      
      render(<HeroSection onEmailSubmit={mockEmailHandler} />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free guide/i })
      
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      // Form should be re-enabled for retry
      expect(submitButton).not.toBeDisabled()
      expect(emailInput).not.toBeDisabled()
    })
  })

  describe('Cross-Form Integration', () => {
    it('should handle multiple forms on the same page', async () => {
      render(
        <div>
          <HeroSection />
          <ContactForm />
        </div>
      )
      
      // Both forms should be present and functional
      const heroEmailInput = screen.getByPlaceholderText(/enter your email address/i)
      const contactNameInput = screen.getByLabelText(/name/i)
      
      expect(heroEmailInput).toBeInTheDocument()
      expect(contactNameInput).toBeInTheDocument()
      
      // Interact with hero form
      fireEvent.change(heroEmailInput, { target: { value: 'hero@example.com' } })
      fireEvent.click(screen.getByRole('button', { name: /get free guide/i }))
      
      // Hero form should show loading
      expect(screen.getByText(/joining/i)).toBeInTheDocument()
      
      // Contact form should still be interactive
      fireEvent.change(contactNameInput, { target: { value: 'John Doe' } })
      expect(contactNameInput).toHaveValue('John Doe')
      
      // Wait for hero form to complete
      await waitFor(() => {
        expect(screen.getByText(/thanks! check your email/i)).toBeInTheDocument()
      }, { timeout: 2000 })
      
      // Contact form should still be functional
      expect(contactNameInput).toHaveValue('John Doe')
    })

    it('should not interfere with localStorage between different forms', async () => {
      render(
        <div>
          <HeroSection />
          <ContactForm />
        </div>
      )
      
      // Fill contact form
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Contact User' } })
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'contact@example.com' } })
      
      // Fill hero form
      fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), { target: { value: 'hero@example.com' } })
      
      // Contact form localStorage should be separate
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'contact-form-name',
          JSON.stringify('Contact User')
        )
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'contact-form-email',
          JSON.stringify('contact@example.com')
        )
      })
      
      // Hero form doesn't use localStorage for single email field
      const heroCall = localStorageMock.setItem.mock.calls.find(
        call => call[0].includes('hero')
      )
      expect(heroCall).toBeUndefined()
    })
  })

  describe('Form Accessibility Integration', () => {
    it('should maintain focus management during form interactions', async () => {
      render(<ContactForm />)
      
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })
      
      // Tab through form elements
      nameInput.focus()
      expect(document.activeElement).toBe(nameInput)
      
      fireEvent.keyDown(nameInput, { key: 'Tab' })
      emailInput.focus()
      expect(document.activeElement).toBe(emailInput)
      
      // Fill form and submit with keyboard
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } })
      
      submitButton.focus()
      fireEvent.keyDown(submitButton, { key: 'Enter' })
      
      // Form should submit
      await waitFor(() => {
        expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should provide proper error messaging for screen readers', async () => {
      render(<ContactForm />)
      
      const submitButton = screen.getByRole('button', { name: /send message/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const nameError = screen.getByText(/name is required/i)
        const emailError = screen.getByText(/email is required/i)
        
        expect(nameError).toBeInTheDocument()
        expect(emailError).toBeInTheDocument()
        
        // Errors should be associated with their inputs
        expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-invalid')
        expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid')
      })
    })
  })
})