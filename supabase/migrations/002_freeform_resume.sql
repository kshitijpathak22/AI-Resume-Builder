-- ================================================
-- Supabase Migration: Add freeform resume fields
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ================================================

ALTER TABLE user_resumes
ADD COLUMN IF NOT EXISTS is_freeform BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS content TEXT;
