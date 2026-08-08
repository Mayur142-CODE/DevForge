"use client"

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Flame, Trophy, MoreVertical, Pencil, Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CalendarHeatmap } from '@/features/heatmap/components/calendar-heatmap'
import { JournalEntryDialog } from '@/components/daily-entries/journal-entry-dialog'
import { formatDateKey, getStreakFromDates, getLongestStreak, getCategoryCompletionRate } from '@/lib/date-utils'
import type { Category, DailyEntry } from '@/types/database'

interface CategoryCardProps {
  category: Category
  dailyEntries?: DailyEntry[]
  onEdit?: (category: Category) => void
  onDelete?: (id: string) => void
  onToggleEntry?: (
    categoryId: string,
    date: string,
    completed: boolean,
    journal?: { title: string; description: string; resource_url: string | null }
  ) => void
  isTogglePending?: boolean
  index?: number
}

export function CategoryCard({
  category,
  dailyEntries = [],
  onEdit,
  onDelete,
  onToggleEntry,
  isTogglePending,
  index = 0,
}: CategoryCardProps) {
  const today = formatDateKey(new Date())
  const completedDates = dailyEntries.filter(e => e.completed).map(e => e.entry_date)
  const isTodayCompleted = completedDates.includes(today)
  const [showJournal, setShowJournal] = React.useState(false)

  const currentStreak = getStreakFromDates(completedDates)
  const longestStreak = Math.max(getLongestStreak(completedDates), category.longest_streak || 0)
  const completionRate = getCategoryCompletionRate(category.created_at, completedDates)

  const handleMarkToday = () => {
    if (isTodayCompleted) {
      // Uncomplete — direct toggle
      onToggleEntry?.(category.id, today, false)
    } else {
      // Open journal modal
      setShowJournal(true)
    }
  }

  const handleJournalSave = (data: { title: string; description: string; resource_url: string | null }) => {
    onToggleEntry?.(category.id, today, true, data)
    setShowJournal(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        className="group h-full flex"
      >
        <Card className="flex-1 flex flex-col border-border/40 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardHeader className="pb-3 pt-5 px-5 relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm" 
                  style={{ backgroundColor: category.color, boxShadow: `0 4px 14px 0 ${category.color}40` }}
                >
                  {category.icon[0]?.toUpperCase() || 'C'}
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight leading-tight">{category.name}</CardTitle>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center">
                    <Flame className="w-3.5 h-3.5 mr-1 text-orange-500" />
                    <span className="font-medium text-foreground mr-1">{currentStreak}</span> Day Streak
                  </div>
                </div>
              </div>
              
              {(onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-border/40">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(category)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => onDelete(category.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-between px-5 pb-5 pt-0 space-y-5">
            {category.description && (
              <CardDescription className="line-clamp-2 text-xs text-muted-foreground/80 leading-relaxed">
                {category.description}
              </CardDescription>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col p-2.5 rounded-lg bg-secondary/40 border border-border/30">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Completion</span>
                <span className="font-semibold text-foreground tracking-tight">{completionRate}%</span>
              </div>
              <div className="flex flex-col p-2.5 rounded-lg bg-secondary/40 border border-border/30">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Longest</span>
                <span className="font-semibold text-foreground flex items-center tracking-tight">
                  <Trophy className="w-3.5 h-3.5 mr-1 text-yellow-500" />
                  {longestStreak}d
                </span>
              </div>
            </div>

            {/* Mini Heatmap - last 12 weeks (~84 days) */}
            <div className="bg-secondary/20 p-3 pt-1 rounded-xl border border-border/20 overflow-hidden relative">
               {/* Fade edges */}
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-secondary/20 to-transparent pointer-events-none z-10"></div>
              <CalendarHeatmap 
                completedDates={completedDates} 
                entries={dailyEntries}
                color={category.color}
                daysCount={84}
              />
            </div>
            
            {/* Action Buttons Section */}
            <div className="flex flex-col gap-2.5 pt-2">
              {onToggleEntry && (
                <Button
                  variant={isTodayCompleted ? "secondary" : "default"}
                  className={`w-full rounded-xl font-medium transition-all duration-300 ${
                    !isTodayCompleted
                      ? 'shadow-sm hover:shadow-md hover:opacity-95'
                      : 'bg-secondary/60 text-muted-foreground'
                  }`}
                  onClick={handleMarkToday}
                  disabled={isTogglePending}
                  style={!isTodayCompleted ? { backgroundColor: category.color, color: '#fff' } : {}}
                >
                  {isTodayCompleted ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-emerald-500 font-bold" />
                      Completed Today
                    </>
                  ) : (
                    'Mark Today'
                  )}
                </Button>
              )}

              <Link href={`/categories/${category.id}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full rounded-xl font-medium text-xs transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer hover:brightness-110 shadow-2xs"
                  style={{
                    color: category.color,
                    borderColor: `${category.color}40`,
                    backgroundColor: `${category.color}10`,
                  }}
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" style={{ color: category.color }} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <JournalEntryDialog
        open={showJournal}
        onOpenChange={setShowJournal}
        onSave={handleJournalSave}
        isPending={isTogglePending}
        categoryName={category.name}
      />
    </>
  )
}
