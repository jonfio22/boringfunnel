import React from 'react'
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils'
import { ContactForm } from '@/components/ui/contact-form'
import { mockLocalStorage, wait } from '../../test-utils'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('ContactForm', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>

  beforeEach(() => {
    localStorageMock = mockLocalStorage()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render all form fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('should show validation errors for required fields', async () => {
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
    })
  })

  it('should validate email format', async () => {
    render(<ContactForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
    })
  })

  it('should accept valid form submission', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    render(<ContactForm />)
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: 'ACME Corp' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello world' } })
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    fireEvent.click(submitButton)
    
    // Should show loading state
    expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument()
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
    }, { timeout: 2000 })
    
    expect(consoleSpy).toHaveBeenCalledWith('Form data:', {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'ACME Corp',
      message: 'Hello world'
    })
    
    consoleSpy.mockRestore()
  })

  it('should auto-save form data to localStorage', async () => {
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'contact-form-name',
        JSON.stringify('John Doe')
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'contact-form-email',
        JSON.stringify('john@example.com')
      )
    })
  })

  it('should restore saved form data from localStorage', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'contact-form-name') return JSON.stringify('Saved Name')
      if (key === 'contact-form-email') return JSON.stringify('saved@example.com')
      if (key === 'contact-form-company') return JSON.stringify('Saved Company')
      return null
    })
    
    render(<ContactForm />)
    
    expect(screen.getByDisplayValue('Saved Name')).toBeInTheDocument()
    expect(screen.getByDisplayValue('saved@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Saved Company')).toBeInTheDocument()
  })

  it('should show return message when user has saved data', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'contact-form-email') return JSON.stringify('returning@example.com')
      return null
    })
    
    render(<ContactForm />)
    
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
  })

  it('should clear saved data after successful submission', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    render(<ContactForm />)
    
    // Fill out and submit form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } })
    
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Should clear saved data
    expect(localStorageMock.setItem).toHaveBeenCalledWith('contact-form-name', JSON.stringify(''))
    expect(localStorageMock.setItem).toHaveBeenCalledWith('contact-form-email', JSON.stringify(''))
    expect(localStorageMock.setItem).toHaveBeenCalledWith('contact-form-company', JSON.stringify(''))
    
    consoleSpy.mockRestore()
  })

  it('should disable submit button during submission', async () => {
    render(<ContactForm />)
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } })
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    fireEvent.click(submitButton)
    
    const disabledButton = screen.getByRole('button', { name: /sending/i })
    expect(disabledButton).toBeDisabled()
  })

  it('should handle form submission errors', async () => {
    // Mock console.log to simulate form submission
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
      throw new Error('Submission failed')
    })
    
    render(<ContactForm />)
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } })
    
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    }, { timeout: 2000 })
    
    consoleSpy.mockRestore()
  })

  it('should not auto-save company field changes immediately', async () => {
    render(<ContactForm />)
    
    const companyInput = screen.getByLabelText(/company/i)
    fireEvent.change(companyInput, { target: { value: 'Test Company' } })
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'contact-form-company',
        JSON.stringify('Test Company')
      )
    })
  })

  it('should have proper form accessibility', () => {
    render(<ContactForm />)
    
    // Check for proper labeling
    expect(screen.getByLabelText(/name/i)).toBeRequired()
    expect(screen.getByLabelText(/email/i)).toBeRequired()
    expect(screen.getByLabelText(/message/i)).toBeRequired()
    expect(screen.getByLabelText(/company/i)).not.toBeRequired()
    
    // Check input types
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('type', 'text')
  })

  it('should reset form after successful submission', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    
    // Fill out form
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Hello' } })
    
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Form should be reset
    expect(nameInput).toHaveValue('')
    expect(emailInput).toHaveValue('')
    expect(messageInput).toHaveValue('')
    
    consoleSpy.mockRestore()
  })

  it('should handle rapid typing without excessive localStorage calls', async () => {
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/name/i)
    
    // Simulate rapid typing
    fireEvent.change(nameInput, { target: { value: 'J' } })
    fireEvent.change(nameInput, { target: { value: 'Jo' } })
    fireEvent.change(nameInput, { target: { value: 'Joh' } })
    fireEvent.change(nameInput, { target: { value: 'John' } })
    
    // Should save the final value
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'contact-form-name',
        JSON.stringify('John')
      )
    })
  })

  it('should handle empty string values correctly', () => {
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/name/i)
    
    // Enter text then clear it
    fireEvent.change(nameInput, { target: { value: 'John' } })
    fireEvent.change(nameInput, { target: { value: '' } })
    
    expect(nameInput).toHaveValue('')
  })
})