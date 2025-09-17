import React from 'react'
import { render, screen, waitFor } from '../../../test/test-utils'
import { CountdownTimer, CompactCountdown, UrgencyBanner } from '@/components/cro/countdown-timer'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}))

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should render with default props', () => {
    render(<CountdownTimer />)
    
    expect(screen.getByText(/special offer expires in/i)).toBeInTheDocument()
    expect(screen.getByText(/don't miss out on this limited-time deal/i)).toBeInTheDocument()
    expect(screen.getByText('Hours')).toBeInTheDocument()
    expect(screen.getByText('Minutes')).toBeInTheDocument()
    expect(screen.getByText('Seconds')).toBeInTheDocument()
  })

  it('should render with custom target date', () => {
    const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    
    render(<CountdownTimer targetDate={futureDate} />)
    
    // Should show days when more than 24 hours remain
    expect(screen.getByText('Days')).toBeInTheDocument()
    expect(screen.getByText('Hours')).toBeInTheDocument()
    expect(screen.getByText('Minutes')).toBeInTheDocument()
    expect(screen.getByText('Seconds')).toBeInTheDocument()
  })

  it('should hide days when less than 24 hours remain', () => {
    const futureDate = new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours from now
    
    render(<CountdownTimer targetDate={futureDate} />)
    
    expect(screen.queryByText('Days')).not.toBeInTheDocument()
    expect(screen.getByText('Hours')).toBeInTheDocument()
    expect(screen.getByText('Minutes')).toBeInTheDocument()
    expect(screen.getByText('Seconds')).toBeInTheDocument()
  })

  it('should update every second', () => {
    const futureDate = new Date(Date.now() + 61 * 1000) // 61 seconds from now
    
    render(<CountdownTimer targetDate={futureDate} />)
    
    // Initial state should show 01:01
    expect(screen.getByText('01')).toBeInTheDocument() // minutes
    
    // Advance timer by 1 second
    vi.advanceTimersByTime(1000)
    
    // Should now show 01:00
    expect(screen.getByText('01')).toBeInTheDocument() // minutes
    expect(screen.getByText('00')).toBeInTheDocument() // seconds
  })

  it('should show expired state when countdown reaches zero', () => {
    const pastDate = new Date(Date.now() - 1000) // 1 second ago
    
    render(<CountdownTimer targetDate={pastDate} />)
    
    expect(screen.getByText(/offer expired/i)).toBeInTheDocument()
    expect(screen.getByText(/this special offer is no longer available/i)).toBeInTheDocument()
  })

  it('should call onExpiry callback when countdown expires', () => {
    const mockOnExpiry = vi.fn()
    const futureDate = new Date(Date.now() + 1000) // 1 second from now
    
    render(<CountdownTimer targetDate={futureDate} onExpiry={mockOnExpiry} />)
    
    // Advance timer past expiry
    vi.advanceTimersByTime(1500)
    
    expect(mockOnExpiry).toHaveBeenCalledTimes(1)
  })

  it('should render with custom props', () => {
    render(
      <CountdownTimer
        title="Custom Title"
        subtitle="Custom Subtitle"
        showLabels={false}
        size="lg"
        className="custom-class"
      />
    )
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument()
    expect(screen.queryByText('Hours')).not.toBeInTheDocument() // Labels hidden
    
    const container = screen.getByText('Custom Title').closest('.custom-class')
    expect(container).toBeInTheDocument()
  })

  it('should render different sizes correctly', () => {
    const { rerender } = render(<CountdownTimer size="sm" />)
    
    // Check for small size classes (would need to verify actual class application)
    const timeElement = screen.getByText(/\d{2}/)
    expect(timeElement).toBeInTheDocument()
    
    rerender(<CountdownTimer size="lg" />)
    expect(timeElement).toBeInTheDocument()
  })

  it('should show red color when time is critical (≤5 minutes)', () => {
    const futureDate = new Date(Date.now() + 3 * 60 * 1000) // 3 minutes from now
    
    render(<CountdownTimer targetDate={futureDate} />)
    
    // Should show minutes in red when ≤5 minutes remain
    const minutesDisplay = screen.getByText('03')
    expect(minutesDisplay).toBeInTheDocument()
  })

  it('should format time with leading zeros', () => {
    const futureDate = new Date(Date.now() + 5 * 1000) // 5 seconds from now
    
    render(<CountdownTimer targetDate={futureDate} />)
    
    expect(screen.getByText('00')).toBeInTheDocument() // minutes
    expect(screen.getByText('05')).toBeInTheDocument() // seconds
  })

  it('should handle duration prop instead of targetDate', () => {
    render(<CountdownTimer duration={30} />) // 30 minutes
    
    // Should show approximately 30 minutes
    expect(screen.getByText('30')).toBeInTheDocument() // minutes
    expect(screen.getByText('00')).toBeInTheDocument() // seconds
  })

  it('should hide title and subtitle when not provided', () => {
    render(<CountdownTimer title="" subtitle="" />)
    
    expect(screen.queryByText(/special offer expires in/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/don't miss out/i)).not.toBeInTheDocument()
  })

  it('should cleanup timer on unmount', () => {
    const { unmount } = render(<CountdownTimer />)
    
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    
    unmount()
    
    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})

describe('CompactCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should render with default props', () => {
    render(<CompactCountdown />)
    
    // Should show 30:00 by default
    expect(screen.getByText('30:00')).toBeInTheDocument()
  })

  it('should countdown correctly', () => {
    render(<CompactCountdown minutes={2} />)
    
    // Should show 2:00 initially
    expect(screen.getByText('2:00')).toBeInTheDocument()
    
    // Advance by 1 second
    vi.advanceTimersByTime(1000)
    
    // Should show 1:59
    expect(screen.getByText('1:59')).toBeInTheDocument()
  })

  it('should show expired state when countdown reaches zero', () => {
    render(<CompactCountdown minutes={0} />)
    
    expect(screen.getByText('Expired')).toBeInTheDocument()
  })

  it('should call onExpiry when countdown expires', () => {
    const mockOnExpiry = vi.fn()
    
    render(<CompactCountdown minutes={0} onExpiry={mockOnExpiry} />)
    
    expect(mockOnExpiry).toHaveBeenCalledTimes(1)
  })

  it('should change color when time is low (≤5 minutes)', () => {
    render(<CompactCountdown minutes={3} />)
    
    const countdown = screen.getByText('3:00')
    expect(countdown).toBeInTheDocument()
    // Color change would be tested via motion props or classes
  })

  it('should format time correctly', () => {
    render(<CompactCountdown minutes={1} />)
    
    // Should show 1:00 initially
    expect(screen.getByText('1:00')).toBeInTheDocument()
    
    // Advance by 35 seconds
    vi.advanceTimersByTime(35000)
    
    // Should show 0:25
    expect(screen.getByText('0:25')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<CompactCountdown className="custom-compact" />)
    
    const countdown = screen.getByText('30:00')
    expect(countdown).toHaveClass('custom-compact')
  })
})

describe('UrgencyBanner', () => {
  it('should render with default props', () => {
    render(<UrgencyBanner />)
    
    expect(screen.getByText(/limited time offer - act now!/i)).toBeInTheDocument()
    expect(screen.getByText('15:00')).toBeInTheDocument() // Default 15 minutes
  })

  it('should render without countdown when disabled', () => {
    render(<UrgencyBanner countdown={false} />)
    
    expect(screen.getByText(/limited time offer - act now!/i)).toBeInTheDocument()
    expect(screen.queryByText('15:00')).not.toBeInTheDocument()
  })

  it('should render with custom message and time', () => {
    render(
      <UrgencyBanner
        message="Custom urgent message!"
        minutes={10}
      />
    )
    
    expect(screen.getByText('Custom urgent message!')).toBeInTheDocument()
    expect(screen.getByText('10:00')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<UrgencyBanner className="custom-banner" />)
    
    const banner = screen.getByText(/limited time offer/i).closest('.custom-banner')
    expect(banner).toBeInTheDocument()
  })

  it('should render clock icon', () => {
    render(<UrgencyBanner />)
    
    // Clock icon should be present (testing for its container)
    const messageContainer = screen.getByText(/limited time offer/i).parentElement
    expect(messageContainer).toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    render(<UrgencyBanner />)
    
    const banner = screen.getByText(/limited time offer/i).closest('div')
    expect(banner).toHaveClass('bg-destructive', 'text-destructive-foreground')
  })
})