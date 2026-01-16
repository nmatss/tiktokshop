'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ContaPage() {
  const [profile, setProfile] = useState<{
    name: string
    email: string
  }>({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setProfile({
          name: data?.name || '',
          email: user.email || '',
        })
      }

      setLoading(false)
    }

    loadProfile()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Usuário não autenticado')
      setSaving(false)
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name: profile.name })
      .eq('id', user.id)

    if (updateError) {
      setError('Erro ao atualizar perfil')
    } else {
      setMessage('Perfil atualizado com sucesso!')
    }

    setSaving(false)
  }

  const handlePasswordReset = async () => {
    setSaving(true)
    setMessage('')
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/app/conta`,
    })

    if (error) {
      setError('Erro ao enviar email de recuperação')
    } else {
      setMessage('Email de redefinição de senha enviado!')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="fade-in max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Minha Conta</h1>
        <p className="text-gray-400">Gerencie suas informações pessoais e segurança</p>
      </div>

      {/* Alerts */}
      {message && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-green-400">{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {/* Personal Data Card */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden mb-6">
        <div className="p-6 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            Dados Pessoais
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              placeholder="Seu nome"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-gray-500 cursor-not-allowed"
              value={profile.email}
              disabled
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              O email não pode ser alterado
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Salvar Alterações
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security Card */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden mb-6">
        <div className="p-6 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            Segurança
          </h2>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">Alterar senha</p>
                <p className="text-sm text-gray-400">
                  Enviaremos um link para redefinir sua senha
                </p>
              </div>
            </div>
            <button
              onClick={handlePasswordReset}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/20 rounded-lg transition-colors disabled:opacity-50"
            >
              Enviar link
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-dark-800 rounded-2xl border border-red-500/30 overflow-hidden">
        <div className="p-6 border-b border-red-500/20">
          <h2 className="text-lg font-semibold text-red-400 flex items-center gap-3">
            <span className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            Zona de Perigo
          </h2>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">Excluir conta</p>
                <p className="text-sm text-gray-400">
                  Esta ação é irreversível. Todos os seus dados serão apagados.
                </p>
              </div>
            </div>
            <button
              className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
              onClick={() => alert('Entre em contato com o suporte para excluir sua conta.')}
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
