'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'

const problems = [
  {
    icon: '🚨',
    title: 'AI Anxiety Paralysis',
    description: 'You\'re hearing about AI everywhere but don\'t know where to start without getting overwhelmed or wasting time on theory.'
  },
  {
    icon: '⏰',
    title: 'Fear of Being Left Behind',
    description: 'Every day you wait, AI gets more advanced and the gap between you and those who "get it" grows wider.'
  },
  {
    icon: '🎯',
    title: 'No Practical Experience',
    description: 'You\'ve watched demos and read articles, but you\'ve never actually BUILT something with AI that you could use.'
  },
  {
    icon: '💸',
    title: 'Expensive Learning Curve',
    description: 'Quality AI education costs thousands, and you\'re not sure if it\'s worth the investment or if you\'ll even succeed.'
  }
]

const solutions = [
  {
    icon: '🎯',
    title: 'Build Real Solutions, Not Toy Examples',
    description: 'You\'ll create a working AI agent that solves an actual problem - something you can immediately use or improve upon.'
  },
  {
    icon: '🎓',
    title: 'Learn with Expert Guidance, Not Alone',
    description: 'Get direct access to AI practitioners who\'ve built real systems, plus 90 days of support to ensure your success.'
  },
  {
    icon: '📋',
    title: 'Templates & Best Practices Included',
    description: 'Receive proven frameworks, code templates, and implementation guides worth $2,000+ - yours to keep forever.'
  },
  {
    icon: '🤝',
    title: 'Join a Community of AI Builders',
    description: 'Connect with 99 other motivated professionals and 5 business sponsors who believe in practical AI education.'
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
            Are You Watching 
            <span className="text-destructive">AI Replace Jobs</span>
            While Feeling Powerless to Adapt?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            You see AI transforming every industry, but you&apos;re stuck on the sidelines, 
            unsure how to get started. Here&apos;s what&apos;s holding you back:
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
            Here&apos;s How We Transform 
            <span className="text-primary">AI Anxiety Into AI Confidence</span>
            in Just 3 Days
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stop watching from the sidelines. Our hands-on workshop gives you the practical skills 
            and confidence to build real AI solutions that work.
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