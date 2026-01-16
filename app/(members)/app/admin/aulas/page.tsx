'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Module {
  id: string
  title: string
  order: number
}

interface Lesson {
  id: string
  slug: string
  title: string
  order: number
  video_provider: 'youtube' | 'vimeo' | 'bunny'
  video_url: string
  duration_sec: number | null
  module_id: string
  module?: Module
}

export default function AdminAulasPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    module_id: '',
    order: 1,
    video_provider: 'youtube' as const,
    video_url: '',
    duration_sec: '',
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    // Get course
    const courseSlug = process.env.NEXT_PUBLIC_COURSE_SLUG_DEFAULT || 'tiktok-shop-do-zero'
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', courseSlug)
      .single()

    if (course) {
      // Get modules
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', course.id)
        .order('order', { ascending: true })

      setModules(modulesData || [])

      // Get lessons with module info
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select(`
          *,
          module:modules(*)
        `)
        .in('module_id', modulesData?.map(m => m.id) || [])
        .order('order', { ascending: true })

      setLessons(lessonsData || [])
    }

    setLoading(false)
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function openEditForm(lesson: Lesson) {
    setEditingLesson(lesson)
    setFormData({
      title: lesson.title,
      slug: lesson.slug,
      module_id: lesson.module_id,
      order: lesson.order,
      video_provider: lesson.video_provider,
      video_url: lesson.video_url,
      duration_sec: lesson.duration_sec?.toString() || '',
    })
    setShowForm(true)
  }

  function openNewForm() {
    setEditingLesson(null)
    setFormData({
      title: '',
      slug: '',
      module_id: modules[0]?.id || '',
      order: lessons.length + 1,
      video_provider: 'youtube',
      video_url: '',
      duration_sec: '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)

    const data = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      module_id: formData.module_id,
      order: formData.order,
      video_provider: formData.video_provider,
      video_url: formData.video_url,
      duration_sec: formData.duration_sec ? parseInt(formData.duration_sec) : null,
    }

    if (editingLesson) {
      await supabase
        .from('lessons')
        .update(data)
        .eq('id', editingLesson.id)
    } else {
      await supabase.from('lessons').insert(data)
    }

    setShowForm(false)
    setEditingLesson(null)
    setSaving(false)
    loadData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) {
      return
    }

    await supabase.from('lessons').delete().eq('id', id)
    loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Aulas</h1>
          <p className="text-gray-400">Gerencie as aulas do curso</p>
        </div>
        <button
          onClick={openNewForm}
          disabled={modules.length === 0}
          className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-orange-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Aula
        </button>
      </div>

      {modules.length === 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-yellow-400">
            Crie pelo menos um módulo antes de adicionar aulas.
          </p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-dark-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </span>
              {editingLesson ? 'Editar Aula' : 'Nova Aula'}
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Nome da aula"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: editingLesson ? formData.slug : generateSlug(e.target.value),
                    })
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="nome-da-aula"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Gerado automaticamente a partir do título
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Módulo *
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    value={formData.module_id}
                    onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                  >
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.order}. {module.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ordem
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Provedor de Vídeo *
                </label>
                <select
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  value={formData.video_provider}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      video_provider: e.target.value as 'youtube' | 'vimeo' | 'bunny',
                    })
                  }
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="bunny">Bunny Stream</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL do Vídeo *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Cole a URL completa do vídeo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duração (segundos)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="600"
                  value={formData.duration_sec}
                  onChange={(e) => setFormData({ ...formData, duration_sec: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingLesson(null)
                }}
                className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-gray-300 hover:bg-dark-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title || !formData.video_url}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lessons List grouped by module */}
      <div className="space-y-6">
        {modules.map((module) => {
          const moduleLessons = lessons.filter((l) => l.module_id === module.id)

          return (
            <div key={module.id} className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
              <div className="p-5 border-b border-dark-700 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary-500/20 text-primary-400 rounded-lg flex items-center justify-center font-bold text-sm">
                  {module.order}
                </span>
                <h3 className="font-semibold text-white">{module.title}</h3>
                <span className="text-sm text-gray-400">({moduleLessons.length} aulas)</span>
              </div>

              {moduleLessons.length > 0 ? (
                <div className="divide-y divide-dark-700">
                  {moduleLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 w-8 text-center font-medium">
                          {lesson.order}.
                        </span>
                        <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-white">{lesson.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-dark-600 rounded text-gray-400">
                              {lesson.video_provider}
                            </span>
                            <span>/{lesson.slug}</span>
                            {lesson.duration_sec && (
                              <span>{Math.floor(lesson.duration_sec / 60)} min</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditForm(lesson)}
                          className="p-2.5 text-gray-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(lesson.id)}
                          className="p-2.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">
                  Nenhuma aula neste módulo
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
