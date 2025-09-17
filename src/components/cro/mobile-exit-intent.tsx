'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface MobileExitIntentProps {
  title?: string
  subtitle?: string
  offerText?: string
  buttonText?: string
  onSubmit?: (email: string) => void
  cooldownHours?: number
  scrollThreshold?: number
}

export function MobileExitIntent({
  title = "Before You Go...",
  subtitle = "Get instant access to our best content",
  offerText = "Join 10,000+ subscribers and get our weekly newsletter",
  buttonText = "Get Free Access",
  onSubmit,
  cooldownHours = 24,
  scrollThreshold = 0.7
}: MobileExitIntentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [hasShown, setHasShown] = useLocalStorage('mobile-exit-intent-shown', false)
  const [lastShownTime, setLastShownTime] = useLocalStorage('mobile-exit-intent-time', 0)
  const [hasTriggered, setHasTriggered] = useState(false)
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastScrollRef = useRef(0)

  const shouldShow = useCallback(() => {
    if (hasShown) {
      const timeDiff = Date.now() - lastShownTime
      const cooldownMs = cooldownHours * 60 * 60 * 1000
      return timeDiff > cooldownMs
    }
    return true
  }, [hasShown, lastShownTime, cooldownHours])

  const checkScrollBehavior = useCallback(() => {
    if (!shouldShow() || hasTriggered) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercentage = scrollTop / documentHeight

    // Check if user has scrolled past threshold and then stops scrolling
    if (scrollPercentage >= scrollThreshold) {
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Set new timeout - if user stops scrolling for 2 seconds, show modal
      scrollTimeoutRef.current = setTimeout(() => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop
        
        // Only show if user hasn't scrolled significantly in the last 2 seconds
        if (Math.abs(currentScroll - lastScrollRef.current) < 50) {
          setIsVisible(true)
          setHasShown(true)
          setLastShownTime(Date.now())
          setHasTriggered(true)
        }
      }, 2000)
    }

    lastScrollRef.current = scrollTop
  }, [shouldShow, hasTriggered, scrollThreshold, setHasShown, setLastShownTime])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', checkScrollBehavior, { passive: true })
      
      return () => {
        window.removeEventListener('scroll', checkScrollBehavior)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
      }
    }
    return undefined
  }, [checkScrollBehavior])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && onSubmit) {
      onSubmit(email)
    }
    setIsVisible(false)
  }

  const handleClose = () => {
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
          />
          
          {/* Mobile-optimized Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:max-w-md md:mx-4"
          >
            <div className="bg-background border-t border-border md:border md:rounded-xl shadow-2xl p-6 relative">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div className="text-center space-y-4">
                <div className="text-3xl mb-2">📱</div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
                <p className="text-sm md:text-base text-muted-foreground">{subtitle}</p>
                
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm text-foreground">{offerText}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-base"
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