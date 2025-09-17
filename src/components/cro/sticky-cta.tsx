'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { useScrollPastElement } from '@/hooks/use-scroll-trigger'
import { useState } from 'react'

interface StickyCTAProps {
  text?: string
  buttonText?: string
  href?: string
  onClick?: () => void
  onDismiss?: () => void
  dismissible?: boolean
  variant?: 'primary' | 'secondary'
}

export function StickyCTA({
  text = "Ready to get started?",
  buttonText = "Get Started Now",
  href = "#cta",
  onClick,
  onDismiss,
  dismissible = true,
  variant = 'primary'
}: StickyCTAProps) {
  const heroRef = useRef<Element>(null)
  const hasPassedHero = useScrollPastElement(heroRef)
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    if (onDismiss) {
      onDismiss()
    }
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // Find hero element if ref is not set
  if (!heroRef.current && typeof window !== 'undefined') {
    const heroElement = document.querySelector('main > section:first-child, main > div:first-child, [data-hero]')
    if (heroElement) {
      (heroRef as any).current = heroElement
    }
  }

  const baseClasses = variant === 'primary' 
    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
    : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'

  return (
    <>
      {/* Hidden ref element to track hero position */}
      <div ref={heroRef as any} className="absolute top-0 left-0 w-1 h-1 pointer-events-none opacity-0" />
      
      <AnimatePresence>
        {hasPassedHero && !isDismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 z-40 md:bottom-6 md:left-6 md:right-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-lg p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-medium text-foreground truncate">
                    {text}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {href.startsWith('http') ? (
                    <a
                      href={href}
                      className={`${baseClasses} px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap`}
                    >
                      {buttonText}
                      <ArrowRight size={16} />
                    </a>
                  ) : (
                    <button
                      onClick={handleClick}
                      className={`${baseClasses} px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap`}
                    >
                      {buttonText}
                      <ArrowRight size={16} />
                    </button>
                  )}
                  
                  {dismissible && (
                    <button
                      onClick={handleDismiss}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      aria-label="Dismiss"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Alternative version that takes a specific element ref
export function StickyCTAWithRef({
  triggerElementRef,
  ...props
}: StickyCTAProps & { triggerElementRef: React.RefObject<HTMLElement> }) {
  const hasPassedElement = useScrollPastElement(triggerElementRef)
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    if (props.onDismiss) {
      props.onDismiss()
    }
  }

  const handleClick = () => {
    if (props.onClick) {
      props.onClick()
    } else if (props.href?.startsWith('#')) {
      const element = document.querySelector(props.href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const baseClasses = props.variant === 'primary' 
    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
    : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'

  return (
    <AnimatePresence>
      {hasPassedElement && !isDismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-40 md:bottom-6 md:left-6 md:right-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-lg p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-medium text-foreground truncate">
                  {props.text || "Ready to get started?"}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {props.href?.startsWith('http') ? (
                  <a
                    href={props.href}
                    className={`${baseClasses} px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap`}
                  >
                    {props.buttonText || "Get Started Now"}
                    <ArrowRight size={16} />
                  </a>
                ) : (
                  <button
                    onClick={handleClick}
                    className={`${baseClasses} px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap`}
                  >
                    {props.buttonText || "Get Started Now"}
                    <ArrowRight size={16} />
                  </button>
                )}
                
                {props.dismissible !== false && (
                  <button
                    onClick={handleDismiss}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label="Dismiss"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}