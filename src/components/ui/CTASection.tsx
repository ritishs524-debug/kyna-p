'use client'

import type { ReactNode } from 'react'
import {
  btnGhost,
  btnOutline,
  btnPrimary,
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
 * The closing call-to-action shared by every inner page.
 *
 * Visually identical to Home's `FinalCtaSection` (same gradient card, same
 * eyebrow, same button pair) so the last thing a visitor sees on any page
 * matches the last thing they see on Home.
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

/** Convenience: the two buttons the CTA uses, for pages that need them inline. */
export function CTAButtons({
  primaryLabel,
  onPrimary,
  secondaryLabel,
  secondaryHref,
}: Pick<
  CTASectionProps,
  'primaryLabel' | 'onPrimary' | 'secondaryLabel' | 'secondaryHref'
>) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={onPrimary}
        className={`${btnPrimary} h-[52px] px-8 text-[15px] lg:h-[58px] lg:px-9 lg:text-base`}
      >
        {primaryLabel}
        <span aria-hidden="true">→</span>
      </button>
      {secondaryLabel && secondaryHref && (
        <a
          href={secondaryHref}
          className={`${btnOutline} h-[52px] px-7 text-[15px] lg:h-[58px] lg:px-8 lg:text-base`}
        >
          {secondaryLabel}
        </a>
      )}
    </div>
  )
}
