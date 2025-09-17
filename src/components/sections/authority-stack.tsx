'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'

const featuredLogos = [
  {
    name: 'TechCrunch',
    logo: '/images/logos/techcrunch.svg',
    alt: 'Featured in TechCrunch'
  },
  {
    name: 'Product Hunt',
    logo: '/images/logos/producthunt.svg',
    alt: 'Featured on Product Hunt'
  },
  {
    name: 'Hacker News',
    logo: '/images/logos/hackernews.svg',
    alt: 'Featured on Hacker News'
  },
  {
    name: 'Dev.to',
    logo: '/images/logos/devto.svg',
    alt: 'Featured on Dev.to'
  },
  {
    name: 'GitHub',
    logo: '/images/logos/github.svg',
    alt: 'Open source on GitHub'
  },
  {
    name: 'Stack Overflow',
    logo: '/images/logos/stackoverflow.svg',
    alt: 'Active on Stack Overflow'
  }
]

const achievements = [
  {
    number: '$15,000',
    label: 'Total Sponsor Investment',
    description: '5 business owners × $3,000 each'
  },
  {
    number: '100 Only',
    label: 'Workshop Seats',
    description: 'Limited spots, first-come basis'
  },
  {
    number: '3 Days',
    label: 'Intensive Training',
    description: 'Build a working AI solution'
  },
  {
    number: '90 Days',
    label: 'Ongoing Support',
    description: 'Expert help after workshop'
  }
]

export function AuthorityStack() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-b border-border">
      <Container>
        {/* Featured In Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Why 5 Business Owners Invested $15,000 to Make This FREE
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            These forward-thinking business owners see what's coming: AI isn't going away. 
            They'd rather invest in upskilling 100 professionals than watch talent get left behind.
          </p>
          
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {achievement.number}
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">
                {achievement.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {achievement.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}