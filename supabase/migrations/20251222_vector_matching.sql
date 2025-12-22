-- ============================================================
-- PHASE 2: Vector Matching SQL Setup
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Add embedding columns to tables
ALTER TABLE students ADD COLUMN IF NOT EXISTS embedding vector(384);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS embedding vector(384);

-- Step 3: Create indexes for fast similarity search
-- Note: IVFFlat index requires at least some rows with embeddings
-- We'll use a simpler index first that works with empty tables
CREATE INDEX IF NOT EXISTS students_embedding_idx ON students 
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS offers_embedding_idx ON offers 
USING hnsw (embedding vector_cosine_ops);

-- Step 4: Create the matching function
CREATE OR REPLACE FUNCTION match_jobs_for_student(
    student_embedding vector(384),
    excluded_ids uuid[] DEFAULT '{}',
    match_count int DEFAULT 20
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    company_id uuid,
    location text,
    type text,
    salary_range text,
    req_skills text[],
    status text,
    created_at timestamptz,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.title,
        o.description,
        o.company_id,
        o.location,
        o.type,
        o.salary_range,
        o.req_skills,
        o.status,
        o.created_at,
        1 - (o.embedding <=> student_embedding) as similarity
    FROM offers o
    WHERE o.status = 'active'
      AND o.embedding IS NOT NULL
      AND (array_length(excluded_ids, 1) IS NULL OR o.id != ALL(excluded_ids))
    ORDER BY o.embedding <=> student_embedding
    LIMIT match_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION match_jobs_for_student TO authenticated;
GRANT EXECUTE ON FUNCTION match_jobs_for_student TO anon;

-- ============================================================
-- VERIFICATION: Test the setup
-- ============================================================
-- SELECT * FROM pg_extension WHERE extname = 'vector';
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'students' AND column_name = 'embedding';
