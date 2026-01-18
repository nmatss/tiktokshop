import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Tables } from '@/lib/database.types'

export type Profile = Tables<'profiles'>
export type Entitlement = Tables<'entitlements'>

export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
  hasActiveEntitlement: boolean
  isAdmin: boolean
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Session error:', error.message)
    return null
  }

  return session
}

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Batch fetch profile and entitlements in parallel to avoid N+1 queries
  const [profileResult, entitlementsResult] = await Promise.all([
    // Get profile with only needed columns
    supabase
      .from('profiles')
      .select('id, name, email, role, created_at')
      .eq('id', user.id)
      .single(),
    // Check for active entitlement with only needed columns
    supabase
      .from('entitlements')
      .select('id, status, expires_at')
      .eq('user_id', user.id)
      .eq('status', 'active'),
  ])

  // Handle errors gracefully
  if (profileResult.error && profileResult.error.code !== 'PGRST116') {
    console.error('Error fetching profile:', profileResult.error.message)
  }
  if (entitlementsResult.error) {
    console.error('Error fetching entitlements:', entitlementsResult.error.message)
  }

  const profile = profileResult.data
  const entitlements = entitlementsResult.data

  const hasActiveEntitlement = entitlements && entitlements.length > 0 &&
    entitlements.some(e => !e.expires_at || new Date(e.expires_at) > new Date())

  return {
    id: user.id,
    email: user.email || '',
    profile,
    hasActiveEntitlement: !!hasActiveEntitlement,
    isAdmin: profile?.role === 'admin'
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

export async function requireEntitlement(): Promise<AuthUser> {
  const user = await requireAuth()

  if (!user.hasActiveEntitlement && !user.isAdmin) {
    redirect('/checkout')
  }

  return user
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth()

  if (!user.isAdmin) {
    redirect('/app')
  }

  return user
}

export async function getUserEntitlements(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('entitlements')
    .select(`
      id,
      status,
      activated_at,
      expires_at,
      created_at,
      course:courses(id, slug, title, description)
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching entitlements:', error.message)
    return []
  }

  return data
}
