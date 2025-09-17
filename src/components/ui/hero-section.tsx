"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Container } from "./container"
import { Button } from "./button"
import { Input } from "./input"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

interface EmailFormData {
  email: string
}

interface MetricBadgeProps {
  value: string
  label: string
  delay?: number
}

const MetricBadge: React.FC<MetricBadgeProps> = ({ value, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="flex flex-col items-center text-center"
  >
    <Badge variant="metric" size="lg" className="mb-1">
      {value}
    </Badge>
    <span className="text-xs text-muted-foreground font-medium">{label}</span>
  </motion.div>
)

interface TrustIndicatorProps {
  icon?: React.ReactNode
  text: string
  delay?: number
}

const TrustIndicator: React.FC<TrustIndicatorProps> = ({ icon, text, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center gap-2 text-sm text-muted-foreground"
  >
    {icon && <span className="text-green-500">{icon}</span>}
    <span>{text}</span>
  </motion.div>
)

export interface HeroSectionProps {
  className?: string
  onEmailSubmit?: (email: string) => Promise<void>
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  className,
  onEmailSubmit 
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitMessage, setSubmitMessage] = React.useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>()

  const onSubmit: SubmitHandler<EmailFormData> = async (data) => {
    setIsSubmitting(true)
    setSubmitMessage("")
    
    try {
      if (onEmailSubmit) {
        await onEmailSubmit(data.email)
        // Note: Don't reset form or show message since we're redirecting
        // reset() and setSubmitMessage() handled by parent component redirect
      } else {
        // Default behavior for demo
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSubmitMessage("Thanks! Check your email for the next steps.")
        reset()
      }
    } catch (error) {
      setSubmitMessage("Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  const checkIcon = (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
    </svg>
  )

  return (
    <section 
      className={cn("relative py-20 lg:py-32 overflow-hidden", className)}
      aria-labelledby="hero-heading"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-orange-950/20" aria-hidden="true" />
      
      <Container size="xl" className="relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 min-h-[1.2em]"
            style={{ lineHeight: '1.1' }}
          >
            How to Build Your First Working{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Agent Without Fear
            </span>{" "}
            of Getting Left Behind
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl lg:text-2xl text-muted-foreground mb-4 font-medium"
          >
            (100% FREE - Sponsored by 5 Forward-Thinking Business Owners)
          </motion.p>

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join the ONLY hands-on AI workshop where you'll build a working AI solution in 3 days, 
            get 90 days of expert support, and transform from "AI anxious" to "AI confident" - 
            while learning alongside 99 other ambitious professionals.
          </motion.p>

          {/* Social Proof Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12"
          >
            <MetricBadge value="100 Spots" label="Fully Sponsored" delay={0.5} />
            <MetricBadge value="$15,000" label="Total Investment" delay={0.6} />
            <MetricBadge value="3 Days" label="Hands-On Building" delay={0.7} />
            <MetricBadge value="90 Days" label="Support Included" delay={0.8} />
          </motion.div>

          {/* Email Capture Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-md mx-auto mb-8"
          >
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-4"
              noValidate
              aria-label="Email signup form"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="hero-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address"
                      }
                    })}
                    id="hero-email"
                    type="email"
                    placeholder="Enter your email address"
                    variant={errors.email ? "error" : "default"}
                    size="lg"
                    disabled={isSubmitting}
                    aria-describedby={errors.email ? "email-error" : "email-help"}
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  {errors.email && (
                    <p 
                      id="email-error"
                      className="text-destructive text-sm mt-1 text-left"
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.email.message}
                    </p>
                  )}
                  <p id="email-help" className="sr-only">
                    Enter your email to receive our free guide and newsletter
                  </p>
                </div>
                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  disabled={isSubmitting}
                  className="whitespace-nowrap min-w-[140px]"
                  aria-describedby="submit-help"
                >
                  {isSubmitting ? (
                    <>
                      <span className="sr-only">Loading</span>
                      <span aria-hidden="true">Joining...</span>
                    </>
                  ) : (
                    "Claim Your FREE Spot"
                  )}
                </Button>
                <p id="submit-help" className="sr-only">
                  Click to join our mailing list and receive the free guide
                </p>
              </div>
            </form>

            {submitMessage && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "text-sm mt-3",
                  submitMessage.includes("Thanks") 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-destructive"
                )}
              >
                {submitMessage}
              </motion.p>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
          >
            <TrustIndicator 
              icon={checkIcon}
              text="No hidden costs - completely free" 
              delay={0.7}
            />
            <TrustIndicator 
              icon={checkIcon}
              text="Build a real AI solution you'll use" 
              delay={0.8}
            />
            <TrustIndicator 
              icon={checkIcon}
              text="Templates & resources included forever" 
              delay={0.9}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}