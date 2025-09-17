'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  fill?: boolean
  sizes?: string
  quality?: number
  loading?: 'eager' | 'lazy'
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  sizes,
  quality = 75,
  loading = 'lazy',
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className
        )}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        <span className="text-sm">Image failed to load</span>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        quality={quality}
        loading={loading}
        style={{
          objectFit,
          objectPosition,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}

// Predefined image component variants for common use cases
export function HeroImage(props: Omit<OptimizedImageProps, 'priority' | 'loading'>) {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      loading="eager"
      placeholder="blur"
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}

export function LazyImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority={false}
      loading="lazy"
      placeholder="blur"
      quality={75}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}

export function AvatarImage(props: Omit<OptimizedImageProps, 'objectFit'>) {
  return (
    <OptimizedImage
      {...props}
      objectFit="cover"
      className={cn('rounded-full', props.className)}
    />
  )
}