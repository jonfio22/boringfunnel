'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/ui/container'

const faqs = [
  {
    question: "I'm already a good developer. Why do I need this?",
    answer: "Being a great developer and building a profitable business are two completely different skills. You can write amazing code but still struggle to find high-paying clients, price your services correctly, or scale beyond trading time for money. This system teaches you the business side that no one teaches in coding bootcamps or computer science degrees."
  },
  {
    question: "How is this different from other business courses?",
    answer: "Most business courses are generic and don't understand the unique challenges developers face. Our system is built specifically for technical people - we speak your language, understand your mindset, and address the specific objections and challenges you face when transitioning from employee to entrepreneur."
  },
  {
    question: "I don't have time to build a side business. Will this work for me?",
    answer: "Actually, most of our successful members started while working full-time jobs. The framework is designed to be implemented in just 2-3 hours per week. We focus on high-impact activities that move the needle, not busy work. Many members see results within the first 30 days."
  },
  {
    question: "What if I'm not sure what services to offer?",
    answer: "That's exactly what we help you figure out! The course includes a detailed skill audit and market opportunity analysis to help you identify your most profitable skills and how to package them into services that clients actually want to buy. You'll have complete clarity on your positioning within the first week."
  },
  {
    question: "I'm not good at sales or marketing. Can I still succeed?",
    answer: "Most developers think they're bad at sales because they've been trying to sell like a salesperson instead of an expert. We teach you how to attract clients through expertise and authority, not pushy sales tactics. When you're positioned correctly, clients come to you already wanting to work with you."
  },
  {
    question: "What if I live outside the US? Will this work internationally?",
    answer: "Absolutely! We have successful members in over 40 countries. The strategies work anywhere there's internet access. In fact, many of our international members have an advantage because they can offer premium services at competitive rates while building global client relationships."
  },
  {
    question: "How quickly can I see results?",
    answer: "Many members see their first results within 30 days - whether that's landing a better client, raising their rates, or launching their first digital product. However, building a sustainable business typically takes 3-6 months of consistent implementation. We provide both quick wins and long-term strategies."
  },
  {
    question: "What if I try this and it doesn't work for me?",
    answer: "We offer a 60-day money-back guarantee. If you implement the strategies and don't see measurable progress in your income or business, we'll refund every penny. We're that confident in our system because we've seen it work for thousands of developers just like you."
  },
  {
    question: "Do I need to quit my job to start?",
    answer: "Not at all! We actually recommend keeping your job while you build your business on the side. This removes financial pressure and allows you to be selective with clients. Most members transition gradually, and many choose to stay employed while running profitable side businesses."
  },
  {
    question: "Is this just about freelancing or can I build products too?",
    answer: "Both! The framework covers multiple monetization strategies: premium consulting, digital products, online courses, SaaS development, and more. You'll learn how to choose the right strategy for your goals and how to potentially stack multiple revenue streams over time."
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