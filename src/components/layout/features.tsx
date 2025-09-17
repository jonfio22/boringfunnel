'use client'

import { motion } from 'framer-motion'

const features = [
  {
    title: 'Lightning Fast',
    description: 'Built with Next.js 14 and optimized for performance. Your landing page loads instantly.',
    icon: '⚡',
  },
  {
    title: 'Mobile First',
    description: 'Responsive design that looks perfect on all devices. Mobile conversion optimized.',
    icon: '📱',
  },
  {
    title: 'SEO Optimized',
    description: 'Built-in SEO best practices and meta tags to help you rank higher in search results.',
    icon: '🔍',
  },
  {
    title: 'Analytics Ready',
    description: 'Google Analytics integration and conversion tracking built-in from day one.',
    icon: '📊',
  },
  {
    title: 'Type Safe',
    description: 'Built with TypeScript for better developer experience and fewer runtime errors.',
    icon: '🛡️',
  },
  {
    title: 'Easy to Customize',
    description: 'Clean, well-organized code that makes customization and maintenance a breeze.',
    icon: '🎨',
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
            Everything You Need to Convert
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our landing page template comes with all the features you need to build a high-converting page for your technical product or service.
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