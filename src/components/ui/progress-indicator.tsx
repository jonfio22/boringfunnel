"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressStep {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "upcoming"
}

interface ProgressIndicatorProps {
  className?: string
  steps?: ProgressStep[]
  currentStep?: number
}

const defaultSteps: ProgressStep[] = [
  {
    id: "signup",
    title: "Sign Up",
    description: "Join the community",
    status: "completed"
  },
  {
    id: "welcome",
    title: "Welcome",
    description: "Get your quick win",
    status: "current"
  },
  {
    id: "community",
    title: "Join Community",
    description: "Connect with developers",
    status: "upcoming"
  },
  {
    id: "course",
    title: "Email Course",
    description: "Start learning",
    status: "upcoming"
  }
]

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  className,
  steps = defaultSteps,
  currentStep = 1
}) => {
  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Progress bar background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
        
        {/* Progress bar fill */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
        />
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 relative z-10",
                    {
                      "bg-green-500 border-green-500 text-white": isCompleted,
                      "bg-blue-500 border-blue-500 text-white": isCurrent,
                      "bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600": isUpcoming,
                    }
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? (
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </motion.svg>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </motion.div>
                
                {/* Step content */}
                <div className="max-w-[80px] sm:max-w-none">
                  <h3
                    className={cn(
                      "text-xs sm:text-sm font-medium mb-1",
                      {
                        "text-green-600 dark:text-green-400": isCompleted,
                        "text-blue-600 dark:text-blue-400": isCurrent,
                        "text-gray-400 dark:text-gray-500": isUpcoming,
                      }
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "text-xs text-gray-500 dark:text-gray-400",
                      {
                        "text-gray-600 dark:text-gray-300": isCompleted || isCurrent,
                      }
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}