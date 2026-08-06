'use client'

import * as React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { format, formatDateKey } from '@/lib/date-utils'
import { Check, ExternalLink, Calendar, Link2 } from 'lucide-react'
import type { DailyEntry } from '@/types/database'

export interface ContributionTooltipProps {
  date: Date | string
  isCompleted: boolean
  entries?: DailyEntry | DailyEntry[] | null
  color?: string
  children: React.ReactNode
}

export function ContributionTooltip({
  date,
  isCompleted,
  entries,
  color = '#3b82f6',
  children,
}: ContributionTooltipProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const dateStr = format(dateObj, 'MMM d, yyyy')

  const entryList: DailyEntry[] = React.useMemo(() => {
    if (!entries) return []
    return Array.isArray(entries) ? entries : [entries]
  }, [entries])

  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          className="z-50 max-w-[280px] w-auto rounded-2xl border border-border/50 bg-card/95 p-4 shadow-2xl backdrop-blur-md text-foreground text-xs space-y-3"
        >
          {/* Header Date */}
          <div className="flex items-center gap-2 text-muted-foreground font-medium pb-2 border-b border-border/30">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span className="text-foreground font-semibold">{dateStr}</span>
          </div>

          {isCompleted ? (
            <div className="space-y-3">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Completed
              </div>

              {/* Entries list */}
              {entryList.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {entryList.map((entry, idx) => (
                    <div key={entry.id || idx} className="space-y-1.5 text-left border-l-2 pl-2.5" style={{ borderColor: color }}>
                      {entry.title && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">TITLE</p>
                          <p className="font-bold text-foreground leading-snug">{entry.title}</p>
                        </div>
                      )}

                      {entry.description && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">DESCRIPTION</p>
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">{entry.description}</p>
                        </div>
                      )}

                      {entry.resource_url && (
                        <div className="pt-1">
                          <a
                            href={entry.resource_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link2 className="w-3 h-3" />
                            <span>Resource Link</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Activity logged for this day.</p>
              )}
            </div>
          ) : (
            <div className="py-1 text-left">
              <p className="text-xs text-muted-foreground">No activity recorded.</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
