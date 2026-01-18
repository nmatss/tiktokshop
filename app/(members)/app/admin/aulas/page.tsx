import { requireAdmin } from '@/lib/auth'
import { AdminAulasClient } from './AdminAulasClient'

export default async function AdminAulasPage() {
  // Server-side admin check - redirects to /app if not admin
  await requireAdmin()

  return <AdminAulasClient />
}
