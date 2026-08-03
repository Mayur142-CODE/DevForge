'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EntryDetailDialog } from '@/components/daily-entries/entry-detail-dialog'
import { useRecentEntries, useUpdateEntry, useDeleteEntry } from '@/hooks/use-daily-entries'
import { BookOpen, ExternalLink, ChevronRight } from 'lucide-react'
import { format, parseISO } from '@/lib/date-utils'
import type { DailyEntry } from '@/types/database'

interface LearningHistoryProps {
  categoryId: string
  color?: string
}

export function LearningHistory({ categoryId, color }: LearningHistoryProps) {
  const { data: entries, isLoading } = useRecentEntries(categoryId)
  const updateEntry = useUpdateEntry()
  const deleteEntry = useDeleteEntry()

  const [selectedEntry, setSelectedEntry] = React.useState<DailyEntry | null>(null)
  const [showDetail, setShowDetail] = React.useState(false)

  const handleViewDetails = (entry: DailyEntry) => {
    setSelectedEntry(entry)
    setShowDetail(true)
  }

  const handleUpdate = (entryId: string, updates: { title: string; description: string; resource_url: string | null }) => {
    updateEntry.mutate({ entryId, updates })
  }

  const handleDelete = (entryId: string, catId: string) => {
    deleteEntry.mutate({ entryId, categoryId: catId })
  }

  // Filter to only show entries with journal content
  const journalEntries = entries?.filter(e => e.title || e.description) || []

  if (isLoading) {
    return (
      <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm rounded-3xl">
        <CardHeader className="pb-4 pt-8 px-8">
          <CardTitle className="text-xl font-semibold flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-muted-foreground" />
            Learning History
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-xl bg-secondary/30 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm rounded-3xl">
          <CardHeader className="pb-4 pt-8 px-8">
            <CardTitle className="text-xl font-semibold flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-muted-foreground" />
              Learning History
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {journalEntries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No journal entries yet.</p>
                <p className="text-xs mt-1 opacity-70">
                  Complete a day with the journal to see your learning history here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {journalEntries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div
                      className="group flex items-start gap-4 p-4 rounded-xl border border-border/30 bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(entry)}
                    >
                      {/* Date indicator */}
                      <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-secondary/60 border border-border/20">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase leading-none">
                          {format(parseISO(entry.entry_date), 'MMM')}
                        </span>
                        <span className="text-lg font-bold leading-tight tracking-tighter">
                          {format(parseISO(entry.entry_date), 'd')}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm leading-snug truncate">
                          {entry.title || 'Untitled'}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {entry.description || 'No description'}
                        </p>
                        {entry.resource_url && (
                          <div className="flex items-center gap-1 mt-1.5 text-[11px] text-primary/80">
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">
                              {(() => { try { return new URL(entry.resource_url).hostname } catch { return 'Link' } })()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <EntryDetailDialog
        open={showDetail}
        onOpenChange={setShowDetail}
        entry={selectedEntry}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isUpdating={updateEntry.isPending}
        isDeleting={deleteEntry.isPending}
      />
    </>
  )
}
