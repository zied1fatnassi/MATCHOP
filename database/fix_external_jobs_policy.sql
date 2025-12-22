-- Fix permissions for external_jobs table
ALTER TABLE external_jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for external jobs" ON external_jobs;
DROP POLICY IF EXISTS "Authenticated students can read external jobs" ON external_jobs;
DROP POLICY IF EXISTS "Service role can manage external jobs" ON external_jobs;

-- 1. Allow authenticated users (students) to READ jobs
CREATE POLICY "Authenticated students can read external jobs" 
ON external_jobs FOR SELECT 
TO authenticated 
USING (true);

-- 2. Allow public access (if needed for landing page, etc)
GRANT SELECT ON external_jobs TO anon;
GRANT SELECT ON external_jobs TO authenticated;
GRANT SELECT ON external_jobs TO service_role;

-- 3. Explicitly allow INSERT/UPDATE for service_role (just in case)
-- Note: Service role usually bypasses RLS, but grants are needed
GRANT ALL ON external_jobs TO service_role;
