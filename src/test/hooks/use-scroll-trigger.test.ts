import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import { useScrollTrigger, useScrollProgress, useScrollDirection, useScrollPastElement } from '@/hooks/use-scroll-trigger'
import { createMockIntersectionObserver, mockWindowProperties, triggerScroll } from '../test-utils'

describe('useScrollTrigger', () => {
  let mockIntersectionObserver: ReturnType<typeof createMockIntersectionObserver>
  let observeMock: ReturnType<typeof vi.fn>
  let unobserveMock: ReturnType<typeof vi.fn>
  let disconnectMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    observeMock = vi.fn()
    unobserveMock = vi.fn()
    disconnectMock = vi.fn()
    
    mockIntersectionObserver = createMockIntersectionObserver()
    mockIntersectionObserver.mockReturnValue({
      observe: observeMock,
      unobserve: unobserveMock,
      disconnect: disconnectMock,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useScrollTrigger(ref)
    })
    
    expect(result.current.isTriggered).toBe(false)
    expect(result.current.isVisible).toBe(false)
  })

  it('should trigger when element comes into view', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {}
    
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: disconnectMock,
      }
    })
    
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      ref.current = document.createElement('div')
      return useScrollTrigger(ref)
    })
    
    const mockEntry = {
      isIntersecting: true,
      target: result.current,
    } as IntersectionObserverEntry
    
    act(() => {
      intersectionCallback([mockEntry])
    })
    
    expect(result.current.isTriggered).toBe(true)
    expect(result.current.isVisible).toBe(true)
  })

  it('should not reset trigger when triggerOnce is true (default)', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {}
    
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: disconnectMock,
      }
    })
    
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      ref.current = document.createElement('div')
      return useScrollTrigger(ref)
    })
    
    // Element comes into view
    act(() => {
      intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry])
    })
    
    expect(result.current.isTriggered).toBe(true)
    expect(result.current.isVisible).toBe(true)
    
    // Element goes out of view
    act(() => {
      intersectionCallback([{ isIntersecting: false } as IntersectionObserverEntry])
    })
    
    expect(result.current.isTriggered).toBe(true) // Should remain triggered
    expect(result.current.isVisible).toBe(false)
  })

  it('should reset trigger when triggerOnce is false', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {}
    
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: disconnectMock,
      }
    })
    
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      ref.current = document.createElement('div')
      return useScrollTrigger(ref, { triggerOnce: false })
    })
    
    // Element comes into view
    act(() => {
      intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry])
    })
    
    expect(result.current.isTriggered).toBe(true)
    expect(result.current.isVisible).toBe(true)
    
    // Element goes out of view
    act(() => {
      intersectionCallback([{ isIntersecting: false } as IntersectionObserverEntry])
    })
    
    expect(result.current.isTriggered).toBe(false) // Should reset
    expect(result.current.isVisible).toBe(false)
  })

  it('should use custom options', () => {
    const customOptions = {
      threshold: 0.5,
      rootMargin: '10px',
      triggerOnce: false,
    }
    
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      ref.current = document.createElement('div')
      return useScrollTrigger(ref, customOptions)
    })
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.5,
        rootMargin: '10px',
      }
    )
  })

  it('should not observe when element is null', () => {
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useScrollTrigger(ref)
    })
    
    expect(observeMock).not.toHaveBeenCalled()
  })

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      ref.current = document.createElement('div')
      return useScrollTrigger(ref)
    })
    
    unmount()
    
    expect(unobserveMock).toHaveBeenCalled()
  })
})

describe('useScrollProgress', () => {
  beforeEach(() => {
    mockWindowProperties({
      pageYOffset: 0,
      innerHeight: 800,
      scrollHeight: 2000,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with 0 progress', () => {
    const { result } = renderHook(() => useScrollProgress())
    
    expect(result.current).toBe(0)
  })

  it('should calculate scroll progress correctly', () => {
    const { result } = renderHook(() => useScrollProgress())
    
    act(() => {
      triggerScroll(600) // 50% of scrollable height (1200)
    })
    
    expect(result.current).toBe(50)
  })

  it('should handle 100% scroll', () => {
    const { result } = renderHook(() => useScrollProgress())
    
    act(() => {
      triggerScroll(1200) // 100% of scrollable height
    })
    
    expect(result.current).toBe(100)
  })

  it('should not exceed 100%', () => {
    const { result } = renderHook(() => useScrollProgress())
    
    act(() => {
      triggerScroll(2000) // More than scrollable height
    })
    
    expect(result.current).toBe(100)
  })

  it('should handle edge case where document height equals window height', () => {
    mockWindowProperties({
      pageYOffset: 0,
      innerHeight: 800,
      scrollHeight: 800,
    })
    
    const { result } = renderHook(() => useScrollProgress())
    
    expect(result.current).toBe(0)
  })

  it('should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useScrollProgress())
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})

describe('useScrollDirection', () => {
  beforeEach(() => {
    mockWindowProperties({ pageYOffset: 0 })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with null direction', () => {
    const { result } = renderHook(() => useScrollDirection())
    
    expect(result.current).toBe(null)
  })

  it('should detect downward scroll', () => {
    const { result } = renderHook(() => useScrollDirection())
    
    act(() => {
      triggerScroll(100)
    })
    
    expect(result.current).toBe('down')
  })

  it('should detect upward scroll', () => {
    const { result } = renderHook(() => useScrollDirection())
    
    // First scroll down
    act(() => {
      triggerScroll(100)
    })
    
    // Then scroll up
    act(() => {
      triggerScroll(50)
    })
    
    expect(result.current).toBe('up')
  })

  it('should handle multiple direction changes', () => {
    const { result } = renderHook(() => useScrollDirection())
    
    act(() => {
      triggerScroll(100) // down
    })
    expect(result.current).toBe('down')
    
    act(() => {
      triggerScroll(50) // up
    })
    expect(result.current).toBe('up')
    
    act(() => {
      triggerScroll(150) // down
    })
    expect(result.current).toBe('down')
  })

  it('should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useScrollDirection())
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})

describe('useScrollPastElement', () => {
  beforeEach(() => {
    mockWindowProperties({ pageYOffset: 0 })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with false', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useScrollPastElement(ref)
    })
    
    expect(result.current).toBe(false)
  })

  it('should detect when scrolled past element', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      const element = document.createElement('div')
      
      // Mock getBoundingClientRect
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        bottom: -10, // Element is above viewport
      })
      
      ref.current = element
      return useScrollPastElement(ref)
    })
    
    act(() => {
      triggerScroll(100)
    })
    
    expect(result.current).toBe(true)
  })

  it('should return false when element is still visible', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      const element = document.createElement('div')
      
      // Mock getBoundingClientRect
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        bottom: 100, // Element is still in viewport
      })
      
      ref.current = element
      return useScrollPastElement(ref)
    })
    
    act(() => {
      triggerScroll(100)
    })
    
    expect(result.current).toBe(false)
  })

  it('should handle null element ref', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useScrollPastElement(ref)
    })
    
    act(() => {
      triggerScroll(100)
    })
    
    expect(result.current).toBe(false)
  })

  it('should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useScrollPastElement(ref)
    })
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})