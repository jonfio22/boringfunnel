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

// Validation function for form analytics
function validateFormAnalytics(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.form_id || typeof data.form_id !== 'string') {
    errors.push('form_id is required and must be a string')
  }

  if (!data.event_type || typeof data.event_type !== 'string') {
    errors.push('event_type is required and must be a string')
  } else {
    const validEventTypes = ['focus', 'blur', 'input', 'submit', 'abandon']
    if (!validEventTypes.includes(data.event_type)) {
      errors.push(`event_type must be one of: ${validEventTypes.join(', ')}`)
    }
  }

  if (data.field_value_length && (typeof data.field_value_length !== 'number' || data.field_value_length < 0)) {
    errors.push('field_value_length must be a positive number')
  }

  if (data.time_spent_seconds && (typeof data.time_spent_seconds !== 'number' || data.time_spent_seconds < 0)) {
    errors.push('time_spent_seconds must be a positive number')
  }

  if (data.completion_rate && (typeof data.completion_rate !== 'number' || data.completion_rate < 0 || data.completion_rate > 100)) {
    errors.push('completion_rate must be a number between 0 and 100')
  }

  if (data.custom_data && typeof data.custom_data !== 'object') {
    errors.push('custom_data must be an object')
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
      const validation = validateFormAnalytics(event)
      
      if (!validation.isValid) {
        validationErrors.push(`Event ${i}: ${validation.errors.join(', ')}`)
        continue
      }

      // Extract client information (currently unused but available for future use)
      // const clientIP = getClientIP(request)

      // Prepare event data
      const eventData = {
        session_id: event.session_id || null,
        form_id: event.form_id,
        form_name: event.form_name || null,
        field_name: event.field_name || null,
        event_type: event.event_type,
        field_value_length: event.field_value_length || null,
        time_spent_seconds: event.time_spent_seconds || null,
        completion_rate: event.completion_rate || null,
        step_number: event.step_number || null,
        total_steps: event.total_steps || null,
        page_path: event.page_path || null,
        custom_data: event.custom_data || {}
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
      .from('form_analytics')
      .insert(validatedEvents)
      .select('id')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save form analytics events' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Form analytics events tracked successfully',
        data: { 
          events_processed: validatedEvents.length,
          event_ids: data.map(d => d.id)
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Form Analytics API error:', error)
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