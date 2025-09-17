# Analytics Setup Guide

This document provides instructions for setting up Google Analytics 4 (GA4) integration and configuring the comprehensive analytics tracking system.

## Prerequisites

1. A Google Analytics 4 account
2. A GA4 property configured for your website
3. The GA4 Measurement ID (format: G-XXXXXXXXXX)

## Environment Configuration

### 1. Environment Variables

Create or update your `.env.local` file in the project root with the following variable:

```bash
# Google Analytics 4 Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important Notes:**
- Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID
- The `NEXT_PUBLIC_` prefix is required for Next.js client-side access
- Never commit your `.env.local` file to version control

### 2. Production vs Development

Analytics tracking is automatically disabled in development mode to prevent test data from polluting your analytics. To test analytics in development:

1. Temporarily set `NODE_ENV=production` in your environment
2. Use the analytics debug function: `debugAnalytics()` in browser console
3. Check browser developer tools for console logs showing tracked events

## GA4 Property Setup

### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" (gear icon)
3. Create a new property or select existing one
4. Choose "GA4" property type
5. Configure basic property settings:
   - Property name: Your website name
   - Reporting time zone: Your local timezone
   - Currency: Your preferred currency

### 2. Configure Enhanced Measurement

In your GA4 property:

1. Go to Admin > Data Streams
2. Select your web data stream
3. Enable "Enhanced measurement" with these settings:
   - ✅ Page views
   - ✅ Scrolls (automatically tracked)
   - ✅ Outbound clicks
   - ✅ Site search (if applicable)
   - ✅ Video engagement
   - ✅ File downloads

### 3. Set Up Conversions

The system automatically tracks these conversion events:

1. **generate_lead** - Email form submissions
2. **begin_checkout** - CTA clicks leading to purchase flow
3. **purchase** - Completed purchases (if e-commerce enabled)

To mark these as conversions in GA4:

1. Go to Admin > Events
2. Find each event name
3. Toggle "Mark as conversion"

## Custom Dimensions (Optional)

For advanced tracking, set up these custom dimensions in GA4:

1. Go to Admin > Custom Definitions > Custom Dimensions
2. Create the following dimensions:

| Dimension Name | Scope | Description |
|----------------|--------|-------------|
| `form_type` | Event | Type of form submitted |
| `button_location` | Event | Location of clicked button |
| `scroll_depth` | Event | Maximum scroll percentage |
| `time_on_page_bucket` | Event | Time spent on page (bucketed) |
| `exit_intent_trigger` | Event | What triggered exit intent |

## Installation & Dependencies

The analytics system requires the `gtag` package:

```bash
npm install gtag
```

This is already included in the `package.json` dependencies.

## Analytics Features Included

### 📊 Automatic Tracking

- **Page Views**: Tracked on every route change
- **Scroll Depth**: 25%, 50%, 75%, 100% milestones
- **Time on Page**: 30s, 1m, 2m, 5m intervals
- **Form Submissions**: Email capture forms
- **Button Clicks**: All CTA and navigation buttons
- **Social Shares**: Twitter, LinkedIn, Facebook, copy link
- **Theme Changes**: Light/dark mode switches
- **Exit Intent**: Mouse leave detection and modal interactions

### 🎯 Conversion Tracking

- **Email Signups**: Hero form, exit intent modal
- **CTA Interactions**: Primary and secondary CTAs
- **Modal Interactions**: Open, close, submit events
- **Social Engagement**: Share button clicks

### 📈 Real-time Dashboard

Access the analytics dashboard by adding the `AnalyticsDashboard` component to any page:

```tsx
import { AnalyticsDashboard } from '@/components/analytics'

// Add to your page component
<AnalyticsDashboard />
```

### 🔧 Custom Event Tracking

Use these utility functions to track custom events:

```tsx
import { 
  trackEvent, 
  trackConversion, 
  trackButtonClick,
  trackEmailSubmission,
  trackSocialShare 
} from '@/lib/analytics'

// Custom event
trackEvent({
  action: 'custom_action',
  category: 'user_interaction',
  label: 'specific_element',
  value: 1
})

// Button click
trackButtonClick('Download', 'header', { 
  file_type: 'pdf' 
})

// Email submission
trackEmailSubmission('newsletter', 'footer')

// Social share
trackSocialShare('twitter', 'blog_post', window.location.href)
```

## Privacy & Compliance

### GDPR/CCPA Considerations

The analytics implementation includes privacy-friendly defaults:

- IP anonymization enabled by default
- No personally identifiable information tracked
- Cookie consent integration ready (implement as needed)

### Cookie Configuration

GA4 cookies are configured with:
- `SameSite=None;Secure` for cross-site compatibility
- 2-year expiration (industry standard)
- Respect for user's "Do Not Track" preferences

## Testing & Debugging

### 1. Debug Mode

Enable debug mode in development:

```tsx
import { debugAnalytics } from '@/lib/analytics'

// Run in browser console or component
debugAnalytics()
```

### 2. Real-time Reports

Monitor events in GA4:

1. Go to Reports > Realtime
2. Perform actions on your site
3. Events should appear within 30 seconds

### 3. DebugView (GA4)

Enable debug mode for detailed event inspection:

1. Install GA4 DebugView Chrome extension
2. Enable debug mode in your browser
3. Events will appear in GA4 DebugView interface

## Troubleshooting

### Common Issues

**Events not appearing in GA4:**
- Check Measurement ID in environment variables
- Verify events in browser Network tab
- Ensure you're in production mode or testing correctly

**Tracking in development:**
- Events are logged to console in development
- Set `NODE_ENV=production` temporarily for testing
- Use `debugAnalytics()` function for status check

**High bounce rate:**
- Scroll depth and time tracking should reduce bounce rate
- Verify enhanced measurement settings in GA4
- Check that page view events are firing correctly

### Support

For additional help:
1. Check browser console for error messages
2. Use GA4 DebugView for event inspection
3. Review GA4 property configuration
4. Test with the included analytics dashboard

## Performance Impact

The analytics implementation is optimized for performance:

- Script loading strategy: `afterInteractive`
- Event debouncing for scroll tracking
- Minimal bundle size impact
- No blocking of page rendering
- Graceful fallbacks for disabled JavaScript

Total performance impact: < 10KB gzipped