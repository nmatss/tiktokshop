import { requireAdmin } from '@/lib/auth'
import { AdminModulosClient } from './AdminModulosClient'

export default async function AdminModulosPage() {
  // Server-side admin check - redirects to /app if not admin
  await requireAdmin()

  return <AdminModulosClient />
}
