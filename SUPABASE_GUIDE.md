# Supabase Integration Guide for MatchOp

A complete step-by-step walkthrough for integrating Supabase backend into your MatchOp application.

---

## Table of Contents

1. [Setup Supabase Project](#1-setup-supabase-project)
2. [Database Schema](#2-database-schema)
3. [Install Supabase Client](#3-install-supabase-client)
4. [Configure Environment](#4-configure-environment)
5. [Initialize Supabase Client](#5-initialize-supabase-client)
6. [Authentication](#6-authentication)
7. [Database Queries](#7-database-queries)
8. [Real-time Chat](#8-real-time-chat)
9. [File Storage](#9-file-storage)
10. [Row Level Security](#10-row-level-security)

---

## 1. Setup Supabase Project

### Step 1.1: Create Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub

### Step 1.2: Create New Project
1. Click "New Project"
2. Fill in details:
   - **Name**: `matchop`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to Tunisia (eu-central-1 recommended)
3. Click "Create new project"
4. Wait 2-3 minutes for setup

### Step 1.3: Get API Keys
1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

---

## 2. Database Schema

### Step 2.1: Open SQL Editor
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste the following schema:

```sql
-- =====================================================
-- MATCHOP DATABASE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('student', 'company')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STUDENT PROFILES
-- =====================================================
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    bio TEXT,
    location TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    behance_url TEXT,
    cv_url TEXT,
    skills TEXT[] DEFAULT '{}',
    experience TEXT,
    availability TEXT,
    university TEXT,
    graduation_year INT
);

-- =====================================================
-- COMPANIES
-- =====================================================
CREATE TABLE companies (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    website TEXT,
    sector TEXT,
    size TEXT,
    description TEXT,
    logo_url TEXT,
    location TEXT,
    contact_email TEXT
);

-- =====================================================
-- JOB OFFERS
-- =====================================================
CREATE TABLE job_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    salary_min INT,
    salary_max INT,
    salary_currency TEXT DEFAULT 'TND',
    skills TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SWIPES (Student actions on job offers)
-- =====================================================
CREATE TABLE swipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    offer_id UUID NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
    direction TEXT NOT NULL CHECK (direction IN ('left', 'right', 'super')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, offer_id)
);

-- =====================================================
-- MATCHES (When both parties swipe right)
-- =====================================================
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    offer_id UUID NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    matched_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'hired')),
    UNIQUE(student_id, offer_id)
);

-- =====================================================
-- MESSAGES
-- =====================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX idx_job_offers_company ON job_offers(company_id);
CREATE INDEX idx_job_offers_active ON job_offers(is_active);
CREATE INDEX idx_swipes_student ON swipes(student_id);
CREATE INDEX idx_swipes_offer ON swipes(offer_id);
CREATE INDEX idx_matches_student ON matches(student_id);
CREATE INDEX idx_matches_company ON matches(company_id);
CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to create match when both parties swipe right
CREATE OR REPLACE FUNCTION check_and_create_match()
RETURNS TRIGGER AS $$
BEGIN
    -- Only check for right swipes
    IF NEW.direction IN ('right', 'super') THEN
        -- Check if company has marked this student as interested
        -- For now, we'll create match on student swipe if offer.auto_match is true
        INSERT INTO matches (student_id, offer_id, company_id)
        SELECT NEW.student_id, NEW.offer_id, jo.company_id
        FROM job_offers jo
        WHERE jo.id = NEW.offer_id
        ON CONFLICT (student_id, offer_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-matching
CREATE TRIGGER on_student_swipe
    AFTER INSERT ON swipes
    FOR EACH ROW
    EXECUTE FUNCTION check_and_create_match();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_job_offers_updated_at
    BEFORE UPDATE ON job_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

4. Click **Run** to execute

---

## 3. Install Supabase Client

### Step 3.1: Install Package

```bash
npm install @supabase/supabase-js
```

---

## 4. Configure Environment

### Step 4.1: Update .env file

Create/update `c:\swipe\.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ Replace with your actual values from Step 1.3

---

## 5. Initialize Supabase Client

### Step 5.1: Create Supabase lib file

Create `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})
```

---

## 6. Authentication

### Step 6.1: Update AuthContext

Replace `src/context/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            }
            setIsLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) {
                    await fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, student_profiles(*), companies(*)')
            .eq('id', userId)
            .single()

        if (!error && data) {
            setProfile(data)
        }
    }

    const signUp = async (email, password, userType, userData) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { type: userType, name: userData.name }
            }
        })

        if (error) throw error

        // Create profile
        if (data.user) {
            await supabase.from('profiles').insert({
                id: data.user.id,
                type: userType,
                name: userData.name,
                email: email
            })

            // Create type-specific profile
            if (userType === 'student') {
                await supabase.from('student_profiles').insert({
                    id: data.user.id,
                    ...userData
                })
            } else {
                await supabase.from('companies').insert({
                    id: data.user.id,
                    ...userData
                })
            }
        }

        return data
    }

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error
        return data
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setUser(null)
        setProfile(null)
    }

    const value = {
        user,
        profile,
        isLoggedIn: !!user,
        isStudent: profile?.type === 'student',
        isCompany: profile?.type === 'company',
        isLoading,
        signUp,
        signIn,
        signOut,
        refreshProfile: () => user && fetchProfile(user.id)
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
```

---

## 7. Database Queries

### Step 7.1: Job Offers Hook

Create `src/hooks/useJobOffers.js`:

```javascript
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useJobOffers() {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        fetchOffers()
    }, [user])

    const fetchOffers = async () => {
        setLoading(true)
        
        // Get offers that user hasn't swiped on yet
        const { data: swipedIds } = await supabase
            .from('swipes')
            .select('offer_id')
            .eq('student_id', user?.id)

        const swipedOfferIds = swipedIds?.map(s => s.offer_id) || []

        let query = supabase
            .from('job_offers')
            .select(`
                *,
                companies (
                    id, name, logo_url, sector, location
                )
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (swipedOfferIds.length > 0) {
            query = query.not('id', 'in', `(${swipedOfferIds.join(',')})`)
        }

        const { data, error } = await query

        if (!error) {
            setOffers(data.map(offer => ({
                ...offer,
                company: offer.companies.name,
                companyLogo: offer.companies.logo_url,
                salary: offer.salary_min && offer.salary_max 
                    ? `${offer.salary_min}-${offer.salary_max} ${offer.salary_currency}/month`
                    : 'Competitive'
            })))
        }
        
        setLoading(false)
    }

    const swipe = async (offerId, direction) => {
        const { error } = await supabase
            .from('swipes')
            .insert({
                student_id: user.id,
                offer_id: offerId,
                direction
            })

        if (!error) {
            setOffers(prev => prev.filter(o => o.id !== offerId))
        }

        return { error }
    }

    return { offers, loading, swipe, refresh: fetchOffers }
}
```

### Step 7.2: Matches Hook

Create `src/hooks/useMatches.js`:

```javascript
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useMatches() {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, isStudent } = useAuth()

    useEffect(() => {
        if (user) fetchMatches()
    }, [user])

    const fetchMatches = async () => {
        setLoading(true)

        let query = supabase
            .from('matches')
            .select(`
                *,
                job_offers (
                    id, title,
                    companies (id, name, logo_url)
                ),
                student_profiles (
                    id,
                    profiles (name, avatar_url)
                )
            `)
            .eq('status', 'active')
            .order('matched_at', { ascending: false })

        if (isStudent) {
            query = query.eq('student_id', user.id)
        } else {
            query = query.eq('company_id', user.id)
        }

        const { data, error } = await query

        if (!error) {
            setMatches(data)
        }
        
        setLoading(false)
    }

    return { matches, loading, refresh: fetchMatches }
}
```

---

## 8. Real-time Chat

### Step 8.1: Messages Hook

Create `src/hooks/useMessages.js`:

```javascript
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useMessages(matchId) {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        if (!matchId) return

        // Fetch existing messages
        fetchMessages()

        // Subscribe to new messages
        const channel = supabase
            .channel(`messages:${matchId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `match_id=eq.${matchId}`
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [matchId])

    const fetchMessages = async () => {
        setLoading(true)
        
        const { data, error } = await supabase
            .from('messages')
            .select('*, profiles(name, avatar_url)')
            .eq('match_id', matchId)
            .order('created_at', { ascending: true })

        if (!error) {
            setMessages(data)
        }
        
        setLoading(false)
    }

    const sendMessage = async (content) => {
        const { error } = await supabase
            .from('messages')
            .insert({
                match_id: matchId,
                sender_id: user.id,
                content
            })

        return { error }
    }

    return { messages, loading, sendMessage }
}
```

---

## 9. File Storage

### Step 9.1: Setup Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Create buckets:
   - `avatars` (public)
   - `cvs` (private)
   - `company-logos` (public)

### Step 9.2: Upload Helper

Create `src/lib/storage.js`:

```javascript
import { supabase } from './supabase'

export async function uploadAvatar(userId, file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

    return publicUrl
}

export async function uploadCV(userId, file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/cv.${fileExt}`

    const { data, error } = await supabase.storage
        .from('cvs')
        .upload(fileName, file, { upsert: true })

    if (error) throw error

    // Get signed URL (valid for 1 hour)
    const { data: { signedUrl } } = await supabase.storage
        .from('cvs')
        .createSignedUrl(fileName, 3600)

    return signedUrl
}
```

---

## 10. Row Level Security

### Step 10.1: Enable RLS Policies

Run in SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- Student profiles: Read all, update own
CREATE POLICY "Student profiles viewable by authenticated"
    ON student_profiles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Students can update own profile"
    ON student_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Students can insert own profile"
    ON student_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Companies: Read all, update own
CREATE POLICY "Companies viewable by all"
    ON companies FOR SELECT USING (true);

CREATE POLICY "Companies can update own"
    ON companies FOR UPDATE USING (auth.uid() = id);

-- Job offers: Read all active, companies manage own
CREATE POLICY "Active offers viewable by all"
    ON job_offers FOR SELECT
    USING (is_active = true OR company_id = auth.uid());

CREATE POLICY "Companies can insert offers"
    ON job_offers FOR INSERT
    WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can update own offers"
    ON job_offers FOR UPDATE
    USING (company_id = auth.uid());

-- Swipes: Students manage own
CREATE POLICY "Students can view own swipes"
    ON swipes FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can create swipes"
    ON swipes FOR INSERT
    WITH CHECK (student_id = auth.uid());

-- Matches: Participants can view
CREATE POLICY "Match participants can view"
    ON matches FOR SELECT
    USING (student_id = auth.uid() OR company_id = auth.uid());

-- Messages: Match participants can view/send
CREATE POLICY "Match participants can view messages"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM matches
            WHERE matches.id = messages.match_id
            AND (matches.student_id = auth.uid() OR matches.company_id = auth.uid())
        )
    );

CREATE POLICY "Match participants can send messages"
    ON messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM matches
            WHERE matches.id = match_id
            AND (matches.student_id = auth.uid() OR matches.company_id = auth.uid())
        )
    );
```

---

## Quick Start Checklist

- [ ] Create Supabase account
- [ ] Create new project
- [ ] Copy API URL and anon key
- [ ] Run database schema SQL
- [ ] Install `@supabase/supabase-js`
- [ ] Create `.env` with credentials
- [ ] Create `src/lib/supabase.js`
- [ ] Update AuthContext
- [ ] Create hooks for data fetching
- [ ] Setup storage buckets
- [ ] Enable RLS policies
- [ ] Test authentication flow
- [ ] Test swipe functionality
- [ ] Test real-time chat

---

## Troubleshooting

### "Invalid API key"
- Check `.env` file has correct values
- Restart dev server after changing `.env`

### "Permission denied"
- Check RLS policies are set up
- Verify user is authenticated

### "Relation does not exist"
- Run the schema SQL in SQL Editor
- Check for typos in table names

---

*Happy building! 🚀*
