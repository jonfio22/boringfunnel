'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'

const credentials = [
  {
    icon: '🎓',
    title: 'Computer Science Degree',
    description: 'Stanford University, 2010'
  },
  {
    icon: '💼',
    title: '12+ Years Experience',
    description: 'Senior roles at Google, Netflix, and startups'
  },
  {
    icon: '🚀',
    title: 'Built & Sold 3 Companies',
    description: 'Total exit value of $15M+'
  },
  {
    icon: '📚',
    title: 'Taught 50,000+ Developers',
    description: 'Through courses, workshops, and mentoring'
  }
]

const timeline = [
  {
    year: '2010-2014',
    title: 'Software Engineer at Google',
    description: 'Worked on search infrastructure and learned the importance of scalable systems.'
  },
  {
    year: '2014-2017',
    title: 'Senior Developer at Netflix',
    description: 'Led teams building streaming platforms, discovered my passion for mentoring.'
  },
  {
    year: '2017-2019',
    title: 'Founded First Startup',
    description: 'Built and sold a developer tools company for $3.2M - learned business fundamentals.'
  },
  {
    year: '2019-2022',
    title: 'Consulting & Teaching',
    description: 'Helped 100+ companies scale their engineering teams while teaching online.'
  },
  {
    year: '2022-Present',
    title: 'Full-Time Educator',
    description: 'Dedicated to helping developers build profitable businesses around their expertise.'
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
            Hi, I&apos;m Alex Thompson
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            I&apos;ve been exactly where you are. A talented developer undercharging for my skills, 
            not knowing how to build a real business. Here&apos;s how I changed that.
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
                <h3 className="text-2xl font-bold text-foreground mb-4">My Story</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In 2010, I graduated from Stanford with a Computer Science degree and immediately 
                  got a job at Google. I thought I had it made - great salary, prestigious company, 
                  interesting problems to solve.
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                But after a few years, I realized I was just another cog in the machine. I wanted 
                to build something of my own, but I had no idea how to turn my technical skills into 
                a real business.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                I made every mistake in the book: underpricing my services, working with terrible 
                clients, building products nobody wanted. I was technically excellent but business stupid.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Everything changed when I learned to think like a business owner, not just a developer. 
                I started positioning myself as an expert, charging premium rates, and building 
                scalable revenue streams.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Now I&apos;m on a mission to help other developers avoid the mistakes I made and build 
                profitable businesses around their expertise. Because the world needs more developer 
                entrepreneurs, not more corporate employees.
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