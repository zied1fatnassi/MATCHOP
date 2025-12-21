-- ============================================================================
-- FIX TRIGGERS V2: ROBUSTITY & PERMISSIONS
-- ============================================================================

-- 1. UPDATE COMPANY-SIDE TRIGGER FUNCTION (SECURITY DEFINER)
-- Bypasses RLS so Company Swipe can read Student Swipe
CREATE OR REPLACE FUNCTION handle_new_match() RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only care about RIGHT swipes
    IF NEW.direction = 'right' THEN
        -- Check if Student swiped RIGHT on this Offer
        IF EXISTS (
            SELECT 1 FROM student_swipes 
            WHERE student_id = NEW.student_id 
            AND offer_id = NEW.offer_id 
            AND direction = 'right'
        ) THEN
            -- Create Match
            INSERT INTO matches (student_id, offer_id, company_id)
            VALUES (NEW.student_id, NEW.offer_id, NEW.company_id)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


-- 2. UPDATE STUDENT-SIDE TRIGGER FUNCTION (SECURITY DEFINER)
-- Bypasses RLS so Student Swipe can read Company Swipe & Offer Owner
CREATE OR REPLACE FUNCTION handle_student_swipe_match() RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_company_id UUID;
BEGIN
    -- Only care about RIGHT swipes
    IF NEW.direction = 'right' THEN
        -- Find the company for this offer
        SELECT company_id INTO target_company_id FROM offers WHERE id = NEW.offer_id;
        
        -- Check if Company ALREADY swiped RIGHT
        IF EXISTS (
            SELECT 1 FROM company_swipes 
            WHERE company_id = target_company_id
            AND student_id = NEW.student_id 
            AND offer_id = NEW.offer_id 
            AND direction = 'right'
        ) THEN
            -- Create Match
            INSERT INTO matches (student_id, offer_id, company_id)
            VALUES (NEW.student_id, NEW.offer_id, target_company_id)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


-- 3. RECREATE TRIGGERS FOR INSERT **OR UPDATE**
-- Ensures match logic fires even if a swipe is updated (e.g. Left -> Right, or Upsert)

DROP TRIGGER IF EXISTS on_company_swipe_match ON company_swipes;
CREATE TRIGGER on_company_swipe_match
    AFTER INSERT OR UPDATE ON company_swipes
    FOR EACH ROW EXECUTE FUNCTION handle_new_match();

DROP TRIGGER IF EXISTS on_student_swipe_match ON student_swipes;
CREATE TRIGGER on_student_swipe_match
    AFTER INSERT OR UPDATE ON student_swipes
    FOR EACH ROW EXECUTE FUNCTION handle_student_swipe_match();

SELECT '✅ Symmetric Triggers now Handle Updates & Bypass RLS' as status;
