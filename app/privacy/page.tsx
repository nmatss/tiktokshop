import Link from 'next/link'

export const metadata = {
  title: 'Politica de Privacidade - TikTok Shop Pro',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-950 border-b border-dark-800">
        <div className="container-narrow py-8">
          <Link href="/" className="text-gray-400 hover:text-white text-sm mb-4 inline-flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Politica de Privacidade</h1>
          <p className="text-gray-400 mt-2">Ultima atualizacao: Janeiro de 2025</p>
        </div>
      </header>

      {/* Content */}
      <div className="container-narrow py-12">
        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">1</span>
              Introducao
            </h2>
            <p className="text-gray-300 leading-relaxed">
              A TikTok Shop Pro esta comprometida em proteger sua privacidade. Esta Politica de
              Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informacoes
              pessoais quando voce utiliza nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm font-bold">2</span>
              Informacoes que Coletamos
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">Coletamos os seguintes tipos de informacoes:</p>
            <ul className="space-y-3">
              {[
                { title: 'Dados de cadastro', desc: 'nome, email, CPF' },
                { title: 'Dados de pagamento', desc: 'processados pela Asaas (nao armazenamos dados de cartao)' },
                { title: 'Dados de uso', desc: 'progresso nas aulas, tempo de visualizacao' },
                { title: 'Dados tecnicos', desc: 'endereco IP, tipo de navegador, dispositivo' },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-dark-700/50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">
                    <strong className="text-white">{item.title}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">3</span>
              Como Usamos suas Informacoes
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">Utilizamos suas informacoes para:</p>
            <ul className="space-y-2">
              {[
                'Fornecer acesso a plataforma e conteudos',
                'Processar pagamentos',
                'Enviar comunicacoes sobre o curso e atualizacoes',
                'Melhorar nossos servicos',
                'Cumprir obrigacoes legais',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm font-bold">4</span>
              Compartilhamento de Dados
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Nao vendemos suas informacoes pessoais. Compartilhamos dados apenas com:
            </p>
            <ul className="space-y-3">
              {[
                { title: 'Processadores de pagamento', desc: 'Asaas, para processar transacoes' },
                { title: 'Provedores de servico', desc: 'Supabase (hospedagem), Vercel (infraestrutura)' },
                { title: 'Autoridades legais', desc: 'quando exigido por lei' },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-dark-700/50 rounded-lg">
                  <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-gray-300">
                    <strong className="text-white">{item.title}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-sm font-bold">5</span>
              Seguranca dos Dados
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Implementamos medidas de seguranca tecnicas e organizacionais para proteger suas
              informacoes, incluindo:
            </p>
            <ul className="space-y-2">
              {[
                'Criptografia de dados em transito (HTTPS)',
                'Autenticacao segura',
                'Controle de acesso baseado em funcoes',
                'Monitoramento de seguranca',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400 text-sm font-bold">6</span>
              Seus Direitos (LGPD)
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              De acordo com a Lei Geral de Protecao de Dados (LGPD), voce tem direito a:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'Acessar seus dados pessoais',
                'Corrigir dados incompletos ou desatualizados',
                'Solicitar a exclusao de seus dados',
                'Revogar consentimento',
                'Solicitar portabilidade dos dados',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-300 leading-relaxed">
              Para exercer esses direitos, entre em contato conosco atraves do email:{' '}
              <a href="mailto:privacidade@tiktokshoppro.com.br" className="text-primary-400 hover:text-primary-300 transition-colors">
                privacidade@tiktokshoppro.com.br
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">7</span>
              Cookies
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Utilizamos cookies essenciais para o funcionamento da plataforma, incluindo:
            </p>
            <ul className="space-y-2">
              {[
                'Cookies de autenticacao (para manter voce logado)',
                'Cookies de sessao (para funcionalidade basica)',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">8</span>
              Retencao de Dados
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Mantemos seus dados pelo tempo necessario para fornecer nossos servicos e cumprir
              obrigacoes legais. Dados de pagamento sao mantidos conforme exigencias fiscais (5 anos).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 text-sm font-bold">9</span>
              Menores de Idade
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Nossos servicos nao sao destinados a menores de 18 anos. Nao coletamos intencionalmente
              dados de menores de idade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">10</span>
              Alteracoes nesta Politica
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Podemos atualizar esta Politica de Privacidade periodicamente. Notificaremos sobre
              alteracoes significativas atraves do email cadastrado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm font-bold">11</span>
              Contato
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Para duvidas sobre esta Politica de Privacidade ou sobre o tratamento de seus dados,
              entre em contato:
            </p>
            <div className="p-4 bg-dark-700/50 rounded-lg">
              <p className="text-gray-300">
                Email:{' '}
                <a href="mailto:privacidade@tiktokshoppro.com.br" className="text-primary-400 hover:text-primary-300 transition-colors">
                  privacidade@tiktokshoppro.com.br
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-950 py-8 border-t border-dark-800">
        <div className="container-narrow text-center">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para a pagina inicial
          </Link>
        </div>
      </footer>
    </main>
  )
}
