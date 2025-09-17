import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Helper function to get client IP (commented out as unused in this endpoint)
// function getClientIP(request: NextRequest): string | null {
//   const forwarded = request.headers.get('x-forwarded-for')
//   const realIP = request.headers.get('x-real-ip')
//   const remoteAddr = request.headers.get('x-remote-addr')
//   
//   if (forwarded) {
//     return forwarded.split(',')[0].trim()
//   }
//   
//   return realIP || remoteAddr || null
// }

// Validation function for conversion events
function validateConversionEvent(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.event_name || typeof data.event_name !== 'string') {
    errors.push('event_name is required and must be a string')
  }

  if (data.conversion_value && (typeof data.conversion_value !== 'number' || data.conversion_value < 0)) {
    errors.push('conversion_value must be a positive number')
  }

  if (data.currency && typeof data.currency !== 'string') {
    errors.push('currency must be a string')
  }

  if (data.items && !Array.isArray(data.items)) {
    errors.push('items must be an array')
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
      const validation = validateConversionEvent(event)
      
      if (!validation.isValid) {
        validationErrors.push(`Event ${i}: ${validation.errors.join(', ')}`)
        continue
      }

      // Prepare event data
      const eventData = {
        session_id: event.session_id || null,
        user_id: event.user_id || null,
        event_name: event.event_name,
        conversion_value: event.conversion_value || null,
        currency: event.currency || 'USD',
        transaction_id: event.transaction_id || null,
        items: event.items || [],
        source: event.source || null,
        medium: event.medium || null,
        campaign: event.campaign || null,
        custom_parameters: event.custom_parameters || {}
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
      .from('conversion_events')
      .insert(validatedEvents)
      .select('id')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save conversion events' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Conversion events tracked successfully',
        data: { 
          events_processed: validatedEvents.length,
          event_ids: data.map(d => d.id)
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Conversion Analytics API error:', error)
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