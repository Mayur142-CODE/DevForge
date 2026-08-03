'use client'

import { motion } from 'framer-motion'
import { format, isToday } from '@/lib/date-utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ExternalLink } from 'lucide-react'
import type { DailyEntry } from '@/types/database'

interface HeatmapCellProps {
  date: Date
  count: number
  color: string
  entry?: DailyEntry | null
  onClick?: (date: string, entry?: DailyEntry | null) => void
}

export function HeatmapCell({ date, count, color, entry, onClick }: HeatmapCellProps) {
  const today = isToday(date)
  const dateStr = format(date, 'MMM d, yyyy')
  const dateKey = format(date, 'yyyy-MM-dd')
  const isCompleted = count > 0

  return (
    <TooltipProvider delay={0}>
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
            onClick={() => onClick?.(dateKey, entry)}
          />
        } />
        <TooltipContent side="top" className="text-xs bg-black/90 text-white border-none shadow-xl rounded-lg py-2 px-3 backdrop-blur-md max-w-[240px]">
          {isCompleted ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-white/60">📅</span>
                <span className="text-white/70">{dateStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60">✅</span>
                <span className="font-medium">Completed</span>
              </div>
              {entry?.title && (
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Title</p>
                  <p className="font-medium text-white/90 leading-snug">{entry.title}</p>
                </div>
              )}
              {entry?.description && (
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Description</p>
                  <p className="text-white/70 leading-snug line-clamp-2">{entry.description}</p>
                </div>
              )}
              {entry?.resource_url && (
                <div className="flex items-center gap-1 text-blue-300">
                  <span className="text-white/60">🔗</span>
                  <span className="text-[11px]">View Resource</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="font-medium">Not completed</p>
              <p className="text-white/70">{dateStr}</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
