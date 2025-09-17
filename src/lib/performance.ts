// Performance monitoring utility for Core Web Vitals
interface PerformanceMetric {
  name: string
  value: number
  delta: number
  id: string
  rating: 'good' | 'needs-improvement' | 'poor'
}

interface WebVitalsReport {
  lcp?: number  // Largest Contentful Paint
  fid?: number  // First Input Delay
  cls?: number  // Cumulative Layout Shift
  fcp?: number  // First Contentful Paint
  ttfb?: number // Time to First Byte
}

// Web Vitals thresholds
const VITALS_THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 800, poor: 1800 }
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// Track performance metrics
export function trackWebVital(metric: PerformanceMetric) {
  // Send to analytics (replace with your preferred analytics service)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.rating,
      custom_parameter_3: metric.id,
    })
  }

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id
    })
  }
}

// Track resource loading performance
export function trackResourceTiming() {
  if (typeof window === 'undefined') return

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource') {
        const resourceEntry = entry as PerformanceResourceTiming
        
        // Track slow resources (> 1s)
        if (resourceEntry.duration > 1000) {
          trackWebVital({
            name: 'slow_resource',
            value: resourceEntry.duration,
            delta: 0,
            id: `${resourceEntry.name}-${Date.now()}`,
            rating: 'poor'
          })
        }
      }
    })
  })

  observer.observe({ entryTypes: ['resource'] })
}

// Track navigation timing
export function trackNavigationTiming() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navTiming) {
      const metrics = {
        ttfb: navTiming.responseStart - navTiming.requestStart,
        domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
        loadComplete: navTiming.loadEventEnd - navTiming.fetchStart,
      }

      Object.entries(metrics).forEach(([name, value]) => {
        if (value > 0) {
          trackWebVital({
            name,
            value,
            delta: 0,
            id: `${name}-${Date.now()}`,
            rating: getRating(name, value)
          })
        }
      })
    }
  })
}

// Performance budget checker
export class PerformanceBudget {
  private static instance: PerformanceBudget
  private metrics: WebVitalsReport = {}
  
  static getInstance(): PerformanceBudget {
    if (!PerformanceBudget.instance) {
      PerformanceBudget.instance = new PerformanceBudget()
    }
    return PerformanceBudget.instance
  }

  updateMetric(name: keyof WebVitalsReport, value: number) {
    this.metrics[name] = value
    this.checkBudget(name, value)
  }

  private checkBudget(name: keyof WebVitalsReport, value: number) {
    const threshold = VITALS_THRESHOLDS[name]
    if (!threshold) return

    const rating = getRating(name, value)
    
    if (rating === 'poor') {
      console.warn(`⚠️ Performance Budget Exceeded: ${name} = ${value}ms (threshold: ${threshold.poor}ms)`)
      
      // Send alert to monitoring service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'performance_budget_exceeded', {
          metric_name: name,
          metric_value: value,
          threshold: threshold.poor
        })
      }
    }
  }

  getReport(): WebVitalsReport {
    return { ...this.metrics }
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Track navigation timing
  trackNavigationTiming()
  
  // Track resource timing
  trackResourceTiming()

  // Track long tasks
  if ('PerformanceObserver' in window) {
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          trackWebVital({
            name: 'long_task',
            value: entry.duration,
            delta: 0,
            id: `long-task-${Date.now()}`,
            rating: entry.duration > 100 ? 'poor' : 'needs-improvement'
          })
        }
      })
    })

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      // Longtask API not supported
    }
  }
}

// Utility to measure custom performance marks
export function measurePerformance(name: string) {
  const startMark = `${name}-start`
  const endMark = `${name}-end`
  const measureName = `${name}-duration`

  return {
    start: () => {
      performance.mark(startMark)
    },
    end: () => {
      performance.mark(endMark)
      performance.measure(measureName, startMark, endMark)
      
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure) {
        trackWebVital({
          name: measureName,
          value: measure.duration,
          delta: 0,
          id: `${measureName}-${Date.now()}`,
          rating: getRating('custom', measure.duration)
        })
      }
      
      // Clean up marks
      performance.clearMarks(startMark)
      performance.clearMarks(endMark)
      performance.clearMeasures(measureName)
    }
  }
}

// Create a performance observer for Web Vitals
export function observeWebVitals() {
  if (typeof window === 'undefined') return

  // Use web-vitals library if available, otherwise implement basic tracking
  try {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      // Convert web-vitals metric format to our format
      const handleMetric = (metric: any) => {
        trackWebVital({
          name: metric.name,
          value: metric.value,
          delta: metric.delta || 0,
          id: metric.id,
          rating: metric.rating || getRating(metric.name.toLowerCase(), metric.value)
        })
      }
      
      // Register the callbacks with proper destructured imports
      if (onCLS && typeof onCLS === 'function') {
        onCLS(handleMetric)
      }
      if (onINP && typeof onINP === 'function') {
        onINP(handleMetric) // FID is deprecated, replaced with INP
      }
      if (onFCP && typeof onFCP === 'function') {
        onFCP(handleMetric)
      }
      if (onLCP && typeof onLCP === 'function') {
        onLCP(handleMetric)
      }
      if (onTTFB && typeof onTTFB === 'function') {
        onTTFB(handleMetric)
      }
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error)
      // Fallback to basic performance tracking
      initPerformanceMonitoring()
    })
  } catch (error) {
    console.warn('Error setting up web-vitals:', error)
    // Fallback to basic performance tracking
    initPerformanceMonitoring()
  }
}