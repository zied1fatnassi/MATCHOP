# Profile Hook Simplification - Explanation

## What was causing the timeouts?

1. **Aggressive 10-second AbortController timeout** was firing prematurely and aborting legitimate queries
2. **Multiple authLoading checks with early returns** were preventing data from loading even when auth was ready
3. **Excessive console logging** on every check was slowing down the React render cycle
4. **Complex error recovery logic** was retrying and re-checking auth state unnecessarily

## How the new hook initializes auth + data

1. **Simple auth check**: If `authLoading === true`, the effect does nothing (no queries sent)
2. **Once auth ready**: When `authLoading === false` and `user.id` exists, `fetchProfile` runs ONCE
3. **Parallel fetches**: Profile, experiences, and education are fetched in sequence with simple try/catch
4. **No timeouts**: Supabase's built-in timeout handles slow connections; we don't abort queries manually
5. **Clear error states**: Each section (experiences, education) gets its own error state, which doesn't block the others

## How RLS is respected without breaking other pages

- Every write operation (insert/update/delete) explicitly sets `student_id: user.id` in the payload
- RLS policies `student_id = auth.uid()` match because we verify `user?.id` exists before sending requests
- Hook is isolated to `/student/profile` route and doesn't affect swipes, matches, or AuthContext
- Errors return friendly messages ("Permission denied. Please re-login.") but log full details to console once
