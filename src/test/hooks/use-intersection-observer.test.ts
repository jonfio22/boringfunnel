import { renderHook, act } from '@testing-library/react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { createMockIntersectionObserver } from '../test-utils'

describe('useIntersectionObserver', () => {
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

  it('should create IntersectionObserver with default options', () => {
    const { result } = renderHook(() => useIntersectionObserver())
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0,
        root: null,
        rootMargin: '0%',
      }
    )
    
    expect(result.current[1]).toBeUndefined()
  })

  it('should create IntersectionObserver with custom options', () => {
    const customOptions = {
      threshold: 0.5,
      root: document.body,
      rootMargin: '10px',
    }
    
    renderHook(() => useIntersectionObserver(customOptions))
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      customOptions
    )
  })

  it('should observe element when node is set', () => {
    const { result } = renderHook(() => useIntersectionObserver())
    const mockElement = document.createElement('div')
    
    act(() => {
      result.current[0](mockElement)
    })
    
    expect(observeMock).toHaveBeenCalledWith(mockElement)
  })

  it('should update entry when intersection changes', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {}
    
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: disconnectMock,
      }
    })
    
    const { result } = renderHook(() => useIntersectionObserver())
    const mockElement = document.createElement('div')
    
    act(() => {
      result.current[0](mockElement)
    })
    
    const mockEntry = {
      target: mockElement,
      isIntersecting: true,
      intersectionRatio: 0.5,
    } as IntersectionObserverEntry
    
    act(() => {
      intersectionCallback([mockEntry])
    })
    
    expect(result.current[1]).toEqual(mockEntry)
  })

  it('should disconnect previous observer when options change', () => {
    const { rerender } = renderHook(
      (options) => useIntersectionObserver(options),
      { initialProps: { threshold: 0 } }
    )
    
    rerender({ threshold: 0.5 })
    
    expect(disconnectMock).toHaveBeenCalled()
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2)
  })

  it('should disconnect previous observer when node changes', () => {
    const { result } = renderHook(() => useIntersectionObserver())
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
    
    act(() => {
      result.current[0](element1)
    })
    
    act(() => {
      result.current[0](element2)
    })
    
    expect(disconnectMock).toHaveBeenCalled()
    expect(observeMock).toHaveBeenCalledWith(element2)
  })

  it('should not observe when node is null', () => {
    const { result } = renderHook(() => useIntersectionObserver())
    
    act(() => {
      result.current[0](null)
    })
    
    expect(observeMock).not.toHaveBeenCalled()
  })

  it('should disconnect observer on unmount', () => {
    const { unmount } = renderHook(() => useIntersectionObserver())
    
    unmount()
    
    expect(disconnectMock).toHaveBeenCalled()
  })

  it('should handle multiple threshold values', () => {
    const options = {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
    
    renderHook(() => useIntersectionObserver(options))
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: [0, 0.25, 0.5, 0.75, 1],
      })
    )
  })

  it('should handle rootMargin correctly', () => {
    const options = {
      rootMargin: '10px 20px 30px 40px',
    }
    
    renderHook(() => useIntersectionObserver(options))
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '10px 20px 30px 40px',
      })
    )
  })

  it('should work with custom root element', () => {
    const customRoot = document.createElement('div')
    const options = {
      root: customRoot,
    }
    
    renderHook(() => useIntersectionObserver(options))
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        root: customRoot,
      })
    )
  })
})