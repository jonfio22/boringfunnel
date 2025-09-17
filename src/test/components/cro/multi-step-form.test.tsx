import React from 'react'
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils'
import { MultiStepForm } from '@/components/cro/multi-step-form'
import { mockLocalStorage } from '../../test-utils'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

const mockSteps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us about yourself',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text' as const,
        placeholder: 'Enter your first name',
        required: true,
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text' as const,
        placeholder: 'Enter your last name',
        required: true,
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Details',
    description: 'How can we reach you?',
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email' as const,
        placeholder: 'Enter your email',
        required: true,
        validation: {
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        },
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'tel' as const,
        placeholder: 'Enter your phone number',
        required: false,
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    fields: [
      {
        name: 'interest',
        label: 'What interests you most?',
        type: 'select' as const,
        required: true,
        options: [
          { value: 'web', label: 'Web Development' },
          { value: 'mobile', label: 'Mobile Development' },
          { value: 'data', label: 'Data Science' },
        ],
      },
      {
        name: 'experience',
        label: 'Experience Level',
        type: 'radio' as const,
        required: true,
        options: [
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ],
      },
    ],
  },
]

describe('MultiStepForm', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>
  const mockOnSubmit = vi.fn()
  const mockOnStepChange = vi.fn()

  beforeEach(() => {
    localStorageMock = mockLocalStorage()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render first step initially', () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
        onStepChange={mockOnStepChange}
      />
    )
    
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
  })

  it('should show progress indicator by default', () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
    
    // Should show step indicators
    const stepIndicators = screen.getAllByText(/[1-3]/)
    expect(stepIndicators).toHaveLength(3)
  })

  it('should hide progress indicator when showProgress is false', () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
        showProgress={false}
      />
    )
    
    expect(screen.queryByText('Step 1 of 3')).not.toBeInTheDocument()
  })

  it('should validate required fields before advancing', async () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
    })
    
    // Should not advance to next step
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(mockOnStepChange).not.toHaveBeenCalled()
  })

  it('should advance to next step when validation passes', async () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
        onStepChange={mockOnStepChange}
      />
    )
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Contact Details')).toBeInTheDocument()
      expect(screen.getByText('How can we reach you?')).toBeInTheDocument()
    })
    
    expect(mockOnStepChange).toHaveBeenCalledWith(1)
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
  })

  it('should go back to previous step', () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
        onStepChange={mockOnStepChange}
      />
    )
    
    // Fill first step and advance
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    // Go back
    const prevButton = screen.getByRole('button', { name: /previous/i })
    fireEvent.click(prevButton)
    
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(mockOnStepChange).toHaveBeenCalledWith(0)
  })

  it('should disable previous button on first step', () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    const prevButton = screen.getByRole('button', { name: /previous/i })
    expect(prevButton).toBeDisabled()
  })

  it('should show submit button on last step', async () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    // Advance through all steps
    // Step 1
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Contact Details')).toBeInTheDocument()
    })
    
    // Step 2
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Preferences')).toBeInTheDocument()
    })
    
    // Should show submit button
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('should submit form on last step', async () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    // Fill all steps
    // Step 1
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })
    
    // Step 2
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/what interests you most/i)).toBeInTheDocument()
    })
    
    // Step 3
    const selectElement = screen.getByLabelText(/what interests you most/i)
    fireEvent.change(selectElement, { target: { value: 'web' } })
    
    const radioOption = screen.getByLabelText(/beginner/i)
    fireEvent.click(radioOption)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '',
        interest: 'web',
        experience: 'beginner',
      })
    })
  })

  it('should auto-save form data to localStorage', async () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'multi-step-form-data',
        expect.stringContaining('John')
      )
    })
  })

  it('should restore saved form data', () => {
    const savedData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    }
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData))
    
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
  })

  it('should clear saved data after successful submission', async () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    // Complete form and submit
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/what interests you most/i)).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByLabelText(/what interests you most/i), { target: { value: 'web' } })
    fireEvent.click(screen.getByLabelText(/beginner/i))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'multi-step-form-data',
        JSON.stringify({})
      )
    })
  })

  it('should handle different field types correctly', async () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    // Advance to preferences step
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/what interests you most/i)).toBeInTheDocument()
    })
    
    // Test select field
    const selectElement = screen.getByLabelText(/what interests you most/i)
    expect(selectElement.tagName).toBe('SELECT')
    fireEvent.change(selectElement, { target: { value: 'mobile' } })
    expect(selectElement).toHaveValue('mobile')
    
    // Test radio buttons
    const radioOptions = screen.getAllByRole('radio')
    expect(radioOptions).toHaveLength(3)
    
    fireEvent.click(screen.getByLabelText(/intermediate/i))
    expect(screen.getByLabelText(/intermediate/i)).toBeChecked()
  })

  it('should validate email field with custom validation', async () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    // Advance to contact step
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })
    
    // Enter invalid email
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
    })
  })

  it('should handle form submission errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockOnSubmit.mockRejectedValue(new Error('Submission failed'))
    
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    // Complete form quickly
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/what interests you most/i)).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByLabelText(/what interests you most/i), { target: { value: 'web' } })
    fireEvent.click(screen.getByLabelText(/beginner/i))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })
    
    // Form should still be submittable after error
    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled()
    
    consoleSpy.mockRestore()
  })

  it('should apply custom className', () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
        className="custom-form-class"
      />
    )
    
    const formContainer = screen.getByRole('form').closest('.custom-form-class')
    expect(formContainer).toBeInTheDocument()
  })

  it('should handle textarea field type', () => {
    const stepsWithTextarea = [
      {
        id: 'feedback',
        title: 'Feedback',
        fields: [
          {
            name: 'comments',
            label: 'Comments',
            type: 'textarea' as const,
            placeholder: 'Enter your comments',
            required: true,
          },
        ],
      },
    ]
    
    render(
      <MultiStepForm
        steps={stepsWithTextarea}
        onSubmit={mockOnSubmit}
      />
    )
    
    const textarea = screen.getByLabelText(/comments/i)
    expect(textarea.tagName).toBe('TEXTAREA')
    expect(textarea).toHaveAttribute('rows', '4')
  })

  it('should show progress with check marks for completed steps', async () => {
    render(
      <MultiStepForm
        steps={mockSteps}
        onSubmit={mockOnSubmit}
      />
    )
    
    // Complete first step
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Contact Details')).toBeInTheDocument()
    })
    
    // First step should show check mark instead of number
    const checkIcon = screen.getByTestId('check-icon') || screen.getByText('✓')
    expect(checkIcon).toBeInTheDocument()
  })
})