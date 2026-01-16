import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // Get user's entitlements
  const { data: entitlements } = await supabase
    .from('entitlements')
    .select(`*, course:courses(title, slug)`)
    .eq('user_id', user.id)

  // Get lesson progress
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('*, lesson:lessons(title, slug, module:modules(title))')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(5)

  const hasActiveEntitlement = entitlements?.some(e =>
    e.status === 'active' && (!e.expires_at || new Date(e.expires_at) > new Date())
  )

  // Get total lessons count and completed count
  let totalLessons = 0
  let completedLessons = 0

  if (hasActiveEntitlement) {
    const { count: total } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })

    const { count: completed } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true)

    totalLessons = total || 0
    completedLessons = completed || 0
  }

  const progressPercentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0

  const firstName = user.profile?.name?.split(' ')[0] || 'Aluno'

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Olá, {firstName}! 👋
          </h1>
          <p className="text-dark-400">
            Bem-vindo de volta. Continue de onde parou.
          </p>
        </div>
        {hasActiveEntitlement && (
          <Link
            href="/app/aulas"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Continuar Assistindo
          </Link>
        )}
      </div>

      {!hasActiveEntitlement ? (
        // No active entitlement
        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Acesso não liberado
          </h2>
          <p className="text-dark-400 mb-8 max-w-md mx-auto">
            Você ainda não tem acesso ao curso. Adquira agora e comece a transformar seu TikTok em uma máquina de vendas.
          </p>
          <Link
            href="/checkout"
            className="inline-block btn-premium text-white px-8 py-4"
          >
            Adquirir Acesso ao Curso
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Progress Card */}
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-white">{progressPercentage}%</span>
              </div>
              <p className="text-sm text-dark-400 mb-3">Progresso Geral</p>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Completed Lessons */}
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-white">{completedLessons}</span>
              </div>
              <p className="text-sm text-dark-400">Aulas Concluídas</p>
              <p className="text-xs text-dark-500 mt-1">de {totalLessons} disponíveis</p>
            </div>

            {/* Remaining */}
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-white">{totalLessons - completedLessons}</span>
              </div>
              <p className="text-sm text-dark-400">Aulas Restantes</p>
              <p className="text-xs text-dark-500 mt-1">para completar</p>
            </div>

            {/* Status */}
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full">
                  Ativo
                </span>
              </div>
              <p className="text-sm text-dark-400">Status do Acesso</p>
              <p className="text-xs text-dark-500 mt-1">Vitalício</p>
            </div>
          </div>

          {/* Continue Watching */}
          {progress && progress.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  Continuar assistindo
                </h2>
                <Link href="/app/aulas" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  Ver todas →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {progress.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/app/aulas/${item.lesson?.slug}`}
                    className="group bg-dark-800 rounded-2xl border border-dark-700 p-5 hover:border-primary-500/50 hover:bg-dark-750 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-primary-500/30 group-hover:to-orange-500/30 transition-colors">
                        <svg className="w-7 h-7 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-dark-500 mb-1 truncate">
                          {item.lesson?.module?.title}
                        </p>
                        <h3 className="font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                          {item.lesson?.title}
                        </h3>
                        <p className="text-sm text-dark-400 mt-1">
                          {item.completed ? (
                            <span className="text-green-400">✓ Concluída</span>
                          ) : (
                            `${Math.floor(item.watched_seconds / 60)} min assistidos`
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Ações rápidas
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/app/aulas"
                className="group bg-dark-800 rounded-2xl border border-dark-700 p-5 hover:border-blue-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">Ver Aulas</h3>
                <p className="text-sm text-dark-400">Acessar todo o conteúdo</p>
              </Link>

              <Link
                href="/app/conta"
                className="group bg-dark-800 rounded-2xl border border-dark-700 p-5 hover:border-purple-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">Minha Conta</h3>
                <p className="text-sm text-dark-400">Editar perfil e senha</p>
              </Link>

              <Link
                href="/app/suporte"
                className="group bg-dark-800 rounded-2xl border border-dark-700 p-5 hover:border-amber-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">Suporte</h3>
                <p className="text-sm text-dark-400">Tire suas dúvidas</p>
              </Link>

              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-dark-800 rounded-2xl border border-dark-700 p-5 hover:border-green-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">Comunidade VIP</h3>
                <p className="text-sm text-dark-400">Grupo do WhatsApp</p>
              </a>
            </div>
          </div>

          {/* Motivational Banner */}
          <div className="bg-gradient-to-r from-primary-600 to-orange-500 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Continue sua jornada! 🚀
                </h3>
                <p className="text-white/80">
                  Você está no caminho certo. Cada aula assistida te aproxima mais do seu objetivo de faturar no TikTok Shop.
                </p>
              </div>
              <Link
                href="/app/aulas"
                className="flex-shrink-0 bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
              >
                Ir para as Aulas
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
