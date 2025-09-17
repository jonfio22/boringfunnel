"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { trackSocialShare } from "@/lib/analytics"

interface ShareButtonsProps {
  className?: string
  title?: string
  url?: string
  text?: string
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  className,
  title = "I just joined the Developer to $100K Creator community!",
  url = typeof window !== "undefined" ? window.location.origin : "",
  text = "Learn the exact framework that helped 500+ developers build profitable digital products. Check it out!"
}) => {
  const shareData = {
    title,
    text,
    url,
  }

  const handleNativeShare = async () => {
    trackSocialShare('native', 'landing_page', url)
    
    if (typeof navigator !== "undefined" && "share" in navigator && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // Fallback to Twitter if native share fails or is cancelled
        handleTwitterShare()
      }
    } else {
      // Fallback to Twitter if Web Share API is not supported
      handleTwitterShare()
    }
  }

  const handleTwitterShare = () => {
    trackSocialShare('twitter', 'landing_page', url)
    const tweetText = encodeURIComponent(`${text} ${url}`)
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'width=550,height=420')
  }

  const handleLinkedInShare = () => {
    trackSocialShare('linkedin', 'landing_page', url)
    const linkedInUrl = encodeURIComponent(url)
    const linkedInTitle = encodeURIComponent(title)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}&title=${linkedInTitle}`, '_blank', 'width=550,height=420')
  }

  const handleFacebookShare = () => {
    trackSocialShare('facebook', 'landing_page', url)
    const facebookUrl = encodeURIComponent(url)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${facebookUrl}`, '_blank', 'width=550,height=420')
  }

  const handleCopyLink = async () => {
    trackSocialShare('copy_link', 'landing_page', url)
    
    try {
      await navigator.clipboard.writeText(url)
      // You might want to show a toast notification here
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  const TwitterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )

  const LinkedInIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )

  const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )

  const LinkIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
    </svg>
  )

  const ShareIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 8a3 3 0 1 0-2.977-2.63l-4.94 2.47a3 3 0 1 0 0 4.319l4.94 2.47a3 3 0 1 0 .895-1.789l-4.94-2.47a3.027 3.027 0 0 0 0-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
    </svg>
  )

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-medium text-muted-foreground"
      >
        Spread the word and help other developers!
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {/* Native share button for mobile */}
        {typeof window !== "undefined" && typeof navigator !== "undefined" && "share" in navigator && (
          <Button
            onClick={handleNativeShare}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ShareIcon />
            Share
          </Button>
        )}
        
        <Button
          onClick={handleTwitterShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20"
        >
          <TwitterIcon />
          Twitter
        </Button>
        
        <Button
          onClick={handleLinkedInShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20"
        >
          <LinkedInIcon />
          LinkedIn
        </Button>
        
        <Button
          onClick={handleFacebookShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20"
        >
          <FacebookIcon />
          Facebook
        </Button>
        
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-950/20"
        >
          <LinkIcon />
          Copy Link
        </Button>
      </motion.div>
    </div>
  )
}