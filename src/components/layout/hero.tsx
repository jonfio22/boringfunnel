'use client'

import { useRouter } from 'next/navigation'
import { HeroSection } from '../ui/hero-section'
import { trackEmailSubmission } from '@/lib/analytics'

export function Hero() {
  const router = useRouter()

  // Handle email submission
  const handleEmailSubmit = async (email: string) => {
    try {
      // Submit to subscribe API endpoint
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'hero_form'
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to subscribe')
      }

      // Track email submission analytics
      trackEmailSubmission('hero_form', 'hero_section', {
        email_domain: email.split('@')[1],
        timestamp: Date.now(),
      })
      
      // Redirect to welcome page
      router.push('/welcome')
      
    } catch (error) {
      console.error('Email subscription error:', error)
      throw error // Let the form component handle the error
    }
  }

  return <HeroSection onEmailSubmit={handleEmailSubmit} />
}