-- ============================================================================
-- COMPLETE RLS FIX FOR STUDENT PROFILE
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================================

-- 1. STUDENTS TABLE - Full RLS Policies
-- ============================================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Students can view own profile" ON students;
DROP POLICY IF EXISTS "Students can insert own profile" ON students;
DROP POLICY IF EXISTS "Students can update own profile" ON students;
DROP POLICY IF EXISTS "Students can delete own profile" ON students;
DROP POLICY IF EXISTS "Anyone can view students" ON students;
DROP POLICY IF EXISTS "Users can manage own student profile" ON students;

-- SELECT: Users can view their own profile
CREATE POLICY "Students can view own profile"
ON students FOR SELECT
TO authenticated
USING (id = auth.uid());

-- INSERT: Users can create their own profile (id must match auth.uid())
CREATE POLICY "Students can insert own profile"
ON students FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- UPDATE: Users can update their own profile
CREATE POLICY "Students can update own profile"
ON students FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- DELETE: Users can delete their own profile
CREATE POLICY "Students can delete own profile"
ON students FOR DELETE
TO authenticated
USING (id = auth.uid());

-- 2. EXPERIENCES TABLE - Full RLS Policies
-- ============================================================================
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Students can view own experiences" ON experiences;
DROP POLICY IF EXISTS "Students can insert own experiences" ON experiences;
DROP POLICY IF EXISTS "Students can update own experiences" ON experiences;
DROP POLICY IF EXISTS "Students can delete own experiences" ON experiences;
DROP POLICY IF EXISTS "Students can manage own experiences" ON experiences;
DROP POLICY IF EXISTS "Companies can view matched experiences" ON experiences;

-- SELECT: Users can view their own experiences
CREATE POLICY "Students can view own experiences"
ON experiences FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- INSERT: Users can insert experiences for themselves
CREATE POLICY "Students can insert own experiences"
ON experiences FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

-- UPDATE: Users can update their own experiences
CREATE POLICY "Students can update own experiences"
ON experiences FOR UPDATE
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- DELETE: Users can delete their own experiences
CREATE POLICY "Students can delete own experiences"
ON experiences FOR DELETE
TO authenticated
USING (student_id = auth.uid());

-- 3. PROFILES TABLE - Ensure base profile RLS is correct
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 4. VERIFY POLICIES
-- ============================================================================
SELECT 'RLS Policies Applied Successfully!' as status;

-- Show active policies for verification
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('students', 'experiences', 'profiles')
ORDER BY tablename, policyname;
