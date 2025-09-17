'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  targetDate?: Date
  duration?: number // in minutes
  title?: string
  subtitle?: string
  onExpiry?: () => void
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({
  targetDate,
  duration = 60, // 60 minutes default
  title = "Special Offer Expires In:",
  subtitle = "Don't miss out on this limited-time deal",
  onExpiry,
  showLabels = true,
  size = 'md',
  className = ''
}: CountdownTimerProps) {
  // Calculate target date if not provided using useMemo
  const endTime = useMemo(() => {
    return targetDate || new Date(Date.now() + duration * 60 * 1000)
  }, [targetDate, duration])
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = endTime.getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
        if (onExpiry) {
          onExpiry()
        }
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime, onExpiry])

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  const unitSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center p-6 bg-muted rounded-lg ${className}`}
      >
        <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-muted-foreground">Offer Expired</h3>
        <p className="text-sm text-muted-foreground">This special offer is no longer available.</p>
      </motion.div>
    )
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Days', show: timeLeft.days > 0 },
    { value: timeLeft.hours, label: 'Hours', show: true },
    { value: timeLeft.minutes, label: 'Minutes', show: true },
    { value: timeLeft.seconds, label: 'Seconds', show: true }
  ].filter(unit => unit.show)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      )}
      
      {subtitle && (
        <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      )}

      <div className="flex justify-center items-center gap-2 md:gap-4">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center">
            <div className="text-center">
              <motion.div
                key={unit.value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`${sizeClasses[size]} font-bold tabular-nums ${
                  unit.value <= 5 && unit.label === 'Minutes' 
                    ? 'text-destructive' 
                    : 'text-primary'
                }`}
              >
                {unit.value.toString().padStart(2, '0')}
              </motion.div>
              {showLabels && (
                <div className={`${unitSizeClasses[size]} text-muted-foreground font-medium`}>
                  {unit.label}
                </div>
              )}
            </div>
            
            {index < timeUnits.length - 1 && (
              <div className={`${sizeClasses[size]} font-bold text-muted-foreground mx-1 md:mx-2`}>
                :
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

interface CompactCountdownProps {
  minutes?: number
  onExpiry?: () => void
  className?: string
}

export function CompactCountdown({
  minutes = 30,
  onExpiry,
  className = ''
}: CompactCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60)

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpiry) onExpiry()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, onExpiry])

  const displayMinutes = Math.floor(timeLeft / 60)
  const displaySeconds = timeLeft % 60

  if (timeLeft <= 0) {
    return (
      <span className={`text-sm text-muted-foreground ${className}`}>
        Expired
      </span>
    )
  }

  return (
    <motion.span
      animate={{ 
        color: timeLeft <= 300 ? '#ef4444' : '#0ea5e9' // Red when <= 5 minutes
      }}
      className={`text-sm font-medium tabular-nums ${className}`}
    >
      {displayMinutes}:{displaySeconds.toString().padStart(2, '0')}
    </motion.span>
  )
}

interface UrgencyBannerProps {
  message?: string
  countdown?: boolean
  minutes?: number
  className?: string
}

export function UrgencyBanner({
  message = "Limited time offer - Act now!",
  countdown = true,
  minutes = 15,
  className = ''
}: UrgencyBannerProps) {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-destructive text-destructive-foreground text-center py-2 px-4 ${className}`}
    >
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <Clock size={16} />
        <span>{message}</span>
        {countdown && <CompactCountdown minutes={minutes} />}
      </div>
    </motion.div>
  )
}