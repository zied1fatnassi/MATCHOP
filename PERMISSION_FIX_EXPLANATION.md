# Permission Fixes - Explanation

## 1. Auth-Ready Check Before Queries
- **Before:** Queries ran immediately when `useEffect` triggered, potentially before auth session was fully loaded.
- **After:** `fetchProfile` now checks `if (authLoading)` and returns early with log message "Waiting for auth to complete...". Only queries when `!authLoading && user?.id` is true.
- **Result:** Experiences and Education queries only run AFTER Supabase auth session is confirmed ready.

## 2. Guaranteed student_id on All Writes
- **Before:** Payload included `student_id: user.id` but no verification that `user.id` was actually present.
- **After:** Every write operation (`addExperience`, `addEducation`, `updateExperience`, etc.) now checks `if (!user?.id)` at the start and returns early with error "User not loaded. Please refresh and login again." if user is missing.
- **Result:** Supabase RLS policies (`student_id = auth.uid()`) are guaranteed to match because we never send requests without a valid user.id.

## 3. Differentiated Error Handling for 403 vs Missing Auth
- **Before:** All errors showed generic "Permission denied" message regardless of actual cause.
- **After:** Error handling now distinguishes three cases:
  - `if (!user?.id)` → "User not loaded. Please refresh and login again."
  - `error.code === '42501'` (PostgreSQL permission denied) → "Permission denied. Please re-login."
  - All other errors → Generic message like "Could not save experience" or "Could not load education"
- **Logging:** All errors now log: `error.code`, `error.message`, `error.details`, `error.hint`, plus sanitized payload.
- **Result:** Users see actionable messages; developers can diagnose RLS vs session vs network issues from console logs.
