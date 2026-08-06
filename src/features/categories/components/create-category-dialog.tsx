'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CategoryFormDialog } from '@/components/categories/category-form-dialog'

export function CreateCategoryDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-xl shadow-xs">
        <Plus className="w-4 h-4 mr-2" />
        Add Category
      </Button>

      <CategoryFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
