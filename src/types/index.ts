// Common types for the application

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface ContactForm {
  name: string
  email: string
  company?: string
  message: string
}

export interface Newsletter {
  email: string
  subscribed_at: string
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  order: number
}

export interface Testimonial {
  id: string
  name: string
  company: string
  role: string
  content: string
  avatar_url?: string
  rating: number
}

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  popular?: boolean
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined
}

// Analytics types
export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

export interface ConversionEvent {
  event_name: string
  currency?: string
  value?: number
  transaction_id?: string
  items?: Array<{
    item_id: string
    item_name: string
    category: string
    quantity?: number
    price?: number
  }>
}

export interface PageViewEvent {
  page_title: string
  page_location: string
  page_path: string
  custom_parameters?: Record<string, any>
}

export interface ScrollDepthEvent {
  scroll_depth: number
  page_path: string
  timestamp: number
}

export interface TimeOnPageEvent {
  time_on_page: number
  page_path: string
  timestamp: number
}

export interface FormAbandonmentEvent {
  form_id: string
  form_name: string
  field_name: string
  completion_rate: number
}

export interface AnalyticsConfig {
  ga_measurement_id?: string
  debug_mode?: boolean
  anonymize_ip?: boolean
  custom_dimensions?: Record<string, string>
}