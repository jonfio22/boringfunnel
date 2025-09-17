'use client'

import { ThemeProvider } from 'next-themes'
import { GA4Provider } from '@/components/analytics/ga4-provider'
import { PerformanceProvider } from '@/components/analytics/performance-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PerformanceProvider>
      <GA4Provider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </GA4Provider>
    </PerformanceProvider>
  )
}