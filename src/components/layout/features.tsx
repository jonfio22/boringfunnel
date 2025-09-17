'use client'

import { motion } from 'framer-motion'

const features = [
  {
    title: 'Hands-On AI Agent Building',
    description: 'No theory overload. You\'ll build a complete AI solution from scratch using industry-standard tools and frameworks.',
    icon: '🏗️',
  },
  {
    title: 'Comprehensive Resource Library',
    description: 'Access our complete AI toolkit: templates, best practices guide, implementation checklists, and troubleshooting resources.',
    icon: '📚',
  },
  {
    title: '90 Days of Expert Support',
    description: 'Don\'t get stuck after the workshop. Get direct access to our AI practitioners for three full months.',
    icon: '👥',
  },
  {
    title: 'Real-World Application Focus',
    description: 'Build something you\'ll actually use - whether for your current role, side project, or business opportunity.',
    icon: '🎯',
  },
  {
    title: 'Exclusive AI Builder Community',
    description: 'Join an ongoing community of workshop graduates, sponsors, and mentors for continued learning and opportunities.',
    icon: '🤝',
  },
  {
    title: 'Zero Setup Frustration',
    description: 'We handle all the technical setup. You focus on learning and building, not fighting with installation issues.',
    icon: '⚡',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Become AI-Confident
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Worth $5,000+, yours completely FREE thanks to our generous sponsors. Here\'s everything included in your workshop experience:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}