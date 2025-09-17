'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Predefined skeleton components for common patterns
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }
  
  return <Skeleton className={cn('rounded-full', sizeClasses[size])} />
}

export function SkeletonText({ 
  lines = 3, 
  className 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-10 w-24 rounded-md', className)} />
}

export function SkeletonTestimonial() {
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <div className="flex items-center space-x-3">
        <SkeletonAvatar />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <SkeletonText lines={4} />
    </div>
  )
}

export function SkeletonHero() {
  return (
    <div className="text-center space-y-6 py-20">
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-12 w-2/3 mx-auto" />
      </div>
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <div className="flex justify-center space-x-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-3">
        <Skeleton className="h-12 w-64" />
        <SkeletonButton className="h-12 w-32" />
      </div>
    </div>
  )
}