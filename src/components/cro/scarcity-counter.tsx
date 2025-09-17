'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock, Star } from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface ScarcityCounterProps {
  initialCount?: number
  minCount?: number
  maxCount?: number
  decreaseInterval?: number
  title?: string
  subtitle?: string
  icon?: 'users' | 'clock' | 'star'
  showProgress?: boolean
  urgencyThreshold?: number
  className?: string
}

export function ScarcityCounter({
  initialCount = 47,
  minCount = 12,
  maxCount = 50,
  decreaseInterval = 180000, // 3 minutes
  title = "Limited Spots Available",
  subtitle = "Join before they're gone!",
  icon = 'users',
  showProgress = true,
  urgencyThreshold = 20,
  className = ''
}: ScarcityCounterProps) {
  const [count, setCount] = useLocalStorage('scarcity-count', initialCount)
  const [lastUpdate, setLastUpdate] = useLocalStorage('scarcity-last-update', Date.now())

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdate

    // If enough time has passed, decrease the count
    if (timeSinceLastUpdate >= decreaseInterval && count > minCount) {
      const decreaseAmount = Math.floor(Math.random() * 3) + 1 // 1-3 decrease
      const newCount = Math.max(minCount, count - decreaseAmount)
      setCount(newCount)
      setLastUpdate(now)
    }

    // Set up interval for future decreases
    const interval = setInterval(() => {
      setCount(prevCount => {
        if (prevCount > minCount) {
          const decreaseAmount = Math.floor(Math.random() * 2) + 1 // 1-2 decrease
          const newCount = Math.max(minCount, prevCount - decreaseAmount)
          setLastUpdate(Date.now())
          return newCount
        }
        return prevCount
      })
    }, decreaseInterval)

    return () => clearInterval(interval)
  }, [count, lastUpdate, decreaseInterval, minCount, setCount, setLastUpdate])

  const progressPercentage = ((count - minCount) / (maxCount - minCount)) * 100
  const isUrgent = count <= urgencyThreshold

  const IconComponent = {
    users: Users,
    clock: Clock,
    star: Star
  }[icon]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
        isUrgent 
          ? 'bg-destructive/10 border-destructive/20 text-destructive' 
          : 'bg-primary/10 border-primary/20 text-primary'
      } ${className}`}
    >
      <IconComponent 
        size={20} 
        className={isUrgent ? 'text-destructive' : 'text-primary'} 
      />
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <motion.span 
            key={count}
            initial={{ scale: 1.2, color: isUrgent ? '#ef4444' : '#0ea5e9' }}
            animate={{ scale: 1, color: 'inherit' }}
            className="text-lg font-bold"
          >
            {count}
          </motion.span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        
        <p className="text-xs opacity-80">{subtitle}</p>
        
        {showProgress && (
          <div className="w-32 h-1.5 bg-background/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: `${progressPercentage}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                isUrgent ? 'bg-destructive' : 'bg-primary'
              }`}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface CompactScarcityCounterProps {
  count?: number
  label?: string
  className?: string
}

export function CompactScarcityCounter({
  count = 23,
  label = "spots left",
  className = ''
}: CompactScarcityCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-sm font-medium ${className}`}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 bg-destructive rounded-full"
      />
      <span className="font-bold">{count}</span>
      <span>{label}</span>
    </motion.div>
  )
}