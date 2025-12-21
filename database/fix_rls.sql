-- Allow users to INSERT their own profile
CREATE POLICY "Users insert own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow students to INSERT their own student record
CREATE POLICY "Students insert own" ON students FOR INSERT WITH CHECK (auth.uid() = id);
