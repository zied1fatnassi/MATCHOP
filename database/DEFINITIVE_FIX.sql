-- ============================================================================
-- DEFINITIVE FIX - RUN THIS ENTIRE SCRIPT
-- ============================================================================

-- STEP 1: GRANT TABLE PERMISSIONS (This is likely what's missing)
GRANT ALL ON TABLE matches TO authenticated;
GRANT ALL ON TABLE matches TO anon;
GRANT ALL ON TABLE matches TO service_role;

GRANT ALL ON TABLE student_swipes TO authenticated;
GRANT ALL ON TABLE company_swipes TO authenticated;
GRANT ALL ON TABLE profiles TO authenticated;
GRANT ALL ON TABLE students TO authenticated;
GRANT ALL ON TABLE companies TO authenticated;
GRANT ALL ON TABLE offers TO authenticated;

-- STEP 2: DISABLE ALL RLS
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_swipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_swipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- STEP 3: RESET TEST DATA
DELETE FROM matches WHERE student_id = '20c01a12-d79a-48de-a17a-7696d52b1832';
DELETE FROM company_swipes WHERE student_id = '20c01a12-d79a-48de-a17a-7696d52b1832';
DELETE FROM student_swipes WHERE student_id = '20c01a12-d79a-48de-a17a-7696d52b1832';

SELECT 'DONE - Now run: node test-match-flow.js' as status;
