'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { getHeatmapDays, getMonthLabels, formatDateKey } from '@/lib/date-utils'
import { HEATMAP_COLORS } from '@/lib/constants'
import { HeatmapCell } from '@/components/heatmap/heatmap-cell'
import { cn } from '@/lib/utils'
import type { DailyEntry } from '@/types/database'

interface HeatmapCalendarProps {
  data: Record<string, number>
  entries?: Record<string, DailyEntry>
  color?: string
  year?: number
  className?: string
  onCellClick?: (date: string, entry?: DailyEntry | null) => void
}

export function HeatmapCalendar({
  data,
  entries,
  color,
  year,
  className,
  onCellClick,
}: HeatmapCalendarProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const days = useMemo(() => getHeatmapDays(year), [year])
  const monthLabels = useMemo(() => getMonthLabels(days), [days])

  const maxCount = useMemo(() => {
    const values = Object.values(data)
    return values.length > 0 ? Math.max(...values) : 1
  }, [data])

  // Build weeks (columns)
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const getColor = (count: number) => {
    if (count === 0) return isDark ? HEATMAP_COLORS.dark.empty : HEATMAP_COLORS.light.empty
    if (color) {
      const ratio = count / maxCount
      if (ratio <= 0.25) return `${color}33`
      if (ratio <= 0.5) return `${color}66`
      if (ratio <= 0.75) return `${color}99`
      return color
    }
    const colors = isDark ? HEATMAP_COLORS.dark : HEATMAP_COLORS.light
    const ratio = count / maxCount
    if (ratio <= 0.25) return colors.level1
    if (ratio <= 0.5) return colors.level2
    if (ratio <= 0.75) return colors.level3
    return colors.level4
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn('flex flex-col space-y-2 w-full', className)}
    >
      <div className="flex overflow-x-auto scrollbar-hide pb-2 w-full custom-scrollbar">
        <div className="min-w-max flex">
          {/* Day labels */}
          <div className="flex flex-col text-[10px] text-muted-foreground w-8 justify-between pb-1 mt-[20px] h-[105px]">
            <span style={{ lineHeight: '14px', height: '14px' }}></span>
            <span style={{ lineHeight: '14px', height: '14px' }}>Mon</span>
            <span style={{ lineHeight: '14px', height: '14px' }}></span>
            <span style={{ lineHeight: '14px', height: '14px' }}>Wed</span>
            <span style={{ lineHeight: '14px', height: '14px' }}></span>
            <span style={{ lineHeight: '14px', height: '14px' }}>Fri</span>
            <span style={{ lineHeight: '14px', height: '14px' }}></span>
          </div>

          <div className="flex flex-col">
            {/* Month labels */}
            <div className="flex text-[10px] text-muted-foreground mb-1 relative h-[16px]">
              {monthLabels.map((month, i) => (
                <div
                  key={`${month.label}-${i}`}
                  className="absolute"
                  style={{
                    left: `${month.index * 15}px`,
                  }}
                >
                  {month.label}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="flex gap-[3px] h-[105px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    const dateKey = formatDateKey(day)
                    const count = data[dateKey] || 0
                    const entry = entries?.[dateKey] || null
                    return (
                      <HeatmapCell
                        key={dateKey}
                        date={day}
                        count={count}
                        color={getColor(count)}
                        entry={entry}
                        onClick={onCellClick}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
