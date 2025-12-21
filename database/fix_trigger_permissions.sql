-- ============================================================================
-- FIX TRIGGER PERMISSIONS (Security Definer)
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_student_swipe_match() RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER -- <--- CRITICAL: Run as Admin to bypass RLS on offers/companies/matches
AS $$
BEGIN
    -- Only care about RIGHT swipes
    IF NEW.direction = 'right' THEN
        -- Check if Company ALREADY swiped RIGHT on this Student for this Offer
        IF EXISTS (
            SELECT 1 FROM company_swipes 
            WHERE company_id = (SELECT company_id FROM offers WHERE id = NEW.offer_id) 
            AND student_id = NEW.student_id 
            AND offer_id = NEW.offer_id 
            AND direction = 'right'
        ) THEN
            -- Create Match
            INSERT INTO matches (student_id, offer_id, company_id)
            VALUES (
                NEW.student_id, 
                NEW.offer_id, 
                (SELECT company_id FROM offers WHERE id = NEW.offer_id)
            )
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

SELECT '✅ Trigger updated to Security Definer' as status;
