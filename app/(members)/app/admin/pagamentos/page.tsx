import { requireAdmin } from '@/lib/auth'
import { AdminPagamentosClient } from './AdminPagamentosClient'

export default async function AdminPagamentosPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Pagamentos</h1>
          <p className="text-dark-400 mt-1">
            Visualize e gerencie todos os pagamentos da plataforma
          </p>
        </div>
      </div>

      <AdminPagamentosClient />
    </div>
  )
}
