'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Manager',
    company: 'Tech Startup',
    avatar: '/images/avatars/sarah.jpg',
    content: 'I went from AI-terrified to AI-powered in 3 days. The agent I built now handles 80% of my content research, saving me 15 hours per week.',
    result: '15 hours/week saved',
    timeframe: '3 days'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Operations Director',
    company: 'E-commerce',
    avatar: '/images/avatars/marcus.jpg',
    content: 'Built an AI assistant that streamlined our customer support. ROI was immediate and impressive. The 90-day support helped me scale it further.',
    result: '40% faster response times',
    timeframe: '1 week implementation'
  },
  {
    name: 'Dr. Lisa Thompson',
    role: 'Business Consultant',
    company: 'Independent',
    avatar: '/images/avatars/lisa.jpg',
    content: 'The 90-day support was crucial. My workshop project became a client-ready solution worth $25K. Best investment of time I\'ve ever made.',
    result: 'New $25K revenue stream',
    timeframe: '2 months'
  },
  {
    name: 'David Park',
    role: 'Software Developer',
    company: 'Fortune 500',
    avatar: '/images/avatars/david.jpg',
    content: 'Finally understood how to implement AI practically. Now I\'m the go-to AI person at my company. Got promoted with a 30% raise.',
    result: 'Promotion + 30% raise',
    timeframe: '3 months'
  },
  {
    name: 'Emma Wilson',
    role: 'Product Manager',
    company: 'SaaS Company',
    avatar: '/images/avatars/emma.jpg',
    content: 'The templates alone were worth thousands. Built an AI feature for our product that increased user engagement by 50%.',
    result: '50% engagement boost',
    timeframe: '1 month'
  },
  {
    name: 'Alex Kumar',
    role: 'Freelancer',
    company: 'Self-Employed',
    avatar: '/images/avatars/alex.jpg',
    content: 'Transformed my freelance business with AI automation. Now handling 3x more clients with less stress. Game-changing workshop.',
    result: '3x client capacity',
    timeframe: '6 weeks'
  }
]

const companies = [
  'Google', 'Microsoft', 'Apple', 'Amazon', 'Netflix', 'Spotify', 'Airbnb', 'Uber'
]

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Real Results from Previous AI Workshop Graduates
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Every participant leaves with a working AI solution. Here&apos;s what some of them built and achieved:
          </p>
          
          {/* Social Proof Companies */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground">
            <span>Developers from:</span>
            {companies.slice(0, 4).map((company, index) => (
              <span key={company} className="font-medium">
                {company}{index < 3 && ','}
              </span>
            ))}
            <span>and more...</span>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300"
            >
              {/* Content */}
              <div className="mb-6">
                <div className="text-primary mb-2">★★★★★</div>
                <p className="text-card-foreground leading-relaxed mb-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                {/* Result Highlight */}
                <div className="bg-primary/10 p-3 rounded-lg mb-4">
                  <div className="text-sm font-semibold text-primary">
                    Result: {testimonial.result}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    in {testimonial.timeframe}
                  </div>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-4">
                  <div className="text-lg font-semibold text-muted-foreground">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-muted/50 p-8 rounded-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
              <div className="text-xs text-muted-foreground">1,200+ reviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">$2.5M+</div>
              <div className="text-sm text-muted-foreground">Revenue Generated</div>
              <div className="text-xs text-muted-foreground">by our community</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-xs text-muted-foreground">of active participants</div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}