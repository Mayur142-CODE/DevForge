'use client'

import { motion } from 'framer-motion'
import { CategoryCard } from '@/components/categories/category-card'
import type { Category } from '@/types/database'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, i) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <CategoryCard category={category} />
        </motion.div>
      ))}
    </div>
  )
}
