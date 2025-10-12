-- Migration to add template_id column to existing resumes table
-- Run this if you already have the resumes table without template_id

ALTER TABLE resumes ADD COLUMN template_id TEXT DEFAULT 'classic' NOT NULL;