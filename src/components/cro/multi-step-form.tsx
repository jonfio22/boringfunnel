'use client'

import { useState, useEffect } from 'react'
import { useForm, FieldValues } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface FormStep {
  id: string
  title: string
  description?: string
  fields: FormField[]
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: any
}

interface MultiStepFormProps {
  steps: FormStep[]
  onSubmit: (data: FieldValues) => void
  onStepChange?: (step: number) => void
  className?: string
  showProgress?: boolean
}

export function MultiStepForm({
  steps,
  onSubmit,
  onStepChange,
  className = '',
  showProgress = true
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedData, setSavedData] = useLocalStorage('multi-step-form-data', {})

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: savedData
  })

  const watchedValues = watch()

  // Auto-save form data
  useEffect(() => {
    setSavedData(watchedValues)
  }, [watchedValues, setSavedData])

  // Restore saved data
  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      Object.entries(savedData).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [savedData, setValue])

  const currentStepFields = steps[currentStep]?.fields || []
  const isLastStep = currentStep === steps.length - 1

  const nextStep = async () => {
    const stepFieldNames = currentStepFields.map(field => field.name)
    const isStepValid = await trigger(stepFieldNames)

    if (isStepValid) {
      if (isLastStep) {
        handleFormSubmit()
      } else {
        const newStep = currentStep + 1
        setCurrentStep(newStep)
        if (onStepChange) {
          onStepChange(newStep)
        }
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      if (onStepChange) {
        onStepChange(newStep)
      }
    }
  }

  const handleFormSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(watchedValues)
      setSavedData({}) // Clear saved data after successful submission
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const fieldError = errors[field.name as keyof typeof errors]

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </label>
            <textarea
              {...register(field.name, {
                required: field.required ? `${field.label} is required` : false,
                ...field.validation
              })}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message as string}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </label>
            <select
              {...register(field.name, {
                required: field.required ? `${field.label} is required` : false,
                ...field.validation
              })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select an option</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message as string}</p>
            )}
          </div>
        )

      case 'radio':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    {...register(field.name, {
                      required: field.required ? `${field.label} is required` : false,
                      ...field.validation
                    })}
                    type="radio"
                    value={option.value}
                    className="text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message as string}</p>
            )}
          </div>
        )

      default:
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </label>
            <input
              {...register(field.name, {
                required: field.required ? `${field.label} is required` : false,
                ...field.validation
              })}
              type={field.type}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message as string}</p>
            )}
          </div>
        )
    }
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 rounded transition-colors ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {steps[currentStep]?.title}
              </h2>
              {steps[currentStep]?.description && (
                <p className="text-muted-foreground">
                  {steps[currentStep].description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {currentStepFields.map(renderField)}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <button
            type="button"
            onClick={nextStep}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : isLastStep ? (
              'Submit'
            ) : (
              <>
                Next
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}