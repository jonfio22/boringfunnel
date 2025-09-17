'use client'

import { 
  LazyExitIntent,
  LazyExitIntentDia,
  LazyMobileExitIntent,
  LazyStickyCTA,
  LazyScrollProgress,
  LazySocialProofNotifications,
  SuspendedCROComponent
} from './lazy-cro-components'

interface CROLayoutProps {
  children: React.ReactNode
  enableExitIntent?: boolean
  enableMobileExitIntent?: boolean
  enableStickyCTA?: boolean
  enableScrollProgress?: boolean
  enableSocialProof?: boolean
  useDiaStyleModal?: boolean
  exitIntentConfig?: {
    title?: string
    subtitle?: string
    offerText?: string
    buttonText?: string
  }
  stickyCTAConfig?: {
    text?: string
    buttonText?: string
    href?: string
  }
  socialProofConfig?: {
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  }
}

export function CROLayout({
  children,
  enableExitIntent = true,
  enableMobileExitIntent = true,
  enableStickyCTA = true,
  enableScrollProgress = true,
  enableSocialProof = true,
  useDiaStyleModal = false,
  exitIntentConfig,
  stickyCTAConfig,
  socialProofConfig
}: CROLayoutProps) {
  const handleEmailCapture = (email: string) => {
    console.log('Email captured:', email)
    // Here you would typically send the email to your backend/analytics
    // Example: analytics.track('exit_intent_email_captured', { email })
  }

  return (
    <>
      {children}

      {/* Exit Intent Modal for Desktop */}
      {enableExitIntent && (
        <SuspendedCROComponent fallback={null}>
          {useDiaStyleModal ? (
            <LazyExitIntentDia 
              onResourceSelect={(resource) => console.log('Resource selected:', resource)}
            />
          ) : (
            <LazyExitIntent
              {...exitIntentConfig}
              onSubmit={handleEmailCapture}
            />
          )}
        </SuspendedCROComponent>
      )}

      {/* Mobile Exit Intent */}
      {enableMobileExitIntent && (
        <SuspendedCROComponent fallback={null}>
          <LazyMobileExitIntent
            {...exitIntentConfig}
            onSubmit={handleEmailCapture}
          />
        </SuspendedCROComponent>
      )}

      {/* Sticky CTA */}
      {enableStickyCTA && (
        <SuspendedCROComponent>
          <LazyStickyCTA
            {...stickyCTAConfig}
          />
        </SuspendedCROComponent>
      )}

      {/* Scroll Progress Bar */}
      {enableScrollProgress && (
        <SuspendedCROComponent fallback={null}>
          <LazyScrollProgress position="top" />
        </SuspendedCROComponent>
      )}

      {/* Social Proof Notifications */}
      {enableSocialProof && (
        <SuspendedCROComponent>
          <LazySocialProofNotifications
            position={socialProofConfig?.position}
          />
        </SuspendedCROComponent>
      )}
    </>
  )
}