'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, MapPin, Star, TrendingUp } from 'lucide-react'

interface SocialProofNotification {
  id: string
  type: 'signup' | 'purchase' | 'review' | 'activity'
  name: string
  location?: string
  action: string
  timeAgo: string
  avatar?: string
  rating?: number
  product?: string
}

interface SocialProofProps {
  notifications?: SocialProofNotification[]
  showInterval?: number
  displayDuration?: number
  maxVisible?: number
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  className?: string
}

const defaultNotifications: SocialProofNotification[] = [
  {
    id: '1',
    type: 'signup',
    name: 'Sarah M.',
    location: 'San Francisco, CA',
    action: 'signed up for the newsletter',
    timeAgo: '2 minutes ago'
  },
  {
    id: '2',
    type: 'purchase',
    name: 'Mike Johnson',
    location: 'Austin, TX',
    action: 'purchased the premium plan',
    timeAgo: '5 minutes ago'
  },
  {
    id: '3',
    type: 'review',
    name: 'Emma Wilson',
    location: 'New York, NY',
    action: 'left a 5-star review',
    timeAgo: '8 minutes ago',
    rating: 5
  },
  {
    id: '4',
    type: 'activity',
    name: 'David Chen',
    location: 'Seattle, WA',
    action: 'completed the onboarding',
    timeAgo: '12 minutes ago'
  },
  {
    id: '5',
    type: 'signup',
    name: 'Lisa Rodriguez',
    location: 'Miami, FL',
    action: 'joined the community',
    timeAgo: '15 minutes ago'
  },
  {
    id: '6',
    type: 'purchase',
    name: 'James Taylor',
    location: 'Denver, CO',
    action: 'upgraded their account',
    timeAgo: '18 minutes ago'
  }
]

export function SocialProofNotifications({
  notifications = defaultNotifications,
  showInterval = 8000,
  displayDuration = 5000,
  maxVisible = 3,
  position = 'bottom-left',
  className = ''
}: SocialProofProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<SocialProofNotification[]>([])
  const currentIndexRef = useRef(0)
  const notificationCounterRef = useRef(0)

  useEffect(() => {
    const showNotification = () => {
      if (notifications.length === 0) return

      const notification = notifications[currentIndexRef.current]
      // Use a counter to ensure truly unique IDs
      const uniqueId = `notification-${notificationCounterRef.current}`
      const uniqueNotification = {
        ...notification,
        id: uniqueId
      }
      
      notificationCounterRef.current += 1
      
      setVisibleNotifications(prev => {
        const newNotifications = [uniqueNotification, ...prev].slice(0, maxVisible)
        return newNotifications
      })

      // Auto-remove notification after display duration
      setTimeout(() => {
        setVisibleNotifications(prev => 
          prev.filter(n => n.id !== uniqueId)
        )
      }, displayDuration)

      currentIndexRef.current = (currentIndexRef.current + 1) % notifications.length
    }

    // Show first notification after a delay
    const firstTimeout = setTimeout(showNotification, 2000)
    
    // Then show notifications at regular intervals
    const interval = setInterval(showNotification, showInterval)

    return () => {
      clearTimeout(firstTimeout)
      clearInterval(interval)
    }
  }, [notifications, showInterval, displayDuration, maxVisible])

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4'
  }[position]

  const getIcon = (type: SocialProofNotification['type']) => {
    switch (type) {
      case 'signup':
        return <User size={16} className="text-blue-500" />
      case 'purchase':
        return <TrendingUp size={16} className="text-green-500" />
      case 'review':
        return <Star size={16} className="text-yellow-500" />
      case 'activity':
        return <User size={16} className="text-purple-500" />
      default:
        return <User size={16} className="text-gray-500" />
    }
  }

  const handleDismiss = (id: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className={`fixed ${positionClasses} z-40 space-y-2 ${className}`}>
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative max-w-sm"
          >
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 pr-8">
              <button
                onClick={() => handleDismiss(notification.id)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm">
                      {notification.name}
                    </span>
                    {notification.rating && (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={`${
                              i < notification.rating! 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-1">
                    {notification.action}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {notification.location && (
                      <>
                        <MapPin size={10} />
                        <span>{notification.location}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{notification.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

interface SocialStatsProps {
  stats: Array<{
    label: string
    value: string | number
    icon?: React.ReactNode
    trend?: 'up' | 'down'
  }>
  className?: string
}

export function SocialStats({ stats, className = '' }: SocialStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}
    >
      {stats.map((stat, statIndex) => (
        <motion.div
          key={statIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: statIndex * 0.1 }}
          className="text-center p-4 bg-background/50 backdrop-blur-sm border border-border rounded-lg"
        >
          {stat.icon && (
            <div className="flex justify-center mb-2">{stat.icon}</div>
          )}
          <div className="text-2xl font-bold text-foreground mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
          {stat.trend && (
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`text-xs mt-1 ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {stat.trend === 'up' ? '↗' : '↘'}
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}

interface TestimonialPopupProps {
  testimonials: Array<{
    id: string
    name: string
    content: string
    rating: number
    company?: string
  }>
  showInterval?: number
  displayDuration?: number
}

export function TestimonialPopup({
  testimonials,
  showInterval = 15000,
  displayDuration = 8000
}: TestimonialPopupProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState<typeof testimonials[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (testimonials.length === 0) return

    const showTestimonial = () => {
      setCurrentTestimonial(testimonials[currentIndex])
      
      setTimeout(() => {
        setCurrentTestimonial(null)
      }, displayDuration)

      setCurrentIndex(prev => (prev + 1) % testimonials.length)
    }

    const interval = setInterval(showTestimonial, showInterval)
    
    // Show first testimonial after a delay
    setTimeout(showTestimonial, 10000)

    return () => clearInterval(interval)
  }, [testimonials, currentIndex, showInterval, displayDuration])

  return (
    <AnimatePresence>
      {currentTestimonial && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-40 max-w-sm"
        >
          <div className="bg-background border border-border rounded-lg shadow-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < currentTestimonial.rating 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentTestimonial(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-sm text-foreground mb-3 italic">
              &ldquo;{currentTestimonial.content}&rdquo;
            </p>
            
            <div className="text-xs text-muted-foreground">
              <div className="font-medium">{currentTestimonial.name}</div>
              {currentTestimonial.company && (
                <div>{currentTestimonial.company}</div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}