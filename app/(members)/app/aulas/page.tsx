import { requireEntitlement } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ModuleList } from '@/components/ModuleList'

export default async function AulasPage() {
  const user = await requireEntitlement()
  const supabase = await createClient()

  // Get course with modules and lessons
  const courseSlug = process.env.COURSE_SLUG_DEFAULT || 'tiktok-shop-do-zero'

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', courseSlug)
    .single()

  if (!course) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Curso não encontrado</h1>
        <p className="text-gray-400">Entre em contato com o suporte</p>
      </div>
    )
  }

  // Get modules with lessons
  const { data: modules } = await supabase
    .from('modules')
    .select(`
      *,
      lessons(*)
    `)
    .eq('course_id', course.id)
    .order('order', { ascending: true })

  // Get user's lesson progress
  const { data: progressData } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', user.id)

  // Create progress map
  const progressMap = new Map(
    progressData?.map(p => [p.lesson_id, p]) || []
  )

  // Merge progress into modules
  const modulesWithProgress = modules?.map(module => ({
    ...module,
    lessons: module.lessons
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
      .map((lesson: { id: string }) => ({
        ...lesson,
        progress: progressMap.get(lesson.id) || null,
      })),
  })) || []

  // Calculate stats
  const totalLessons = modulesWithProgress.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = progressData?.filter(p => p.completed).length || 0
  const progressPercentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0

  // Calculate total duration
  const totalDurationMin = modulesWithProgress.reduce((acc, m) => {
    return acc + m.lessons.reduce((lessonAcc: number, l: { duration_sec?: number }) => {
      return lessonAcc + (l.duration_sec ? Math.floor(l.duration_sec / 60) : 0)
    }, 0)
  }, 0)

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
        <p className="text-gray-400">{course.description}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            </div>
            <span className="text-2xl font-bold text-white">{modulesWithProgress.length}</span>
          </div>
          <p className="text-sm text-gray-400">Módulos</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">{totalLessons}</span>
          </div>
          <p className="text-sm text-gray-400">Aulas</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-green-400">{completedLessons}</span>
          </div>
          <p className="text-sm text-gray-400">Concluídas</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">{totalDurationMin}min</span>
          </div>
          <p className="text-sm text-gray-400">De conteúdo</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-white">Seu Progresso</h2>
              <p className="text-sm text-gray-400">{completedLessons} de {totalLessons} aulas concluídas</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary-400">{progressPercentage}%</span>
        </div>
        <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {progressPercentage === 100 && (
          <p className="text-center text-green-400 font-medium mt-3 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Parabéns! Você concluiu o curso!
          </p>
        )}
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Conteúdo do Curso
        </h2>
        <ModuleList modules={modulesWithProgress} />
      </div>
    </div>
  )
}
