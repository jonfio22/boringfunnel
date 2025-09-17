import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import '@/styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: false
})

export const metadata: Metadata = {
  title: {
    default: 'Free AI Workshop - Build Your First AI Agent in 3 Days (100 Spots Only)',
    template: '%s | AI Workshop'
  },
  description: 'Join the ONLY hands-on AI workshop where you\'ll build a working AI solution in 3 days. 100% FREE - Sponsored by 5 business owners. Includes 90 days support, templates, and resources.',
  keywords: [
    'AI workshop',
    'free AI training',
    'build AI agent', 
    'AI for beginners',
    'practical AI education',
    'AI bootcamp',
    'learn AI development',
    'AI implementation'
  ],
  authors: [{ name: 'BoringFunnel Team', url: 'https://boringfunnel.com' }],
  creator: 'BoringFunnel',
  publisher: 'BoringFunnel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://boringfunnel.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://boringfunnel.com',
    title: 'From Developer to $100K Digital Product Creator in 12 Months',
    description: 'Learn the exact framework that helped 500+ developers build profitable digital products while keeping their day jobs. Join 10,000+ developers in our proven system.',
    siteName: 'BoringFunnel',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BoringFunnel - Developer Success Framework',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'From Developer to $100K Digital Product Creator in 12 Months',
    description: 'Learn the exact framework that helped 500+ developers build profitable digital products while keeping their day jobs.',
    creator: '@boringfunnel',
    images: ['/images/twitter-card.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BoringFunnel",
              "url": "https://boringfunnel.com",
              "logo": "https://boringfunnel.com/images/logo.png",
              "description": "Helping developers build profitable digital products",
              "sameAs": [
                "https://twitter.com/boringfunnel",
                "https://linkedin.com/company/boringfunnel"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}