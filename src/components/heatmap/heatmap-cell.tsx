'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday } from '@/lib/date-utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface HeatmapCellProps {
  date: Date
  count: number
  color: string
}

export function HeatmapCell({ date, count, color }: HeatmapCellProps) {
  const today = isToday(date)
  const dateStr = format(date, 'MMM d, yyyy')
  const status = count > 0 ? `${count} contribution${count > 1 ? 's' : ''}` : 'No contributions'

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger render={
          <motion.div
            className="rounded-[3px] cursor-pointer"
            style={{
              width: 12,
              height: 12,
              backgroundColor: color,
              outline: today ? '2px solid var(--foreground)' : 'none',
              outlineOffset: '-1px',
            }}
            whileHover={{ scale: 1.4 }}
            transition={{ duration: 0.1 }}
          />
        } />
        <TooltipContent side="top" className="text-xs bg-black/90 text-white border-none shadow-xl rounded-lg py-1.5 px-3 backdrop-blur-md">
          <p className="font-medium">{status}</p>
          <p className="text-white/70">{dateStr}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
