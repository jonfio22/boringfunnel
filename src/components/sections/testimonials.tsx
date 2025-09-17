'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Full-Stack Developer',
    company: 'Ex-Google',
    avatar: '/images/avatars/sarah.jpg',
    content: 'I went from charging $50/hour to $200/hour in just 3 months. The positioning strategies alone paid for the course 10x over. Now I have a waiting list of clients.',
    result: '$50/hr → $200/hr',
    timeframe: '3 months'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'React Specialist',
    company: 'Freelancer',
    avatar: '/images/avatars/marcus.jpg',
    content: 'Built my first $10k product after following the framework. The step-by-step guidance made it so much easier than trying to figure it out alone.',
    result: '$10k first product',
    timeframe: '6 months'
  },
  {
    name: 'Alex Kim',
    role: 'DevOps Engineer',
    company: 'Ex-Amazon',
    avatar: '/images/avatars/alex.jpg',
    content: 'The client attraction strategies are pure gold. I now work with 3 high-value clients who never negotiate on price and respect my expertise.',
    result: '3 premium clients',
    timeframe: '4 months'
  },
  {
    name: 'Emma Thompson',
    role: 'Frontend Developer',
    company: 'Remote',
    avatar: '/images/avatars/emma.jpg',
    content: 'Launched my SaaS product and hit $5k MRR within 8 months. The product development framework saved me from so many common mistakes.',
    result: '$5k MRR SaaS',
    timeframe: '8 months'
  },
  {
    name: 'David Park',
    role: 'Mobile Developer',
    company: 'Consultant',
    avatar: '/images/avatars/david.jpg',
    content: 'Went from stressed freelancer to confident consultant. Now I work 30 hours a week and make 3x more than my old full-time job.',
    result: '3x income, 30hr weeks',
    timeframe: '5 months'
  },
  {
    name: 'Lisa Anderson',
    role: 'Python Developer',
    company: 'Course Creator',
    avatar: '/images/avatars/lisa.jpg',
    content: 'Created my first online course and made $25k in the first launch. The course creation framework made the whole process so much less overwhelming.',
    result: '$25k course launch',
    timeframe: '7 months'
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
            Real Results from Real Developers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of developers who&apos;ve transformed their careers and built profitable businesses.
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