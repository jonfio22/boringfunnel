'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useScrollDepth } from '@/hooks/use-scroll-depth'
import { useTimeOnPage } from '@/hooks/use-time-on-page'
import { debugAnalytics } from '@/lib/analytics'

interface AnalyticsDashboardProps {
  className?: string
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  delay?: number
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend = 'neutral',
  delay = 0 
}) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-background border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className={`text-sm ${trendColors[trend]}`}>{subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
)

const ScrollIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3z"/>
    <path d="M12 7v5"/>
    <path d="M10 10l2 2 2-2"/>
  </svg>
)

const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17l6-6 4 4 8-8"/>
    <path d="M14 7h7v7"/>
  </svg>
)

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
)

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const { maxScrollDepth, trackedThresholds } = useScrollDepth()
  const { timeOnPage, isVisible } = useTimeOnPage()
  const [isDebugMode, setIsDebugMode] = React.useState(false)

  // Simulate some analytics data (in a real app, this would come from your analytics service)
  const [analyticsData] = React.useState({
    pageViews: 1247,
    conversionRate: 3.2,
    popularActions: [
      { action: 'Email Signup', count: 42 },
      { action: 'CTA Click', count: 38 },
      { action: 'Social Share', count: 15 },
    ],
    averageTimeOnPage: 145, // seconds
    totalSessions: 892,
  })

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleDebugToggle = () => {
    setIsDebugMode(!isDebugMode)
    if (!isDebugMode) {
      debugAnalytics()
    }
  }

  return (
    <section className={`py-16 bg-muted/30 ${className}`}>
      <Container size="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Analytics Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time insights into user behavior and conversion performance
          </p>
        </motion.div>

        {/* Current Session Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">Current Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Time on Page"
              value={formatTime(timeOnPage)}
              subtitle={isVisible ? "Currently active" : "Tab not visible"}
              icon={<ClockIcon />}
              trend={timeOnPage > 60 ? 'up' : 'neutral'}
              delay={0.1}
            />
            <MetricCard
              title="Max Scroll Depth"
              value={`${maxScrollDepth}%`}
              subtitle={`${trackedThresholds.length} milestones reached`}
              icon={<ScrollIcon />}
              trend={maxScrollDepth > 75 ? 'up' : maxScrollDepth > 25 ? 'neutral' : 'down'}
              delay={0.2}
            />
            <MetricCard
              title="Engagement Level"
              value={timeOnPage > 120 && maxScrollDepth > 50 ? "High" : timeOnPage > 60 || maxScrollDepth > 25 ? "Medium" : "Low"}
              subtitle="Based on time and scroll"
              icon={<TrendingUpIcon />}
              trend={timeOnPage > 120 && maxScrollDepth > 50 ? 'up' : 'neutral'}
              delay={0.3}
            />
          </div>
        </motion.div>

        {/* Overall Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">Overall Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Page Views"
              value={analyticsData.pageViews.toLocaleString()}
              subtitle="+12% from last week"
              icon={<EyeIcon />}
              trend="up"
              delay={0.1}
            />
            <MetricCard
              title="Conversion Rate"
              value={`${analyticsData.conversionRate}%`}
              subtitle="+0.3% from last week"
              icon={<TargetIcon />}
              trend="up"
              delay={0.2}
            />
            <MetricCard
              title="Avg. Time on Page"
              value={formatTime(analyticsData.averageTimeOnPage)}
              subtitle="Above industry average"
              icon={<ClockIcon />}
              trend="up"
              delay={0.3}
            />
            <MetricCard
              title="Total Sessions"
              value={analyticsData.totalSessions.toLocaleString()}
              subtitle="+8% from last week"
              icon={<TrendingUpIcon />}
              trend="up"
              delay={0.4}
            />
          </div>
        </motion.div>

        {/* Popular Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">Popular Actions</h3>
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="space-y-4">
              {analyticsData.popularActions.map((action, index) => (
                <motion.div
                  key={action.action}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-center justify-between py-2"
                >
                  <span className="font-medium text-foreground">{action.action}</span>
                  <Badge variant="outline" className="ml-2">
                    {action.count}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Debug Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Button
            onClick={handleDebugToggle}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            {isDebugMode ? 'Hide' : 'Show'} Debug Info
          </Button>
          
          {isDebugMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted rounded-lg p-4 text-left text-sm font-mono"
            >
              <p><strong>Analytics Status:</strong> {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}</p>
              <p><strong>GA Measurement ID:</strong> {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'Not set'}</p>
              <p><strong>Current Path:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</p>
              <p><strong>Tracked Thresholds:</strong> {trackedThresholds.join(', ') || 'None'}</p>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  )
}