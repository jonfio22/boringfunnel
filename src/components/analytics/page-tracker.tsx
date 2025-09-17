'use client'

import { useEffect } from 'react'
import { useScrollDepth } from '@/hooks/use-scroll-depth'
import { useTimeOnPage } from '@/hooks/use-time-on-page'
import { trackPageView } from '@/lib/analytics'

interface PageTrackerProps {
  pageName?: string
  trackScrollDepth?: boolean
  trackTimeOnPage?: boolean
  children?: React.ReactNode
}

export function PageTracker({ 
  pageName, 
  trackScrollDepth = true, 
  trackTimeOnPage = true,
  children 
}: PageTrackerProps) {
  // Enable scroll depth tracking
  useScrollDepth({ 
    enabled: trackScrollDepth,
    thresholds: [25, 50, 75, 100]
  })
  
  // Enable time on page tracking
  useTimeOnPage({ 
    enabled: trackTimeOnPage,
    trackingIntervals: [30, 60, 120, 300] // 30s, 1m, 2m, 5m
  })

  // Track page view on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && pageName) {
      trackPageView({
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname,
        custom_parameters: {
          timestamp: Date.now(),
        }
      })
    }
  }, [pageName])

  return <>{children}</>
}