import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Helper function to get client IP
// @ts-ignore - Function kept for future use
// eslint-disable-next-line no-unused-vars
function getClientIP(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('x-remote-addr')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return realIP || remoteAddr || null
}

// Validation function for analytics events
function validateAnalyticsEvent(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.event_name || typeof data.event_name !== 'string') {
    errors.push('event_name is required and must be a string')
  }

  if (data.event_category && typeof data.event_category !== 'string') {
    errors.push('event_category must be a string')
  }

  if (data.event_action && typeof data.event_action !== 'string') {
    errors.push('event_action must be a string')
  }

  if (data.event_value && (typeof data.event_value !== 'number' || data.event_value < 0)) {
    errors.push('event_value must be a positive number')
  }

  if (data.custom_parameters && typeof data.custom_parameters !== 'object') {
    errors.push('custom_parameters must be an object')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle batch events
    const events = Array.isArray(body) ? body : [body]
    
    const validatedEvents = []
    const validationErrors = []

    for (let i = 0; i < events.length; i++) {
      const event = events[i]
      const validation = validateAnalyticsEvent(event)
      
      if (!validation.isValid) {
        validationErrors.push(`Event ${i}: ${validation.errors.join(', ')}`)
        continue
      }

      // Extract client information
      // const clientIP = getClientIP(request) // Commented out - not used yet
      const userAgent = request.headers.get('user-agent')

      // Prepare event data
      const eventData = {
        session_id: event.session_id || null,
        user_id: event.user_id || null,
        event_name: event.event_name,
        event_category: event.event_category || null,
        event_action: event.event_action || null,
        event_label: event.event_label || null,
        event_value: event.event_value || null,
        page_path: event.page_path || null,
        page_title: event.page_title || null,
        page_referrer: event.page_referrer || null,
        custom_parameters: event.custom_parameters || {},
        ip_address: null, // clientIP commented out for now
        user_agent: userAgent,
        device_type: event.device_type || null,
        browser: event.browser || null,
        os: event.os || null,
        country: event.country || null,
        city: event.city || null
      }

      validatedEvents.push(eventData)
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationErrors 
        },
        { status: 400 }
      )
    }

    if (validatedEvents.length === 0) {
      return NextResponse.json(
        { error: 'No valid events to process' },
        { status: 400 }
      )
    }

    // Insert events into database
    const { data, error } = await supabase
      .from('analytics_events')
      .insert(validatedEvents)
      .select('id')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save analytics events' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Analytics events tracked successfully',
        data: { 
          events_processed: validatedEvents.length,
          event_ids: data.map(d => d.id)
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}