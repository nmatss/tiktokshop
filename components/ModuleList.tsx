'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Tables } from '@/lib/database.types'

type Module = Tables<'modules'> & {
  lessons: (Tables<'lessons'> & {
    progress?: Tables<'lesson_progress'> | null
  })[]
}

interface ModuleListProps {
  modules: Module[]
  currentLessonSlug?: string
}

export function ModuleList({ modules, currentLessonSlug }: ModuleListProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    // Expand module containing current lesson by default
    if (currentLessonSlug) {
      const moduleWithCurrentLesson = modules.find(m =>
        m.lessons.some(l => l.slug === currentLessonSlug)
      )
      if (moduleWithCurrentLesson) {
        return new Set([moduleWithCurrentLesson.id])
      }
    }
    // Expand first module by default
    return modules.length > 0 ? new Set([modules[0].id]) : new Set()
  })

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const getModuleProgress = (module: Module) => {
    const completedLessons = module.lessons.filter(l => l.progress?.completed).length
    const totalLessons = module.lessons.length
    return { completed: completedLessons, total: totalLessons }
  }

  return (
    <div className="space-y-3">
      {modules.map((module) => {
        const isExpanded = expandedModules.has(module.id)
        const progress = getModuleProgress(module)
        const isCompleted = progress.completed === progress.total && progress.total > 0

        return (
          <div
            key={module.id}
            className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors text-left"
              aria-expanded={isExpanded}
              aria-controls={`module-${module.id}-lessons`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold
                    ${isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-primary-500/20 text-primary-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    module.order
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-white">{module.title}</h3>
                  <p className="text-sm text-gray-400">
                    {progress.completed}/{progress.total} aulas concluidas
                  </p>
                </div>
              </div>

              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div id={`module-${module.id}-lessons`} className="border-t border-dark-700">
                {module.lessons.map((lesson) => {
                  const isCurrentLesson = lesson.slug === currentLessonSlug
                  const isLessonCompleted = lesson.progress?.completed

                  return (
                    <Link
                      key={lesson.id}
                      href={`/app/aulas/${lesson.slug}`}
                      className={`
                        flex items-center gap-3 p-4 transition-colors
                        ${isCurrentLesson
                          ? 'bg-primary-500/10 border-l-4 border-l-primary-500'
                          : 'hover:bg-dark-700/50 border-l-4 border-l-transparent'
                        }
                      `}
                    >
                      <div
                        className={`
                          w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs
                          ${isLessonCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrentLesson
                              ? 'bg-primary-500 text-white'
                              : 'bg-dark-600 text-gray-400'
                          }
                        `}
                      >
                        {isLessonCompleted ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : isCurrentLesson ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        ) : (
                          <span>{lesson.order}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${isCurrentLesson ? 'font-medium text-white' : 'text-gray-300'}`}>
                          {lesson.title}
                        </p>
                        {lesson.duration_sec && (
                          <p className="text-xs text-gray-500">
                            {Math.floor(lesson.duration_sec / 60)} min
                          </p>
                        )}
                      </div>

                      {isCurrentLesson && (
                        <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs font-medium rounded">
                          Atual
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
