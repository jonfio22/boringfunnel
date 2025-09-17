import React from 'react'
import { render, screen, fireEvent, waitFor } from '../test-utils'
import { ExitIntent } from '@/components/cro/exit-intent'
import { useScrollDepth } from '@/hooks/use-scroll-depth'
import { useTimeOnPage } from '@/hooks/use-time-on-page'
import { Button } from '@/components/ui/button'
import { mockAnalytics, mockLocalStorage, triggerMouseLeave, triggerScroll, triggerVisibilityChange } from '../test-utils'
import { trackButtonClick, trackThemeChange, trackSocialShare } from '@/lib/analytics'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Test component that uses analytics hooks
function AnalyticsTestComponent() {
  useScrollDepth({ enabled: true })
  useTimeOnPage({ enabled: true })
  
  return (
    <div style={{ height: '3000px' }}>
      <h1>Analytics Test Page</h1>
      <Button 
        onClick={() => trackButtonClick('test-button', 'header', { campaign: 'test' })}
      >
        Track Click
      </Button>
      <div style={{ height: '100vh' }}>Content</div>
    </div>
  )
}

describe('Analytics Tracking Integration', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>

  beforeEach(() => {
    localStorageMock = mockLocalStorage()
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('Scroll Depth Tracking', () => {
    it('should track scroll depth milestones', async () => {
      render(<AnalyticsTestComponent />)
      
      // Scroll to 25%
      triggerScroll(300) // Assuming 1200px scrollable height
      
      // Wait for debounce
      vi.advanceTimersByTime(1000)
      
      expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
        scroll_depth: 25,
        page_path: '/',
        timestamp: expect.any(Number),
      })
      
      // Scroll to 50%
      triggerScroll(600)
      vi.advanceTimersByTime(1000)
      
      expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
        scroll_depth: 50,
        page_path: '/',
        timestamp: expect.any(Number),
      })
      
      // Should track multiple thresholds
      expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledTimes(2)
    })

    it('should not track same threshold twice', async () => {
      render(<AnalyticsTestComponent />)
      
      // Scroll to 25% multiple times
      triggerScroll(300)
      vi.advanceTimersByTime(1000)
      
      triggerScroll(250)
      vi.advanceTimersByTime(1000)
      
      triggerScroll(350)
      vi.advanceTimersByTime(1000)
      
      // Should only track once
      expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledTimes(1)
    })

    it('should debounce rapid scroll events', async () => {
      render(<AnalyticsTestComponent />)
      
      // Rapid scroll events
      triggerScroll(100)
      triggerScroll(200)
      triggerScroll(300)
      
      // Should not track yet
      expect(mockAnalytics.trackScrollDepth).not.toHaveBeenCalled()
      
      // Wait for debounce
      vi.advanceTimersByTime(1000)
      
      // Should only track final position
      expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledTimes(1)
      expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
        scroll_depth: 25,
        page_path: '/',
        timestamp: expect.any(Number),
      })
    })
  })

  describe('Time on Page Tracking', () => {
    it('should track time intervals', async () => {
      render(<AnalyticsTestComponent />)
      
      // Advance time to 30 seconds
      vi.advanceTimersByTime(30000)
      
      expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledWith({
        time_on_page: 30000,
        page_path: '/',
        timestamp: expect.any(Number),
      })
      
      // Advance to 60 seconds
      vi.advanceTimersByTime(30000)
      
      expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledWith({
        time_on_page: 60000,
        page_path: '/',
        timestamp: expect.any(Number),
      })
      
      expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledTimes(2)
    })

    it('should handle page visibility changes', async () => {
      render(<AnalyticsTestComponent />)
      
      // Let some time pass while visible
      vi.advanceTimersByTime(15000)
      
      // Hide page
      triggerVisibilityChange(true)
      
      // Let time pass while hidden (should not count)
      vi.advanceTimersByTime(30000)
      
      // Show page again
      triggerVisibilityChange(false)
      
      // Continue timing
      vi.advanceTimersByTime(15000)
      
      // Should reach 30s threshold based on visible time only
      expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledWith({
        time_on_page: 30000,
        page_path: '/',
        timestamp: expect.any(Number),
      })
    })

    it('should track time on page unload', async () => {
      render(<AnalyticsTestComponent />)
      
      // Let some time pass
      vi.advanceTimersByTime(15000)
      
      // Trigger page unload
      fireEvent(window, new Event('beforeunload'))
      
      expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledWith({
        time_on_page: expect.any(Number),
        page_path: '/',
        timestamp: expect.any(Number),
      })
    })
  })

  describe('Exit Intent Tracking', () => {
    it('should track exit intent trigger and modal interactions', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(<ExitIntent />)
      
      // Trigger exit intent
      triggerMouseLeave()
      
      expect(mockAnalytics.trackExitIntent).toHaveBeenCalledWith('mouse_leave', 'page_top')
      expect(mockAnalytics.trackModalInteraction).toHaveBeenCalledWith('open', 'exit_intent', 'mouse_leave')
      
      // Close modal
      const closeButton = screen.getByLabelText(/close modal/i)
      fireEvent.click(closeButton)
      
      expect(mockAnalytics.trackModalInteraction).toHaveBeenCalledWith('close', 'exit_intent')
    })

    it('should track email submission from exit intent', () => {
      const mockOnSubmit = vi.fn()
      localStorageMock.getItem.mockReturnValue(null)
      
      render(<ExitIntent onSubmit={mockOnSubmit} />)
      
      triggerMouseLeave()
      
      const emailInput = screen.getByPlaceholderText(/enter your email address/i)
      const submitButton = screen.getByRole('button', { name: /get my free guide/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)
      
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
  })

  describe('Button Click Tracking', () => {
    it('should track button clicks with context', () => {
      render(<AnalyticsTestComponent />)
      
      const button = screen.getByRole('button', { name: /track click/i })
      fireEvent.click(button)
      
      expect(mockAnalytics.trackEvent).toHaveBeenCalledWith({
        action: 'button_click',
        category: 'interactions',
        label: 'test-button',
        custom_parameters: {
          location: 'header',
          campaign: 'test',
        },
      })
    })
  })

  describe('Theme Change Tracking', () => {
    it('should track theme changes', () => {
      trackThemeChange('dark', 'light')
      
      expect(mockAnalytics.trackEvent).toHaveBeenCalledWith({
        action: 'theme_change',
        category: 'user_preferences',
        label: 'light_to_dark',
        custom_parameters: {
          new_theme: 'dark',
          previous_theme: 'light',
        },
      })
    })
  })

  describe('Social Share Tracking', () => {
    it('should track social shares', () => {
      trackSocialShare('twitter', 'blog_post', 'https://example.com/post')
      
      expect(mockAnalytics.trackEvent).toHaveBeenCalledWith({
        action: 'social_share',
        category: 'social',
        label: 'twitter',
        custom_parameters: {
          content_type: 'blog_post',
          shared_url: 'https://example.com/post',
        },
      })
    })
  })

  describe('Analytics Integration Scenarios', () => {
    it('should track complete user journey', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(
        <div>
          <AnalyticsTestComponent />
          <ExitIntent />
        </div>
      )
      
      // User spends time on page
      vi.advanceTimersByTime(30000)
      
      expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledWith({
        time_on_page: 30000,
        page_path: '/',
        timestamp: expect.any(Number),
      })
      
      // User scrolls down
      triggerScroll(300)
      vi.advanceTimersByTime(1000)
      
      expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
        scroll_depth: 25,
        page_path: '/',
        timestamp: expect.any(Number),
      })
      
      // User clicks button
      fireEvent.click(screen.getByRole('button', { name: /track click/i }))
      
      expect(mockAnalytics.trackEvent).toHaveBeenCalledWith({
        action: 'button_click',
        category: 'interactions',
        label: 'test-button',
        custom_parameters: {
          location: 'header',
          campaign: 'test',
        },
      })
      
      // User triggers exit intent
      triggerMouseLeave()
      
      expect(mockAnalytics.trackExitIntent).toHaveBeenCalledWith('mouse_leave', 'page_top')
      expect(mockAnalytics.trackModalInteraction).toHaveBeenCalledWith('open', 'exit_intent', 'mouse_leave')
      
      // User submits email
      const emailInput = screen.getByPlaceholderText(/enter your email address/i)
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      fireEvent.click(screen.getByRole('button', { name: /get my free guide/i }))
      
      expect(mockAnalytics.trackEmailSubmission).toHaveBeenCalledWith(
        'exit_intent_form',
        'exit_intent_modal',
        expect.objectContaining({
          email_domain: 'example.com',
        })
      )
      
      // Verify all tracking calls were made
      expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalled()
      expect(mockAnalytics.trackScrollDepth).toHaveBeenCalled()
      expect(mockAnalytics.trackEvent).toHaveBeenCalled()
      expect(mockAnalytics.trackExitIntent).toHaveBeenCalled()
      expect(mockAnalytics.trackModalInteraction).toHaveBeenCalled()
      expect(mockAnalytics.trackEmailSubmission).toHaveBeenCalled()
    })

    it('should handle analytics errors gracefully', () => {
      // Mock analytics to throw error
      mockAnalytics.trackEvent.mockImplementation(() => {
        throw new Error('Analytics error')
      })
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<AnalyticsTestComponent />)
      
      // Should not crash when analytics fails
      fireEvent.click(screen.getByRole('button', { name: /track click/i }))
      
      // Page should still be functional
      expect(screen.getByText('Analytics Test Page')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })

    it('should respect analytics enablement settings', () => {
      // Test with analytics disabled
      function DisabledAnalyticsComponent() {
        useScrollDepth({ enabled: false })
        useTimeOnPage({ enabled: false })
        return <div>Disabled Analytics</div>
      }
      
      render(<DisabledAnalyticsComponent />)
      
      // Advance time and scroll
      vi.advanceTimersByTime(30000)
      triggerScroll(300)
      vi.advanceTimersByTime(1000)
      
      // Should not track when disabled
      expect(mockAnalytics.trackTimeOnPage).not.toHaveBeenCalled()
      expect(mockAnalytics.trackScrollDepth).not.toHaveBeenCalled()
    })

    it('should track performance metrics correctly', async () => {
      render(<AnalyticsTestComponent />)
      
      // Simulate multiple interactions in sequence
      const startTime = Date.now()
      
      // Quick sequence of events
      triggerScroll(100)
      vi.advanceTimersByTime(500)
      
      triggerScroll(300)
      vi.advanceTimersByTime(1000)
      
      fireEvent.click(screen.getByRole('button', { name: /track click/i }))
      
      vi.advanceTimersByTime(29000) // Total 30s
      
      // Should track scroll depth and time on page
      expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
        scroll_depth: 25,
        page_path: '/',
        timestamp: expect.any(Number),
      })
      
      expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledWith({
        time_on_page: 30000,
        page_path: '/',
        timestamp: expect.any(Number),
      })
      
      expect(mockAnalytics.trackEvent).toHaveBeenCalledWith({
        action: 'button_click',
        category: 'interactions',
        label: 'test-button',
        custom_parameters: expect.any(Object),
      })
    })
  })
})