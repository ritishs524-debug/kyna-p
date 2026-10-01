'use client'

import type { ReactNode } from 'react'
import {
  btnGhost,
  btnPrimaryLegacy,
  cardFeature,
  color,
  container,
  dark,
  eyebrow,
} from '../../lib/design-tokens'
import { Reveal } from './Reveal'

type CTASectionProps = {
  eyebrow?: string
  title: ReactNode
  body?: ReactNode
  primaryLabel?: string
  /** Called when the primary button is pressed (usually navigate to /contact). */
  onPrimary?: () => void
  secondaryLabel?: string
  secondaryHref?: string
  secondaryOnClick?: () => void
  className?: string
}

/**
 * The closing call-to-action shared by every page, Home included.
 *
 * Home used to render its own copy of this card. It now delegates here (see
 * `FinalCtaSection`), so there is exactly one definition of the card's
 * gradient, eyebrow, type scale and button pair.
 */
export function CTASection({
  eyebrow: eyebrowText = 'Ready to Start Your Recovery Journey?',
  title,
  body = 'Share your pain, sports injury or movement goals with our specialists and discover a personalised roadmap back to confident, pain-free movement.',
  primaryLabel = 'Book Free Consultation',
  onPrimary,
  secondaryLabel = 'Call 98781 82115',
  secondaryHref = 'tel:9878182115',
  secondaryOnClick,
  className = '',
}: CTASectionProps) {
  return (
    <section
      data-cta
      className={`relative overflow-hidden bg-white pt-16 pb-16 lg:pt-20 lg:pb-24 dark:bg-slate-950 ${className}`}
    >
      <div className={container.content}>
        <Reveal
          className={`relative overflow-hidden ${cardFeature} ${dark.cardFeature} px-6 py-12 text-center sm:px-12`}
        >
          <div className="relative space-y-4">
            {eyebrowText && (
              <p className={`${eyebrow} ${color.blue} ${dark.eyebrow}`}>{eyebrowText}</p>
            )}

            <h2
              className={`text-balance text-[26px] leading-[1.2] font-bold tracking-tight ${color.navy} sm:text-[32px] ${dark.heading}`}
            >
              {title}
            </h2>

            {body && (
              <p className="mx-auto max-w-xl text-[15px] leading-[1.7] text-slate-500 dark:text-slate-400">
                {body}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <button
                type="button"
                onClick={onPrimary}
                className={`${btnPrimaryLegacy} h-[52px] px-9 text-[11px]`}
              >
                {primaryLabel}
              </button>

              {secondaryLabel && (
                <a
                  href={secondaryHref}
                  onClick={secondaryOnClick}
                  className={`${btnGhost} h-[52px] px-8 text-[11px]`}
                >
                  {secondaryLabel}
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
