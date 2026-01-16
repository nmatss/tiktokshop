import Link from 'next/link'
import Image from 'next/image'
import { CountdownTimer } from '@/components/CountdownTimer'
import { Testimonials } from '@/components/Testimonials'
import { FloatingCTA, FloatingWhatsApp } from '@/components/FloatingCTA'
import { VideoModal } from '@/components/VideoModal'

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-dark-900">
      {/* Floating Elements */}
      <FloatingCTA />
      <FloatingWhatsApp />

      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-orange-500 text-white py-2.5 text-center text-sm font-medium">
        <div className="container-wide flex items-center justify-center gap-2">
          <span className="animate-pulse">🔥</span>
          <span>ULTIMA CHANCE: Preco promocional encerra em breve!</span>
          <span className="animate-pulse">🔥</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-dark-950/95 backdrop-blur-lg z-40 border-b border-dark-800">
        <div className="container-wide flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-white">
              TikTok Shop<span className="text-primary-500">Pro</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#resultados" className="text-gray-400 hover:text-white transition-colors font-medium">
              Resultados
            </a>
            <a href="#conteudo" className="text-gray-400 hover:text-white transition-colors font-medium">
              Conteudo
            </a>
            <a href="#depoimentos" className="text-gray-400 hover:text-white transition-colors font-medium">
              Depoimentos
            </a>
            <a href="#preco" className="text-gray-400 hover:text-white transition-colors font-medium">
              Investimento
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-gray-400 hover:text-white transition-colors font-medium text-sm"
            >
              Area do Aluno
            </Link>
            <Link href="/checkout" className="btn-premium text-white text-sm py-2 px-4">
              QUERO COMECAR
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white text-sm mb-6 animate-fade-in-up">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>+2.500 alunos ja transformaram suas vidas</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 animate-fade-in-up delay-100">
                Transforme seu TikTok em uma{' '}
                <span className="text-gradient">Maquina de Vendas</span>{' '}
                em 30 dias
              </h1>

              <p className="text-xl text-gray-300 mb-8 animate-fade-in-up delay-200 max-w-xl mx-auto lg:mx-0">
                O metodo definitivo para faturar <strong className="text-white">R$ 5.000 a R$ 30.000/mes</strong> com TikTok Shop —
                sem aparecer, sem seguidores e sem investir em anuncios.
              </p>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8 animate-fade-in-up delay-300">
                <div className="flex -space-x-3">
                  {[1, 3, 5, 8, 9].map((i) => (
                    <Image
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i}`}
                      alt="Aluno"
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-dark-900"
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-primary-600 border-2 border-dark-900 flex items-center justify-center text-white text-xs font-bold">
                    +2k
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-white text-sm ml-1">4.9 (847 avaliacoes)</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-400">
                <Link href="/checkout" className="btn-premium text-white text-center pulse-glow">
                  QUERO MINHA VAGA AGORA
                  <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="#conteudo"
                  className="px-8 py-4 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all text-center"
                >
                  Ver o que vou aprender
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-8 text-gray-400 text-sm animate-fade-in-up delay-500">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Garantia 7 dias
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Pagamento Seguro
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                  Acesso Imediato
                </span>
              </div>
            </div>

            {/* Right Content - Video */}
            <div className="relative animate-fade-in-up delay-300">
              <div className="video-container">
                <VideoModal
                  videoId="dQw4w9WgXcQ"
                  thumbnailText="Assista a apresentacao"
                  thumbnailSubtext="3 minutos"
                />
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -bottom-6 -left-6 bg-dark-800/90 backdrop-blur border border-dark-700 rounded-xl p-4 animate-fade-in-up delay-500 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">R$ 2.8M+</p>
                    <p className="text-gray-400 text-sm">Faturado pelos alunos</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-dark-800/90 backdrop-blur border border-dark-700 rounded-xl p-4 animate-fade-in-up delay-600 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <p className="text-white font-bold">#1 Mais Vendido</p>
                    <p className="text-gray-400 text-sm">Categoria E-commerce</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Bar */}
      <section className="bg-dark-950 py-6 border-y border-dark-800">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full uppercase">Oferta Limitada</span>
              <p className="text-white font-medium">Preco sobe em:</p>
            </div>
            <CountdownTimer size="sm" />
            <Link href="/checkout" className="text-primary-400 hover:text-primary-300 font-semibold underline">
              Garantir preco atual →
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-400 text-sm font-semibold rounded-full mb-4">Voce se identifica?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cansado de tentar ganhar dinheiro online e nao conseguir?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '😤', text: 'Ja tentou dropshipping e perdeu dinheiro com anuncios' },
              { icon: '😩', text: 'Nao tem dinheiro para investir em trafego pago' },
              { icon: '😰', text: 'Tem vergonha de aparecer em videos' },
              { icon: '😔', text: 'Comeca varios projetos mas nunca termina' },
              { icon: '😫', text: 'Nao sabe por onde comecar no digital' },
              { icon: '😞', text: 'Esta cansado de trabalhar para enriquecer os outros' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-dark-700 p-5 rounded-xl border border-dark-600"
              >
                <span className="text-3xl">{item.icon}</span>
                <p className="text-gray-300 font-medium">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-xl text-gray-400 mb-4">
              Se voce marcou pelo menos <strong className="text-white">UM</strong> item acima...
            </p>
            <p className="text-2xl font-bold text-gradient">
              O TikTok Shop e a sua melhor chance de virar o jogo em 2025!
            </p>
          </div>
        </div>
      </section>

      {/* Solution / Results Section */}
      <section id="resultados" className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full mb-4">A Solucao</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Por que o TikTok Shop e diferente de tudo que voce ja tentou?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              O unico lugar onde voce consegue vender para milhoes de pessoas sem gastar um centavo em anuncios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Trafego Organico Gratis',
                description: 'O algoritmo do TikTok entrega seus videos para milhoes de pessoas. Voce nao precisa pagar por visualizacoes.',
                highlight: 'Economia de R$ 3.000+/mes em ads',
              },
              {
                icon: '🎯',
                title: 'Compra Dentro do App',
                description: 'Seu cliente ve o produto e compra sem sair do TikTok. Menos cliques = mais vendas.',
                highlight: 'Taxa de conversao 3x maior',
              },
              {
                icon: '📱',
                title: 'Nao Precisa Aparecer',
                description: 'Grave so as maos mostrando o produto. Milhares de vendedores faturam assim.',
                highlight: 'Zero vergonha, 100% resultado',
              },
              {
                icon: '💰',
                title: 'Baixo Investimento',
                description: 'Comece com seu celular e R$ 200 para comprar amostras. Reinvista os lucros.',
                highlight: 'ROI medio de 400%',
              },
              {
                icon: '⚡',
                title: 'Resultados Rapidos',
                description: 'Diferente de SEO ou Instagram, um video pode viralizar no mesmo dia que voce posta.',
                highlight: 'Primeira venda em ate 7 dias',
              },
              {
                icon: '📈',
                title: 'Mercado Explodindo',
                description: 'O TikTok Shop chegou no Brasil recentemente. Quem entrar agora vai dominar.',
                highlight: 'Crescimento de 300% em 2024',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all group"
              >
                <div className="w-14 h-14 bg-dark-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 mb-4">{item.description}</p>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  {item.highlight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Content Section */}
      <section id="conteudo" className="section-padding bg-dark-950">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-primary-500/20 text-primary-400 text-sm font-semibold rounded-full mb-4">Conteudo Completo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              O Metodo Passo a Passo para Faturar no TikTok Shop
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              7 modulos + 50 aulas praticas para voce sair do zero e comecar a vender.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Modules List */}
            <div className="space-y-4">
              {[
                {
                  module: 1,
                  title: 'Fundamentos do TikTok Shop',
                  lessons: 6,
                  duration: '45 min',
                  topics: ['Como funciona a plataforma', 'Requisitos de cadastro', 'Configuracao da loja'],
                },
                {
                  module: 2,
                  title: 'Encontrando Produtos Vencedores',
                  lessons: 8,
                  duration: '1h 20min',
                  topics: ['Criterios de selecao', 'Ferramentas de pesquisa', 'Fornecedores confiaveis'],
                },
                {
                  module: 3,
                  title: 'Criando Videos que Vendem',
                  lessons: 10,
                  duration: '2h',
                  topics: ['Estrutura do video viral', 'Edicao no celular', 'Hooks que param o scroll'],
                },
                {
                  module: 4,
                  title: 'Estrategias de Trafego Organico',
                  lessons: 8,
                  duration: '1h 30min',
                  topics: ['Algoritmo decifrado', 'Frequencia ideal', 'Hashtags que funcionam'],
                },
                {
                  module: 5,
                  title: 'Convertendo Visualizacoes em Vendas',
                  lessons: 7,
                  duration: '1h',
                  topics: ['Descricoes persuasivas', 'Precos estrategicos', 'Resposta a comentarios'],
                },
                {
                  module: 6,
                  title: 'Escalando para 5 Digitos',
                  lessons: 6,
                  duration: '1h',
                  topics: ['Multiplas contas', 'Quando usar ads', 'Automacao'],
                },
                {
                  module: 7,
                  title: 'Bonus: Lives que Faturam',
                  lessons: 5,
                  duration: '1h',
                  topics: ['Estrutura da live', 'Equipamentos', 'Ofertas ao vivo'],
                  bonus: true,
                },
              ].map((module) => (
                <details
                  key={module.module}
                  className="group bg-dark-800 rounded-xl overflow-hidden border border-dark-700"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-dark-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        module.bonus
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-primary-600 text-white'
                      }`}>
                        {module.bonus ? '🎁' : module.module}
                      </span>
                      <div>
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          {module.title}
                          {module.bonus && <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded-full uppercase">Bonus</span>}
                        </h3>
                        <p className="text-sm text-gray-400">{module.lessons} aulas • {module.duration}</p>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 border-t border-dark-700 pt-4">
                    <ul className="space-y-2">
                      {module.topics.map((topic, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>

            {/* Side Info */}
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* What's Included */}
              <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-dark-600">
                <h3 className="text-xl font-bold text-white mb-6">O que voce recebe:</h3>
                <ul className="space-y-4">
                  {[
                    { icon: '🎬', text: '50+ aulas em video HD', value: 'R$ 997' },
                    { icon: '📦', text: 'Lista de 100+ fornecedores', value: 'R$ 297' },
                    { icon: '📝', text: 'Templates de video editaveis', value: 'R$ 197' },
                    { icon: '🎯', text: 'Planilha de produtos vencedores', value: 'R$ 147' },
                    { icon: '👥', text: 'Comunidade VIP vitalicia', value: 'R$ 497' },
                    { icon: '🎁', text: 'Bonus: Modulo de Lives', value: 'R$ 297' },
                    { icon: '💬', text: 'Suporte por 1 ano', value: 'R$ 497' },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="flex items-center gap-3 text-gray-300">
                        <span className="text-xl">{item.icon}</span>
                        {item.text}
                      </span>
                      <span className="text-gray-500 line-through text-sm">{item.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-dark-600">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-400">Valor total:</span>
                    <span className="text-gray-500 line-through">R$ 2.929</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white font-bold text-xl">Voce paga apenas:</span>
                    <span className="text-gradient font-black text-3xl">R$ 297</span>
                  </div>
                </div>
              </div>

              {/* CTA Box */}
              <Link
                href="/checkout"
                className="block w-full btn-premium text-white text-center text-xl py-5 pulse-glow"
              >
                QUERO COMECAR AGORA
              </Link>
              <p className="text-center text-gray-400 text-sm">
                ⚡ Acesso liberado imediatamente apos a compra
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12">
            {/* For whom it IS */}
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-6">
                <span className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">✓</span>
                Este curso E para voce se:
              </h3>
              <ul className="space-y-4">
                {[
                  'Quer comecar um negocio online com baixo investimento',
                  'Esta cansado de trabalhar para os outros',
                  'Busca uma renda extra ou principal',
                  'Nao quer aparecer em videos',
                  'Tem disposicao para aprender e aplicar',
                  'Quer liberdade de tempo e localizacao',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* For whom it's NOT */}
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-6">
                <span className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">✗</span>
                Este curso NAO e para voce se:
              </h3>
              <ul className="space-y-4">
                {[
                  'Procura dinheiro facil sem trabalhar',
                  'Nao tem paciencia para aprender',
                  'Desiste na primeira dificuldade',
                  'Acha que vai ficar rico em 1 semana',
                  'Nao esta disposto a gravar videos simples',
                  'Prefere reclamar do que agir',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-400 text-sm font-semibold rounded-full mb-4">Resultados Reais</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Veja o que nossos alunos estao conquistando
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Pessoas comuns que decidiram mudar de vida e estao colhendo os resultados.
            </p>
          </div>

          <Testimonials />
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-narrow">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-3xl p-8 md:p-12 border border-green-500/30 text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Garantia Incondicional de 7 Dias
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              Assista as aulas, aplique o metodo. Se em 7 dias voce nao estiver 100% satisfeito
              com o conteudo, basta enviar um email e devolvemos <strong className="text-white">cada centavo</strong>.
              Sem perguntas, sem burocracia.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-gray-300">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Reembolso em ate 48h
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sem perguntas
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                100% do valor
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="preco" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container-narrow relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-red-500/20 text-red-400 text-sm font-semibold rounded-full mb-4">Oferta Especial</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Quanto vale transformar sua vida?
            </h2>
            <p className="text-xl text-gray-400">
              Menos que uma pizza por semana para ter acesso vitalicio.
            </p>
          </div>

          <div className="bg-dark-800 rounded-3xl p-8 md:p-10 border border-dark-700 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 bg-red-500 text-white text-sm font-bold px-6 py-2 rounded-bl-xl transform rotate-12">
              -70% OFF
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-500 mb-2">De <span className="line-through">R$ 997</span></p>
              <p className="text-6xl md:text-7xl font-black text-gradient mb-2">R$ 297</p>
              <p className="text-gray-400">ou 12x de R$ 29,06 no cartao</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-bold text-white mb-4">Incluso no pacote:</h4>
                <ul className="space-y-3">
                  {[
                    'Acesso vitalicio ao curso completo',
                    '7 modulos + 50 aulas praticas',
                    'Lista de 100+ fornecedores',
                    'Templates de video editaveis',
                    'Planilha de produtos vencedores',
                    'Modulo bonus de Lives',
                    'Comunidade VIP exclusiva',
                    'Suporte por 1 ano',
                    'Atualizacoes gratuitas',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Formas de pagamento:</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-dark-700 rounded-xl border border-dark-600">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💳</span>
                      <span className="font-semibold text-white">Cartao de Credito</span>
                    </div>
                    <p className="text-sm text-gray-400">Em ate 12x de R$ 29,06</p>
                  </div>
                  <div className="p-4 bg-green-900/30 rounded-xl border-2 border-green-500/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📱</span>
                      <span className="font-semibold text-white">PIX</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full uppercase">10% OFF</span>
                    </div>
                    <p className="text-sm text-gray-400">R$ 267,30 a vista</p>
                  </div>
                  <div className="p-4 bg-dark-700 rounded-xl border border-dark-600">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🏦</span>
                      <span className="font-semibold text-white">Boleto</span>
                    </div>
                    <p className="text-sm text-gray-400">R$ 297 a vista</p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full btn-premium text-white text-center text-xl py-5 pulse-glow"
            >
              QUERO GARANTIR MINHA VAGA AGORA
            </Link>

            <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Compra 100% segura
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Garantia de 7 dias
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                </svg>
                Acesso imediato
              </span>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">⏰ Oferta expira em:</p>
            <CountdownTimer size="md" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-400">
              Tire suas duvidas antes de comecar
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Preciso ter seguidores para comecar?',
                a: 'Nao! O TikTok e a unica rede social que entrega conteudo baseado na qualidade, nao nos seguidores. Voce pode comecar do zero e ter resultados ja nos primeiros dias.',
              },
              {
                q: 'Preciso aparecer nos videos?',
                a: 'Nao! A maioria dos nossos alunos grava apenas mostrando as maos e o produto. Inclusive ensinamos tecnicas especificas para quem nao quer aparecer.',
              },
              {
                q: 'Quanto preciso investir para comecar?',
                a: 'Voce pode comecar com R$ 200-300 para comprar amostras dos produtos. O trafego e organico, entao nao precisa gastar com anuncios no inicio.',
              },
              {
                q: 'Em quanto tempo vou ter resultados?',
                a: 'Depende da sua dedicacao, mas a media e de 7-15 dias para a primeira venda. Temos alunos que venderam no mesmo dia que publicaram o primeiro video.',
              },
              {
                q: 'O curso funciona para iniciantes?',
                a: 'Sim! O curso foi criado do zero ao avancado. Nao precisa de nenhum conhecimento previo em vendas ou redes sociais.',
              },
              {
                q: 'Por quanto tempo tenho acesso?',
                a: 'Acesso vitalicio. Comprou uma vez, e seu para sempre. Isso inclui todas as atualizacoes futuras.',
              },
              {
                q: 'Posso pedir reembolso?',
                a: 'Sim! Voce tem 7 dias de garantia incondicional. Se nao gostar por qualquer motivo, devolvemos 100% do valor.',
              },
              {
                q: 'Como funciona o suporte?',
                a: 'Voce tera acesso a comunidade VIP onde pode tirar duvidas diretamente comigo e com outros alunos. Tambem temos suporte por email.',
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-dark-700 rounded-xl border border-dark-600 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-white hover:bg-dark-600 transition-colors">
                  <span className="pr-4">{faq.q}</span>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 border-t border-dark-600 pt-4">
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

        <div className="container-narrow relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Sua vida pode mudar em 30 dias.<br />
            A decisao e sua.
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Daqui a um mes voce pode estar no mesmo lugar... ou pode estar
            comemorando suas primeiras vendas no TikTok Shop.
          </p>
          <Link
            href="/checkout"
            className="inline-block bg-white text-primary-600 font-bold text-xl px-10 py-5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            QUERO MUDAR MINHA HISTORIA
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-white/80 text-sm">
            <span>✓ Acesso imediato</span>
            <span>✓ Garantia 7 dias</span>
            <span>✓ Suporte dedicado</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-950 py-12 border-t border-dark-800">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-bold text-xl text-white mb-2">
                TikTok Shop<span className="text-primary-500">Pro</span>
              </p>
              <p className="text-gray-500 text-sm">
                Transformando criadores em vendedores de sucesso.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacidade
              </Link>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                Area do Aluno
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-dark-800 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TikTok Shop Pro. Todos os direitos reservados.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Este produto nao tem relacao oficial com o TikTok ou ByteDance.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
