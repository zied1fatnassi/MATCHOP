# Vercel Environment Variables - Verification Guide

## 🚨 CRITICAL: This is the #1 Most Likely Cause of Loading Issues

Your `.env` file exists locally, but **Vercel doesn't see it**. You need to manually add environment variables to Vercel's dashboard.

## Step-by-Step Instructions

### 1. Get Your Supabase Credentials

Open your local `.env` file and copy these values:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

**Don't have them?** Go to:
1. Supabase Dashboard → Your Project
2. Settings → API
3. Copy "Project URL" and "anon public" key

### 2. Add to Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click your **matchop** project
3. Click **Settings** tab (top menu)
4. Click **Environment Variables** (left sidebar)
5. Click **Add Environment Variable**

Add each variable:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: (paste your URL from .env)
- Environment: Check **Production**, **Preview**, **Development**
- Click **Save**

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: (paste your anon key from .env)
- Environment: Check **Production**, **Preview**, **Development**
- Click **Save**

### 3. Redeploy

After adding variables:
1. Go to **Deployments** tab
2. Click the **3 dots (⋯)** on the latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes for deployment to complete

### 4. Test

1. Visit your deployed site: `https://matchop.vercel.app`
2. Open browser console (F12)
3. Look for `[Diagnostic]` logs
4. Should see:
   ```
   [Diagnostic] Environment Variables: { hasSupabaseUrl: true, hasSupabaseKey: true }
   ```

## ⚠️ If URLs Don't Match

If your Vercel environment variables have **different** URLs than your local `.env`, your production app will connect to a **different** database.

**Solution:** Make sure the URLs in Vercel match your local `.env` exactly.

## 🔍 How to Verify Variables Are Set

In Vercel Dashboard → Settings → Environment Variables, you should see:

```
VITE_SUPABASE_URL          Production, Preview, Development
VITE_SUPABASE_ANON_KEY     Production, Preview, Development
```

If you see these, you're good! Just redeploy.

## 💡 Why This Happens

- `.env` files are **ignored by Git** (security)
- Vercel builds your app from GitHub
- Vercel doesn't have access to your local `.env`
- YOU must manually copy the variables to Vercel's dashboard
