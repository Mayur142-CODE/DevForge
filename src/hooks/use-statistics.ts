'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getOverviewStats,
  getWeeklyStats,
  getMonthlyStats,
  getYearlyStats,
} from '@/services/statistics'

export function useOverviewStats() {
  return useQuery({
    queryKey: ['statistics', 'overview'],
    queryFn: getOverviewStats,
  })
}

export function useWeeklyStats() {
  return useQuery({
    queryKey: ['statistics', 'weekly'],
    queryFn: getWeeklyStats,
  })
}

export function useMonthlyStats() {
  return useQuery({
    queryKey: ['statistics', 'monthly'],
    queryFn: getMonthlyStats,
  })
}

export function useYearlyStats() {
  return useQuery({
    queryKey: ['statistics', 'yearly'],
    queryFn: getYearlyStats,
  })
}
