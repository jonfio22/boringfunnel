'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { trackExitIntent, trackModalInteraction, trackEmailSubmission } from '@/lib/analytics'

interface ExitIntentProps {
  title?: string
  subtitle?: string
  offerText?: string
  buttonText?: string
  onSubmit?: (email: string) => void
  cooldownHours?: number
}

export function ExitIntent({
  title = "Wait! Don't Miss Out",
  subtitle = "Get our exclusive guide before you go",
  offerText = "Download our free guide and get 20% off your first purchase",
  buttonText = "Get My Free Guide",
  onSubmit,
  cooldownHours = 24
}: ExitIntentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [hasShown, setHasShown] = useLocalStorage('exit-intent-shown', false)
  const [lastShownTime, setLastShownTime] = useLocalStorage('exit-intent-time', 0)
  const modalRef = useRef<HTMLDivElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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
      trackModalInteraction('open', 'exit_intent', 'mouse_leave')
    }
  }, [shouldShow, setHasShown, setLastShownTime])

  const handleClose = useCallback(() => {
    trackModalInteraction('close', 'exit_intent')
    setIsVisible(false)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('mouseleave', handleMouseLeave)
      return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }
    return undefined
  }, [handleMouseLeave])

  // Focus management
  useEffect(() => {
    if (isVisible) {
      // Focus the email input when modal opens
      emailInputRef.current?.focus()
      
      // Handle keyboard navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose()
        }
        if (e.key === 'Tab') {
          // Trap focus within modal
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          const firstElement = focusableElements?.[0] as HTMLElement
          const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement
          
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement?.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement?.focus()
            }
          }
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
    return undefined
  }, [isVisible, handleClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && onSubmit) {
      onSubmit(email)
      
      // Track email submission from exit intent modal
      trackEmailSubmission('exit_intent_form', 'exit_intent_modal', {
        email_domain: email.split('@')[1],
        timestamp: Date.now(),
      })
      trackModalInteraction('submit', 'exit_intent')
    }
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-title"
            aria-describedby="exit-intent-description"
          >
            <div className="bg-background border border-border rounded-xl shadow-2xl p-6 relative">
              {/* Close button */}
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div className="text-center space-y-4">
                <div className="text-4xl mb-2" aria-hidden="true">🎯</div>
                <h2 id="exit-intent-title" className="text-2xl font-bold text-foreground">{title}</h2>
                <p id="exit-intent-description" className="text-muted-foreground">{subtitle}</p>
                
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground">{offerText}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <label htmlFor="exit-intent-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    ref={emailInputRef}
                    id="exit-intent-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    required
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {buttonText}
                  </button>
                </form>

                <p className="text-xs text-muted-foreground">
                  No spam, unsubscribe anytime
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}