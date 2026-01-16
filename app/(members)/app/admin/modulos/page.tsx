'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Module {
  id: string
  title: string
  order: number
  course_id: string
  _count?: { lessons: number }
}

export default function AdminModulosPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [courseId, setCourseId] = useState<string>('')
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [newModule, setNewModule] = useState({ title: '', order: 0 })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

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
      setCourseId(course.id)

      // Get modules with lesson count
      const { data: modulesData } = await supabase
        .from('modules')
        .select(`
          *,
          lessons(id)
        `)
        .eq('course_id', course.id)
        .order('order', { ascending: true })

      const modulesWithCount = modulesData?.map(m => ({
        ...m,
        _count: { lessons: m.lessons?.length || 0 },
      })) || []

      setModules(modulesWithCount)
    }

    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)

    if (editingModule) {
      // Update
      await supabase
        .from('modules')
        .update({
          title: editingModule.title,
          order: editingModule.order,
        })
        .eq('id', editingModule.id)
    } else {
      // Create
      await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          title: newModule.title,
          order: newModule.order || modules.length + 1,
        })
    }

    setShowForm(false)
    setEditingModule(null)
    setNewModule({ title: '', order: 0 })
    setSaving(false)
    loadData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza? Todas as aulas deste módulo serão excluídas.')) {
      return
    }

    await supabase.from('modules').delete().eq('id', id)
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
          <h1 className="text-2xl font-bold text-white mb-2">Módulos</h1>
          <p className="text-gray-400">Gerencie os módulos do curso</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-orange-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-orange-600 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Módulo
        </button>
      </div>

      {/* Form Modal */}
      {(showForm || editingModule) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md border border-dark-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </span>
              {editingModule ? 'Editar Módulo' : 'Novo Módulo'}
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Nome do módulo"
                  value={editingModule?.title || newModule.title}
                  onChange={(e) =>
                    editingModule
                      ? setEditingModule({ ...editingModule, title: e.target.value })
                      : setNewModule({ ...newModule, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ordem
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="1"
                  value={editingModule?.order || newModule.order}
                  onChange={(e) =>
                    editingModule
                      ? setEditingModule({ ...editingModule, order: parseInt(e.target.value) })
                      : setNewModule({ ...newModule, order: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingModule(null)
                }}
                className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-gray-300 hover:bg-dark-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-orange-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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

      {/* Modules List */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
        {modules.length > 0 ? (
          <div className="divide-y divide-dark-700">
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-5 hover:bg-dark-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-primary-500/20 text-primary-400 rounded-lg flex items-center justify-center font-bold">
                    {module.order}
                  </span>
                  <div>
                    <h3 className="font-medium text-white">{module.title}</h3>
                    <p className="text-sm text-gray-400">
                      {module._count?.lessons || 0} aulas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingModule(module)}
                    className="p-2.5 text-gray-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(module.id)}
                    className="p-2.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-gray-400 mb-4">Nenhum módulo cadastrado.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-primary-400 hover:text-primary-300 font-medium"
            >
              Criar primeiro módulo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
