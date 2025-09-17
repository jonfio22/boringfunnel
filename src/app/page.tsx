import dynamic from 'next/dynamic'
import { Header } from '@/components/layout/header'
import { Hero } from '@/components/layout/hero'
import { CROLayout } from '@/components/cro/cro-layout'
import { UrgencyBanner } from '@/components/cro'
import { SkeletonCard, SkeletonTestimonial, SkeletonText } from '@/components/ui/skeleton'

// Lazy load below-fold components with loading states
const AuthorityStack = dynamic(() => import('@/components/sections/authority-stack').then(mod => ({ default: mod.AuthorityStack })), {
  loading: () => <div className="py-16"><SkeletonCard /></div>,
  ssr: true
})

const ProblemSolution = dynamic(() => import('@/components/sections/problem-solution').then(mod => ({ default: mod.ProblemSolution })), {
  loading: () => <div className="py-16 space-y-8"><SkeletonText lines={6} /><SkeletonCard /></div>,
  ssr: true
})

const Features = dynamic(() => import('@/components/layout/features').then(mod => ({ default: mod.Features })), {
  loading: () => (
    <div className="py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  ),
  ssr: true
})

const ScarcityCounter = dynamic(() => import('@/components/cro').then(mod => ({ default: mod.ScarcityCounter })), {
  loading: () => <div className="h-32 w-64 mx-auto"><SkeletonCard /></div>,
  ssr: true
})

const Testimonials = dynamic(() => import('@/components/sections/testimonials').then(mod => ({ default: mod.Testimonials })), {
  loading: () => (
    <div className="py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => <SkeletonTestimonial key={i} />)}
    </div>
  ),
  ssr: true
})

const AboutSection = dynamic(() => import('@/components/sections/about-section').then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="py-16"><SkeletonText lines={8} /></div>,
  ssr: true
})

const FAQ = dynamic(() => import('@/components/sections/faq').then(mod => ({ default: mod.FAQ })), {
  loading: () => (
    <div className="py-16 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <SkeletonText lines={2} />
        </div>
      ))}
    </div>
  ),
  ssr: true
})

const CTA = dynamic(() => import('@/components/layout/cta').then(mod => ({ default: mod.CTA })), {
  loading: () => <div className="py-16"><SkeletonText lines={4} /></div>,
  ssr: true
})

const Footer = dynamic(() => import('@/components/layout/footer').then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="py-16"><SkeletonText lines={6} /></div>,
  ssr: true
})

export default function Home() {
  return (
    <CROLayout
      enableExitIntent={false}
      enableMobileExitIntent={false}
      enableStickyCTA={false}
      enableScrollProgress={true}
      enableSocialProof={false}
    >
      <div className="min-h-screen">
        <UrgencyBanner 
          message="⚠️ Only 100 FREE spots available - Workshop starts soon"
          countdown={true}
          minutes={30}
        />
        <Header />
        <main className="flex-1">
          <Hero />
          <section id="authority" aria-labelledby="authority-heading">
            <AuthorityStack />
          </section>
          <section id="problem-solution" aria-labelledby="problem-heading">
            <ProblemSolution />
          </section>
          <section id="features" aria-labelledby="features-heading">
            <Features />
          </section>
          <aside className="flex justify-center py-8" aria-labelledby="scarcity-heading">
            <ScarcityCounter 
              title="Spots Remaining"
              subtitle="Join thousands of successful marketers"
              initialCount={23}
              minCount={8}
            />
          </aside>
          <section id="testimonials" aria-labelledby="testimonials-heading">
            <Testimonials />
          </section>
          <section id="about" aria-labelledby="about-heading">
            <AboutSection />
          </section>
          <section id="faq" aria-labelledby="faq-heading">
            <FAQ />
          </section>
          <section id="cta" aria-labelledby="cta-heading">
            <CTA />
          </section>
        </main>
        <footer id="footer" role="contentinfo">
          <Footer />
        </footer>
      </div>
    </CROLayout>
  )
}