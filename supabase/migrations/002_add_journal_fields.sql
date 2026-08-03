-- StreakHub Migration: Add journal fields to daily_entries
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql

ALTER TABLE daily_entries
  ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS resource_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
