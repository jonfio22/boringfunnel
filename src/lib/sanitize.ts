import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize user input to prevent XSS attacks
 * @param input - The user input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  // Remove any HTML tags and dangerous content
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true // Keep text content
  }).trim()
}

/**
 * Sanitize object with multiple string fields
 * @param data - Object containing string fields to sanitize
 * @returns Object with sanitized string fields
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]) as T[Extract<keyof T, string>]
    }
  }
  
  return sanitized
}

/**
 * Validate and sanitize email address
 * @param email - Email address to validate and sanitize
 * @returns Sanitized email or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  const sanitized = sanitizeInput(email).toLowerCase()
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  
  return emailRegex.test(sanitized) ? sanitized : null
}