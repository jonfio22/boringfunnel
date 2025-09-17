'use client'

import { useEffect, useRef } from 'react'
import { trackScrollDepth } from '@/lib/analytics'

interface UseScrollDepthOptions {
  thresholds?: number[] // Percentage thresholds to track (default: [25, 50, 75, 100])
  debounceMs?: number   // Debounce time in milliseconds (default: 1000)
  enabled?: boolean     // Whether tracking is enabled (default: true)
}

export function useScrollDepth(options: UseScrollDepthOptions = {}) {
  const {
    thresholds = [25, 50, 75, 100],
    debounceMs = 1000,
    enabled = true,
  } = options

  const trackedThresholds = useRef<Set<number>>(new Set())
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined)
  const maxScrollDepth = useRef<number>(0)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const handleScroll = () => {
      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      // Debounce the scroll calculation
      debounceTimer.current = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        
        // Calculate scroll percentage
        const scrollableHeight = documentHeight - windowHeight
        const scrollPercentage = scrollableHeight > 0 
          ? Math.round((scrollTop / scrollableHeight) * 100) 
          : 100

        // Update max scroll depth
        if (scrollPercentage > maxScrollDepth.current) {
          maxScrollDepth.current = scrollPercentage
        }

        // Check if any new thresholds have been crossed
        thresholds.forEach(threshold => {
          if (
            scrollPercentage >= threshold && 
            !trackedThresholds.current.has(threshold)
          ) {
            trackedThresholds.current.add(threshold)
            
            // Track the scroll depth event
            trackScrollDepth({
              scroll_depth: threshold,
              page_path: window.location.pathname,
              timestamp: Date.now(),
            })
          }
        })
      }, debounceMs)
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [thresholds, debounceMs, enabled])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return {
    maxScrollDepth: maxScrollDepth.current,
    trackedThresholds: Array.from(trackedThresholds.current),
  }
}