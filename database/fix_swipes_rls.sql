-- ============================================================================
-- FIX SWIPES RLS
-- ============================================================================

ALTER TABLE student_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_swipes ENABLE ROW LEVEL SECURITY;

-- 1. Student Swipes Policies
CREATE POLICY "Student insert own swipe" ON student_swipes 
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Student view own swipes" ON student_swipes 
    FOR SELECT USING (auth.uid() = student_id);

-- 2. Company Swipes Policies
CREATE POLICY "Company insert own swipe" ON company_swipes 
    FOR INSERT WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Company view own swipes" ON company_swipes 
    FOR SELECT USING (auth.uid() = company_id);

-- 3. Allow Admin/RPC (or System) to potentially read/write if needed
-- (SECURITY DEFINER functions bypass this, but good to have)

SELECT '✅ Swipes RLS Policies Applied' as status;
