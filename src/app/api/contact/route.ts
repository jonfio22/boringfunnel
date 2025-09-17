import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sanitizeFormData, sanitizeEmail } from '@/lib/sanitize'
import { withRateLimit } from '@/lib/rate-limit'

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

// Helper function to extract UTM parameters from URL
function extractUTMParams(url: string) {
  const urlObj = new URL(url)
  return {
    utm_source: urlObj.searchParams.get('utm_source'),
    utm_medium: urlObj.searchParams.get('utm_medium'),
    utm_campaign: urlObj.searchParams.get('utm_campaign'),
    utm_content: urlObj.searchParams.get('utm_content'),
    utm_term: urlObj.searchParams.get('utm_term'),
  }
}

// Validation function
function validateContactForm(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 1) {
    errors.push('Name is required')
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format')
    }
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }

  if (data.company && typeof data.company !== 'string') {
    errors.push('Company must be a string')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Sanitize input data
    const sanitizedBody = sanitizeFormData(body)
    
    // Validate and sanitize email specifically
    const validEmail = sanitizeEmail(sanitizedBody.email)
    if (!validEmail) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: ['Invalid email format'] 
        },
        { status: 400 }
      )
    }
    sanitizedBody.email = validEmail
    
    // Validate the sanitized data
    const validation = validateContactForm(sanitizedBody)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      )
    }

    // Extract client information
    // const clientIP = getClientIP(request) // Commented out - not used yet
    const userAgent = request.headers.get('user-agent')
    const referrer = request.headers.get('referer')
    
    // Extract UTM parameters from referrer if available
    const utmParams = referrer ? extractUTMParams(referrer) : {}

    // Prepare data for database insertion
    const contactData = {
      name: sanitizedBody.name,
      email: sanitizedBody.email,
      company: sanitizedBody.company || null,
      message: sanitizedBody.message,
      source: 'contact_form',
      ip_address: null, // clientIP commented out for now
      user_agent: userAgent,
      referrer: referrer,
      ...utmParams
    }

    // Insert into database
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save contact information' },
        { status: 500 }
      )
    }

    // Track analytics event
    const analyticsData = {
      event_name: 'contact_form_submit',
      event_category: 'engagement',
      event_action: 'submit',
      event_label: 'contact_form',
      page_path: '/contact',
      custom_parameters: {
        has_company: !!sanitizedBody.company,
        message_length: sanitizedBody.message.length,
        source: 'contact_form'
      },
      ip_address: null, // clientIP commented out for now
      user_agent: userAgent
    }

    // Insert analytics event (non-blocking)
    try {
      const { error: analyticsError } = await supabase
        .from('analytics_events')
        .insert([analyticsData])
      
      if (analyticsError) {
        console.error('Failed to track analytics event:', analyticsError)
      } else {
        console.log('Analytics event tracked successfully')
      }
    } catch (err) {
      console.error('Failed to track analytics event:', err)
    }

    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        data: { id: data.id }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export rate-limited POST handler
export const POST = withRateLimit(handlePOST, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 contact form submissions per minute
})

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}