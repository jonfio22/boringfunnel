'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState, useEffect, useRef } from 'react'

// Loading components for better UX
const CROLoadingSpinner = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
)

// Modal loading spinner - kept for potential future use
// const ModalLoadingSpinner = () => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-white p-6 rounded-lg shadow-lg">
//       <div className="animate-pulse">
//         <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
//         <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
//         <div className="h-4 bg-gray-200 rounded w-56"></div>
//       </div>
//     </div>
//   </div>
// )

// Lazy load CRO components with proper loading states
export const LazyExitIntent = dynamic(
  () => import('./exit-intent').then(mod => ({ default: mod.ExitIntent })),
  {
    ssr: false,
    loading: () => null, // Don't show loading for exit intent
  }
)

export const LazyExitIntentDia = dynamic(
  () => import('./exit-intent-dia').then(mod => ({ default: mod.ExitIntentDia })),
  {
    ssr: false,
    loading: () => null, // Don't show loading for exit intent
  }
)

export const LazyMobileExitIntent = dynamic(
  () => import('./mobile-exit-intent').then(mod => ({ default: mod.MobileExitIntent })),
  {
    ssr: false,
    loading: () => null,
  }
)

export const LazyStickyCTA = dynamic(
  () => import('./sticky-cta').then(mod => ({ default: mod.StickyCTA })),
  {
    ssr: false,
    loading: () => <CROLoadingSpinner />,
  }
)

export const LazyScrollProgress = dynamic(
  () => import('./scroll-progress').then(mod => ({ default: mod.ScrollProgress })),
  {
    ssr: false,
    loading: () => null,
  }
)

export const LazySocialProofNotifications = dynamic(
  () => import('./social-proof').then(mod => ({ default: mod.SocialProofNotifications })),
  {
    ssr: false,
    loading: () => <CROLoadingSpinner />,
  }
)

export const LazyCountdownTimer = dynamic(
  () => import('./countdown-timer').then(mod => ({ default: mod.CountdownTimer })),
  {
    ssr: false,
    loading: () => <CROLoadingSpinner />,
  }
)

export const LazyScarcityCounter = dynamic(
  () => import('./scarcity-counter').then(mod => ({ default: mod.ScarcityCounter })),
  {
    ssr: false,
    loading: () => <CROLoadingSpinner />,
  }
)

export const LazyMultiStepForm = dynamic(
  () => import('./multi-step-form').then(mod => ({ default: mod.MultiStepForm })),
  {
    ssr: false,
    loading: () => <CROLoadingSpinner />,
  }
)

// Wrapper component with Suspense for better error boundaries
export function SuspendedCROComponent({ 
  children, 
  fallback = <CROLoadingSpinner /> 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

// Higher-order component for intersection observer based lazy loading
export function withIntersectionLoading<T extends {}>(
  Component: React.ComponentType<T>,
  threshold = 0.1
) {
  return function IntersectionLoadedComponent(props: T) {
    const [isVisible, setIsVisible] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const currentRef = ref.current
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true)
            setHasLoaded(true)
          }
        },
        { threshold }
      )

      if (currentRef) {
        observer.observe(currentRef)
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef)
        }
      }
    }, [hasLoaded])

    return (
      <div ref={ref}>
        {(isVisible || hasLoaded) ? (
          <Component {...props} />
        ) : (
          <CROLoadingSpinner />
        )}
      </div>
    )
  }
}