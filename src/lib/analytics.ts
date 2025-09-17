'use client'

import { 
  AnalyticsEvent, 
  ConversionEvent, 
  PageViewEvent, 
  ScrollDepthEvent, 
  TimeOnPageEvent,
  FormAbandonmentEvent 
} from '@/types'

// Check if analytics is available and enabled
const isAnalyticsEnabled = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.gtag === 'function' && 
         process.env.NODE_ENV === 'production'
}

// Track custom events
export const trackEvent = (event: AnalyticsEvent): void => {
  if (!isAnalyticsEnabled()) {
    console.log('Analytics (Development):', event)
    return
  }

  window.gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.custom_parameters,
  })
}

// Track conversion events with enhanced ecommerce data
export const trackConversion = (conversion: ConversionEvent): void => {
  if (!isAnalyticsEnabled()) {
    console.log('Conversion (Development):', conversion)
    return
  }

  window.gtag('event', conversion.event_name, {
    currency: conversion.currency || 'USD',
    value: conversion.value,
    transaction_id: conversion.transaction_id,
    items: conversion.items,
  })
}

// Track page views
export const trackPageView = (pageView: PageViewEvent): void => {
  if (!isAnalyticsEnabled()) {
    console.log('Page View (Development):', pageView)
    return
  }

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
    page_title: pageView.page_title,
    page_location: pageView.page_location,
    page_path: pageView.page_path,
    ...pageView.custom_parameters,
  })
}

// Track scroll depth
export const trackScrollDepth = (scrollEvent: ScrollDepthEvent): void => {
  trackEvent({
    action: 'scroll_depth',
    category: 'engagement',
    label: `${scrollEvent.scroll_depth}%`,
    value: scrollEvent.scroll_depth,
    custom_parameters: {
      page_path: scrollEvent.page_path,
      timestamp: scrollEvent.timestamp,
    },
  })
}

// Track time on page
export const trackTimeOnPage = (timeEvent: TimeOnPageEvent): void => {
  trackEvent({
    action: 'time_on_page',
    category: 'engagement',
    label: `${Math.round(timeEvent.time_on_page / 1000)}s`,
    value: Math.round(timeEvent.time_on_page / 1000),
    custom_parameters: {
      page_path: timeEvent.page_path,
      timestamp: timeEvent.timestamp,
    },
  })
}

// Track form abandonment
export const trackFormAbandonment = (abandonmentEvent: FormAbandonmentEvent): void => {
  trackEvent({
    action: 'form_abandonment',
    category: 'forms',
    label: abandonmentEvent.form_name,
    value: Math.round(abandonmentEvent.completion_rate * 100),
    custom_parameters: {
      form_id: abandonmentEvent.form_id,
      field_name: abandonmentEvent.field_name,
      completion_rate: abandonmentEvent.completion_rate,
    },
  })
}

// Track button clicks
export const trackButtonClick = (
  buttonName: string, 
  location: string, 
  additionalData?: Record<string, any>
): void => {
  trackEvent({
    action: 'button_click',
    category: 'interactions',
    label: buttonName,
    custom_parameters: {
      location,
      ...additionalData,
    },
  })
}

// Track email submissions
export const trackEmailSubmission = (
  formType: string, 
  location: string, 
  additionalData?: Record<string, any>
): void => {
  trackEvent({
    action: 'email_submission',
    category: 'conversions',
    label: formType,
    custom_parameters: {
      location,
      ...additionalData,
    },
  })
  
  // Also track as conversion
  trackConversion({
    event_name: 'generate_lead',
    value: 1,
    currency: 'USD',
  })
}

// Track social shares
export const trackSocialShare = (
  platform: string, 
  contentType: string, 
  url?: string
): void => {
  trackEvent({
    action: 'social_share',
    category: 'social',
    label: platform,
    custom_parameters: {
      content_type: contentType,
      shared_url: url || window.location.href,
    },
  })
}

// Track theme changes
export const trackThemeChange = (newTheme: string, previousTheme: string): void => {
  trackEvent({
    action: 'theme_change',
    category: 'user_preferences',
    label: `${previousTheme}_to_${newTheme}`,
    custom_parameters: {
      new_theme: newTheme,
      previous_theme: previousTheme,
    },
  })
}

// Track exit intent
export const trackExitIntent = (trigger: string, location: string): void => {
  trackEvent({
    action: 'exit_intent',
    category: 'engagement',
    label: trigger,
    custom_parameters: {
      location,
      timestamp: Date.now(),
    },
  })
}

// Track CTA interactions
export const trackCTAClick = (
  ctaText: string, 
  ctaLocation: string, 
  ctaType: string = 'button'
): void => {
  trackEvent({
    action: 'cta_click',
    category: 'conversions',
    label: ctaText,
    custom_parameters: {
      cta_location: ctaLocation,
      cta_type: ctaType,
    },
  })
}

// Track modal interactions
export const trackModalInteraction = (
  action: 'open' | 'close' | 'submit' | 'select_resource',
  modalName: string,
  trigger?: string
): void => {
  trackEvent({
    action: `modal_${action}`,
    category: 'modals',
    label: modalName,
    custom_parameters: {
      trigger,
      timestamp: Date.now(),
    },
  })
}

// Enhanced ecommerce tracking helpers
export const trackPurchase = (
  transactionId: string,
  value: number,
  items: ConversionEvent['items'] = []
): void => {
  trackConversion({
    event_name: 'purchase',
    transaction_id: transactionId,
    value,
    currency: 'USD',
    items,
  })
}

export const trackBeginCheckout = (value: number, items: ConversionEvent['items'] = []): void => {
  trackConversion({
    event_name: 'begin_checkout',
    value,
    currency: 'USD',
    items,
  })
}

export const trackAddToCart = (
  itemId: string,
  itemName: string,
  category: string,
  value: number
): void => {
  trackConversion({
    event_name: 'add_to_cart',
    value,
    currency: 'USD',
    items: [{
      item_id: itemId,
      item_name: itemName,
      category,
      quantity: 1,
      price: value,
    }],
  })
}

// Debug function for development
export const debugAnalytics = (): void => {
  if (typeof window !== 'undefined') {
    console.log('Analytics Debug Info:', {
      gtagAvailable: typeof window.gtag === 'function',
      dataLayerLength: window.dataLayer?.length || 0,
      environment: process.env.NODE_ENV,
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    })
  }
}