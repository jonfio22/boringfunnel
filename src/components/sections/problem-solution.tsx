'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'

const problems = [
  {
    icon: '💸',
    title: 'Undervaluing Your Skills',
    description: 'You\'re charging way less than you\'re worth because you don\'t know how to position yourself as an expert.'
  },
  {
    icon: '🔍',
    title: 'No Clear Path to Monetization',
    description: 'You have the skills but don\'t know where to start or what services to offer that actually sell.'
  },
  {
    icon: '⏰',
    title: 'Trading Time for Money',
    description: 'You\'re stuck in the hourly billing trap with no way to scale your income beyond more hours.'
  },
  {
    icon: '🎯',
    title: 'Can\'t Find Quality Clients',
    description: 'You\'re tired of working with clients who don\'t value quality work and constantly negotiate prices.'
  }
]

const solutions = [
  {
    icon: '💎',
    title: 'Premium Positioning Strategy',
    description: 'Learn to position yourself as a premium expert and command 3-5x higher rates immediately.'
  },
  {
    icon: '📈',
    title: 'Scalable Revenue Streams',
    description: 'Build products, courses, and services that generate income while you sleep.'
  },
  {
    icon: '🎯',
    title: 'Ideal Client Attraction',
    description: 'Attract high-value clients who appreciate quality and pay premium prices without negotiation.'
  },
  {
    icon: '🚀',
    title: 'Proven System & Framework',
    description: 'Follow our battle-tested system that\'s helped 50,000+ developers build profitable businesses.'
  }
]

export function ProblemSolution() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <Container>
        {/* Problem Agitation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Are You Tired of Being the 
            <span className="text-destructive"> &ldquo;Cheap&rdquo; </span>
            Developer?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            You have incredible technical skills, but you&apos;re struggling to turn them into the income you deserve. 
            Sound familiar?
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card/50 p-6 rounded-xl border border-destructive/20 hover:border-destructive/40 transition-colors duration-300"
            >
              <div className="text-3xl mb-4">{problem.icon}</div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Solution Bridge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <div className="text-2xl">💡</div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Here&apos;s How We 
            <span className="text-primary"> Transform </span>
            Your Career
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stop leaving money on the table. Our proven system helps developers like you build profitable, 
            scalable businesses around their expertise.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-3xl mb-4">{solution.icon}</div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                {solution.title}
              </h3>
              <p className="text-muted-foreground">
                {solution.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}