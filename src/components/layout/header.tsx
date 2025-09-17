'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
        buttonRef.current?.focus()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const navItems = [
    { href: '#features', label: 'Features' },
    { href: '#testimonials', label: 'Success Stories' },
    { href: '#faq', label: 'FAQ' },
    { href: '#cta', label: 'Get Started' }
  ]

  return (
    <header 
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border"
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <a 
              href="#main-content" 
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
              aria-label="BoringFunnel - Go to main content"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center" aria-hidden="true">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-foreground">BoringFunnel</span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-8" 
            role="navigation" 
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1"
                tabIndex={0}
              >
                {item.label}
              </a>
            ))}
            <ThemeToggle />
            <button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => window.location.href = '#cta'}
              aria-label="Get started with BoringFunnel"
            >
              Get Started
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            ref={buttonRef}
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center" aria-hidden="true">
              <span className={cn(
                'bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm',
                isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
              )}></span>
              <span className={cn(
                'bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5',
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              )}></span>
              <span className={cn(
                'bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm',
                isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
              )}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              id="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border py-4"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                    tabIndex={0}
                    autoFocus={index === 0}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <ThemeToggle />
                  <button 
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => {
                      setIsMenuOpen(false)
                      window.location.href = '#cta'
                    }}
                    aria-label="Get started with BoringFunnel"
                  >
                    Get Started
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}