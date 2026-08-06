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
}

export function FlameMark({ size = 32, className }: { size?: number; className?: string }) {
  const gradientId = React.useId()
  const innerGradientId = React.useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 transition-transform duration-300 hover:scale-105', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="256" y1="460" x2="256" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
        <linearGradient id={innerGradientId} x1="256" y1="380" x2="256" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="100%" stopColor="#FFF7ED" />
        </linearGradient>
      </defs>

      {/* Outer Flame Shape with Upward Streak */}
      <path
        d="M 256 52 C 256 52, 330 160, 330 250 C 330 290, 310 330, 275 355 C 315 350, 350 310, 360 270 C 390 325, 385 400, 335 445 C 290 485, 210 485, 165 445 C 125 410, 120 345, 150 295 C 160 330, 185 355, 220 360 C 185 320, 185 250, 220 200 C 225 240, 245 260, 265 260 C 230 200, 256 52, 256 52 Z"
        fill={`url(#${gradientId})`}
      />

      {/* Inner Flame Core */}
      <path
        d="M 256 190 C 256 190, 290 250, 290 295 C 290 335, 260 365, 225 360 C 255 355, 275 330, 270 305 C 260 280, 240 265, 240 235 C 240 220, 250 200, 256 190 Z"
        fill={`url(#${innerGradientId})`}
        opacity="0.95"
      />
    </svg>
  )
}

export function Logo({
  size = 32,
  showText = false,
  textClassName,
  className,
}: LogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <FlameMark size={size} />
      {showText && (
        <span
          className={cn(
            'font-bold tracking-tight text-foreground overflow-hidden whitespace-nowrap text-lg',
            textClassName
          )}
        >
          StreakHub
        </span>
      )}
    </div>
  )
}
