import { requireAdmin } from '@/lib/auth'
import { AdminUsuariosClient } from './AdminUsuariosClient'

export default async function AdminUsuariosPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Usuários</h1>
          <p className="text-dark-400 mt-1">
            Visualize e gerencie os usuários da plataforma
          </p>
        </div>
      </div>

      <AdminUsuariosClient />
    </div>
  )
}
