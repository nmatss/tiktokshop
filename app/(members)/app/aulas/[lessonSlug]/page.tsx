import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireEntitlement } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { LessonPlayer } from '@/components/LessonPlayer'
import { ModuleList } from '@/components/ModuleList'

interface Props {
  params: Promise<{ lessonSlug: string }>
}

export default async function LessonPage({ params }: Props) {
  const { lessonSlug } = await params
  const user = await requireEntitlement()
  const supabase = await createClient()

  // Get lesson with only needed columns
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select(`
      id,
      slug,
      title,
      video_provider,
      video_url,
      duration_sec,
      module:modules(
        id,
        title,
        course:courses(id, slug, title)
      )
    `)
    .eq('slug', lessonSlug)
    .single()

  if (lessonError && lessonError.code !== 'PGRST116') {
    console.error('Error fetching lesson:', lessonError.message)
  }

  if (!lesson) {
    notFound()
  }

  // Batch fetch progress, modules, and all user progress in parallel
  const [progressResult, modulesResult, allProgressResult] = await Promise.all([
    // Get user's progress for this lesson
    supabase
      .from('lesson_progress')
      .select('id, watched_seconds, completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .single(),
    // Get all modules with lessons for sidebar
    supabase
      .from('modules')
      .select(`
        id,
        title,
        "order",
        lessons(id, slug, title, "order", duration_sec)
      `)
      .eq('course_id', lesson.module.course.id)
      .order('order', { ascending: true }),
    // Get all user progress
    supabase
      .from('lesson_progress')
      .select('id, lesson_id, completed, watched_seconds')
      .eq('user_id', user.id),
  ])

  // Handle errors gracefully (PGRST116 = no rows found, which is expected)
  if (progressResult.error && progressResult.error.code !== 'PGRST116') {
    console.error('Error fetching progress:', progressResult.error.message)
  }
  if (modulesResult.error) {
    console.error('Error fetching modules:', modulesResult.error.message)
  }
  if (allProgressResult.error) {
    console.error('Error fetching all progress:', allProgressResult.error.message)
  }

  const progress = progressResult.data
  const modules = modulesResult.data
  const allProgress = allProgressResult.data

  const progressMap = new Map(
    allProgress?.map(p => [p.lesson_id, p]) || []
  )

  const modulesWithProgress = modules?.map(module => ({
    ...module,
    lessons: module.lessons
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
      .map((l: { id: string }) => ({
        ...l,
        progress: progressMap.get(l.id) || null,
      })),
  })) || []

  // Find next/previous lessons
  const allLessons = modulesWithProgress.flatMap(m => m.lessons)
  const currentIndex = allLessons.findIndex((l: { slug: string }) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <div className="fade-in">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link href="/app/aulas" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar às aulas
            </Link>
          </nav>

          {/* Lesson Title */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-full mb-2">
              {lesson.module.title}
            </span>
            <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
          </div>

          {/* Video Player */}
          <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 mb-6">
            <LessonPlayer
              lessonId={lesson.id}
              videoProvider={lesson.video_provider}
              videoUrl={lesson.video_url}
              title={lesson.title}
              initialProgress={progress?.watched_seconds || 0}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-4 bg-dark-800 rounded-xl border border-dark-700 mb-6">
            {prevLesson ? (
              <Link
                href={`/app/aulas/${prevLesson.slug}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center group-hover:bg-dark-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Anterior</p>
                  <p className="text-sm font-medium truncate max-w-[120px] sm:max-w-[180px]">{prevLesson.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/app/aulas/${nextLesson.slug}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="text-right">
                  <p className="text-xs text-gray-500">Próxima</p>
                  <p className="text-sm font-medium truncate max-w-[120px] sm:max-w-[180px]">{nextLesson.title}</p>
                </div>
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Última aula!</span>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sobre esta aula
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <span className="text-gray-400">Módulo: <span className="text-white">{lesson.module.title}</span></span>
              </div>
              {lesson.duration_sec && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-400">Duração: <span className="text-white">{Math.floor(lesson.duration_sec / 60)} minutos</span></span>
                </div>
              )}
              {progress?.completed && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-green-400 font-medium">Aula concluída</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Module List */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="sticky top-4">
            <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
              <div className="p-4 border-b border-dark-700">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Conteúdo do Curso
                </h2>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4">
                <ModuleList
                  modules={modulesWithProgress}
                  currentLessonSlug={lessonSlug}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
