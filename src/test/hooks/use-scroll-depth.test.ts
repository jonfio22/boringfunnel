import { renderHook, act } from '@testing-library/react'
import { useScrollDepth } from '@/hooks/use-scroll-depth'
import { mockAnalytics, mockWindowProperties, triggerScroll, wait } from '../test-utils'

describe('useScrollDepth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWindowProperties({
      pageYOffset: 0,
      innerHeight: 800,
      scrollHeight: 2000,
      location: { pathname: '/test-page' },
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should initialize with default options', () => {
    const { result } = renderHook(() => useScrollDepth())
    
    expect(result.current.maxScrollDepth).toBe(0)
    expect(result.current.trackedThresholds).toEqual([])
  })

  it('should track scroll depth at default thresholds', async () => {
    const { result } = renderHook(() => useScrollDepth())
    
    // Scroll to 25%
    act(() => {
      triggerScroll(300) // 300 / 1200 * 100 = 25%
    })
    
    act(() => {
      vi.advanceTimersByTime(1000) // Wait for debounce
    })
    
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
      scroll_depth: 25,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
    
    expect(result.current.trackedThresholds).toContain(25)
  })

  it('should track multiple thresholds', async () => {
    renderHook(() => useScrollDepth())
    
    // Scroll to 25%
    act(() => {
      triggerScroll(300)
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    // Scroll to 50%
    act(() => {
      triggerScroll(600)
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledTimes(2)
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
      scroll_depth: 25,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
      scroll_depth: 50,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
  })

  it('should not track same threshold twice', async () => {
    renderHook(() => useScrollDepth())
    
    // Scroll to 25% multiple times
    act(() => {
      triggerScroll(300)
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    act(() => {
      triggerScroll(250)
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    act(() => {
      triggerScroll(350)
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledTimes(1)
  })

  it('should work with custom thresholds', async () => {
    const customOptions = {
      thresholds: [10, 30, 60, 90],
    }
    
    renderHook(() => useScrollDepth(customOptions))
    
    // Scroll to 30%
    act(() => {
      triggerScroll(360)
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
      scroll_depth: 30,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
  })

  it('should respect custom debounce time', async () => {
    const customOptions = {
      debounceMs: 500,
    }
    
    renderHook(() => useScrollDepth(customOptions))
    
    act(() => {
      triggerScroll(300)
    })
    
    // Should not track yet
    act(() => {
      vi.advanceTimersByTime(400)
    })
    
    expect(mockAnalytics.trackScrollDepth).not.toHaveBeenCalled()
    
    // Now it should track
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalled()
  })

  it('should not track when disabled', async () => {
    const { result } = renderHook(() => useScrollDepth({ enabled: false }))
    
    act(() => {
      triggerScroll(300)
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(mockAnalytics.trackScrollDepth).not.toHaveBeenCalled()
    expect(result.current.trackedThresholds).toEqual([])
  })

  it('should debounce scroll events', async () => {
    renderHook(() => useScrollDepth())
    
    // Rapid scroll events
    act(() => {
      triggerScroll(100)
      triggerScroll(200)
      triggerScroll(300)
    })
    
    // Should not track yet
    expect(mockAnalytics.trackScrollDepth).not.toHaveBeenCalled()
    
    // Wait for debounce
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    // Should only track once with the final position
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledTimes(1)
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
      scroll_depth: 25,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
  })

  it('should update max scroll depth', () => {
    const { result } = renderHook(() => useScrollDepth())
    
    act(() => {
      triggerScroll(300)
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(result.current.maxScrollDepth).toBe(25)
    
    act(() => {
      triggerScroll(600)
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(result.current.maxScrollDepth).toBe(50)
  })

  it('should handle 100% scroll correctly', async () => {
    renderHook(() => useScrollDepth())
    
    // Scroll to bottom
    act(() => {
      triggerScroll(1200) // Full scroll
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
      scroll_depth: 100,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
  })

  it('should handle edge case where scrollable height is 0', async () => {
    mockWindowProperties({
      pageYOffset: 0,
      innerHeight: 800,
      scrollHeight: 800, // Same as window height
    })
    
    renderHook(() => useScrollDepth())
    
    act(() => {
      triggerScroll(0)
    })
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(mockAnalytics.trackScrollDepth).toHaveBeenCalledWith({
      scroll_depth: 100,
      page_path: '/test-page',
      timestamp: expect.any(Number),
    })
  })

  it('should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useScrollDepth())
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('should not run on server side', () => {
    Object.defineProperty(window, 'location', {
      value: undefined,
      writable: true,
    })
    
    renderHook(() => useScrollDepth())
    
    expect(mockAnalytics.trackScrollDepth).not.toHaveBeenCalled()
  })
})