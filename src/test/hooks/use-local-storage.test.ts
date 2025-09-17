import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { mockLocalStorage } from '../test-utils'

describe('useLocalStorage', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>

  beforeEach(() => {
    localStorageMock = mockLocalStorage()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial value when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    expect(result.current[0]).toBe('initial-value')
  })

  it('should return stored value from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    expect(result.current[0]).toBe('stored-value')
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key')
  })

  it('should update localStorage when value changes', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(result.current[0]).toBe('new-value')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'))
  })

  it('should support function updates', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('initial-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    act(() => {
      result.current[1]((prev) => prev + '-updated')
    })
    
    expect(result.current[0]).toBe('initial-value-updated')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('initial-value-updated'))
  })

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    expect(result.current[0]).toBe('initial-value')
    expect(consoleSpy).toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('should handle setItem errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage setItem error')
    })
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(consoleSpy).toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('should work with complex objects', () => {
    const complexObject = { name: 'test', items: [1, 2, 3], nested: { value: true } }
    localStorageMock.getItem.mockReturnValue(JSON.stringify(complexObject))
    
    const { result } = renderHook(() => useLocalStorage('test-key', {}))
    
    expect(result.current[0]).toEqual(complexObject)
  })

  it('should handle malformed JSON in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json-{')
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'))
    
    expect(result.current[0]).toBe('default-value')
    expect(consoleSpy).toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('should not call localStorage on server side', () => {
    // Simulate server environment
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      writable: true,
    })
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    // Should still update state but not call localStorage
    expect(result.current[0]).toBe('new-value')
  })

  it('should update when key changes', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'key1') return JSON.stringify('value1')
      if (key === 'key2') return JSON.stringify('value2')
      return null
    })
    
    const { result, rerender } = renderHook(
      ({ key, initialValue }) => useLocalStorage(key, initialValue),
      { initialProps: { key: 'key1', initialValue: 'default' } }
    )
    
    expect(result.current[0]).toBe('value1')
    
    rerender({ key: 'key2', initialValue: 'default' })
    
    expect(result.current[0]).toBe('value2')
  })
})