import '@testing-library/jest-dom'

// Mock Supabase for tests
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(() => Promise.resolve({ data: { session: { user: { id: 'test-user' } } } })),
            getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } })),
        },
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
    }
}))
