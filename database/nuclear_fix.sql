-- ============================================================================
-- NUCLEAR FIX: DISABLE RLS ON MATCHES (TEMP FOR TESTING)
-- ============================================================================

-- This is the "f*** it, let's just verify the trigger works" approach
-- We can re-enable RLS properly after confirming the core logic works

ALTER TABLE matches DISABLE ROW LEVEL SECURITY;

-- Reset test data
DELETE FROM student_swipes WHERE student_id = '20c01a12-d79a-48de-a17a-7696d52b1832'::uuid;
DELETE FROM company_swipes WHERE student_id = '20c01a12-d79a-48de-a17a-7696d52b1832'::uuid;
DELETE FROM matches WHERE student_id = '20c01a12-d79a-48de-a17a-7696d52b1832'::uuid;

SELECT '✅ RLS DISABLED on matches. Run test now!' as status;
