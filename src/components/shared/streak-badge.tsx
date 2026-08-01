'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakBadgeProps {
  streak: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function StreakBadge({ streak, className, size = 'md' }: StreakBadgeProps) {
  const sizes = {
    sm: { icon: 'h-3 w-3', text: 'text-xs', padding: 'px-1.5 py-0.5' },
    md: { icon: 'h-4 w-4', text: 'text-sm', padding: 'px-2 py-1' },
    lg: { icon: 'h-5 w-5', text: 'text-base', padding: 'px-3 py-1.5' },
  }

  if (streak === 0) return null

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium',
        sizes[size].padding,
        className
      )}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
      >
        <Flame className={sizes[size].icon} />
      </motion.div>
      <span className={sizes[size].text}>{streak}</span>
    </motion.div>
  )
}
