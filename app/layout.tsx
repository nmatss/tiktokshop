import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TikTok Shop do Zero ao Caixa',
  description: 'Aprenda a criar e escalar sua loja no TikTok Shop do zero até fazer vendas consistentes.',
  keywords: ['TikTok Shop', 'dropshipping', 'ecommerce', 'vendas online', 'curso'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
