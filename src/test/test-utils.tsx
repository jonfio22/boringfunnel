import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'
import { ThemeProvider } from '@/components/theme-provider'

// Mock analytics functions for testing
export const mockAnalytics = {
  trackEvent: vi.fn(),
  trackConversion: vi.fn(),
  trackPageView: vi.fn(),
  trackScrollDepth: vi.fn(),
  trackTimeOnPage: vi.fn(),
  trackFormAbandonment: vi.fn(),
  trackButtonClick: vi.fn(),
  trackEmailSubmission: vi.fn(),
  trackSocialShare: vi.fn(),
  trackThemeChange: vi.fn(),
  trackExitIntent: vi.fn(),
  trackCTAClick: vi.fn(),
  trackModalInteraction: vi.fn(),
  trackPurchase: vi.fn(),
  trackBeginCheckout: vi.fn(),
  trackAddToCart: vi.fn(),
}

// Mock the analytics module
vi.mock('@/lib/analytics', () => mockAnalytics)

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Utility functions for testing
export const createMockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })
  
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  })
  
  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  })
  
  return mockIntersectionObserver
}

export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  })
  
  return localStorageMock
}

export const mockWindowProperties = (props: Partial<Window & typeof globalThis> & {
  scrollTop?: number;
  scrollHeight?: number;
  clientHeight?: number;
}) => {
  Object.defineProperty(window, 'location', {
    value: {
      pathname: '/',
      href: 'http://localhost:3000',
      ...props.location,
    },
    writable: true,
  })
  
  Object.defineProperty(window, 'pageYOffset', {
    value: props.pageYOffset || 0,
    writable: true,
  })
  
  Object.defineProperty(window, 'innerHeight', {
    value: props.innerHeight || 800,
    writable: true,
  })
  
  Object.defineProperty(document, 'documentElement', {
    value: {
      scrollTop: props.scrollTop || 0,
      scrollHeight: props.scrollHeight || 2000,
      clientHeight: props.clientHeight || 800,
    },
    writable: true,
  })
}

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const triggerMouseLeave = () => {
  const event = new MouseEvent('mouseleave', {
    clientY: -10,
    bubbles: true,
  })
  document.dispatchEvent(event)
}

export const triggerScroll = (scrollY: number) => {
  Object.defineProperty(window, 'pageYOffset', {
    value: scrollY,
    writable: true,
  })
  window.dispatchEvent(new Event('scroll'))
}

export const triggerResize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    writable: true,
  })
  Object.defineProperty(window, 'innerHeight', {
    value: height,
    writable: true,
  })
  window.dispatchEvent(new Event('resize'))
}

export const triggerVisibilityChange = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', {
    value: hidden,
    writable: true,
  })
  document.dispatchEvent(new Event('visibilitychange'))
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }