import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Server-side only Supabase admin client
// This file can only be imported in server components and API routes
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Singleton admin client for server-side operations
let adminClient: ReturnType<typeof createAdminClient> | null = null

export function getAdminClient() {
  if (!adminClient) {
    adminClient = createAdminClient()
  }
  return adminClient
}