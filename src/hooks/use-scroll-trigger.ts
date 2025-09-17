'use client'

import { useState, useEffect, useCallback, RefObject } from 'react'

interface UseScrollTriggerOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollTrigger(
  elementRef: RefObject<Element>,
  options: UseScrollTriggerOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options

  const [isTriggered, setIsTriggered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    const inView = entry.isIntersecting

    setIsVisible(inView)

    if (inView && !isTriggered) {
      setIsTriggered(true)
    }

    if (!triggerOnce && !inView && isTriggered) {
      setIsTriggered(false)
    }
  }, [isTriggered, triggerOnce])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin
    })

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, handleIntersect, threshold, rootMargin])

  return { isTriggered, isVisible }
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollProgress
}

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset

      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up')
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return scrollDirection
}

export function useScrollPastElement(elementRef: RefObject<Element | null>) {
  const [hasPassed, setHasPassed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const element = elementRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const hasPassedElement = rect.bottom < 0

      setHasPassed(hasPassedElement)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [elementRef])

  return hasPassed
}