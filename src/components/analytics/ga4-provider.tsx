'use client'

import Script from 'next/script'
import { createContext, useContext, useEffect, ReactNode } from 'react'
import { AnalyticsConfig } from '@/types'

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      target: string,
      config?: Record<string, any>
    ) => void
    dataLayer: any[]
  }
}

interface GA4ContextType {
  isEnabled: boolean
  measurementId: string | null
}

const GA4Context = createContext<GA4ContextType>({
  isEnabled: false,
  measurementId: null,
})

export const useGA4 = () => {
  const context = useContext(GA4Context)
  if (!context) {
    throw new Error('useGA4 must be used within a GA4Provider')
  }
  return context
}

interface GA4ProviderProps {
  children: ReactNode
  config?: AnalyticsConfig
}

export function GA4Provider({ children, config }: GA4ProviderProps) {
  const measurementId = config?.ga_measurement_id || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null
  const isEnabled = Boolean(measurementId && process.env.NODE_ENV === 'production')
  
  useEffect(() => {
    if (!isEnabled || !measurementId) return

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || []
    
    // Initialize gtag function
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    
    // Set gtag on window
    window.gtag = gtag
    
    // Configure gtag with timestamp
    gtag('js', new Date())
    
    // Configure GA4 with measurement ID and settings
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: config?.anonymize_ip ?? true,
      debug_mode: config?.debug_mode ?? false,
      custom_map: config?.custom_dimensions,
      // Enhanced measurement settings
      enhanced_measurement: {
        scrolls: true,
        outbound_clicks: true,
        site_search: false,
        video_engagement: true,
        file_downloads: true,
      },
      // Cookie settings for privacy compliance
      cookie_flags: 'SameSite=None;Secure',
      cookie_expires: 63072000, // 2 years in seconds
    })

    // Set custom dimensions if provided
    if (config?.custom_dimensions) {
      Object.entries(config.custom_dimensions).forEach(([key, value]) => {
        gtag('set', { [key]: value })
      })
    }
  }, [isEnabled, measurementId, config])

  return (
    <GA4Context.Provider value={{ isEnabled, measurementId }}>
      {isEnabled && measurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="lazyOnload"
          />
          <Script id="gtag-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', {
                page_title: document.title,
                page_location: window.location.href,
                anonymize_ip: ${config?.anonymize_ip ?? true},
                debug_mode: ${config?.debug_mode ?? false}
              });
            `}
          </Script>
        </>
      )}
      {children}
    </GA4Context.Provider>
  )
}