'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'

const credentials = [
  {
    icon: '🎓',
    title: 'Former AI Research Scientist',
    description: 'Google AI Labs, 2015-2020'
  },
  {
    icon: '💼',
    title: 'Founded 3 AI Startups',
    description: 'Built real-world AI solutions at scale'
  },
  {
    icon: '🚀',
    title: 'Trained 10,000+ Professionals',
    description: 'In practical AI implementation'
  },
  {
    icon: '📚',
    title: 'Published AI Researcher',
    description: '20+ papers on applied AI systems'
  }
]

const timeline = [
  {
    year: '2015-2020',
    title: 'AI Research Scientist at Google',
    description: 'Developed practical AI systems for real-world applications, not just theory.'
  },
  {
    year: '2020-2021',
    title: 'Founded First AI Startup',
    description: 'Built AI automation tools used by 500+ companies - learned what actually works.'
  },
  {
    year: '2021-2023',
    title: 'AI Implementation Consultant',
    description: 'Helped Fortune 500 companies integrate AI, saw the massive skills gap firsthand.'
  },
  {
    year: '2023-Present',
    title: 'AI Education Pioneer',
    description: 'Dedicated to democratizing AI education through hands-on workshops.'
  },
  {
    year: 'The Mission',
    title: 'Making AI Accessible',
    description: 'Everyone deserves to understand and use AI, not just tech giants.'
  }
]

export function AboutSection() {
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
            Meet Your AI Workshop Leaders & Sponsors
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Led by Alex Chen, former AI Research Scientist at Google and founder of 3 AI startups. 
            Alex believes everyone deserves access to quality AI education.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Photo Placeholder */}
            <div className="w-64 h-64 bg-muted rounded-xl mb-8 mx-auto lg:mx-0 flex items-center justify-center">
              <div className="text-6xl">👨‍💻</div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Why This Workshop?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Working at Google AI Labs, I saw firsthand how AI would transform every industry. 
                  But I also saw how inaccessible this technology was to most people - locked behind 
                  corporate walls and PhD programs.
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                When I left to start my own AI companies, I discovered the massive gap between 
                AI potential and practical implementation. Companies desperately needed people who 
                could actually BUILD with AI, not just theorize about it.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                I created this workshop because AI moves fast, and traditional courses take too long. 
                In 3 days, you&apos;ll have a working solution and the confidence to build more. No 
                theory overload, no academic jargon - just practical skills.
              </p>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Message from Our Sponsors</h3>
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;Our 5 business sponsors each contributed $3,000 because they understand: AI skills 
                are the new literacy. They&apos;d rather invest in upskilling talent than watch people 
                get left behind. This is about democratizing access to the future.&rdquo;
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Together, we&apos;re making sure that AI transformation doesn&apos;t leave anyone behind. 
                Join us and be part of the solution.
              </p>
            </div>
          </motion.div>

          {/* Credentials & Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Credentials */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Credentials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {credentials.map((credential, index) => (
                  <motion.div
                    key={credential.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card p-4 rounded-lg border border-border"
                  >
                    <div className="text-2xl mb-2">{credential.icon}</div>
                    <div className="font-semibold text-card-foreground text-sm mb-1">
                      {credential.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {credential.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Journey</h3>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-20 text-sm font-medium text-primary">
                      {item.year}
                    </div>
                    <div className="flex-grow">
                      <div className="font-semibold text-foreground mb-1">
                        {item.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Personal Note */}
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
              <h4 className="font-semibold text-foreground mb-3">Why I Do This</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I&apos;ve been fortunate enough to achieve financial independence through my businesses. 
                Now I&apos;m passionate about helping other developers do the same. There&apos;s something 
                magical about watching a talented developer finally get paid what they&apos;re worth.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}