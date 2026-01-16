import Link from 'next/link'

export const metadata = {
  title: 'Termos de Uso - TikTok Shop Pro',
}

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-white mt-4">Termos de Uso</h1>
          <p className="text-gray-400 mt-2">Ultima atualizacao: Janeiro de 2025</p>
        </div>
      </header>

      {/* Content */}
      <div className="container-narrow py-12">
        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">1</span>
              Aceitacao dos Termos
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Ao acessar e utilizar a plataforma TikTok Shop Pro, voce concorda com estes Termos de Uso.
              Se voce nao concordar com qualquer parte destes termos, nao devera utilizar nossos servicos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">2</span>
              Descricao do Servico
            </h2>
            <p className="text-gray-300 leading-relaxed">
              O TikTok Shop Pro e uma plataforma de educacao online que oferece cursos e conteudos
              relacionados a vendas no TikTok Shop. O acesso aos conteudos e liberado mediante pagamento
              e criacao de conta na plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">3</span>
              Cadastro e Conta
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Para utilizar nossos servicos, voce deve criar uma conta fornecendo informacoes verdadeiras
              e completas. Voce e responsavel por manter a confidencialidade de sua senha e por todas as
              atividades que ocorrem em sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-sm font-bold">4</span>
              Pagamento e Reembolso
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Os precos sao exibidos em Reais (BRL) e incluem todos os impostos aplicaveis. Oferecemos
              garantia incondicional de 7 (sete) dias. Se nao ficar satisfeito, basta solicitar o reembolso
              dentro deste prazo e devolveremos 100% do valor pago.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">5</span>
              Propriedade Intelectual
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Todo o conteudo disponibilizado na plataforma, incluindo videos, textos, imagens e materiais
              de apoio, e protegido por direitos autorais. E proibida a reproducao, distribuicao ou
              compartilhamento do conteudo sem autorizacao previa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 text-sm font-bold">6</span>
              Uso Aceitavel
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">Voce concorda em nao:</p>
            <ul className="space-y-2">
              {[
                'Compartilhar seu acesso com terceiros',
                'Copiar, reproduzir ou distribuir o conteudo',
                'Utilizar o conteudo para fins comerciais nao autorizados',
                'Tentar acessar areas restritas da plataforma',
                'Praticar qualquer atividade ilegal atraves da plataforma',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">7</span>
              Limitacao de Responsabilidade
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Os resultados obtidos com a aplicacao do conhecimento adquirido no curso podem variar.
              Nao garantimos resultados financeiros especificos, pois estes dependem de diversos fatores
              individuais e de mercado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">8</span>
              Modificacoes
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Reservamos o direito de modificar estes Termos de Uso a qualquer momento. As alteracoes
              entram em vigor imediatamente apos a publicacao na plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">9</span>
              Lei Aplicavel
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Estes Termos de Uso sao regidos pelas leis da Republica Federativa do Brasil.
              Qualquer disputa sera resolvida no foro da comarca de Sao Paulo/SP.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm font-bold">10</span>
              Contato
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Para duvidas sobre estes Termos de Uso, entre em contato atraves do email:{' '}
              <a href="mailto:suporte@tiktokshoppro.com.br" className="text-primary-400 hover:text-primary-300 transition-colors">
                suporte@tiktokshoppro.com.br
              </a>
            </p>
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
