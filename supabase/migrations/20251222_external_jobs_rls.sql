ALTER TABLE external_jobs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (students/companies) to read external jobs
CREATE POLICY "Allow authenticated read access to external_jobs"
ON external_jobs
FOR SELECT
TO authenticated
USING (true);

-- Allow anon read access (optional, if you want public viewing)
CREATE POLICY "Allow anon read access to external_jobs"
ON external_jobs
FOR SELECT
TO anon
USING (true);
