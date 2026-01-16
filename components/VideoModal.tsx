'use client'

import { useState, useEffect, useCallback } from 'react'

interface VideoModalProps {
  videoId?: string
  thumbnailText?: string
  thumbnailSubtext?: string
}

export function VideoModal({
  videoId = 'dQw4w9WgXcQ',
  thumbnailText = 'Assista a apresentacao',
  thumbnailSubtext = '3 minutos',
}: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeModal])

  return (
    <>
      {/* Thumbnail/Trigger */}
      <div className="relative aspect-video bg-dark-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
          <button
            onClick={openModal}
            className="text-center group"
            aria-label="Abrir video de apresentacao"
          >
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer group-hover:scale-110 transition-transform pulse-glow">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <p className="text-white font-semibold">{thumbnailText}</p>
            <p className="text-gray-400 text-sm">{thumbnailSubtext}</p>
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Video de apresentacao"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90"
            onClick={closeModal}
          />

          {/* Content */}
          <div className="relative w-full max-w-4xl animate-scale-in">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors p-2"
              aria-label="Fechar video"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video container */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Video de apresentacao"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
