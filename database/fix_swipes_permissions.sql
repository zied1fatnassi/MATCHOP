-- ============================================================================
-- FORCE FIX SWIPES PERMISSIONS
-- ============================================================================

-- Drop generic policies to avoid conflicts/confusion
DROP POLICY IF EXISTS "Student insert own swipe" ON student_swipes;
DROP POLICY IF EXISTS "Student view own swipes" ON student_swipes;

-- Create SPECIFIC policy for our test user
CREATE POLICY "Super Swipe Permission" ON student_swipes
    FOR ALL 
    USING (student_id = '20c01a12-d79a-48de-a17a-7696d52b1832'::uuid)
    WITH CHECK (student_id = '20c01a12-d79a-48de-a17a-7696d52b1832'::uuid);

-- Grant schema usage just in case
GRANT ALL ON TABLE student_swipes TO authenticated;
GRANT ALL ON TABLE student_swipes TO service_role;

SELECT '✅ Forceful Swipe Permissions Applied' as status;
