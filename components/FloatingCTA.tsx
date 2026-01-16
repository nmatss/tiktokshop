'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FloatingCTAProps {
  price?: string
  originalPrice?: string
  ctaText?: string
  ctaHref?: string
  showAfterScroll?: number
}

export function FloatingCTA({
  price = 'R$ 297',
  originalPrice = 'R$ 997',
  ctaText = 'GARANTIR MINHA VAGA',
  ctaHref = '/checkout',
  showAfterScroll = 600,
}: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const shouldShow = scrollY > showAfterScroll

      if (shouldShow && !isVisible && !isClosing) {
        setIsVisible(true)
      } else if (!shouldShow && isVisible) {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll, isVisible, isClosing])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in-up">
      <div className="bg-dark-900/95 backdrop-blur-lg border-t border-dark-700 shadow-2xl">
        <div className="container-wide py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Price info - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 line-through text-sm">{originalPrice}</span>
                <span className="text-2xl font-bold text-gradient">{price}</span>
              </div>
              <div className="h-8 w-px bg-dark-700" />
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Garantia de 7 dias
              </div>
            </div>

            {/* Mobile: simpler view */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-gray-500 line-through text-xs">{originalPrice}</span>
              <span className="text-xl font-bold text-gradient">{price}</span>
            </div>

            {/* CTA Button */}
            <Link
              href={ctaHref}
              className="btn-premium text-white text-sm sm:text-base whitespace-nowrap pulse-glow"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <a
      href="https://wa.me/5511999999999?text=Olá! Tenho interesse no curso TikTok Shop"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors animate-scale-in hover:scale-110"
    >
      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}
