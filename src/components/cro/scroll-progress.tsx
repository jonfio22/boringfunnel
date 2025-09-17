'use client'

import { motion } from 'framer-motion'
import { useScrollProgress } from '@/hooks/use-scroll-trigger'

interface ScrollProgressProps {
  position?: 'top' | 'bottom'
  height?: number
  className?: string
  showPercentage?: boolean
  color?: string
}

export function ScrollProgress({
  position = 'top',
  height = 3,
  className = '',
  showPercentage = false,
  color
}: ScrollProgressProps) {
  const scrollProgress = useScrollProgress()

  const positionClasses = position === 'top' 
    ? 'top-0 left-0 right-0' 
    : 'bottom-0 left-0 right-0'

  const progressColor = color || 'bg-primary'

  return (
    <div className={`fixed ${positionClasses} z-50 ${className}`}>
      <div 
        className="w-full bg-border/20 backdrop-blur-sm"
        style={{ height: `${height}px` }}
      >
        <motion.div
          className={`h-full ${progressColor} origin-left`}
          style={{ scaleX: scrollProgress / 100 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
        />
      </div>
      
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollProgress > 5 ? 1 : 0 }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-medium text-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded"
        >
          {Math.round(scrollProgress)}%
        </motion.div>
      )}
    </div>
  )
}

interface CircularProgressProps {
  size?: number
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function CircularScrollProgress({
  size = 60,
  strokeWidth = 4,
  className = '',
  showPercentage = true,
  position = 'bottom-right'
}: CircularProgressProps) {
  const scrollProgress = useScrollProgress()
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }[position]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: scrollProgress > 5 ? 1 : 0,
        scale: scrollProgress > 5 ? 1 : 0.8
      }}
      className={`fixed ${positionClasses} z-50 ${className}`}
    >
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-border"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-300 ease-out"
          />
        </svg>
        
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-foreground">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface ReadingProgressProps {
  articleSelector?: string
  className?: string
}

export function ReadingProgress({
  articleSelector = 'main',
  className = ''
}: ReadingProgressProps) {
  const scrollProgress = useScrollProgress()
  
  // articleSelector could be used for more specific progress calculation
  // For now, we use the global scroll progress
  console.debug('Article selector:', articleSelector)

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="w-full h-1 bg-border/20">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 origin-left"
          style={{ scaleX: scrollProgress / 100 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
        />
      </div>
    </div>
  )
}