'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Payment {
  id: string
  asaas_payment_id: string
  status: string
  value_cents: number
  billing_type: string
  created_at: string
  user: {
    name: string | null
    email: string | null
  } | null
  course: {
    title: string
  } | null
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'yellow' },
  confirmed: { label: 'Confirmado', color: 'green' },
  received: { label: 'Recebido', color: 'green' },
  overdue: { label: 'Vencido', color: 'red' },
  refunded: { label: 'Reembolsado', color: 'purple' },
  canceled: { label: 'Cancelado', color: 'gray' },
}

const BILLING_LABELS: Record<string, string> = {
  PIX: 'PIX',
  BOLETO: 'Boleto',
  CREDIT_CARD: 'Cartão',
}

export function AdminPagamentosClient() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadPayments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('payments')
      .select(`
        id,
        asaas_payment_id,
        status,
        value_cents,
        billing_type,
        created_at,
        user:profiles (
          name,
          email
        ),
        course:courses (
          title
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading payments:', error)
      alert('Erro ao carregar pagamentos')
    } else {
      setPayments(data || [])
    }
    setLoading(false)
  }

  async function confirmPayment(paymentId: string, userId: string) {
    if (!confirm('Deseja CONFIRMAR este pagamento manualmente? O usuário terá acesso ao curso.')) {
      return
    }

    // Update payment status
    const { error: paymentError } = await supabase
      .from('payments')
      .update({ status: 'confirmed' })
      .eq('id', paymentId)

    if (paymentError) {
      console.error('Error confirming payment:', paymentError)
      alert('Erro ao confirmar pagamento')
      return
    }

    // Get course ID
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'tiktok-shop-do-zero')
      .single()

    if (course) {
      // Create entitlement
      await supabase.from('entitlements').upsert({
        user_id: userId,
        course_id: course.id,
        status: 'active',
        activated_at: new Date().toISOString(),
        expires_at: null,
      })
    }

    loadPayments()
  }

  const filteredPayments = payments.filter((payment) => {
    // Search filter
    const searchLower = search.toLowerCase()
    const matchesSearch =
      !search ||
      payment.user?.name?.toLowerCase().includes(searchLower) ||
      payment.user?.email?.toLowerCase().includes(searchLower) ||
      payment.asaas_payment_id.toLowerCase().includes(searchLower)

    // Status filter
    if (filter === 'all') return matchesSearch
    return matchesSearch && payment.status === filter
  })

  const totalRevenue = payments
    .filter((p) => p.status === 'confirmed' || p.status === 'received')
    .reduce((sum, p) => sum + p.value_cents, 0)

  const pendingRevenue = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.value_cents, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <p className="text-2xl font-bold text-white">{payments.length}</p>
          <p className="text-sm text-dark-400">Total de pagamentos</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <p className="text-2xl font-bold text-green-400">
            {payments.filter((p) => p.status === 'confirmed' || p.status === 'received').length}
          </p>
          <p className="text-sm text-dark-400">Confirmados</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <p className="text-2xl font-bold text-green-400">
            R$ {(totalRevenue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-dark-400">Receita total</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <p className="text-2xl font-bold text-yellow-400">
            R$ {(pendingRevenue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-dark-400">Pendente</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nome, email ou ID do pagamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendentes</option>
          <option value="confirmed">Confirmados</option>
          <option value="received">Recebidos</option>
          <option value="overdue">Vencidos</option>
          <option value="refunded">Reembolsados</option>
          <option value="canceled">Cancelados</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-300">
                  Cliente
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-300">
                  Valor
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-300">
                  Método
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-300">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-300">
                  Data
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-dark-300">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filteredPayments.map((payment) => {
                const statusInfo = STATUS_LABELS[payment.status] || {
                  label: payment.status,
                  color: 'gray',
                }

                return (
                  <tr key={payment.id} className="hover:bg-dark-750">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">
                          {payment.user?.name || 'Sem nome'}
                        </p>
                        <p className="text-sm text-dark-400">{payment.user?.email}</p>
                        <p className="text-xs text-dark-500 mt-1 font-mono">
                          {payment.asaas_payment_id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">
                        R$ {(payment.value_cents / 100).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-dark-700 text-dark-300 rounded">
                        {BILLING_LABELS[payment.billing_type] || payment.billing_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded bg-${statusInfo.color}-500/20 text-${statusInfo.color}-400`}
                        style={{
                          backgroundColor: `rgb(var(--${statusInfo.color}-500) / 0.2)`,
                          color: `rgb(var(--${statusInfo.color}-400))`,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-400">
                      {new Date(payment.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => {
                              // Get user_id from the profiles relation
                              const { data } = supabase
                                .from('payments')
                                .select('user_id')
                                .eq('id', payment.id)
                                .single()
                                .then(({ data }) => {
                                  if (data) {
                                    confirmPayment(payment.id, data.user_id)
                                  }
                                })
                            }}
                            className="px-3 py-1.5 text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded transition-colors"
                          >
                            Confirmar Manual
                          </button>
                        )}
                        <a
                          href={`https://sandbox.asaas.com/payments/${payment.asaas_payment_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs font-medium bg-dark-700 text-dark-300 hover:bg-dark-600 rounded transition-colors"
                        >
                          Ver no Asaas
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-dark-400">
            Nenhum pagamento encontrado
          </div>
        )}
      </div>
    </div>
  )
}
