-- ============================================================================
-- FIX RLS POLICIES FOR EXPERIENCES AND EDUCATION TABLES
-- Run this in Supabase SQL Editor to fix permission denied errors
-- ============================================================================

-- 1. DROP OLD POLICIES (if they exist)
DROP POLICY IF EXISTS "experiences_select_own" ON experiences;
DROP POLICY IF EXISTS "experiences_insert_own" ON experiences;
DROP POLICY IF EXISTS "experiences_update_own" ON experiences;
DROP POLICY IF EXISTS "experiences_delete_own" ON experiences;

DROP POLICY IF EXISTS "education_select_own" ON student_education;
DROP POLICY IF EXISTS "education_insert_own" ON student_education;
DROP POLICY IF EXISTS "education_update_own" ON student_education;
DROP POLICY IF EXISTS "education_delete_own" ON student_education;

-- 2. ENSURE RLS IS ENABLED
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_education ENABLE ROW LEVEL SECURITY;

-- 3. CREATE NEW POLICIES FOR EXPERIENCES TABLE
CREATE POLICY "experiences_select_own" 
ON experiences FOR SELECT 
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "experiences_insert_own" 
ON experiences FOR INSERT 
TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "experiences_update_own" 
ON experiences FOR UPDATE 
TO authenticated
USING (student_id = auth.uid()) 
WITH CHECK (student_id = auth.uid());

CREATE POLICY "experiences_delete_own" 
ON experiences FOR DELETE 
TO authenticated
USING (student_id = auth.uid());

-- 4. CREATE NEW POLICIES FOR STUDENT_EDUCATION TABLE
CREATE POLICY "education_select_own" 
ON student_education FOR SELECT 
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "education_insert_own" 
ON student_education FOR INSERT 
TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "education_update_own" 
ON student_education FOR UPDATE 
TO authenticated
USING (student_id = auth.uid()) 
WITH CHECK (student_id = auth.uid());

CREATE POLICY "education_delete_own" 
ON student_education FOR DELETE 
TO authenticated
USING (student_id = auth.uid());

-- 5. VERIFY POLICIES WERE CREATED
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('experiences', 'student_education')
ORDER BY tablename, cmd;

-- Expected output: You should see 4 policies per table (SELECT, INSERT, UPDATE, DELETE)
