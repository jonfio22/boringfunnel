'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Download, BookOpen, Code } from 'lucide-react'
import { ReactNode } from 'react'

interface DiaModalProps {
  isVisible: boolean
  onClose: () => void
  children?: ReactNode
}

interface ResourceCardProps {
  title: string
  description: string
  gradient: string
  icon: ReactNode
  author?: {
    name: string
    avatar?: string
  }
  onSeeMore?: () => void
  onTryInDia?: () => void
}

export function ResourceCard({
  title,
  description,
  gradient,
  icon,
  author,
  onSeeMore,
  onTryInDia
}: ResourceCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transition-transform hover:scale-105">
      {/* Card Header with Gradient */}
      <div className={`relative h-48 ${gradient} p-6 flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative text-white">
          {icon}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        
        {/* Author */}
        {author && (
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-semibold">{author.name[0]}</span>
            </div>
            <span className="text-sm text-muted-foreground">{author.name}</span>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onSeeMore}
            className="flex-1 py-2.5 px-4 rounded-full border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            See more
          </button>
          <button
            onClick={onTryInDia}
            className="flex-1 py-2.5 px-4 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Resource
          </button>
        </div>
      </div>
    </div>
  )
}

export function DiaModal({ isVisible, onClose, children }: DiaModalProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-background/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="relative p-6 border-b border-border/50">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
                <h2 className="text-2xl font-semibold text-center">Recommended Resources</h2>
              </div>
              
              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Pre-styled resource cards for developers
export const developerResources = [
  {
    title: "Technical Creator's Playbook",
    description: "Transform your coding skills into a profitable business.",
    gradient: "bg-gradient-to-br from-blue-500 to-purple-600",
    icon: <Code size={64} className="opacity-90" />,
    author: { name: "DeveloperSuccess" }
  },
  {
    title: "Product Validation Checklist",
    description: "Validate your idea before writing a single line of code.",
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
    icon: <Sparkles size={64} className="opacity-90" />,
    author: { name: "DeveloperSuccess" }
  },
  {
    title: "Pricing Strategy Guide",
    description: "Learn how to price your developer services and products.",
    gradient: "bg-gradient-to-br from-orange-500 to-red-600",
    icon: <Download size={64} className="opacity-90" />,
    author: { name: "DeveloperSuccess" }
  },
  {
    title: "Email Course Blueprint",
    description: "Create an email course that converts readers into customers.",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    icon: <BookOpen size={64} className="opacity-90" />,
    author: { name: "DeveloperSuccess" }
  }
]