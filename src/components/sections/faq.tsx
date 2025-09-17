'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/ui/container'

const faqs = [
  {
    question: "I have zero AI experience. Will I be able to keep up?",
    answer: "Absolutely! This workshop is designed for beginners. We start from basics and build up systematically. Plus, you get 90 days of support to ask questions and get help. Many of our most successful participants started with no AI background at all."
  },
  {
    question: "What if I can't attend all 3 days?",
    answer: "All sessions are recorded and you'll get lifetime access. However, we strongly recommend attending live for the hands-on building experience and real-time support. The workshop is intensive and builds on each day's progress."
  },
  {
    question: "What kind of AI agent will I build?",
    answer: "You'll choose from 5 proven project types based on your interests: customer service assistant, content research agent, data analysis helper, lead qualification bot, or process automation agent. Each comes with templates and step-by-step guidance."
  },
  {
    question: "Is this really completely free? What's the catch?",
    answer: "Yes, completely free. The 5 business sponsors covered all costs because they believe in democratizing AI education. No upsells, no hidden fees, no catch. They see AI skills as essential for the future workforce."
  },
  {
    question: "What happens after the 90-day support period?",
    answer: "You keep all materials forever and remain in our graduate community. Many participants continue collaborating and sharing resources long after the official support ends. Plus, sponsors often offer opportunities to top performers."
  },
  {
    question: "How do I know this isn't just basic AI theory?",
    answer: "By day 3, you'll have a working AI solution deployed and functional. We focus 80% on building and 20% on necessary theory. Every participant leaves with something they built themselves that actually works."
  },
  {
    question: "What tools or software do I need?",
    answer: "Just a laptop and internet connection. We provide access to all necessary AI tools and platforms during the workshop. No expensive software subscriptions or powerful computers required."
  },
  {
    question: "Who are the 5 business sponsors?",
    answer: "Five forward-thinking business owners from various industries who each contributed $3,000 to make this workshop free. They believe practical AI skills shouldn't be gatekept and want to help 100 professionals get ahead."
  },
  {
    question: "Can I really build something useful in just 3 days?",
    answer: "Yes! We've designed the workshop around proven, practical projects. You won't become an AI expert overnight, but you'll have a working foundation and the skills to build upon it. Many graduates expand their projects into full solutions."
  },
  {
    question: "What if I get stuck after the workshop?",
    answer: "That's what the 90-day support is for! You can ask questions, get code reviews, and receive guidance as you implement and expand your AI solution. We're committed to your success beyond just the workshop days."
  }
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="border border-border rounded-lg overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-card hover:bg-muted/50 transition-colors duration-200 flex justify-between items-center"
      >
        <span className="font-semibold text-card-foreground pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <svg
            className="w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 bg-muted/20 border-t border-border">
              <p className="text-muted-foreground leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We&apos;ve helped thousands of developers overcome these exact concerns. 
            Here are the most common questions we get.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItems.includes(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 bg-card p-8 rounded-xl border border-border"
        >
          <h3 className="text-2xl font-bold text-card-foreground mb-4">
            Still Have Questions?
          </h3>
          <p className="text-muted-foreground mb-6">
            We&apos;re here to help! Reach out to our team and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Email Support
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors duration-200"
            >
              Schedule a Call
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}