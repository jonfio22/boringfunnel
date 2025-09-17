'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { ContactForm } from '@/types'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [savedEmail, setSavedEmail] = useLocalStorage('contact-form-email', '')
  const [savedName, setSavedName] = useLocalStorage('contact-form-name', '')
  const [savedCompany, setSavedCompany] = useLocalStorage('contact-form-company', '')
  const [showReturnMessage, setShowReturnMessage] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactForm>({
    defaultValues: {
      email: savedEmail,
      name: savedName,
      company: savedCompany
    }
  })

  const watchedEmail = watch('email')
  const watchedName = watch('name')
  const watchedCompany = watch('company')

  // Auto-save form data to localStorage
  useEffect(() => {
    if (watchedEmail !== savedEmail) {
      setSavedEmail(watchedEmail || '')
    }
  }, [watchedEmail, savedEmail, setSavedEmail])

  useEffect(() => {
    if (watchedName !== savedName) {
      setSavedName(watchedName || '')
    }
  }, [watchedName, savedName, setSavedName])

  useEffect(() => {
    if (watchedCompany !== savedCompany) {
      setSavedCompany(watchedCompany || '')
    }
  }, [watchedCompany, savedCompany, setSavedCompany])

  // Show return message if user has saved data
  useEffect(() => {
    if (savedEmail && !watchedEmail) {
      setValue('email', savedEmail)
      setShowReturnMessage(true)
      setTimeout(() => setShowReturnMessage(false), 5000)
    }
    if (savedName && !watchedName) {
      setValue('name', savedName)
    }
    if (savedCompany && !watchedCompany) {
      setValue('company', savedCompany)
    }
  }, [savedEmail, savedName, savedCompany, watchedEmail, watchedName, watchedCompany, setValue])

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitMessage('Thank you for your message! We&apos;ll get back to you soon.')
        
        // Clear saved data after successful submission
        setSavedEmail('')
        setSavedName('')
        setSavedCompany('')
        reset()
      } else {
        setSubmitMessage(result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {showReturnMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary"
        >
          Welcome back! We&apos;ve saved your information for you.
        </motion.div>
      )}
      
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Name *
        </label>
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          id="name"
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Your name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email *
        </label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          type="email"
          id="email"
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
          Company
        </label>
        <input
          {...register('company')}
          type="text"
          id="company"
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Your company"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message *
        </label>
        <textarea
          {...register('message', { required: 'Message is required' })}
          id="message"
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Tell us about your project..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      {submitMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          {submitMessage}
        </motion.p>
      )}
      </motion.form>
    </div>
  )
}