import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { useAuth } from '@clerk/nextjs'

// Create a basic Supabase client for unauthenticated requests
export const db = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', 
  {
    global: {
      fetch: fetch
    }
  }
)

// Hook to get an authenticated Supabase client in client components
export function useSupabaseClient() {
  const { isSignedIn, getToken } = useAuth()
  
  const getSupabaseClient = async () => {
    // If user is signed in, use their token
    if (isSignedIn) {
      try {
        const token = await getToken({ template: 'supabase' })
        
        return createClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', 
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          }
        )
      } catch (error) {
        console.error("Failed to get Clerk token:", error)
        // Fall back to anonymous client if token retrieval fails
      }
    }
    
    // Return anonymous client if not signed in or token retrieval failed
    return db
  }
  
  return { getSupabaseClient }
}