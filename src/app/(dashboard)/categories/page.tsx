"use client"

import * as React from 'react'
import { useCategories } from '@/features/categories/api/use-categories'
import { useDeleteCategory } from '@/hooks/use-categories'
import { useDailyEntries } from '@/features/daily-entries/api/use-daily-entries'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateCategoryDialog } from '@/features/categories/components/create-category-dialog'
import { CategoryFormDialog } from '@/components/categories/category-form-dialog'
import { CategoryCard } from '@/components/categories/category-card'
import { ConfirmDeleteDialog } from '@/components/categories/confirm-delete-dialog'
import { Category } from '@/types/database'

export default function CategoriesPage() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories()
  const currentYear = new Date().getFullYear()
  const { data: dailyEntries, isLoading: isEntriesLoading } = useDailyEntries(currentYear)
  const deleteCategory = useDeleteCategory()
  
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = React.useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingCategoryId(id)
  }

  const confirmDelete = () => {
    if (deletingCategoryId) {
      deleteCategory.mutate(deletingCategoryId, {
        onSuccess: () => setDeletingCategoryId(null)
      })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setTimeout(() => setEditingCategory(null), 300) // Clear after animation
    }
  }

  if (isCategoriesLoading || isEntriesLoading) {
    return (
      <div className="space-y-8 p-6 max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {[1,2,3].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">Manage your learning tracks and disciplines.</p>
        </div>
        <CreateCategoryDialog />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {categories?.map((category, index) => {
          const categoryEntries = dailyEntries?.filter(e => e.category_id === category.id) || []
          return (
            <CategoryCard
              key={category.id}
              category={category}
              dailyEntries={categoryEntries}
              onEdit={handleEdit}
              onDelete={handleDelete}
              index={index}
            />
          )
        })}
      </div>

      <CategoryFormDialog 
        open={isEditDialogOpen} 
        onOpenChange={handleDialogChange}
        category={editingCategory || undefined}
      />

      <ConfirmDeleteDialog
        open={!!deletingCategoryId}
        onOpenChange={(open) => !open && setDeletingCategoryId(null)}
        onConfirm={confirmDelete}
        isDeleting={deleteCategory.isPending}
      />
    </div>
  )
}
