'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  content: string
  rating: number
  revenue?: string
  highlight?: boolean
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Mariana Silva',
    role: 'Ex-CLT, Empreendedora Digital',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Comecei do zero, sem seguidores, sem experiência. Em 45 dias fiz minha primeira venda. Hoje faturo mais de R$ 15 mil por mês só com TikTok Shop. O método é simples e direto ao ponto.',
    rating: 5,
    revenue: 'R$ 15k/mês',
    highlight: true,
  },
  {
    id: 2,
    name: 'Carlos Eduardo',
    role: 'Estudante de Marketing',
    avatar: 'https://i.pravatar.cc/150?img=3',
    content: 'Sempre tive medo de aparecer na câmera. O curso me ensinou que não precisa disso. Faço vídeos mostrando só o produto e os resultados são incríveis.',
    rating: 5,
    revenue: 'R$ 8k/mês',
  },
  {
    id: 3,
    name: 'Amanda Rodrigues',
    role: 'Mãe Solo',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content: 'Trabalho de casa cuidando dos meus filhos e ainda consigo ter uma renda. O suporte na comunidade é fantástico, sempre tem alguém pra ajudar.',
    rating: 5,
    revenue: 'R$ 6k/mês',
  },
  {
    id: 4,
    name: 'Rafael Santos',
    role: 'Ex-Vendedor de Loja',
    avatar: 'https://i.pravatar.cc/150?img=8',
    content: 'Saí do emprego que odiava e hoje tenho liberdade total. O investimento no curso se pagou na primeira semana.',
    rating: 5,
    revenue: 'R$ 22k/mês',
    highlight: true,
  },
  {
    id: 5,
    name: 'Juliana Costa',
    role: 'Designer Gráfica',
    avatar: 'https://i.pravatar.cc/150?img=9',
    content: 'Já tinha tentado dropshipping tradicional e não deu certo. O TikTok Shop é diferente - o tráfego orgânico muda tudo.',
    rating: 5,
    revenue: 'R$ 12k/mês',
  },
  {
    id: 6,
    name: 'Pedro Henrique',
    role: 'Motorista de App',
    avatar: 'https://i.pravatar.cc/150?img=11',
    content: 'Fazia Uber 12h por dia. Agora trabalho 3h no TikTok e ganho o dobro. Minha vida mudou completamente.',
    rating: 5,
    revenue: 'R$ 10k/mês',
  },
]

export function Testimonials() {
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-dark-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )

  return (
    <div>
      {/* Featured Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {testimonials.slice(0, 6).map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`
              bg-dark-800 border border-dark-700 rounded-2xl p-6 relative
              ${testimonial.highlight ? 'ring-2 ring-primary-500' : ''}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {testimonial.highlight && (
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full uppercase">Destaque</span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4 pt-2">
              <div className="relative">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                {testimonial.revenue && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {testimonial.revenue}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-white">{testimonial.name}</h4>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
                <StarRating rating={testimonial.rating} />
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              &ldquo;{testimonial.content}&rdquo;
            </p>
          </div>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="bg-dark-900 rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-white mb-1">2.547+</p>
            <p className="text-dark-400">Alunos ativos</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-400 mb-1">R$ 2.8M</p>
            <p className="text-dark-400">Faturado pelos alunos</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-yellow-400 mb-1">4.9/5</p>
            <p className="text-dark-400">Avaliação média</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white mb-1">97%</p>
            <p className="text-dark-400">Taxa de satisfação</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  const testimonial = testimonials[current]

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="bg-dark-800 border border-dark-700 rounded-2xl text-center py-8 px-6">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={80}
          height={80}
          className="rounded-full mx-auto mb-4"
        />
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-6 h-6 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-xl text-gray-300 leading-relaxed mb-6 italic">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <h4 className="font-bold text-white">{testimonial.name}</h4>
        <p className="text-gray-400">{testimonial.role}</p>
        {testimonial.revenue && (
          <p className="mt-2 inline-block px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
            Fatura {testimonial.revenue}
          </p>
        )}
      </div>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-dark-700 border border-dark-600 rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-dark-700 border border-dark-600 rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current ? 'bg-primary-500 w-6' : 'bg-dark-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
