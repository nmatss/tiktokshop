'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error.message)
      }
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      // Always redirect to login, even if logout partially fails
      router.push('/login')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className={className || "mt-3 w-full text-left text-sm text-dark-400 hover:text-red-400 transition-colors"}
    >
      Sair
    </button>
  )
}
