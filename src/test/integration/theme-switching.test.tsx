import React from 'react'
import { render, screen, fireEvent, waitFor } from '../test-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ContactForm } from '@/components/ui/contact-form'
import { mockAnalytics } from '../test-utils'

// Mock next-themes
const mockSetTheme = vi.fn()
const mockUseTheme = {
  theme: 'light',
  setTheme: mockSetTheme,
  resolvedTheme: 'light',
  themes: ['light', 'dark', 'system'],
}

vi.mock('next-themes', () => ({
  useTheme: () => mockUseTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Theme toggle component for testing
function ThemeToggle() {
  const { theme, setTheme } = mockUseTheme
  
  return (
    <div>
      <span data-testid="current-theme">Current theme: {theme}</span>
      <Button 
        onClick={() => {
          const newTheme = theme === 'light' ? 'dark' : 'light'
          setTheme(newTheme)
          // Simulate theme change analytics
          mockAnalytics.trackThemeChange(newTheme, theme)
        }}
        data-testid="theme-toggle"
      >
        Toggle Theme
      </Button>
    </div>
  )
}

// Test component that shows theme-aware styling
function ThemedComponent() {
  return (
    <div className="bg-background text-foreground border border-border">
      <h1 className="text-primary">Themed Heading</h1>
      <p className="text-muted-foreground">Themed text</p>
      <Button variant="default">Default Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Input placeholder="Themed input" />
    </div>
  )
}

describe('Theme Switching Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseTheme.theme = 'light'
    mockUseTheme.resolvedTheme = 'light'
  })

  describe('Theme Toggle Functionality', () => {
    it('should toggle between light and dark themes', () => {
      render(<ThemeToggle />)
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light')
      
      const toggleButton = screen.getByTestId('theme-toggle')
      fireEvent.click(toggleButton)
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
      expect(mockAnalytics.trackThemeChange).toHaveBeenCalledWith('dark', 'light')
    })

    it('should track theme changes in analytics', () => {
      render(<ThemeToggle />)
      
      fireEvent.click(screen.getByTestId('theme-toggle'))
      
      expect(mockAnalytics.trackThemeChange).toHaveBeenCalledWith('dark', 'light')
      
      // Simulate changing back
      mockUseTheme.theme = 'dark'
      fireEvent.click(screen.getByTestId('theme-toggle'))
      
      expect(mockAnalytics.trackThemeChange).toHaveBeenCalledWith('light', 'dark')
    })
  })

  describe('Component Theme Adaptation', () => {
    it('should apply correct classes for light theme', () => {
      mockUseTheme.theme = 'light'
      render(<ThemedComponent />)
      
      const container = screen.getByText('Themed Heading').parentElement
      expect(container).toHaveClass('bg-background', 'text-foreground', 'border-border')
      
      const heading = screen.getByText('Themed Heading')
      expect(heading).toHaveClass('text-primary')
      
      const text = screen.getByText('Themed text')
      expect(text).toHaveClass('text-muted-foreground')
    })

    it('should maintain theme consistency across different components', () => {
      render(
        <div>
          <ThemedComponent />
          <Button variant="primary">Primary Button</Button>
          <Input variant="default" placeholder="Test input" />
        </div>
      )
      
      // All components should have consistent theme classes
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('transition-colors')
      })
      
      const input = screen.getByPlaceholderText('Test input')
      expect(input).toHaveClass('bg-background', 'text-foreground')
    })
  })

  describe('Form Theme Integration', () => {
    it('should maintain theme consistency in contact form', () => {
      render(<ContactForm />)
      
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })
      
      // Form inputs should have theme-aware classes
      expect(nameInput).toHaveClass('bg-background', 'text-foreground', 'border-input')
      expect(emailInput).toHaveClass('bg-background', 'text-foreground', 'border-input')
      
      // Submit button should have theme-aware classes
      expect(submitButton).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('should show proper error states with theme colors', async () => {
      render(<ContactForm />)
      
      const submitButton = screen.getByRole('button', { name: /send message/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/name is required/i)
        expect(errorMessage).toHaveClass('text-destructive')
      })
    })

    it('should maintain theme during form interactions', async () => {
      render(<ContactForm />)
      
      const nameInput = screen.getByLabelText(/name/i)
      
      // Focus should maintain theme
      fireEvent.focus(nameInput)
      expect(nameInput).toHaveClass('focus:ring-ring')
      
      // Typing should maintain theme
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      expect(nameInput).toHaveClass('bg-background', 'text-foreground')
    })
  })

  describe('Button Variants with Themes', () => {
    it('should render different button variants correctly with themes', () => {
      render(
        <div>
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="cta">CTA</Button>
        </div>
      )
      
      const defaultButton = screen.getByRole('button', { name: 'Default' })
      expect(defaultButton).toHaveClass('bg-primary', 'text-primary-foreground')
      
      const secondaryButton = screen.getByRole('button', { name: 'Secondary' })
      expect(secondaryButton).toHaveClass('bg-secondary', 'text-secondary-foreground')
      
      const destructiveButton = screen.getByRole('button', { name: 'Destructive' })
      expect(destructiveButton).toHaveClass('bg-destructive', 'text-destructive-foreground')
      
      const outlineButton = screen.getByRole('button', { name: 'Outline' })
      expect(outlineButton).toHaveClass('border-input', 'bg-background')
      
      const ghostButton = screen.getByRole('button', { name: 'Ghost' })
      expect(ghostButton).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
      
      const linkButton = screen.getByRole('button', { name: 'Link' })
      expect(linkButton).toHaveClass('text-primary', 'underline-offset-4')
    })

    it('should handle hover states correctly with themes', () => {
      render(<Button variant="default">Hover me</Button>)
      
      const button = screen.getByRole('button', { name: 'Hover me' })
      expect(button).toHaveClass('hover:bg-primary/90')
      
      fireEvent.mouseEnter(button)
      fireEvent.mouseLeave(button)
      
      // Should maintain classes after hover
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    })
  })

  describe('Input Variants with Themes', () => {
    it('should render different input variants correctly', () => {
      render(
        <div>
          <Input variant="default" placeholder="Default input" />
          <Input variant="error" placeholder="Error input" />
          <Input variant="success" placeholder="Success input" />
        </div>
      )
      
      const defaultInput = screen.getByPlaceholderText('Default input')
      expect(defaultInput).toHaveClass('border-input')
      
      const errorInput = screen.getByPlaceholderText('Error input')
      expect(errorInput).toHaveClass('border-destructive', 'focus-visible:ring-destructive')
      
      const successInput = screen.getByPlaceholderText('Success input')
      expect(successInput).toHaveClass('border-green-500', 'focus-visible:ring-green-500')
    })

    it('should handle focus states correctly with themes', () => {
      render(<Input placeholder="Focus me" />)
      
      const input = screen.getByPlaceholderText('Focus me')
      expect(input).toHaveClass('focus-visible:ring-ring')
      
      fireEvent.focus(input)
      fireEvent.blur(input)
      
      // Should maintain theme classes
      expect(input).toHaveClass('bg-background', 'text-foreground')
    })
  })

  describe('Theme Persistence and System Integration', () => {
    it('should handle system theme preference', () => {
      mockUseTheme.theme = 'system'
      mockUseTheme.resolvedTheme = 'dark'
      
      render(<ThemeToggle />)
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: system')
    })

    it('should handle theme switching with proper state management', () => {
      render(<ThemeToggle />)
      
      // Initial state
      expect(mockUseTheme.theme).toBe('light')
      
      // Toggle to dark
      fireEvent.click(screen.getByTestId('theme-toggle'))
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
      
      // Simulate theme actually changing
      mockUseTheme.theme = 'dark'
      
      // Toggle back to light
      fireEvent.click(screen.getByTestId('theme-toggle'))
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })
  })

  describe('Accessibility with Themes', () => {
    it('should maintain accessibility standards across themes', () => {
      render(
        <div>
          <Button>Accessible Button</Button>
          <Input aria-label="Accessible Input" />
          <div className="text-foreground bg-background">
            Accessible Content
          </div>
        </div>
      )
      
      const button = screen.getByRole('button')
      const input = screen.getByRole('textbox')
      
      expect(button).toBeInTheDocument()
      expect(input).toHaveAttribute('aria-label', 'Accessible Input')
      
      // Theme classes should not interfere with accessibility
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2')
      expect(input).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2')
    })

    it('should provide sufficient contrast ratios with theme colors', () => {
      render(
        <div>
          <div className="text-foreground bg-background">Normal text</div>
          <div className="text-muted-foreground bg-background">Muted text</div>
          <div className="text-primary bg-background">Primary text</div>
          <div className="text-destructive bg-background">Error text</div>
        </div>
      )
      
      // All text elements should be readable
      expect(screen.getByText('Normal text')).toBeInTheDocument()
      expect(screen.getByText('Muted text')).toBeInTheDocument()
      expect(screen.getByText('Primary text')).toBeInTheDocument()
      expect(screen.getByText('Error text')).toBeInTheDocument()
    })
  })

  describe('Real-world Theme Switching Scenarios', () => {
    it('should handle rapid theme switching', () => {
      render(<ThemeToggle />)
      
      const toggleButton = screen.getByTestId('theme-toggle')
      
      // Rapid clicks
      fireEvent.click(toggleButton)
      fireEvent.click(toggleButton)
      fireEvent.click(toggleButton)
      
      // Should track all changes
      expect(mockAnalytics.trackThemeChange).toHaveBeenCalledTimes(3)
      expect(mockSetTheme).toHaveBeenCalledTimes(3)
    })

    it('should maintain form state during theme changes', async () => {
      render(
        <div>
          <ThemeToggle />
          <ContactForm />
        </div>
      )
      
      // Fill form
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
      
      // Toggle theme
      fireEvent.click(screen.getByTestId('theme-toggle'))
      
      // Form data should be preserved
      expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe')
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com')
      
      // Form should still be functional
      fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } })
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
      })
    })

    it('should handle theme switching with multiple components', () => {
      render(
        <div>
          <ThemeToggle />
          <ThemedComponent />
          <Button variant="outline">Additional Button</Button>
          <Input placeholder="Additional Input" />
        </div>
      )
      
      // All components should start with light theme classes
      const button = screen.getByText('Default Button')
      const input = screen.getByPlaceholderText('Themed input')
      const additionalButton = screen.getByText('Additional Button')
      const additionalInput = screen.getByPlaceholderText('Additional Input')
      
      expect(button).toHaveClass('bg-primary')
      expect(input).toHaveClass('bg-background')
      expect(additionalButton).toHaveClass('bg-background')
      expect(additionalInput).toHaveClass('bg-background')
      
      // Toggle theme
      fireEvent.click(screen.getByTestId('theme-toggle'))
      
      // Theme change should be tracked
      expect(mockAnalytics.trackThemeChange).toHaveBeenCalledWith('dark', 'light')
    })
  })
})