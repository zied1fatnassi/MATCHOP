import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = 'https://kedqldpdvycbnznejbbl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZHFsZHBkdnljYm56bmVqYmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzI2OTEsImV4cCI6MjA4MTY0ODY5MX0.vCBQy38Nh4-MbHLKu68ki1EVCNB72f8Q64-lnixcmeE';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testDoubleOptIn() {
    console.log('🚀 Testing Double-Opt-In Flow...');

    // 1. LOGIN
    const email = 'student@tek-up.tn';
    const password = 'password123';
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !session) {
        console.error('❌ Login Failed:', authError);
        return;
    }
    console.log('✅ Signed In:', session.user.id);
    const userId = session.user.id;

    // 2. GET RECOMMENDATIONS
    console.log('\n📡 Fetching Recommendations...');
    const { data: recResponse, error: recError } = await supabase.functions.invoke('match-recommendations', {
        body: { limit: 1, distance: 50 }
    });

    if (recError || !recResponse?.data?.length) {
        console.error('❌ No Recommendations found to swipe on!');
        return;
    }

    const targetOffer = recResponse.data[0];
    console.log(`✅ Found Offer to Swipe: "${targetOffer.title}" @ ${targetOffer.company_name} (ID: ${targetOffer.offer_id})`);


    // 3. STUDENT SWIPE RIGHT
    console.log('\n👉 Student Swiping RIGHT...');
    const { error: swipeError } = await supabase.from('student_swipes').upsert({
        student_id: userId,
        offer_id: targetOffer.offer_id, // Note: Function returns 'offer_id', table expects 'offer_id'
        direction: 'right'
    }, { onConflict: 'student_id, offer_id' });

    if (swipeError) {
        console.error('❌ Student Swipe Failed:', swipeError);
        return;
    }
    console.log('✅ Student Swiped Right.');


    // 4. VERIFY NO MATCH YET (Pending)
    const { data: matchCheck1 } = await supabase.from('matches')
        .select('*')
        .eq('student_id', userId)
        .eq('offer_id', targetOffer.offer_id)
        .single();

    if (matchCheck1) {
        console.error('❌ Premature Match! (Did company already swipe?)');
    } else {
        console.log('✅ No Match yet (Expected). Waiting for Company...');
    }


    // 5. SIMULATE COMPANY SWIPE RIGHT (using Debug RPC)
    console.log('\n🤖 Simulating Company Response (RPC)...');
    const { error: rpcError } = await supabase.rpc('debug_company_swipe', {
        target_student_id: userId,
        target_offer_id: targetOffer.offer_id,
        swipe_direction: 'right'
    });

    if (rpcError) {
        console.error('❌ Company Simulation Failed:', rpcError);
        return;
    }
    console.log('✅ Company Swiped Right.');


    // 6. FINAL VERIFICATION
    console.log('\n🎉 Verifying Match Creation...');

    // First, try simple select to isolate permission issues
    const { data: finalMatch, error: finalError } = await supabase.from('matches')
        .select('*')
        .eq('student_id', userId)
        .eq('offer_id', targetOffer.offer_id)
        .single();

    if (finalError || !finalMatch) {
        console.error('❌ MATCH FAILED! Trigger did not fire (or RLS Blocked)?');
        console.error('   Error Details:', finalError);
    } else {
        console.log('✅ MATCH CONFIRMED! 🥳');
        console.log(`   Match ID: ${finalMatch.id}`);
        console.log(`   Status: ${finalMatch.status}`);
        console.log('   (Company details omitted to bypass potential RLS join issues)');
    }
}

testDoubleOptIn();
