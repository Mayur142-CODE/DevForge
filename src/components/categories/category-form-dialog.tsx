'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ColorPicker } from '@/components/categories/color-picker'
import { useCreateCategory, useUpdateCategory } from '@/features/categories/api/use-categories'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { Category } from '@/types/database'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#6366f1')

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()

  const isEditing = !!category

  useEffect(() => {
    if (category) {
      setName(category.name || '')
      setDescription(category.description || '')
      setColor(category.color || '#6366f1')
    } else {
      setName('')
      setDescription('')
      setColor('#6366f1')
    }
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('You must be logged in to save category.')
      return
    }

    const iconChar = name.trim().charAt(0).toUpperCase() || 'C'

    if (isEditing && category) {
      updateCategory.mutate(
        {
          id: category.id,
          name: name.trim(),
          description: description.trim(),
          color,
          icon: iconChar,
        },
        {
          onSuccess: () => {
            toast.success('Category updated successfully!')
            onOpenChange(false)
          },
          onError: (error) => {
            toast.error('Failed to update category: ' + error.message)
          },
        }
      )
    } else {
      createCategory.mutate(
        {
          user_id: user.id,
          name: name.trim(),
          description: description.trim(),
          color,
          icon: iconChar,
          daily_target: 1,
          is_active: true,
        },
        {
          onSuccess: () => {
            toast.success('Category created successfully!')
            onOpenChange(false)
            setName('')
            setDescription('')
            setColor('#6366f1')
          },
          onError: (error) => {
            toast.error('Failed to create category: ' + error.message)
          },
        }
      )
    }
  }

  const isPending = createCategory.isPending || updateCategory.isPending
  const displayIcon = name.trim() ? name.trim().charAt(0).toUpperCase() : (category?.icon || 'C')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] rounded-3xl border-border/40 bg-card/95 backdrop-blur-md shadow-2xl p-6">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md transition-all duration-300 shrink-0"
              style={{ backgroundColor: color, boxShadow: `0 6px 20px -4px ${color}60` }}
            >
              {displayIcon}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {isEditing ? 'Edit Category' : 'Create Category'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {isEditing
                  ? 'Modify learning track details and theme accent color.'
                  : 'Add a new learning track or discipline to your dashboard.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Category Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., React, System Design, LeetCode"
              className="rounded-xl border-border/50 bg-background/50 h-10 text-sm focus-visible:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what you'll track and learn..."
              rows={2}
              className="rounded-xl border-border/50 bg-background/50 text-sm focus-visible:ring-primary min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Accent Color
            </Label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <DialogFooter className="pt-4 border-t border-border/30 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="rounded-xl text-xs font-semibold shadow-sm"
              style={{ backgroundColor: color, color: '#fff' }}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
