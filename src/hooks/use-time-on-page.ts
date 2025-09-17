'use client'

import { useEffect, useRef, useState } from 'react'
import { trackTimeOnPage } from '@/lib/analytics'

interface UseTimeOnPageOptions {
  trackingIntervals?: number[] // Time intervals in seconds to track (default: [30, 60, 120, 300])
  enabled?: boolean            // Whether tracking is enabled (default: true)
  trackOnUnload?: boolean      // Track time when user leaves page (default: true)
}

export function useTimeOnPage(options: UseTimeOnPageOptions = {}) {
  const {
    trackingIntervals = [30, 60, 120, 300], // 30s, 1m, 2m, 5m
    enabled = true,
    trackOnUnload = true,
  } = options

  const [timeOnPage, setTimeOnPage] = useState(0)
  const startTime = useRef<number>(Date.now())
  const lastTrackedInterval = useRef<number>(0)
  const intervalId = useRef<NodeJS.Timeout | undefined>(undefined)
  const isVisible = useRef<boolean>(true)
  const totalVisibleTime = useRef<number>(0)
  const lastVisibilityChange = useRef<number>(Date.now())

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    startTime.current = Date.now()
    lastVisibilityChange.current = Date.now()

    // Track time every second
    intervalId.current = setInterval(() => {
      const currentTime = Date.now()
      const elapsed = Math.floor((currentTime - startTime.current) / 1000)
      
      // Only count time when page is visible
      if (isVisible.current) {
        setTimeOnPage(elapsed)
        
        // Check if we've crossed any tracking intervals
        trackingIntervals.forEach(interval => {
          if (elapsed >= interval && lastTrackedInterval.current < interval) {
            lastTrackedInterval.current = interval
            
            trackTimeOnPage({
              time_on_page: interval * 1000, // Convert to milliseconds
              page_path: window.location.pathname,
              timestamp: currentTime,
            })
          }
        })
      }
    }, 1000)

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      const currentTime = Date.now()
      
      if (document.hidden) {
        // Page became hidden - add visible time to total
        if (isVisible.current) {
          totalVisibleTime.current += currentTime - lastVisibilityChange.current
        }
        isVisible.current = false
      } else {
        // Page became visible
        isVisible.current = true
        lastVisibilityChange.current = currentTime
      }
    }

    // Handle page unload
    const handleBeforeUnload = () => {
      if (!trackOnUnload) return
      
      const currentTime = Date.now()
      const totalTime = isVisible.current 
        ? totalVisibleTime.current + (currentTime - lastVisibilityChange.current)
        : totalVisibleTime.current
      
      // Track final time on page
      trackTimeOnPage({
        time_on_page: totalTime,
        page_path: window.location.pathname,
        timestamp: currentTime,
      })
    }

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      // Cleanup
      if (intervalId.current) {
        clearInterval(intervalId.current)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      // Track final time if component unmounts
      if (trackOnUnload) {
        const currentTime = Date.now()
        const finalTime = isVisible.current 
          ? totalVisibleTime.current + (currentTime - lastVisibilityChange.current)
          : totalVisibleTime.current
        
        trackTimeOnPage({
          time_on_page: finalTime,
          page_path: window.location.pathname,
          timestamp: currentTime,
        })
      }
    }
  }, [enabled, trackOnUnload, trackingIntervals])

  return {
    timeOnPage,
    isVisible: isVisible.current,
    totalVisibleTime: totalVisibleTime.current,
  }
}