'use client'

import { motion } from 'framer-motion'
import { trackCTAClick } from '@/lib/analytics'

export function CTA() {
  const handlePrimaryClick = () => {
    trackCTAClick('Claim Your FREE Spot Now', 'footer_cta', 'primary_button')
  }

  const handleSecondaryClick = () => {
    trackCTAClick('See Workshop Agenda', 'footer_cta', 'secondary_button')
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 text-center border border-primary/20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
          >
            Ready to Transform AI Anxiety Into AI Confidence?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Join 99 other professionals in this fully-sponsored AI workshop. Only 100 seats available. 5 business leaders invested $15,000 to make this possible because they believe practical AI skills shouldn't be reserved for the privileged few.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={handlePrimaryClick}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Claim Your FREE Spot Now
            </button>
            <button 
              onClick={handleSecondaryClick}
              className="text-primary hover:text-primary/80 transition-colors text-lg font-semibold"
            >
              See Workshop Agenda →
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-8 text-sm text-muted-foreground"
          >
            ✅ Completely FREE - No hidden costs &nbsp;&nbsp;&nbsp; ✅ Build a real AI solution &nbsp;&nbsp;&nbsp; ✅ 90 days of expert support
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}