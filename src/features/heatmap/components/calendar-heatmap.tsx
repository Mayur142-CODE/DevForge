import * as React from 'react'
import { eachDayOfInterval, format, isSameMonth, subDays, startOfWeek } from 'date-fns'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface CalendarHeatmapProps {
  completedDates: string[] // Array of 'YYYY-MM-DD'
  onDateClick?: (date: string) => void
  color?: string
  daysCount?: number
}

export function CalendarHeatmap({ 
  completedDates, 
  onDateClick, 
  color = 'bg-primary', 
  daysCount = 365 
}: CalendarHeatmapProps) {
  const today = new Date()
  // Start from Sunday of the week that contains the start date
  const startDate = startOfWeek(subDays(today, daysCount))
  const endDate = today
  
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Organize days into columns (weeks)
  const weeks: Date[][] = []
  let currentWeek: Date[] = []
  
  days.forEach((day) => {
    currentWeek.push(day)
    if (currentWeek.length === 7 || day.getTime() === endDate.getTime()) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  // Generate month labels
  const monthLabels: { month: string; colIndex: number }[] = []
  weeks.forEach((week, index) => {
    const firstDayOfWeek = week[0]
    // If it's the first week, or the month changed from the previous week's first day
    if (index === 0 || !isSameMonth(firstDayOfWeek, weeks[index - 1][0])) {
      // Avoid pushing a month label if it's the very last week and it's squished
      if (index < weeks.length - 2) {
        monthLabels.push({
          month: format(firstDayOfWeek, 'MMM'),
          colIndex: index,
        })
      }
    }
  })

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex overflow-x-auto scrollbar-hide pb-2 w-full custom-scrollbar">
        <div className="min-w-max flex">
          {/* Day of Week Labels */}
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
            {/* Month Labels */}
            <div className="flex text-[10px] text-muted-foreground mb-1 relative h-[16px]">
              {monthLabels.map((m, i) => (
                <span 
                  key={`${m.month}-${i}`} 
                  className="absolute"
                  style={{ left: `${m.colIndex * 15}px` }}
                >
                  {m.month}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[3px] h-[105px]">
              <TooltipProvider delayDuration={100}>
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {week.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd')
                      const isCompleted = completedDates.includes(dateStr)
                      
                      return (
                        <Tooltip key={dateStr}>
                          <TooltipTrigger 
                            render={
                              <button
                                onClick={() => onDateClick?.(dateStr)}
                                className={cn(
                                  "w-[12px] h-[12px] rounded-[3px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                  isCompleted ? color : "bg-secondary hover:bg-muted"
                                )}
                              />
                            }
                          />
                          <TooltipContent side="top">
                            <p className="text-xs">
                              {isCompleted ? 'Completed' : 'No activity'} on {format(day, 'MMM d, yyyy')}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                    {/* Fill empty spaces at the end of the last week if it doesn't end on Saturday */}
                    {weekIndex === weeks.length - 1 && week.length < 7
                      ? Array.from({ length: 7 - week.length }).map((_, i) => (
                          <div key={`empty-end-${i}`} className="w-[12px] h-[12px]" />
                        ))
                      : null}
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end text-[10px] text-muted-foreground gap-2 pr-4 pt-1">
        <span>Less</span>
        <div className="flex gap-[3px]">
          <div className="w-[12px] h-[12px] rounded-[3px] bg-secondary"></div>
          <div className={cn("w-[12px] h-[12px] rounded-[3px] opacity-40", color)}></div>
          <div className={cn("w-[12px] h-[12px] rounded-[3px] opacity-60", color)}></div>
          <div className={cn("w-[12px] h-[12px] rounded-[3px] opacity-80", color)}></div>
          <div className={cn("w-[12px] h-[12px] rounded-[3px]", color)}></div>
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
