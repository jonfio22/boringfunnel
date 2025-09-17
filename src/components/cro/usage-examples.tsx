'use client'

/**
 * Usage Examples for CRO Components
 * 
 * This file demonstrates how to use the various conversion rate optimization
 * components in different scenarios.
 */

import { 
  ExitIntent, 
  MobileExitIntent, 
  StickyCTA, 
  ScrollProgress,
  ScarcityCounter,
  CountdownTimer,
  SocialProofNotifications,
  MultiStepForm
} from './index'

// Example 1: Basic Exit Intent Setup
export function ExitIntentExample() {
  const handleEmailCapture = (email: string) => {
    console.log('Exit intent email captured:', email)
    // Send to your analytics/backend
  }

  return (
    <ExitIntent
      title="Don't Leave Empty-Handed!"
      subtitle="Get our exclusive marketing guide"
      offerText="Download our 50-page guide and learn the secrets of high-converting funnels"
      buttonText="Get Free Guide"
      onSubmit={handleEmailCapture}
      cooldownHours={24}
    />
  )
}

// Example 2: Multi-Step Form Configuration
export function MultiStepFormExample() {
  const formSteps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text' as const,
          required: true,
          placeholder: 'Enter your first name'
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text' as const,
          required: true,
          placeholder: 'Enter your last name'
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email' as const,
          required: true,
          placeholder: 'your@email.com',
          validation: {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          }
        }
      ]
    },
    {
      id: 'company',
      title: 'Company Details',
      description: 'Information about your business',
      fields: [
        {
          name: 'companyName',
          label: 'Company Name',
          type: 'text' as const,
          required: true,
          placeholder: 'Enter your company name'
        },
        {
          name: 'companySize',
          label: 'Company Size',
          type: 'select' as const,
          required: true,
          options: [
            { value: '1-10', label: '1-10 employees' },
            { value: '11-50', label: '11-50 employees' },
            { value: '51-200', label: '51-200 employees' },
            { value: '200+', label: '200+ employees' }
          ]
        },
        {
          name: 'industry',
          label: 'Industry',
          type: 'select' as const,
          required: true,
          options: [
            { value: 'tech', label: 'Technology' },
            { value: 'healthcare', label: 'Healthcare' },
            { value: 'finance', label: 'Finance' },
            { value: 'retail', label: 'Retail' },
            { value: 'other', label: 'Other' }
          ]
        }
      ]
    },
    {
      id: 'goals',
      title: 'Your Goals',
      description: 'What are you looking to achieve?',
      fields: [
        {
          name: 'primaryGoal',
          label: 'Primary Goal',
          type: 'radio' as const,
          required: true,
          options: [
            { value: 'increase-conversions', label: 'Increase conversions' },
            { value: 'generate-leads', label: 'Generate more leads' },
            { value: 'improve-retention', label: 'Improve customer retention' },
            { value: 'reduce-churn', label: 'Reduce churn rate' }
          ]
        },
        {
          name: 'additionalInfo',
          label: 'Additional Information',
          type: 'textarea' as const,
          placeholder: 'Tell us more about your specific needs...'
        }
      ]
    }
  ]

  const handleFormSubmit = async (data: any) => {
    console.log('Multi-step form submitted:', data)
    // Process the form data
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
  }

  return (
    <MultiStepForm
      steps={formSteps}
      onSubmit={handleFormSubmit}
      showProgress={true}
    />
  )
}

// Example 3: Social Proof Configuration
export function SocialProofExample() {
  const customNotifications = [
    {
      id: '1',
      type: 'signup' as const,
      name: 'John D.',
      location: 'New York, NY',
      action: 'just signed up for the premium plan',
      timeAgo: '3 minutes ago'
    },
    {
      id: '2',
      type: 'review' as const,
      name: 'Sarah M.',
      location: 'San Francisco, CA',
      action: 'left a 5-star review',
      timeAgo: '7 minutes ago',
      rating: 5
    }
  ]

  return (
    <SocialProofNotifications
      notifications={customNotifications}
      showInterval={10000}
      displayDuration={6000}
      position="bottom-right"
    />
  )
}

// Example 4: Comprehensive CRO Page Setup
export function ComprehensiveCROExample() {
  return (
    <div className="min-h-screen">
      {/* Urgency Banner at the top */}
      <div className="bg-red-600 text-white text-center py-2">
        <CountdownTimer
          duration={30}
          title="Special Offer Ends In:"
          size="sm"
          showLabels={false}
        />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Our Platform
        </h1>

        {/* Scarcity indicator */}
        <div className="flex justify-center mb-8">
          <ScarcityCounter
            title="Spots Left Today"
            subtitle="Limited availability"
            initialCount={15}
            minCount={3}
            icon="users"
          />
        </div>

        {/* Main content area */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 mb-4">
              We help businesses increase their conversion rates by up to 300%
              using proven psychological triggers and optimization techniques.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
            <MultiStepFormExample />
          </div>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <ScrollProgress position="top" />

      {/* Sticky CTA */}
      <StickyCTA
        text="Ready to boost your conversions?"
        buttonText="Start Free Trial"
        href="#signup"
      />

      {/* Exit intent modal */}
      <ExitIntentExample />

      {/* Mobile exit intent */}
      <MobileExitIntent
        title="Before You Go..."
        subtitle="Get our conversion checklist"
        offerText="Free 20-point conversion optimization checklist"
        buttonText="Get Checklist"
      />

      {/* Social proof notifications */}
      <SocialProofExample />
    </div>
  )
}

// Example 5: E-commerce Specific Setup
export function EcommerceCROExample() {
  return (
    <div>
      {/* Product page with scarcity */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Product Image</span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">Premium Course Package</h1>
            
            {/* Price with urgency */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-green-600">$97</span>
              <span className="text-lg text-gray-500 line-through ml-2">$197</span>
            </div>

            {/* Scarcity counter */}
            <div className="mb-6">
              <ScarcityCounter
                title="Courses Left"
                subtitle="At this special price"
                initialCount={8}
                minCount={1}
                urgencyThreshold={5}
                icon="star"
              />
            </div>

            {/* Countdown timer */}
            <div className="mb-6">
              <CountdownTimer
                duration={120} // 2 hours
                title="Special Price Expires:"
                size="md"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Buy Now - Secure Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}