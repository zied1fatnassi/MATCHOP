-- NUCLEAR OPTION: Unlock external_jobs table completely for the demo
-- This ensures that regardless of key used (Anon vs Service), it works.

ALTER TABLE external_jobs ENABLE ROW LEVEL SECURITY;

-- Drop all restrictive policies
DROP POLICY IF EXISTS "Public read access for external jobs" ON external_jobs;
DROP POLICY IF EXISTS "Authenticated students can read external jobs" ON external_jobs;
DROP POLICY IF EXISTS "Service role can manage external jobs" ON external_jobs;
DROP POLICY IF EXISTS "Allow all access" ON external_jobs;

-- 1. UNIVERSAL READ ACCESS (User needs to see jobs)
CREATE POLICY "Universal Read"
ON external_jobs FOR SELECT
TO public
USING (true);

-- 2. UNIVERSAL WRITE ACCESS (Scraper needs to save jobs)
-- Warning: In production, restricted to service_role only.
CREATE POLICY "Universal Insert"
ON external_jobs FOR INSERT
TO public
WITH CHECK (true);

-- 3. UNIVERSAL UPDATE/DELETE
CREATE POLICY "Universal Update"
ON external_jobs FOR UPDATE
TO public
USING (true);

-- Grant privileges to postgres roles
GRANT ALL ON external_jobs TO anon;
GRANT ALL ON external_jobs TO authenticated;
GRANT ALL ON external_jobs TO service_role;
