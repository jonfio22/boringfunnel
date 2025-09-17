import React from 'react'
import { render, screen, fireEvent } from '../../../test/test-utils'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground', 'h-10', 'px-4', 'py-2')
  })

  it('should render with custom className', () => {
    render(<Button className="custom-class">Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveClass('custom-class')
  })

  it('should render different variants correctly', () => {
    const { rerender } = render(<Button variant="destructive">Button</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground')

    rerender(<Button variant="outline">Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'border-input', 'bg-background')

    rerender(<Button variant="secondary">Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')

    rerender(<Button variant="ghost">Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')

    rerender(<Button variant="link">Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('text-primary', 'underline-offset-4')

    rerender(<Button variant="gradient">Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-purple-600')

    rerender(<Button variant="cta">Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-orange-500', 'text-white')
  })

  it('should render different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Button</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('h-9', 'px-3')

    rerender(<Button size="lg">Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-11', 'px-8')

    rerender(<Button size="xl">Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-12', 'px-10', 'text-base')

    rerender(<Button size="icon">Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-10', 'w-10')
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>)
    
    const button = screen.getByRole('button', { name: /disabled button/i })
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Button with ref</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.textContent).toBe('Button with ref')
  })

  it('should pass through HTML button attributes', () => {
    render(
      <Button 
        type="submit" 
        form="test-form" 
        data-testid="test-button"
        aria-label="Custom label"
      >
        Submit
      </Button>
    )
    
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('form', 'test-form')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  it('should combine variant and size classes correctly', () => {
    render(<Button variant="gradient" size="lg">Large Gradient Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gradient-to-r', 'h-11', 'px-8')
  })

  it('should render children correctly', () => {
    render(
      <Button>
        <span>Icon</span>
        Button Text
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('IconButton Text')
    expect(screen.getByText('Icon')).toBeInTheDocument()
  })

  it('should have correct focus styles', () => {
    render(<Button>Focus me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring')
  })

  it('should support keyboard navigation', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Press Enter</Button>)
    
    const button = screen.getByRole('button')
    button.focus()
    
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    fireEvent.keyDown(button, { key: ' ', code: 'Space' })
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('should handle mouse events correctly', () => {
    const handleMouseEnter = vi.fn()
    const handleMouseLeave = vi.fn()
    
    render(
      <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        Hover me
      </Button>
    )
    
    const button = screen.getByRole('button')
    
    fireEvent.mouseEnter(button)
    expect(handleMouseEnter).toHaveBeenCalledTimes(1)
    
    fireEvent.mouseLeave(button)
    expect(handleMouseLeave).toHaveBeenCalledTimes(1)
  })

  it('should have correct accessibility attributes', () => {
    render(<Button>Accessible Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
  })

  it('should maintain button semantics with different variants', () => {
    render(<Button variant="link">Link Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button.tagName).toBe('BUTTON')
    expect(button).not.toHaveAttribute('href')
  })
})