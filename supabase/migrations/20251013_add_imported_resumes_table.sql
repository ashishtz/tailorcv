-- Create imported_resumes table
CREATE TABLE IF NOT EXISTS imported_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Add index on user_id for faster lookups
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add index on user_id
CREATE INDEX IF NOT EXISTS idx_imported_resumes_user_id ON imported_resumes(user_id);