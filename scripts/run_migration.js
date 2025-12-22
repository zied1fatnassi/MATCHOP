import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import fs from 'fs'

// Load env vars
const envFile = fs.readFileSync('.env', 'utf8')
const envConfig = dotenv.parse(envFile)

const supabase = createClient(
    envConfig.VITE_SUPABASE_URL,
    envConfig.VITE_SUPABASE_SERVICE_ROLE_KEY || envConfig.VITE_SUPABASE_ANON_KEY
)

const sql = `
-- Add missing columns to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS open_to_work BOOLEAN DEFAULT false;
`

async function run() {
    console.log('Running migration...')
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
    if (error) {
        console.error('Migration failed:', error)
    } else {
        console.log('Migration successful!')
    }
}

run()
