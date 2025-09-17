import React from 'react'
import { render, screen, fireEvent } from '../../../test/test-utils'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('should render with default props', () => {
    render(<Input placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('flex', 'w-full', 'rounded-md', 'border', 'h-10')
  })

  it('should render with custom className', () => {
    render(<Input className="custom-input" placeholder="Test" />)
    
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveClass('custom-input')
  })

  it('should render different variants correctly', () => {
    const { rerender } = render(<Input variant="default" placeholder="Default" />)
    let input = screen.getByPlaceholderText('Default')
    expect(input).toHaveClass('border-input')

    rerender(<Input variant="error" placeholder="Error" />)
    input = screen.getByPlaceholderText('Error')
    expect(input).toHaveClass('border-destructive', 'focus-visible:ring-destructive')

    rerender(<Input variant="success" placeholder="Success" />)
    input = screen.getByPlaceholderText('Success')
    expect(input).toHaveClass('border-green-500', 'focus-visible:ring-green-500')
  })

  it('should render different sizes correctly', () => {
    const { rerender } = render(<Input size="sm" placeholder="Small" />)
    let input = screen.getByPlaceholderText('Small')
    expect(input).toHaveClass('h-9')

    rerender(<Input size="lg" placeholder="Large" />)
    input = screen.getByPlaceholderText('Large')
    expect(input).toHaveClass('h-11')

    rerender(<Input size="xl" placeholder="Extra Large" />)
    input = screen.getByPlaceholderText('Extra Large')
    expect(input).toHaveClass('h-12', 'text-base')
  })

  it('should handle different input types', () => {
    const { rerender } = render(<Input type="text" placeholder="Text input" />)
    let input = screen.getByPlaceholderText('Text input')
    expect(input).toHaveAttribute('type', 'text')

    rerender(<Input type="email" placeholder="Email input" />)
    input = screen.getByPlaceholderText('Email input')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Password input" />)
    input = screen.getByPlaceholderText('Password input')
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type="number" placeholder="Number input" />)
    input = screen.getByPlaceholderText('Number input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('should handle value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Type here" />)
    
    const input = screen.getByPlaceholderText('Type here')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test value')
  })

  it('should handle controlled input', () => {
    const handleChange = vi.fn()
    const { rerender } = render(
      <Input value="initial" onChange={handleChange} placeholder="Controlled" />
    )
    
    const input = screen.getByPlaceholderText('Controlled')
    expect(input).toHaveValue('initial')
    
    rerender(<Input value="updated" onChange={handleChange} placeholder="Controlled" />)
    expect(input).toHaveValue('updated')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />)
    
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('should handle focus and blur events', () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    
    render(
      <Input 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        placeholder="Focus me" 
      />
    )
    
    const input = screen.getByPlaceholderText('Focus me')
    
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} placeholder="Ref input" />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.placeholder).toBe('Ref input')
  })

  it('should pass through HTML input attributes', () => {
    render(
      <Input 
        placeholder="Test input"
        required
        maxLength={50}
        minLength={5}
        pattern="[A-Za-z]+"
        data-testid="test-input"
        aria-label="Custom label"
        autoComplete="email"
      />
    )
    
    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('maxLength', '50')
    expect(input).toHaveAttribute('minLength', '5')
    expect(input).toHaveAttribute('pattern', '[A-Za-z]+')
    expect(input).toHaveAttribute('aria-label', 'Custom label')
    expect(input).toHaveAttribute('autoComplete', 'email')
  })

  it('should have correct focus styles', () => {
    render(<Input placeholder="Focus styles" />)
    
    const input = screen.getByPlaceholderText('Focus styles')
    expect(input).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    )
  })

  it('should support file input type', () => {
    render(<Input type="file" data-testid="file-input" />)
    
    const input = screen.getByTestId('file-input')
    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveClass('file:border-0', 'file:bg-transparent', 'file:text-sm')
  })

  it('should handle readonly state', () => {
    render(<Input readOnly placeholder="Readonly input" />)
    
    const input = screen.getByPlaceholderText('Readonly input')
    expect(input).toHaveAttribute('readonly')
  })

  it('should combine variant and size classes correctly', () => {
    render(<Input variant="error" size="lg" placeholder="Large error input" />)
    
    const input = screen.getByPlaceholderText('Large error input')
    expect(input).toHaveClass('border-destructive', 'h-11')
  })

  it('should handle keyboard events', () => {
    const handleKeyDown = vi.fn()
    const handleKeyUp = vi.fn()
    
    render(
      <Input 
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="Keyboard events"
      />
    )
    
    const input = screen.getByPlaceholderText('Keyboard events')
    
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
    
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' })
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('should maintain accessibility standards', () => {
    render(
      <div>
        <label htmlFor="test-input">Test Label</label>
        <Input id="test-input" placeholder="Accessible input" />
      </div>
    )
    
    const input = screen.getByLabelText('Test Label')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'test-input')
  })

  it('should handle input validation states', () => {
    render(<Input variant="error" aria-invalid="true" placeholder="Invalid input" />)
    
    const input = screen.getByPlaceholderText('Invalid input')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveClass('border-destructive')
  })

  it('should support step attribute for number inputs', () => {
    render(<Input type="number" step="0.01" placeholder="Number with step" />)
    
    const input = screen.getByPlaceholderText('Number with step')
    expect(input).toHaveAttribute('step', '0.01')
  })

  it('should handle min and max attributes', () => {
    render(<Input type="number" min="0" max="100" placeholder="Constrained number" />)
    
    const input = screen.getByPlaceholderText('Constrained number')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
  })
})