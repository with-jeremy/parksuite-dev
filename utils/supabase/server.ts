import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { auth } from '@clerk/nextjs/server'

// Create a Supabase client for server-side authenticated requests
export const createServerSupabaseClient = async () => {
  const authSession = await auth()
  
  // If user is authenticated, use their token
  if (authSession && authSession.userId) {
    const supabaseAccessToken = authSession?.sessionClaims?.supabaseAccessToken || ''
    
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', 
      {
        global: {
          headers: {
            Authorization: `Bearer ${supabaseAccessToken}`
          }
        }
      }
    )
  }
  
  // Otherwise use anonymous client
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', 
    {
      global: {
        fetch: fetch
      }
    }
  )
}

// Use this for server components and API routes
export const getServerDb = async () => {
  return await createServerSupabaseClient()
}
