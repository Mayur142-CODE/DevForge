'use client'

import { motion } from 'framer-motion'
import { isToday, formatDateKey } from '@/lib/date-utils'
import { ContributionTooltip } from '@/components/heatmap/contribution-tooltip'
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
  const dateKey = formatDateKey(date)
  const isCompleted = count > 0

  return (
    <ContributionTooltip
      date={date}
      isCompleted={isCompleted}
      entries={entry}
      color={color}
    >
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
    </ContributionTooltip>
  )
}
