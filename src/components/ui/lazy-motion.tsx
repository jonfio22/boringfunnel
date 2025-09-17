'use client'

import dynamic from 'next/dynamic'
import { type ComponentProps } from 'react'

// Lazy load framer-motion components with optimized imports
export const LazyMotionDiv = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.div })),
  {
    ssr: false,
    loading: () => <div />,
  }
)

export const LazyMotionSection = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.section })),
  {
    ssr: false,
    loading: () => <section />,
  }
)

export const LazyMotionH1 = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.h1 })),
  {
    ssr: false,
    loading: () => <h1 />,
  }
)

export const LazyMotionP = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.p })),
  {
    ssr: false,
    loading: () => <p />,
  }
)

export const LazyAnimatePresence = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })),
  {
    ssr: false,
    loading: () => <div />,
  }
)

// Optimized motion wrapper with reduced motion support
export const MotionWrapper = dynamic(
  () => import('framer-motion').then(mod => {
    const MotionComponent = ({ children, ...props }: any) => {
      // Check for reduced motion preference
      const prefersReducedMotion = typeof window !== 'undefined' && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        // Return a static div for users who prefer reduced motion
        return <div {...props}>{children}</div>
      }

      return <mod.motion.div {...props}>{children}</mod.motion.div>
    }
    return { default: MotionComponent }
  }),
  {
    ssr: false,
    loading: () => <div />,
  }
)

// Type exports for better DX
export type MotionDivProps = ComponentProps<typeof LazyMotionDiv>
export type MotionSectionProps = ComponentProps<typeof LazyMotionSection>
export type MotionH1Props = ComponentProps<typeof LazyMotionH1>
export type MotionPProps = ComponentProps<typeof LazyMotionP>