import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

// IMPORTANT: This client bypasses RLS and should ONLY be used in:
// - API routes (server-side only)
// - Webhook handlers
// - Admin operations that need to bypass RLS
// NEVER expose or use this on the client side

let serviceClient: ReturnType<typeof createClient<Database>> | null = null

export function createServiceClient() {
  if (serviceClient) return serviceClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role credentials')
  }

  serviceClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return serviceClient
}
