import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
}

/**
 * Get client identifier from request
 */
function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig = defaultConfig
): { limited: boolean; remaining: number; resetTime: number } {
  const clientId = getClientId(request)
  const now = Date.now()
  
  const clientData = rateLimitMap.get(clientId)
  
  if (!clientData || now > clientData.resetTime) {
    // New window
    rateLimitMap.set(clientId, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    }
  }
  
  // Existing window
  if (clientData.count >= config.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetTime: clientData.resetTime,
    }
  }
  
  // Increment count
  clientData.count++
  rateLimitMap.set(clientId, clientData)
  
  return {
    limited: false,
    remaining: config.maxRequests - clientData.count,
    resetTime: clientData.resetTime,
  }
}

/**
 * Rate limit middleware for API routes
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (req: NextRequest) => {
    const { limited, remaining, resetTime } = checkRateLimit(req, config)
    
    if (limited) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please try again later',
          resetTime: new Date(resetTime).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(config?.maxRequests || defaultConfig.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(resetTime),
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
          },
        }
      )
    }
    
    // Add rate limit headers to response
    const response = await handler(req)
    response.headers.set('X-RateLimit-Limit', String(config?.maxRequests || defaultConfig.maxRequests))
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    response.headers.set('X-RateLimit-Reset', String(resetTime))
    
    return response
  }
}

// Clean up old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now()
  const entries = Array.from(rateLimitMap.entries())
  for (const [clientId, data] of entries) {
    if (now > data.resetTime + 300000) { // 5 minutes after reset
      rateLimitMap.delete(clientId)
    }
  }
}, 300000)