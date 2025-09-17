import { renderHook, act } from '@testing-library/react'
import { useTimeOnPage } from '@/hooks/use-time-on-page'
import { mockAnalytics, mockWindowProperties, triggerVisibilityChange } from '../test-utils'

describe('useTimeOnPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWindowProperties({
      location: { pathname: '/test-page' },
    })
    vi.useFakeTimers()
    Object.defineProperty(document, 'hidden', {
      value: false,
      writable: true,
    })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTimeOnPage())
    
    expect(result.current.timeOnPage).toBe(0)
    expect(result.current.isVisible).toBe(true)
    expect(result.current.totalVisibleTime).toBe(0)
  })

  it('should track time progression', () => {
    const { result } = renderHook(() => useTimeOnPage())
    
    // Advance time by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    expect(result.current.timeOnPage).toBe(5)
  })

  it('should track time intervals and call analytics', () => {
    renderHook(() => useTimeOnPage())
    
    // Advance time to trigger 30s interval
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    
    expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledWith({
      time_on_page: 30000,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
  })

  it('should track multiple intervals', () => {
    renderHook(() => useTimeOnPage())
    
    // Advance time to trigger 30s interval
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    
    // Advance time to trigger 60s interval
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    
    expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledTimes(2)
    expect(mockAnalytics.trackTimeOnPage).toHaveBeenNthCalledWith(1, {
      time_on_page: 30000,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
    expect(mockAnalytics.trackTimeOnPage).toHaveBeenNthCalledWith(2, {
      time_on_page: 60000,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
  })

  it('should use custom tracking intervals', () => {
    const customOptions = {
      trackingIntervals: [10, 20, 40],
    }
    
    renderHook(() => useTimeOnPage(customOptions))
    
    // Advance time to trigger 10s interval
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    
    expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledWith({
      time_on_page: 10000,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
  })

  it('should not track when disabled', () => {
    const { result } = renderHook(() => useTimeOnPage({ enabled: false }))
    
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    
    expect(mockAnalytics.trackTimeOnPage).not.toHaveBeenCalled()
    expect(result.current.timeOnPage).toBe(0)
  })

  it('should handle page visibility changes', () => {
    const { result } = renderHook(() => useTimeOnPage())
    
    // Page becomes hidden
    act(() => {
      triggerVisibilityChange(true)
    })
    
    expect(result.current.isVisible).toBe(false)
    
    // Advance time while hidden - should not count
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    
    expect(result.current.timeOnPage).toBe(0)
    
    // Page becomes visible again
    act(() => {
      triggerVisibilityChange(false)
    })
    
    expect(result.current.isVisible).toBe(true)
  })

  it('should track time on page unload', () => {
    renderHook(() => useTimeOnPage())
    
    // Advance some time
    act(() => {
      vi.advanceTimersByTime(15000)
    })
    
    // Trigger beforeunload event
    act(() => {
      window.dispatchEvent(new Event('beforeunload'))
    })
    
    expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledWith({
      time_on_page: expect.any(Number),
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
  })

  it('should not track on unload when disabled', () => {
    renderHook(() => useTimeOnPage({ trackOnUnload: false }))
    
    act(() => {
      vi.advanceTimersByTime(15000)
    })
    
    act(() => {
      window.dispatchEvent(new Event('beforeunload'))
    })
    
    // Should only track the 30s interval, not the unload
    expect(mockAnalytics.trackTimeOnPage).not.toHaveBeenCalled()
  })

  it('should track time on component unmount', () => {
    const { unmount } = renderHook(() => useTimeOnPage())
    
    act(() => {
      vi.advanceTimersByTime(15000)
    })
    
    unmount()
    
    expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledWith({
      time_on_page: expect.any(Number),
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
  })

  it('should not track on unmount when trackOnUnload is false', () => {
    const { unmount } = renderHook(() => useTimeOnPage({ trackOnUnload: false }))
    
    act(() => {
      vi.advanceTimersByTime(15000)
    })
    
    unmount()
    
    expect(mockAnalytics.trackTimeOnPage).not.toHaveBeenCalled()
  })

  it('should handle visibility change timing correctly', () => {
    renderHook(() => useTimeOnPage())
    
    // Let some time pass while visible
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    // Page becomes hidden
    act(() => {
      triggerVisibilityChange(true)
    })
    
    // Let time pass while hidden
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    
    // Page becomes visible again
    act(() => {
      triggerVisibilityChange(false)
    })
    
    // Let more time pass
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    // Total elapsed time should be 20s, but visible time should be only 10s
    expect(mockAnalytics.trackTimeOnPage).not.toHaveBeenCalled() // No interval reached
  })

  it('should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const removeWindowEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useTimeOnPage())
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    expect(removeWindowEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })

  it('should not run on server side', () => {
    Object.defineProperty(window, 'location', {
      value: undefined,
      writable: true,
    })
    
    const { result } = renderHook(() => useTimeOnPage())
    
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    
    expect(mockAnalytics.trackTimeOnPage).not.toHaveBeenCalled()
    expect(result.current.timeOnPage).toBe(0)
  })

  it('should only track each interval once', () => {
    renderHook(() => useTimeOnPage())
    
    // Advance to 30s
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    
    // Advance to 35s (should not trigger 30s again)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    // Advance to 60s (should trigger 60s)
    act(() => {
      vi.advanceTimersByTime(25000)
    })
    
    expect(mockAnalytics.trackTimeOnPage).toHaveBeenCalledTimes(2)
  })

  it('should calculate total visible time correctly with multiple visibility changes', () => {
    const { result } = renderHook(() => useTimeOnPage())
    
    // 5 seconds visible
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    // Hide page
    act(() => {
      triggerVisibilityChange(true)
    })
    
    // 10 seconds hidden
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    
    // Show page again
    act(() => {
      triggerVisibilityChange(false)
    })
    
    // 10 more seconds visible
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    
    // Total elapsed: 25s, but only 15s visible
    expect(result.current.timeOnPage).toBe(25) // Total time regardless of visibility
  })
})