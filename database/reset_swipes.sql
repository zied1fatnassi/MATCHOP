    -- ============================================================================
    -- RESET SWIPES FOR TEST USER
    -- ============================================================================

    DELETE FROM student_swipes WHERE student_id = '20c01a12-d79a-48de-a17a-7696d52b1832'::uuid;
    DELETE FROM company_swipes WHERE student_id = '20c01a12-d79a-48de-a17a-7696d52b1832'::uuid;
    DELETE FROM matches WHERE student_id = '20c01a12-d79a-48de-a17a-7696d52b1832'::uuid;

    SELECT '✅ Swipes & Matches Cleared for Test User' as status;
