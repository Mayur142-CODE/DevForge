'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { BookOpen, Link as LinkIcon, Loader2 } from 'lucide-react'

interface JournalEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: {
    title: string
    description: string
    resource_url: string | null
  }) => void
  isPending?: boolean
  categoryName?: string
  /** Pre-fill fields for editing an existing entry */
  initialData?: {
    title: string
    description: string
    resource_url: string | null
  }
  /** Override the dialog title */
  dialogTitle?: string
  /** Override the submit button label */
  submitLabel?: string
}

export function JournalEntryDialog({
  open,
  onOpenChange,
  onSave,
  isPending,
  categoryName,
  initialData,
  dialogTitle,
  submitLabel,
}: JournalEntryDialogProps) {
  const [title, setTitle] = React.useState(initialData?.title || '')
  const [description, setDescription] = React.useState(initialData?.description || '')
  const [resourceUrl, setResourceUrl] = React.useState(initialData?.resource_url || '')

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setTitle(initialData?.title || '')
      setDescription(initialData?.description || '')
      setResourceUrl(initialData?.resource_url || '')
    }
  }, [open, initialData])

  const isValid = title.trim().length > 0 && description.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isPending) return
    onSave({
      title: title.trim(),
      description: description.trim(),
      resource_url: resourceUrl.trim() || null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">
                  {dialogTitle || "What did you accomplish today?"}
                </DialogTitle>
                {categoryName && (
                  <DialogDescription className="mt-1">
                    Logging for <span className="font-medium text-foreground">{categoryName}</span>
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="journal-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="journal-title"
                placeholder="e.g. Solved 3 LeetCode Problems"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="h-10"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="journal-description">
                Description / Notes <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="journal-description"
                placeholder="Briefly describe what you learned or accomplished today..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Resource Link */}
            <div className="space-y-2">
              <Label htmlFor="journal-resource" className="text-muted-foreground">
                <LinkIcon className="w-3.5 h-3.5" />
                Resource Link
                <span className="text-xs font-normal ml-1">(optional)</span>
              </Label>
              <Input
                id="journal-resource"
                type="url"
                placeholder="https://..."
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                submitLabel || 'Save & Complete'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
