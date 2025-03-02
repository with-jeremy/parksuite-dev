import { createClient } from '@supabase/supabase-js'


// Create a single supabase client for interacting with your database
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

export { db }