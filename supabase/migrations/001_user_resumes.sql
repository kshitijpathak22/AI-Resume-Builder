-- ================================================
-- Supabase Migration: Create user_resumes table
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ================================================

CREATE TABLE IF NOT EXISTS user_resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  resume_id TEXT UNIQUE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  first_name TEXT,
  last_name TEXT,
  job_title TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  theme_color TEXT DEFAULT '#5b3fd9',
  summary TEXT,
  "Experience" JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE user_resumes ENABLE ROW LEVEL SECURITY;

-- Allow all operations (auth is handled by Clerk, not Supabase Auth)
CREATE POLICY "Allow all operations" ON user_resumes
  FOR ALL USING (true) WITH CHECK (true);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_user_resumes_user_email ON user_resumes(user_email);
CREATE INDEX IF NOT EXISTS idx_user_resumes_resume_id ON user_resumes(resume_id);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
