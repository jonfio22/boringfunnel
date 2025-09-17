import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sanitizeEmail, sanitizeInput } from '@/lib/sanitize'
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
function validateSubscribeForm(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format')
    }
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array')
  }

  if (data.source && typeof data.source !== 'string') {
    errors.push('Source must be a string')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Sanitize and validate email
    const sanitizedEmail = sanitizeEmail(body.email || '')
    if (!sanitizedEmail) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: ['Invalid email format'] 
        },
        { status: 400 }
      )
    }
    
    // Sanitize other fields
    const sanitizedBody = {
      email: sanitizedEmail,
      source: body.source ? sanitizeInput(body.source) : undefined,
      tags: Array.isArray(body.tags) ? body.tags.map((tag: any) => sanitizeInput(String(tag))) : undefined,
      metadata: body.metadata
    }
    
    // Validate the sanitized data
    const validation = validateSubscribeForm(sanitizedBody)
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
    const subscriberData = {
      email: sanitizedBody.email,
      source: sanitizedBody.source || 'newsletter_signup',
      tags: sanitizedBody.tags || [],
      metadata: sanitizedBody.metadata || {},
      ip_address: null, // clientIP commented out for now
      user_agent: userAgent,
      referrer: referrer,
      confirmed_at: new Date().toISOString(), // Auto-confirm for now
      ...utmParams
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', subscriberData.email)
      .single()

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { 
            message: 'Email already subscribed',
            data: { id: existingSubscriber.id, already_subscribed: true }
          },
          { status: 200 }
        )
      } else {
        // Reactivate unsubscribed user
        const { data, error } = await supabase
          .from('subscribers')
          .update({ 
            status: 'active',
            confirmed_at: new Date().toISOString(),
            unsubscribed_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id)
          .select()
          .single()

        if (error) {
          console.error('Database error:', error)
          return NextResponse.json(
            { error: 'Failed to reactivate subscription' },
            { status: 500 }
          )
        }

        return NextResponse.json(
          { 
            message: 'Subscription reactivated successfully',
            data: { id: data.id, reactivated: true }
          },
          { status: 200 }
        )
      }
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('subscribers')
      .insert([subscriberData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      )
    }

    // Track analytics event
    const analyticsData = {
      event_name: 'newsletter_subscribe',
      event_category: 'engagement',
      event_action: 'subscribe',
      event_label: subscriberData.source,
      page_path: '/subscribe',
      custom_parameters: {
        source: subscriberData.source,
        tags: subscriberData.tags,
        has_metadata: Object.keys(subscriberData.metadata).length > 0
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
        message: 'Subscribed successfully',
        data: { id: data.id }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Subscribe API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export rate-limited POST handler
export const POST = withRateLimit(handlePOST, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 subscribe requests per minute per IP
})

// Handle unsubscribe requests
async function handlePATCH(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Update subscriber status to unsubscribed
    const { data, error } = await supabase
      .from('subscribers')
      .update({ 
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', body.email.toLowerCase().trim())
      .eq('status', 'active')
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Email not found or already unsubscribed' },
        { status: 404 }
      )
    }

    // Track analytics event
    const analyticsData = {
      event_name: 'newsletter_unsubscribe',
      event_category: 'engagement',
      event_action: 'unsubscribe',
      event_label: 'email_unsubscribe',
      custom_parameters: {
        email: body.email
      },
      ip_address: getClientIP(request),
      user_agent: request.headers.get('user-agent')
    }

    // Insert analytics event (non-blocking)
    try {
      const { error: analyticsError } = await supabase
        .from('analytics_events')
        .insert([analyticsData])
      
      if (analyticsError) {
        console.error('Failed to track unsubscribe analytics event:', analyticsError)
      } else {
        console.log('Unsubscribe analytics event tracked successfully')
      }
    } catch (err) {
      console.error('Failed to track unsubscribe analytics event:', err)
    }

    return NextResponse.json(
      { 
        message: 'Unsubscribed successfully',
        data: { id: data.id }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Unsubscribe API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export rate-limited PATCH handler
export const PATCH = withRateLimit(handlePATCH, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 3, // 3 unsubscribe requests per minute per IP
})

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}