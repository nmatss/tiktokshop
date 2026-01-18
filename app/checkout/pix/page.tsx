'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function PixPaymentContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('id')

  const [paymentData, setPaymentData] = useState<{
    pixQrCode: string
    pixCopyPaste: string
    value: number
    expiresAt: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds

  useEffect(() => {
    async function fetchPaymentData() {
      if (!paymentId) {
        setError('ID do pagamento não encontrado')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/asaas/payment/${paymentId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar dados do pagamento')
        }

        setPaymentData({
          pixQrCode: data.pixQrCode,
          pixCopyPaste: data.pixCopyPaste,
          value: data.value,
          expiresAt: data.expiresAt,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pagamento')
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentData()
  }, [paymentId])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopy = async () => {
    if (!paymentData?.pixCopyPaste) return

    try {
      await navigator.clipboard.writeText(paymentData.pixCopyPaste)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = paymentData.pixCopyPaste
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando dados do pagamento...</p>
        </div>
      </div>
    )
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="bg-dark-800 rounded-2xl p-8 max-w-md w-full text-center border border-dark-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Erro no Pagamento</h1>
          <p className="text-gray-400 mb-6">{error || 'Não foi possível carregar os dados do pagamento'}</p>
          <Link
            href="/checkout"
            className="inline-block px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
          >
            Tentar Novamente
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-900 border-b border-dark-800">
        <div className="container-wide h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-white">
            TikTok Shop<span className="text-primary-500">Pro</span>
          </Link>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Pagamento Seguro</span>
          </div>
        </div>
      </header>

      <div className="container-narrow py-8 lg:py-12">
        <div className="max-w-lg mx-auto">
          {/* Status Card */}
          <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
            {/* Timer Header */}
            <div className="bg-gradient-to-r from-primary-600 to-orange-500 p-4 text-center">
              <p className="text-white text-sm mb-1">Pague em até</p>
              <p className="text-3xl font-black text-white">{formatTime(timeLeft)}</p>
              {timeLeft <= 0 && (
                <p className="text-yellow-200 text-sm mt-1">PIX expirado. Gere um novo.</p>
              )}
            </div>

            <div className="p-6">
              {/* Value */}
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-1">Valor a pagar:</p>
                <p className="text-4xl font-black text-white">
                  R$ {paymentData.value.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-green-400 text-sm mt-1">10% de desconto aplicado</p>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-xl p-4 mb-6 flex items-center justify-center">
                {paymentData.pixQrCode ? (
                  <img
                    src={`data:image/png;base64,${paymentData.pixQrCode}`}
                    alt="QR Code PIX"
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                    <p className="text-gray-500 text-sm text-center">QR Code<br />indisponível</p>
                  </div>
                )}
              </div>

              {/* Copy Paste */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2 text-center">Ou copie o código PIX:</p>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={paymentData.pixCopyPaste || ''}
                    className="w-full px-4 py-3 pr-24 bg-dark-700 border border-dark-600 rounded-xl text-white text-sm truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-dark-700/50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Como pagar:
                </h3>
                <ol className="space-y-2 text-sm text-gray-400">
                  <li key="step-1" className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-xs flex-shrink-0 mt-0.5">1</span>
                    Abra o app do seu banco
                  </li>
                  <li key="step-2" className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-xs flex-shrink-0 mt-0.5">2</span>
                    Escolha pagar via PIX com QR Code ou código
                  </li>
                  <li key="step-3" className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-xs flex-shrink-0 mt-0.5">3</span>
                    Escaneie o QR Code ou cole o código copiado
                  </li>
                  <li key="step-4" className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-xs flex-shrink-0 mt-0.5">4</span>
                    Confirme o pagamento
                  </li>
                </ol>
              </div>

              {/* Confirmation Note */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <svg className="w-8 h-8 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-400 text-sm">
                  Após o pagamento, você receberá a confirmação por email em poucos segundos.
                </p>
              </div>
            </div>
          </div>

          {/* Support Link */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Problemas com o pagamento?{' '}
              <a href="mailto:suporte@tiktokshoppro.com.br" className="text-primary-400 hover:underline">
                Entre em contato
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function PixPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    }>
      <PixPaymentContent />
    </Suspense>
  )
}
