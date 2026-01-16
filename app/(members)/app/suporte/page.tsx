'use client'

import { useState } from 'react'

export default function SuportePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Como acesso as aulas?',
      a: 'Basta clicar em "Aulas" no menu lateral e escolher a aula que deseja assistir. Seu progresso é salvo automaticamente.',
    },
    {
      q: 'Meu acesso tem prazo de validade?',
      a: 'Não! Seu acesso é vitalício. Você pode assistir as aulas quantas vezes quiser, para sempre.',
    },
    {
      q: 'Posso baixar as aulas?',
      a: 'As aulas são exclusivas para visualização online na plataforma para garantir a segurança do conteúdo.',
    },
    {
      q: 'Como entro no grupo da comunidade?',
      a: 'O link de acesso ao grupo VIP está disponível na primeira aula do módulo de boas-vindas.',
    },
    {
      q: 'Esqueci minha senha, o que faço?',
      a: 'Você pode redefinir sua senha na página "Minha Conta" ou na tela de login clicando em "Esqueci minha senha".',
    },
    {
      q: 'O vídeo não está carregando, o que fazer?',
      a: 'Tente atualizar a página (F5), limpar o cache do navegador ou usar outro navegador. Se persistir, entre em contato.',
    },
  ]

  return (
    <div className="fade-in max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Central de Suporte</h1>
        <p className="text-gray-400">Estamos aqui para ajudar você a ter a melhor experiência</p>
      </div>

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-green-500/50 transition-all group"
        >
          <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">WhatsApp</h3>
          <p className="text-sm text-gray-400 mb-2">Atendimento rápido</p>
          <span className="text-xs text-green-400 font-medium">Seg-Sex, 9h às 18h</span>
        </a>

        <a
          href="mailto:suporte@tiktokshoppro.com.br"
          className="bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-blue-500/50 transition-all group"
        >
          <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">Email</h3>
          <p className="text-sm text-gray-400 mb-2">suporte@tiktokshoppro.com.br</p>
          <span className="text-xs text-blue-400 font-medium">Resposta em até 24h</span>
        </a>

        <a
          href="#"
          className="bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-purple-500/50 transition-all group"
        >
          <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">Comunidade VIP</h3>
          <p className="text-sm text-gray-400 mb-2">Tire dúvidas com alunos</p>
          <span className="text-xs text-purple-400 font-medium">Acesso exclusivo</span>
        </a>
      </div>

      {/* FAQ Section */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Perguntas Frequentes
          </h2>
        </div>

        <div className="divide-y divide-dark-700">
          {faqs.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-dark-700/50 transition-colors"
              >
                <span className="font-medium text-white pr-4">{item.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5">
                  <p className="text-gray-400 bg-dark-900/50 p-4 rounded-lg">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Response Time Info */}
      <div className="bg-gradient-to-br from-primary-500/10 to-orange-500/10 rounded-2xl p-6 border border-primary-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Tempo de Resposta</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong className="text-white">WhatsApp:</strong> Resposta em minutos (horário comercial)</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong className="text-white">Email:</strong> Resposta em até 24 horas úteis</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong className="text-white">Problemas técnicos:</strong> São tratados com prioridade</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
