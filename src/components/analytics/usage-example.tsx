'use client'

import { PageTracker } from './page-tracker'
import { AnalyticsDashboard } from './analytics-dashboard'
import { useScrollDepth } from '@/hooks/use-scroll-depth'
import { useTimeOnPage } from '@/hooks/use-time-on-page'

/**
 * Example component showing how to integrate analytics tracking
 * This demonstrates the various ways to use the analytics system
 */
export function AnalyticsUsageExample() {
  // Hook examples - these automatically track user behavior
  const { maxScrollDepth, trackedThresholds } = useScrollDepth()
  const { timeOnPage, isVisible } = useTimeOnPage()

  return (
    <PageTracker pageName="Analytics Example Page">
      <div className="space-y-8">
        {/* Current session info */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Live Analytics Data</h3>
          <p>Time on page: {Math.floor(timeOnPage / 60)}m {timeOnPage % 60}s</p>
          <p>Max scroll depth: {maxScrollDepth}%</p>
          <p>Milestones reached: {trackedThresholds.join(', ')}</p>
          <p>Page visible: {isVisible ? 'Yes' : 'No'}</p>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />

        {/* Long content to test scroll tracking */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Scroll Tracking Test</h2>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="p-4 bg-background border rounded">
              <p>Content block {i + 1} - This content helps test scroll depth tracking.</p>
            </div>
          ))}
        </div>
      </div>
    </PageTracker>
  )
}

/**
 * How to use analytics in your components:
 * 
 * 1. Wrap your page with PageTracker:
 *    <PageTracker pageName="Your Page Name">
 *      {children}
 *    </PageTracker>
 * 
 * 2. Track custom events:
 *    import { trackEvent, trackButtonClick } from '@/lib/analytics'
 *    
 *    const handleClick = () => {
 *      trackButtonClick('Special Button', 'header')
 *      // your click handler logic
 *    }
 * 
 * 3. Use hooks for real-time data:
 *    const { maxScrollDepth } = useScrollDepth()
 *    const { timeOnPage } = useTimeOnPage()
 * 
 * 4. Add the dashboard anywhere:
 *    <AnalyticsDashboard />
 */