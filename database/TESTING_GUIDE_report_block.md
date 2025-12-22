# Report & Block System - Testing Guide

## Prerequisites
✅ All code files created  
⏳ Database migration needs to be run  

## Step-by-Step Testing

### 1. Run Database Migration

**Access Supabase Dashboard:**
1. Go to https://supabase.com/dashboard
2. Select your MatchOp project
3. Navigate to **SQL Editor**

**Execute Migration:**
1. Click "+ New Query"
2. Copy contents of `database/report_block_system.sql`
3. Paste into editor
4. Click **Run** (or press Ctrl+Enter)
5. Verify success message: "Success. No rows returned"

**Verify Tables Created:**
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('reported_users', 'blocked_users');

-- Should return 2 rows
```

---

### 2. Test Report Flow

#### A. Report from Job Offer Detail Modal

1. **Start Dev Server:**
   ```bash
   npm run dev
   ```

2. **Login as Student:**
   - Navigate to `/student/login`
   - Login with your test account

3. **Open Job Offer:**
   - Go to `/student/swipe`
   - Click on any job card to open details
   - Look for **Report** button (bottom-left of modal)

4. **Submit Report:**
   - Click "Report" button
   - Select reason: "Fake Profile or Impersonation"
   - Add details: "This seems like a scam job posting"
   - Click "Submit Report"

5. **Verify Success:**
   - ✅ Success message should appear
   - ✅ Modal should auto-close after 2.5 seconds

6. **Verify in Database:**
   ```sql
   SELECT * FROM reported_users ORDER BY created_at DESC LIMIT 1;
   ```
   - Should show your report with status='pending'

#### B. Test Duplicate Report Prevention

1. Try to report the same company again
2. Should see error: "You have already reported this user"

---

### 3. Test Block Functionality

#### A. Block from Chat (if chat is implemented)

1. Go to any match's chat
2. Click menu (three dots) in header
3. Select "Block User"
4. Confirm the block action

#### B. Verify Block Filtering

1. **Check Database:**
   ```sql
   SELECT * FROM blocked_users WHERE blocker_id = '<your_user_id>';
   ```

2. **Verify Filtered from Swipe Deck:**
   - Go to `/student/swipe`
   - Blocked company's offers should NOT appear
   - Check browser console for log: `[useJobOffers] Filtered out blocked companies: 1`

3. **Unblock:**
   - (If you implement settings page later)
   - Or manually delete from database:
     ```sql
     DELETE FROM blocked_users 
     WHERE blocker_id = '<your_user_id>' 
     AND blocked_id = '<blocked_company_id>';
     ```

---

### 4. Test RLS Policies

**Ensure Users Can Only See Their Own Reports:**

```sql
-- As User A: Try to view User B's reports
-- Should return empty (if you switch auth context)
SELECT * FROM reported_users WHERE reporter_id != auth.uid();
```

**Ensure Users Can Only Block for Themselves:**
- Try creating a block with different `blocker_id` than your session
- Should fail with RLS policy error

---

### 5. Edge Cases to Test

#### A. Self-Report Prevention
- Cannot report yourself (prevented in hook)

#### B. Self-Block Prevention
- Cannot block yourself (prevented in hook)

#### C. Long Details Text
- Enter 500 characters in details field
- Should allow exactly 500, prevent more

#### D. Missing Reason
- Try to submit without selecting a reason
- Submit button should be disabled

---

### 6. Visual Verification

**ReportModal Styling:**
- ✅ Modal appears centered
- ✅ Glassmorphism effect visible
- ✅ Reason options have hover states
- ✅ Selected reason is highlighted
- ✅ Character counter updates
- ✅ Success animation plays

**BlockConfirmModal:**
- ✅ Warning icon visible
- ✅ List of consequences clear
- ✅ Buttons properly aligned

---

### 7. Performance Checks

**Console Logs to Look For:**
```
[useJobOffers] Filtered out blocked companies: X
[useReporting] Report submitted successfully
[useBlocking] User blocked: <user_id>
```

**Network Tab:**
- Check for successful POST to `reported_users` table
- Check for successful POST to `blocked_users` table
- No unnecessary queries

---

## Common Issues & Solutions

### Issue: "relation 'reported_users' does not exist"
**Solution:** Run the SQL migration file

### Issue: "permission denied for table"
**Solution:** RLS policies not applied correctly, re-run migration

### Issue: Blocked users still appearing
**Solution:**
1. Clear browser cache (localStorage)
2. Force refresh offers: `useJobOffers().refresh()`
3. Check if `blockedUsers` array is populated

### Issue: Report modal styling broken
**Solution:** Ensure `ReportModal.css` is imported

---

## Manual Testing Checklist

- [ ] Database migration runs successfully
- [ ] Can report a company
- [ ] Cannot report the same company twice
- [ ] Report appears in database with correct data
- [ ] Can block a user/company
- [ ] Blocked companies don't appear in swipe deck
- [ ] Can unblock a user
- [ ] RLS prevents viewing others' reports
- [ ] Report modal UI looks good (glassmorphism)
- [ ] Success animation plays correctly
- [ ] Character counter works
- [ ] Long text truncates at 500 chars
- [ ] Mobile responsiveness works

---

## Next Steps After Testing

1. ✅ Report & Block System Working
2. Move to **Days 3-4: Verification Badges**
3. Then **Day 5: Spam Detection**
4. Finally **Days 6-7: Dark Mode & Filters**

---

## Rollback Plan

If something goes wrong:

```sql
-- Remove tables (will cascade delete all data)
DROP TABLE IF EXISTS reported_users CASCADE;
DROP TABLE IF EXISTS blocked_users CASCADE;

-- Remove helper functions
DROP FUNCTION IF EXISTS get_user_report_count(UUID);
DROP FUNCTION IF EXISTS is_user_blocked(UUID, UUID);
```

Then delete created files:
- `src/hooks/useReporting.js`
- `src/hooks/useBlocking.js`
- `src/components/ReportModal.jsx`
- `src/components/ReportModal.css`
- `src/components/BlockConfirmModal.jsx`
