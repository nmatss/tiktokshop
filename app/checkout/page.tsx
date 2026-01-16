'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CountdownTimer } from '@/components/CountdownTimer'

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/asaas/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, paymentMethod }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else if (data.pixQrCode || data.paymentId) {
        window.location.href = `/checkout/pix?id=${data.paymentId}`
      } else {
        throw new Error('Não foi possível processar o pagamento. Tente novamente.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  const prices = {
    pix: { value: 267.30, display: 'R$ 267,30', discount: '10% OFF' },
    card: { value: 297, display: 'R$ 297,00', installment: '12x de R$ 29,06' },
    boleto: { value: 297, display: 'R$ 297,00', note: 'Vencimento em 3 dias' },
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

      {/* Urgency Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-orange-500 py-3">
        <div className="container-wide flex flex-col sm:flex-row items-center justify-center gap-3 text-white text-sm">
          <span className="font-semibold">⏰ Oferta por tempo limitado!</span>
          <CountdownTimer size="sm" showLabels={false} />
        </div>
      </div>

      <div className="container-wide py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Form - 3 columns */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-dark-800 rounded-2xl p-6 lg:p-8 border border-dark-700">
              <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm">1</span>
                Seus Dados
              </h1>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full px-4 py-3.5 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3.5 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-300 mb-2">
                      CPF *
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      required
                      className="w-full px-4 py-3.5 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        const masked = value
                          .replace(/(\d{3})(\d)/, '$1.$2')
                          .replace(/(\d{3})(\d)/, '$1.$2')
                          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                        setFormData({ ...formData, cpf: masked })
                      }}
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      WhatsApp (opcional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3.5 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        const masked = value
                          .replace(/(\d{2})(\d)/, '($1) $2')
                          .replace(/(\d{5})(\d)/, '$1-$2')
                        setFormData({ ...formData, phone: masked })
                      }}
                      maxLength={15}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-4 border-t border-dark-700">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm">2</span>
                    Forma de Pagamento
                  </h2>

                  <div className="grid sm:grid-cols-3 gap-3">
                    {/* PIX */}
                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-dark-600 bg-dark-700 hover:border-dark-500'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="pix"
                        checked={paymentMethod === 'pix'}
                        onChange={() => setPaymentMethod('pix')}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📱</span>
                        <div>
                          <p className="font-semibold text-white">PIX</p>
                          <p className="text-xs text-green-400 font-medium">10% OFF</p>
                        </div>
                      </div>
                      {paymentMethod === 'pix' && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>

                    {/* Card */}
                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 bg-dark-700 hover:border-dark-500'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💳</span>
                        <div>
                          <p className="font-semibold text-white">Cartão</p>
                          <p className="text-xs text-gray-400">até 12x</p>
                        </div>
                      </div>
                      {paymentMethod === 'card' && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>

                    {/* Boleto */}
                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      paymentMethod === 'boleto'
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-dark-600 bg-dark-700 hover:border-dark-500'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="boleto"
                        checked={paymentMethod === 'boleto'}
                        onChange={() => setPaymentMethod('boleto')}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🏦</span>
                        <div>
                          <p className="font-semibold text-white">Boleto</p>
                          <p className="text-xs text-gray-400">à vista</p>
                        </div>
                      </div>
                      {paymentMethod === 'boleto' && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Price Display */}
                  <div className="mt-6 p-4 bg-dark-700 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Valor total:</span>
                      <div className="text-right">
                        <p className="text-3xl font-black text-white">{prices[paymentMethod].display}</p>
                        {'installment' in prices[paymentMethod] && (
                          <p className="text-sm text-gray-400">{prices[paymentMethod].installment}</p>
                        )}
                        {'discount' in prices[paymentMethod] && (
                          <p className="text-sm text-green-400 font-medium">{prices[paymentMethod].discount}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-premium text-white text-xl py-5 pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    <>
                      FINALIZAR COMPRA
                      <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500">
                  Ao clicar em finalizar, você concorda com nossos{' '}
                  <Link href="/terms" className="text-primary-400 hover:underline">
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link href="/privacy" className="text-primary-400 hover:underline">
                    Política de Privacidade
                  </Link>
                </p>
              </form>
            </div>

            {/* Trust Signals */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-dark-800 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Compra Segura</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-dark-800 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Dados Protegidos</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-dark-800 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Garantia 7 dias</span>
              </div>
            </div>
          </div>

          {/* Order Summary - 2 columns */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Product Card */}
              <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700">
                <div className="bg-gradient-to-r from-primary-600 to-orange-500 p-4">
                  <p className="text-white font-bold text-center">🔥 OFERTA ESPECIAL</p>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    TikTok Shop do Zero ao Caixa
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">
                    O método completo para faturar de R$ 5.000 a R$ 30.000/mês
                  </p>

                  <div className="space-y-3 mb-6">
                    {[
                      '7 módulos + 50 aulas em vídeo HD',
                      'Lista de 100+ fornecedores verificados',
                      'Templates de vídeo editáveis',
                      'Planilha de produtos vencedores',
                      'Comunidade VIP vitalícia',
                      'Módulo bônus: Lives que Faturam',
                      'Suporte por 1 ano',
                      'Atualizações gratuitas',
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dark-700 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">De:</span>
                      <span className="text-gray-500 line-through">R$ 997,00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Por apenas:</span>
                      <span className="text-3xl font-black text-gradient">R$ 297</span>
                    </div>
                    <p className="text-right text-sm text-gray-500">
                      ou PIX com 10% OFF: R$ 267,30
                    </p>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-400 mb-1">Garantia Incondicional</h3>
                    <p className="text-gray-400 text-sm">
                      Se em 7 dias você não estiver satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-dark-800 rounded-2xl p-5 border border-dark-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-2">
                    {[1, 3, 5, 8, 9].map((i) => (
                      <Image
                        key={i}
                        src={`https://i.pravatar.cc/80?img=${i}`}
                        alt="Aluno"
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-dark-800"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">4.9 de 5 (847 avaliações)</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  <span className="text-green-400 font-semibold">+2.547 alunos</span> já transformaram suas vidas com o método
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-dark-800 py-6">
        <div className="container-wide text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} TikTok Shop Pro. Todos os direitos reservados.</p>
          <p className="mt-1">Pagamentos processados com segurança pela Asaas.</p>
        </div>
      </footer>
    </main>
  )
}
