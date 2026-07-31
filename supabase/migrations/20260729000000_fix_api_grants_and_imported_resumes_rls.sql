-- Fix 1: API roles were missing DML privileges on public tables, causing every
-- PostgREST request to fail with 42501 "permission denied for table ..." (HTTP 403).
-- RLS policies exist, but RLS only filters rows - the role still needs table GRANTs.
-- Restore the standard Supabase grants explicitly so the schema is portable.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- Fix 2: imported_resumes was created without RLS - any authenticated user could
-- read every other user's imported resume content. Enable RLS with an own-rows policy.
ALTER TABLE imported_resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own imported resumes" ON imported_resumes;
CREATE POLICY "Users can manage their own imported resumes"
  ON imported_resumes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
