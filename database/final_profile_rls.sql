-- ============================================================================
-- FINAL RLS FIX FOR MATCHOP PROFILE
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. STUDENTS TABLE (id = auth.uid())
-- ============================================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Force drop ALL possible policy names
DO $$
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Students can view own profile" ON students';
    EXECUTE 'DROP POLICY IF EXISTS "Students can insert own profile" ON students';
    EXECUTE 'DROP POLICY IF EXISTS "Students can update own profile" ON students';
    EXECUTE 'DROP POLICY IF EXISTS "Students can delete own profile" ON students';
    EXECUTE 'DROP POLICY IF EXISTS "students_select_own" ON students';
    EXECUTE 'DROP POLICY IF EXISTS "students_insert_own" ON students';
    EXECUTE 'DROP POLICY IF EXISTS "students_update_own" ON students';
    EXECUTE 'DROP POLICY IF EXISTS "students_delete_own" ON students';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can view students" ON students';
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage own student profile" ON students';
    EXECUTE 'DROP POLICY IF EXISTS "students_select_for_companies" ON students';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Create clean policies
CREATE POLICY "students_select_own" ON students FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "students_insert_own" ON students FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "students_update_own" ON students FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "students_delete_own" ON students FOR DELETE TO authenticated
USING (id = auth.uid());


-- ============================================================================
-- 2. EXPERIENCES TABLE (student_id = auth.uid())
-- ============================================================================

-- Create table if not exists
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiences_student ON experiences(student_id);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Force drop ALL possible policy names
DO $$
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Students can view own experiences" ON experiences';
    EXECUTE 'DROP POLICY IF EXISTS "Students can insert own experiences" ON experiences';
    EXECUTE 'DROP POLICY IF EXISTS "Students can update own experiences" ON experiences';
    EXECUTE 'DROP POLICY IF EXISTS "Students can delete own experiences" ON experiences';
    EXECUTE 'DROP POLICY IF EXISTS "Students can manage own experiences" ON experiences';
    EXECUTE 'DROP POLICY IF EXISTS "Companies can view matched experiences" ON experiences';
    EXECUTE 'DROP POLICY IF EXISTS "experiences_select_own" ON experiences';
    EXECUTE 'DROP POLICY IF EXISTS "experiences_insert_own" ON experiences';
    EXECUTE 'DROP POLICY IF EXISTS "experiences_update_own" ON experiences';
    EXECUTE 'DROP POLICY IF EXISTS "experiences_delete_own" ON experiences';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Create clean policies
CREATE POLICY "experiences_select_own" ON experiences FOR SELECT TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "experiences_insert_own" ON experiences FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "experiences_update_own" ON experiences FOR UPDATE TO authenticated
USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

CREATE POLICY "experiences_delete_own" ON experiences FOR DELETE TO authenticated
USING (student_id = auth.uid());


-- ============================================================================
-- 3. AVATARS STORAGE BUCKET
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Force drop storage policies
DO $$
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "avatars_insert_own" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "avatars_delete_own" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Storage policies
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "avatars_update_own" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "avatars_delete_own" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);


-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT '✅ RLS policies applied!' as status;

SELECT tablename, policyname, cmd FROM pg_policies 
WHERE tablename IN ('students', 'experiences')
ORDER BY tablename, policyname;
