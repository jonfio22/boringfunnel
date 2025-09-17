"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { ShareButtons } from "@/components/ui/share-buttons"
import { ProgressIndicator } from "@/components/ui/progress-indicator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function WelcomePage() {
  const [isJoining, setIsJoining] = React.useState(false)

  const handleJoinCommunity = async () => {
    setIsJoining(true)
    // Simulate API call - replace with actual community join logic
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirect to Discord/Slack/Community platform
    window.open("https://discord.gg/your-community-link", "_blank")
    setIsJoining(false)
  }

  const quickWinTips = [
    {
      icon: "💡",
      title: "Start with Micro-Products",
      description: "Don't build the next Facebook. Start with a $29 digital product that solves one specific problem."
    },
    {
      icon: "⚡",
      title: "Validate Before You Build",
      description: "Spend 1 hour talking to potential customers instead of 100 hours building something nobody wants."
    },
    {
      icon: "🎯",
      title: "Focus on Developer Pain Points",
      description: "You already know the struggles. Build tools, courses, or templates that solve problems you've faced."
    }
  ]

  const emailCoursePreview = [
    "Day 1: The Developer Advantage (Why you're already ahead)",
    "Day 2: Finding Your First Product Idea in 24 Hours",
    "Day 3: Validation Without Building Anything",
    "Day 4: The Minimum Viable Product Framework",
    "Day 5: Launch Day Strategy (No audience required)",
    "Day 6: Pricing Psychology for Developers",
    "Day 7: From $0 to $1000 MRR Roadmap"
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-orange-950/20">
      <Container size="xl" className="py-12 lg:py-20">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <ProgressIndicator currentStep={1} />
        </motion.div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600 dark:text-green-400"
              >
                <path d="M20 6L9 17l-5-5" />
              </motion.svg>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Developer Success
              </span>{" "}
              Community!
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              You&apos;re officially on the path from developer to $100K+ digital product creator. 
              Let&apos;s start with some immediate value.
            </p>
          </motion.div>

          {/* Quick Win Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 bg-white dark:bg-gray-900/50 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="metric" className="bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                Quick Win
              </Badge>
              <span className="text-2xl">🚀</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-6">3 Developer Advantages You Can Use Today</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {quickWinTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="text-left p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="text-2xl mb-3">{tip.icon}</div>
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Primary CTA - Join Community */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-6">
              <h2 className="text-3xl font-bold mb-4">Ready to Connect with 10,000+ Developers?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join our exclusive community where developers share wins, get feedback on ideas, 
                and support each other&apos;s product journeys. Plus, get access to exclusive resources 
                and monthly expert AMAs.
              </p>
              
              <Button
                onClick={handleJoinCommunity}
                variant="secondary"
                size="xl"
                disabled={isJoining}
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              >
                {isJoining ? "Opening Community..." : "Join the Community Now"}
              </Button>
              
              <p className="text-sm text-blue-200 mt-4">
                Free forever • No spam • Join 500+ developers who&apos;ve launched products
              </p>
            </div>
          </motion.div>

          {/* Email Course Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mb-12 bg-white dark:bg-gray-900/50 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4">What to Expect Next</h2>
            <p className="text-muted-foreground mb-6">
              Your 7-day email course starts tomorrow. Here&apos;s what you&apos;ll learn:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              {emailCoursePreview.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </div>
                  <span className="text-sm">{day}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                📧 <strong>Check your email!</strong> Your first lesson should arrive within the next few minutes.
              </p>
            </div>
          </motion.div>

          {/* Social Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mb-12"
          >
            <ShareButtons />
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground">
                ← Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </main>
  )
}