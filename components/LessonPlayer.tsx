'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LessonPlayerProps {
  lessonId: string
  videoProvider: 'youtube' | 'vimeo' | 'bunny'
  videoUrl: string
  title: string
  initialProgress?: number
  onComplete?: () => void
}

export function LessonPlayer({
  lessonId,
  videoProvider,
  videoUrl,
  title,
  initialProgress = 0,
  onComplete,
}: LessonPlayerProps) {
  const lastSavedProgress = useRef(initialProgress)
  const progressInterval = useRef<NodeJS.Timeout>()
  const supabase = createClient()

  // Extract video ID based on provider
  const getEmbedUrl = useCallback(() => {
    switch (videoProvider) {
      case 'youtube': {
        // Handle various YouTube URL formats
        const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s?]+)/)
        const videoId = ytMatch ? ytMatch[1] : videoUrl
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`
      }
      case 'vimeo': {
        const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)
        const videoId = vimeoMatch ? vimeoMatch[1] : videoUrl
        return `https://player.vimeo.com/video/${videoId}?dnt=1`
      }
      case 'bunny': {
        // Bunny Stream embed URL
        return videoUrl.includes('iframe') ? videoUrl : `https://iframe.mediadelivery.net/embed/${videoUrl}`
      }
      default:
        return videoUrl
    }
  }, [videoProvider, videoUrl])

  // Save progress to database
  const saveProgress = useCallback(async (watchedSeconds: number, completed: boolean = false) => {
    // Only save if progress changed significantly (every 10 seconds)
    if (!completed && Math.abs(watchedSeconds - lastSavedProgress.current) < 10) {
      return
    }

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert(
          {
            lesson_id: lessonId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            watched_seconds: Math.floor(watchedSeconds),
            completed,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,lesson_id',
          }
        )

      if (!error) {
        lastSavedProgress.current = watchedSeconds
        if (completed && onComplete) {
          onComplete()
        }
      }
    } catch (err) {
      console.error('Error saving progress:', err)
    }
  }, [lessonId, supabase, onComplete])

  // Setup progress tracking (simplified - real implementation would use postMessage API)
  useEffect(() => {
    // For MVP, save progress every 30 seconds
    progressInterval.current = setInterval(() => {
      // In a full implementation, you'd get actual time from the video player
      // For now, increment by 30 seconds as a placeholder
      lastSavedProgress.current += 30
      saveProgress(lastSavedProgress.current)
    }, 30000)

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      // Save final progress on unmount
      saveProgress(lastSavedProgress.current)
    }
  }, [saveProgress])

  const embedUrl = getEmbedUrl()

  return (
    <div className="w-full">
      <div className="relative w-full pt-[56.25%] bg-dark-900 rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-900">{title}</h1>
        <button
          onClick={() => saveProgress(lastSavedProgress.current, true)}
          className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Marcar como concluída
        </button>
      </div>
    </div>
  )
}
