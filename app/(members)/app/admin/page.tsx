import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminPage() {
  await requireAdmin()
  const supabase = await createClient()

  // Get stats
  const [
    { count: totalUsers },
    { count: totalEntitlements },
    { count: activeEntitlements },
    { count: totalPayments },
    { count: totalModules },
    { count: totalLessons },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('entitlements').select('*', { count: 'exact', head: true }),
    supabase.from('entitlements').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('payments').select('*', { count: 'exact', head: true }),
    supabase.from('modules').select('*', { count: 'exact', head: true }),
    supabase.from('lessons').select('*', { count: 'exact', head: true }),
  ])

  // Get recent payments
  const { data: recentPayments } = await supabase
    .from('payments')
    .select(`
      *,
      profile:profiles(name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  const conversionRate = totalUsers && totalUsers > 0
    ? Math.round(((activeEntitlements || 0) / totalUsers) * 100)
    : 0

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Painel Administrativo</h1>
        <p className="text-gray-400">Visão geral da plataforma e métricas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total de Usuários</p>
              <p className="text-3xl font-bold text-white">{totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Acessos Ativos</p>
              <p className="text-3xl font-bold text-green-400">{activeEntitlements || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total de Pagamentos</p>
              <p className="text-3xl font-bold text-white">{totalPayments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Módulos</p>
              <p className="text-3xl font-bold text-white">{totalModules || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Aulas</p>
              <p className="text-3xl font-bold text-white">{totalLessons || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-500/20 to-orange-500/20 rounded-2xl p-6 border border-primary-500/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-500/30 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Taxa de Conversão</p>
              <p className="text-3xl font-bold text-primary-400">{conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/app/admin/modulos"
          className="bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-blue-500/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Gerenciar Módulos</h3>
              <p className="text-sm text-gray-400">Criar, editar e ordenar módulos</p>
            </div>
          </div>
        </Link>

        <Link
          href="/app/admin/aulas"
          className="bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Gerenciar Aulas</h3>
              <p className="text-sm text-gray-400">Adicionar e editar aulas</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Payments */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
        <div className="p-6 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Pagamentos Recentes
          </h2>
        </div>

        {recentPayments && recentPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-dark-700">
                  <th className="px-6 py-4 font-medium text-gray-400">Usuário</th>
                  <th className="px-6 py-4 font-medium text-gray-400">Valor</th>
                  <th className="px-6 py-4 font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 font-medium text-gray-400">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {payment.profile?.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {payment.profile?.name || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {payment.profile?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">
                        R$ {(payment.value_cents / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full
                          ${payment.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-400'
                            : payment.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'}
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          payment.status === 'confirmed' ? 'bg-green-400' :
                          payment.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`} />
                        {payment.status === 'confirmed' ? 'Confirmado' :
                         payment.status === 'pending' ? 'Pendente' : payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400">Nenhum pagamento registrado ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
