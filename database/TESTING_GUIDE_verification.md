# Phase 1 Verification System Testing Guide

## Step 1: Run Database Migration

**In Supabase SQL Editor:**

```sql
-- Copy and run the contents of: database/add_verification_columns.sql
```

**Verify columns were created:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('verified', 'verification_method', 'verification_data', 'verified_at');
```

Should return 4 rows.

---

## Step 2: Test Email Auto-Verification

1. **Login to your app** with an email-verified account
2. **Check console** - should see:
   ```
   [Auth] Auto-verifying email for user: <user_id>
   [Auth] Email verification badge added
   ```

3. **Verify in Database:**
   ```sql
   SELECT id, verified, verification_method, verified_at 
   FROM profiles 
   WHERE id = '<your_user_id>';
   ```
   Should show `verified = true`, `verification_method = 'email'`

---

## Step 3: Visual Verification

1. Check **SwipeCard** - Company names should show badge (if company is verified)
2. Badge should have:
   - Blue color for email verification
   - Hover tooltip
   - Smooth animation on hover

---

## Step 4: Manual LinkedIn Verification

**Run in browser console:**

```javascript
// Import verification function
const { verifyLinkedInProfile } = await import('/src/lib/verification.js')

// Your user ID
const userId = '<your_user_id>'

// Verify LinkedIn
const result = await verifyLinkedInProfile(userId, 'https://linkedin.com/in/yourprofile')
console.log(result)
```

Should return `{ success: true }`

---

## Success Criteria

- ✅ Verification columns exist in profiles table
- ✅ Email-verified users get automatic badge
- ✅ Badge appears on swipe cards (xs size)
- ✅ Badge has correct color (blue for email, blue for LinkedIn)
- ✅ Tooltip shows on hover
- ✅ LinkedIn URL validation works
- ✅ Database stores verification data correctly

---

## Troubleshooting

**Issue: Badge not showing**
- Check if `offer.companyVerified` is true
- Check console for errors
- Verify component is imported

**Issue: Auto-verification not running**
- Clear localStorage and re-login
- Check console for Auto-verify message
- Verify user.email_confirmed_at exists

**Issue: Style issues**
- Ensure `VerificationBadge.css` is imported
- Check CSS variables are defined
