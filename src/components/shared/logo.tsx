'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LogoProps {
  /** Size of the logo icon in pixels (default: 32) */
  size?: number
  /** Whether to render the 'StreakHub' brand text alongside the logo icon */
  showText?: boolean
  /** Additional CSS class names for the brand text */
  textClassName?: string
  /** Additional CSS class names for the root container */
  className?: string
  /** Custom image source if needed */
  src?: string
}

export function Logo({
  size = 32,
  showText = false,
  textClassName,
  className,
  src = '/logo.png',
}: LogoProps) {
  const [imgSrc, setImgSrc] = React.useState(src)

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <img
        src={imgSrc}
        alt="StreakHub Logo"
        width={size}
        height={size}
        className="rounded-lg object-contain shrink-0 shadow-sm transition-transform duration-200 hover:scale-105"
        style={{ width: size, height: size }}
        onError={() => {
          if (imgSrc !== '/logo.svg') {
            setImgSrc('/logo.svg')
          }
        }}
      />
      {showText && (
        <span
          className={cn(
            'font-semibold text-lg tracking-tight text-foreground overflow-hidden whitespace-nowrap',
            textClassName
          )}
        >
          StreakHub
        </span>
      )}
    </div>
  )
}
