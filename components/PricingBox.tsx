'use client'

import { CTAButton } from './CTAButton'

interface PricingBoxProps {
  title: string
  originalPrice?: string
  price: string
  installments?: string
  features: string[]
  ctaText: string
  ctaHref: string
  highlight?: boolean
}

export function PricingBox({
  title,
  originalPrice,
  price,
  installments,
  features,
  ctaText,
  ctaHref,
  highlight = false,
}: PricingBoxProps) {
  return (
    <div
      className={`
        relative rounded-2xl p-8
        ${highlight
          ? 'bg-gradient-to-b from-primary-600 to-primary-700 text-white shadow-2xl scale-105'
          : 'bg-white text-dark-900 shadow-lg border border-dark-200'
        }
      `}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-yellow-400 text-dark-900 text-sm font-bold px-4 py-1 rounded-full">
            MAIS POPULAR
          </span>
        </div>
      )}

      <h3 className="text-2xl font-bold mb-4">{title}</h3>

      <div className="mb-6">
        {originalPrice && (
          <p className={`text-lg line-through ${highlight ? 'text-primary-200' : 'text-dark-400'}`}>
            De {originalPrice}
          </p>
        )}
        <p className="text-4xl font-bold">
          {price}
        </p>
        {installments && (
          <p className={`text-sm ${highlight ? 'text-primary-100' : 'text-dark-500'}`}>
            ou {installments}
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg
              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${highlight ? 'text-primary-200' : 'text-primary-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className={highlight ? 'text-white' : 'text-dark-700'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <CTAButton
        href={ctaHref}
        variant={highlight ? 'secondary' : 'primary'}
        fullWidth
        size="lg"
      >
        {ctaText}
      </CTAButton>
    </div>
  )
}
