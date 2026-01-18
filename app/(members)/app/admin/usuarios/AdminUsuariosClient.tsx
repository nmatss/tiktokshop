'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  name: string | null
  email: string | null
  role: string
  created_at: string
  entitlements: {
    id: string
    status: string
    expires_at: string | null
    course: {
      title: string
    } | null
  }[]
}

export function AdminUsuariosClient() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'admin' | 'with_access' | 'without_access'>('all')
  const supabase = createClient()

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadUsers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        email,
        role,
        created_at,
        entitlements (
          id,
          status,
          expires_at,
          course:courses (
            title
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading users:', error)
      alert('Erro ao carregar usuários')
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  async function toggleAdmin(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    const confirmMsg = newRole === 'admin'
      ? 'Deseja tornar este usuário ADMINISTRADOR?'
      : 'Deseja REMOVER as permissões de administrador deste usuário?'

    if (!confirm(confirmMsg)) return

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      console.error('Error updating role:', error)
      alert('Erro ao atualizar permissão')
    } else {
      loadUsers()
    }
  }

  async function grantAccess(userId: string) {
    // Get default course
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'tiktok-shop-do-zero')
      .single()

    if (!course) {
      alert('Curso não encontrado')
      return
    }

    const { error } = await supabase
      .from('entitlements')
      .upsert({
        user_id: userId,
        course_id: course.id,
        status: 'active',
        activated_at: new Date().toISOString(),
        expires_at: null, // Lifetime access
      })

    if (error) {
      console.error('Error granting access:', error)
      alert('Erro ao conceder acesso')
    } else {
      loadUsers()
    }
  }

  async function revokeAccess(entitlementId: string) {
    if (!confirm('Deseja REVOGAR o acesso deste usuário ao curso?')) return

    const { error } = await supabase
      .from('entitlements')
      .update({ status: 'inactive' })
      .eq('id', entitlementId)

    if (error) {
      console.error('Error revoking access:', error)
      alert('Erro ao revogar acesso')
    } else {
      loadUsers()
    }
  }

  const filteredUsers = users.filter((user) => {
    // Search filter
    const searchLower = search.toLowerCase()
    const matchesSearch =
      !search ||
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)

    // Status filter
    const hasActiveAccess = user.entitlements?.some((e) => e.status === 'active')

    switch (filter) {
      case 'admin':
        return matchesSearch && user.role === 'admin'
      case 'with_access':
        return matchesSearch && hasActiveAccess
      case 'without_access':
        return matchesSearch && !hasActiveAccess
      default:
        return matchesSearch
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
        >
          <option value="all">Todos os usuários</option>
          <option value="admin">Administradores</option>
          <option value="with_access">Com acesso ao curso</option>
          <option value="without_access">Sem acesso ao curso</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <p className="text-2xl font-bold text-white">{users.length}</p>
          <p className="text-sm text-dark-400">Total de usuários</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <p className="text-2xl font-bold text-primary-400">
            {users.filter((u) => u.role === 'admin').length}
          </p>
          <p className="text-sm text-dark-400">Administradores</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <p className="text-2xl font-bold text-green-400">
            {users.filter((u) => u.entitlements?.some((e) => e.status === 'active')).length}
          </p>
          <p className="text-sm text-dark-400">Com acesso ativo</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <p className="text-2xl font-bold text-yellow-400">
            {users.filter((u) => !u.entitlements?.some((e) => e.status === 'active')).length}
          </p>
          <p className="text-sm text-dark-400">Sem acesso</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-300">
                  Usuário
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-300">
                  Tipo
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-300">
                  Acesso ao Curso
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-300">
                  Cadastro
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-dark-300">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filteredUsers.map((user) => {
                const activeEntitlement = user.entitlements?.find(
                  (e) => e.status === 'active'
                )

                return (
                  <tr key={user.id} className="hover:bg-dark-750">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">
                          {user.name || 'Sem nome'}
                        </p>
                        <p className="text-sm text-dark-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="px-2 py-1 text-xs font-medium bg-primary-500/20 text-primary-400 rounded">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-dark-700 text-dark-300 rounded">
                          Usuário
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {activeEntitlement ? (
                        <div>
                          <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded">
                            Ativo
                          </span>
                          <p className="text-xs text-dark-500 mt-1">
                            {activeEntitlement.expires_at
                              ? `Expira em ${new Date(activeEntitlement.expires_at).toLocaleDateString('pt-BR')}`
                              : 'Vitalício'}
                          </p>
                        </div>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded">
                          Sem acesso
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-400">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleAdmin(user.id, user.role)}
                          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                            user.role === 'admin'
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30'
                          }`}
                          title={user.role === 'admin' ? 'Remover admin' : 'Tornar admin'}
                        >
                          {user.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                        </button>

                        {activeEntitlement ? (
                          <button
                            onClick={() => revokeAccess(activeEntitlement.id)}
                            className="px-3 py-1.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded transition-colors"
                          >
                            Revogar Acesso
                          </button>
                        ) : (
                          <button
                            onClick={() => grantAccess(user.id)}
                            className="px-3 py-1.5 text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded transition-colors"
                          >
                            Conceder Acesso
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-dark-400">
            Nenhum usuário encontrado
          </div>
        )}
      </div>
    </div>
  )
}
