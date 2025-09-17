'use client'

import { useEffect } from 'react'
import { observeWebVitals, initPerformanceMonitoring } from '@/lib/performance'

interface PerformanceProviderProps {
  children: React.ReactNode
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  useEffect(() => {
    // Wrap everything in a try-catch to prevent crashes
    let cleanup: (() => void) | undefined
    
    try {
      // Initialize performance monitoring
      initPerformanceMonitoring()
      
      // Observe Web Vitals
      observeWebVitals()
      
      // Track initial page load performance
      const trackPageLoad = () => {
        try {
          if (typeof window !== 'undefined' && window.performance) {
            const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            
            if (navTiming) {
              // Track page load time
              const loadTime = navTiming.loadEventEnd - navTiming.fetchStart
              
              if (window.gtag) {
                window.gtag('event', 'page_load_time', {
                  custom_parameter_1: loadTime,
                  custom_parameter_2: loadTime > 3000 ? 'slow' : loadTime > 1000 ? 'medium' : 'fast'
                })
              }
              
              console.log(`Page load time: ${loadTime}ms`)
            }
          }
        } catch (error) {
          console.warn('Error tracking page load performance:', error)
        }
      }

      // Track when page is fully loaded
      if (typeof document !== 'undefined') {
        if (document.readyState === 'complete') {
          trackPageLoad()
        } else {
          window.addEventListener('load', trackPageLoad)
        }
      }

      cleanup = () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('load', trackPageLoad)
        }
      }
    } catch (error) {
      console.warn('Error initializing performance provider:', error)
    }

    return cleanup
  }, [])

  return <>{children}</>
}

// HOC for measuring component render performance
export function withPerformanceTracking<T extends {}>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: T) {
    useEffect(() => {
      const startTime = performance.now()
      
      return () => {
        const endTime = performance.now()
        const renderTime = endTime - startTime
        
        if (renderTime > 16) { // Longer than one frame at 60fps
          console.warn(`Slow component render: ${componentName} took ${renderTime}ms`)
          
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'slow_component_render', {
              component_name: componentName,
              render_time: renderTime
            })
          }
        }
      }
    })

    return <Component {...props} />
  }
}