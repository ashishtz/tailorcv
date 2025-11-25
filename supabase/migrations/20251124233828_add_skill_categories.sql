-- Create skill_categories table (global categories, not user-specific)
CREATE TABLE skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Delete all existing records from user_skills (fresh start as per requirements)
DELETE FROM user_skills;

-- Add category_id column to user_skills
ALTER TABLE user_skills ADD COLUMN category_id UUID REFERENCES skill_categories(id) ON DELETE SET NULL;

-- Enable Row Level Security on skill_categories
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for skill_categories (everyone can view, authenticated users can insert)
CREATE POLICY "Everyone can view skill categories"
  ON skill_categories FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert skill categories"
  ON skill_categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
