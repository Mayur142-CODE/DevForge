'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ConfirmDeleteDialog } from '@/components/categories/confirm-delete-dialog'
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Pencil,
  Trash2,
  Loader2,
  LinkIcon,
} from 'lucide-react'
import { format, parseISO } from '@/lib/date-utils'
import type { DailyEntry } from '@/types/database'

interface EntryDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: DailyEntry | null
  onUpdate?: (entryId: string, updates: { title: string; description: string; resource_url: string | null }) => void
  onDelete?: (entryId: string, categoryId: string) => void
  isUpdating?: boolean
  isDeleting?: boolean
}

export function EntryDetailDialog({
  open,
  onOpenChange,
  entry,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: EntryDetailDialogProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [editTitle, setEditTitle] = React.useState('')
  const [editDescription, setEditDescription] = React.useState('')
  const [editResourceUrl, setEditResourceUrl] = React.useState('')

  // Reset edit state when dialog opens or entry changes
  React.useEffect(() => {
    if (open && entry) {
      setIsEditing(false)
      setEditTitle(entry.title || '')
      setEditDescription(entry.description || '')
      setEditResourceUrl(entry.resource_url || '')
    }
  }, [open, entry])

  if (!entry) return null

  const formattedDate = format(parseISO(entry.entry_date), 'EEEE, MMMM d, yyyy')
  const isEditValid = editTitle.trim().length > 0 && editDescription.trim().length > 0

  const handleSaveEdit = () => {
    if (!isEditValid || !onUpdate) return
    onUpdate(entry.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      resource_url: editResourceUrl.trim() || null,
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (!onDelete) return
    onDelete(entry.id, entry.category_id)
    setShowDeleteConfirm(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-500/10 rounded-xl flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <DialogTitle className="text-lg">Entry Details</DialogTitle>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {formattedDate}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {isEditing ? (
              /* Edit Mode */
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-10"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-resource" className="text-muted-foreground">
                    <LinkIcon className="w-3.5 h-3.5" />
                    Resource Link
                  </Label>
                  <Input
                    id="edit-resource"
                    type="url"
                    placeholder="https://..."
                    value={editResourceUrl}
                    onChange={(e) => setEditResourceUrl(e.target.value)}
                    className="h-10"
                  />
                </div>
              </>
            ) : (
              /* Read-Only Mode */
              <>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</p>
                  <p className="text-base font-semibold leading-snug">
                    {entry.title || <span className="text-muted-foreground italic">No title</span>}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</p>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {entry.description || <span className="text-muted-foreground italic">No description</span>}
                  </p>
                </div>

                {entry.resource_url && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Resource</p>
                    <a
                      href={entry.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {(() => {
                        try {
                          return new URL(entry.resource_url).hostname
                        } catch {
                          return entry.resource_url
                        }
                      })()}
                    </a>
                  </div>
                )}
              </>
            )}
          </div>

          {(onUpdate || onDelete) && (
            <DialogFooter className="gap-2 sm:gap-0">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={!isEditValid || isUpdating}
                    className="w-full sm:w-auto"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {onDelete && (
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10 border-border/40"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                  {onUpdate && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Entry
                    </Button>
                  )}
                </>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Entry"
        description="Are you sure you want to delete this entry? This will remove the completion for this day and recalculate your streaks."
      />
    </>
  )
}
