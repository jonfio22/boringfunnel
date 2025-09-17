'use client'

import { useState, useEffect, useCallback } from 'react'
import { DiaModal, ResourceCard, developerResources } from '@/components/ui/dia-modal'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { trackExitIntent, trackModalInteraction, trackEmailSubmission } from '@/lib/analytics'

interface ExitIntentDiaProps {
  cooldownHours?: number
  onResourceSelect?: (resource: string) => void
}

export function ExitIntentDia({
  cooldownHours = 24,
  onResourceSelect
}: ExitIntentDiaProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [hasShown, setHasShown] = useLocalStorage('exit-intent-shown', false)
  const [lastShownTime, setLastShownTime] = useLocalStorage('exit-intent-time', 0)

  const shouldShow = useCallback(() => {
    if (hasShown) {
      const timeDiff = Date.now() - lastShownTime
      const cooldownMs = cooldownHours * 60 * 60 * 1000
      return timeDiff > cooldownMs
    }
    return true
  }, [hasShown, lastShownTime, cooldownHours])

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && shouldShow()) {
      setIsVisible(true)
      setHasShown(true)
      setLastShownTime(Date.now())
      
      // Track exit intent trigger
      trackExitIntent('mouse_leave', 'page_top')
      trackModalInteraction('open', 'exit_intent_dia', 'mouse_leave')
    }
  }, [shouldShow, setHasShown, setLastShownTime])

  const handleClose = useCallback(() => {
    trackModalInteraction('close', 'exit_intent_dia')
    setIsVisible(false)
    setShowEmailForm(false)
    setSelectedResource(null)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('mouseleave', handleMouseLeave)
      return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }
    return undefined
  }, [handleMouseLeave])

  const handleResourceSelect = (resourceTitle: string) => {
    setSelectedResource(resourceTitle)
    setShowEmailForm(true)
    trackModalInteraction('select_resource', 'exit_intent_dia', resourceTitle)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && selectedResource) {
      // Track email submission
      trackEmailSubmission('exit_intent_dia_form', 'exit_intent_dia', {
        resource: selectedResource,
        email_domain: email.split('@')[1],
        timestamp: Date.now(),
      })
      
      if (onResourceSelect) {
        onResourceSelect(selectedResource)
      }
      
      // Close modal and reset
      handleClose()
      
      // In a real app, you'd send the email here
      console.log('Resource selected:', selectedResource, 'Email:', email)
    }
  }

  return (
    <DiaModal isVisible={isVisible} onClose={handleClose}>
      {!showEmailForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {developerResources.map((resource, index) => (
            <ResourceCard
              key={index}
              {...resource}
              onSeeMore={() => console.log('See more:', resource.title)}
              onTryInDia={() => handleResourceSelect(resource.title)}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Almost There!</h3>
            <p className="text-muted-foreground">
              Enter your email to get instant access to:
            </p>
            <p className="text-lg font-medium text-primary">{selectedResource}</p>
          </div>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-full border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              required
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-foreground text-background py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Get My Free Resource
            </button>
          </form>
          
          <button
            onClick={() => setShowEmailForm(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to resources
          </button>
          
          <p className="text-xs text-muted-foreground">
            No spam, unsubscribe anytime. By entering your email, you agree to receive our newsletter.
          </p>
        </div>
      )}
    </DiaModal>
  )
}