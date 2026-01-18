import Link from 'next/link'
import Image from 'next/image'
import { getTelegramInviteLink } from '@/lib/telegram'

export default function ObrigadoPage() {
  const telegramLink = getTelegramInviteLink()
  return (
    <main className="min-h-screen bg-dark-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <span className="text-2xl">{['🎉', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}</span>
          </div>
        ))}
      </div>

      <div className="container-narrow py-12 lg:py-20 relative z-10">
        <div className="text-center mb-12">
          {/* Success Icon */}
          <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in shadow-2xl shadow-green-500/30">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fade-in-up">
            Parabéns! 🎉
          </h1>
          <p className="text-2xl text-green-400 font-semibold mb-4 animate-fade-in-up delay-100">
            Seu pagamento foi confirmado!
          </p>
          <p className="text-xl text-gray-400 max-w-xl mx-auto animate-fade-in-up delay-200">
            Você agora faz parte da comunidade <span className="text-white font-semibold">TikTok Shop Pro</span>.
            Sua jornada para faturar no TikTok começa agora!
          </p>
        </div>

        {/* Next Steps Card */}
        <div className="bg-dark-800 rounded-3xl p-8 md:p-10 border border-dark-700 mb-8 animate-fade-in-up delay-300">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-lg">📋</span>
            Próximos Passos
          </h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                icon: '📧',
                title: 'Verifique seu email',
                description: 'Enviamos seus dados de acesso para o email cadastrado. Confira também a caixa de spam.',
                highlight: true,
              },
              {
                step: 2,
                icon: '🔐',
                title: 'Acesse a área de membros',
                description: 'Use o botão abaixo para fazer login e começar a assistir as aulas imediatamente.',
              },
              {
                step: 3,
                icon: '👥',
                title: 'Entre na comunidade VIP',
                description: telegramLink
                  ? 'Clique no botão abaixo para entrar no grupo exclusivo do Telegram.'
                  : 'O link de acesso ao grupo exclusivo está na primeira aula. Não perca!',
                telegramLink: telegramLink,
              },
              {
                step: 4,
                icon: '📚',
                title: 'Comece pelo módulo 1',
                description: 'Assista as aulas em ordem para ter o melhor aproveitamento do método.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`flex gap-4 p-4 rounded-xl ${
                  item.highlight ? 'bg-primary-500/10 border border-primary-500/30' : 'bg-dark-700/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
                  item.highlight ? 'bg-primary-600' : 'bg-dark-600'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 font-medium">PASSO {item.step}</span>
                    {item.highlight && (
                      <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-bold rounded">IMPORTANTE</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                  {item.telegramLink && (
                    <a
                      href={item.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Entrar no Telegram
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center space-y-4 animate-fade-in-up delay-400">
          <Link
            href="/login"
            className="inline-block btn-premium text-white text-xl px-12 py-5 pulse-glow"
          >
            ACESSAR MINHA CONTA AGORA
            <svg className="w-6 h-6 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <p className="text-gray-500 text-sm">
            Dúvidas?{' '}
            <a href="mailto:suporte@tiktokshoppro.com.br" className="text-primary-400 hover:underline">
              suporte@tiktokshoppro.com.br
            </a>
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-16 pt-12 border-t border-dark-800">
          <div className="text-center mb-8">
            <p className="text-gray-400 mb-4">Você está em boa companhia! 🚀</p>
            <div className="flex justify-center -space-x-3 mb-4">
              {[1, 3, 5, 8, 9, 11, 14, 16].map((i) => (
                <Image
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i}`}
                  alt="Aluno"
                  width={48}
                  height={48}
                  className="rounded-full border-3 border-dark-900"
                />
              ))}
              <div className="w-12 h-12 rounded-full bg-primary-600 border-3 border-dark-900 flex items-center justify-center text-white text-sm font-bold">
                +2k
              </div>
            </div>
            <p className="text-white font-medium">
              <span className="text-green-400">+2.547 alunos</span> já estão transformando suas vidas
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center p-4 bg-dark-800 rounded-xl">
              <p className="text-2xl font-bold text-white">50+</p>
              <p className="text-sm text-gray-400">Aulas</p>
            </div>
            <div className="text-center p-4 bg-dark-800 rounded-xl">
              <p className="text-2xl font-bold text-green-400">R$ 2.8M</p>
              <p className="text-sm text-gray-400">Faturado</p>
            </div>
            <div className="text-center p-4 bg-dark-800 rounded-xl">
              <p className="text-2xl font-bold text-yellow-400">4.9</p>
              <p className="text-sm text-gray-400">Avaliação</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  )
}
