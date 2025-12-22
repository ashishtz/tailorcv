-- Add social links columns to profiles table
ALTER TABLE profiles
ADD COLUMN linkedin_url TEXT,
ADD COLUMN github_url TEXT,
ADD COLUMN stackoverflow_url TEXT;
