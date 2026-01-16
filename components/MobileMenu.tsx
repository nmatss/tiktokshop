'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/app/(members)/LogoutButton'

interface MobileMenuProps {
  user: {
    email: string
    isAdmin: boolean
  }
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-dark-800 rounded-2xl shadow-xl border border-dark-700 py-2 z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-dark-700">
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-gray-400">Minha conta</p>
          </div>

          <nav className="py-2">
            <MenuLink href="/app" icon="home" onClick={() => setIsOpen(false)}>
              Dashboard
            </MenuLink>
            <MenuLink href="/app/aulas" icon="play" onClick={() => setIsOpen(false)}>
              Minhas Aulas
            </MenuLink>
            <MenuLink href="/app/conta" icon="user" onClick={() => setIsOpen(false)}>
              Minha Conta
            </MenuLink>
            <MenuLink href="/app/suporte" icon="help" onClick={() => setIsOpen(false)}>
              Suporte
            </MenuLink>

            {user.isAdmin && (
              <>
                <div className="my-2 border-t border-dark-700" />
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Administração
                </p>
                <MenuLink href="/app/admin" icon="dashboard" onClick={() => setIsOpen(false)}>
                  Painel Admin
                </MenuLink>
                <MenuLink href="/app/admin/modulos" icon="folder" onClick={() => setIsOpen(false)}>
                  Módulos
                </MenuLink>
                <MenuLink href="/app/admin/aulas" icon="video" onClick={() => setIsOpen(false)}>
                  Aulas
                </MenuLink>
              </>
            )}
          </nav>

          <div className="border-t border-dark-700 pt-2 px-2">
            <LogoutButton className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-dark-700 rounded-xl" />
          </div>
        </div>
      )}
    </div>
  )
}

function MenuLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string
  icon: string
  children: React.ReactNode
  onClick: () => void
}) {
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    play: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    help: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    dashboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    folder: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    video: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
    >
      <span className="text-gray-400">{icons[icon]}</span>
      {children}
    </Link>
  )
}
