'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/app'

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email ou senha incorretos'
        : error.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/app`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage('Verifique seu email para confirmar o cadastro.')
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/app/conta`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage('Enviamos um link de recuperação para seu email.')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-dark-900 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <span className="font-bold text-3xl text-white">
              TikTok Shop<span className="text-primary-500">Pro</span>
            </span>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {mode === 'login' && 'Bem-vindo de volta!'}
              {mode === 'register' && 'Crie sua conta'}
              {mode === 'forgot' && 'Recuperar senha'}
            </h1>
            <p className="text-gray-400">
              {mode === 'login' && 'Entre para acessar suas aulas e continuar aprendendo.'}
              {mode === 'register' && 'Preencha os dados para começar sua jornada.'}
              {mode === 'forgot' && 'Digite seu email para receber o link de recuperação.'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {message}
            </div>
          )}

          {/* Forms */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  className="w-full px-4 py-3.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); setMessage(''); }}
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium text-white text-lg py-4 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Entrando...
                  </span>
                ) : 'Entrar'}
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium text-white text-lg py-4 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Criando conta...
                  </span>
                ) : 'Criar Conta'}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium text-white text-lg py-4 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </span>
                ) : 'Enviar Link de Recuperação'}
              </button>
            </form>
          )}

          {/* Toggle modes */}
          <div className="mt-8 text-center">
            {mode === 'login' && (
              <p className="text-gray-400">
                Não tem conta?{' '}
                <button
                  onClick={() => { setMode('register'); setError(''); setMessage(''); }}
                  className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                >
                  Cadastre-se grátis
                </button>
              </p>
            )}
            {mode === 'register' && (
              <p className="text-gray-400">
                Já tem conta?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                  className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                >
                  Fazer login
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <button
                onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
              >
                ← Voltar para login
              </button>
            )}
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-dark-900">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)"/>
            </svg>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          {/* Stats */}
          <div className="mb-12">
            <div className="flex -space-x-3 justify-center mb-4">
              {[1, 3, 5, 8, 9, 11].map((i) => (
                <Image
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i}`}
                  alt="Aluno"
                  width={48}
                  height={48}
                  className="rounded-full border-3 border-primary-600"
                />
              ))}
            </div>
            <p className="text-white/90 text-lg">
              <span className="font-bold">+2.547 alunos</span> já estão transformando suas vidas
            </p>
          </div>

          {/* Quote */}
          <blockquote className="max-w-md">
            <p className="text-2xl text-white font-medium leading-relaxed mb-6">
              "Em 30 dias saí de zero para R$ 8.000 no mês. O método realmente funciona!"
            </p>
            <footer className="flex items-center justify-center gap-4">
              <Image
                src="https://i.pravatar.cc/100?img=3"
                alt="Carlos Eduardo"
                width={56}
                height={56}
                className="rounded-full border-2 border-white/30"
              />
              <div className="text-left">
                <p className="text-white font-semibold">Carlos Eduardo</p>
                <p className="text-white/70 text-sm">Estudante de Marketing</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </footer>
          </blockquote>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white/80 text-sm">50+ aulas</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-white/80 text-sm">Comunidade VIP</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-white/80 text-sm">Garantia 7 dias</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
