-- ============================================================================
-- FIX PROFILE PICTURE UPLOAD - RLS POLICIES
-- ============================================================================

-- 1. ALLOW STUDENTS TO UPDATE THEIR OWN PROFILE
DROP POLICY IF EXISTS "Students can update own profile" ON students;
CREATE POLICY "Students can update own profile"
ON students
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 2. ALLOW STUDENTS TO INSERT THEIR OWN PROFILE (if missing)
DROP POLICY IF EXISTS "Students can insert own profile" ON students;
CREATE POLICY "Students can insert own profile"
ON students
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 3. ALLOW COMPANIES TO UPDATE THEIR OWN PROFILE
DROP POLICY IF EXISTS "Companies can update own profile" ON companies;
CREATE POLICY "Companies can update own profile"
ON companies
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. ALLOW COMPANIES TO INSERT THEIR OWN PROFILE (if missing)
DROP POLICY IF EXISTS "Companies can insert own profile" ON companies;
CREATE POLICY "Companies can insert own profile"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 5. CREATE STORAGE BUCKET FOR PROFILE PICTURES (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 6. ALLOW AUTHENTICATED USERS TO UPLOAD TO AVATARS BUCKET
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

SELECT '✅ Profile picture upload FIXED!' as status;
