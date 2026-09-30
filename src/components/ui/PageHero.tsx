'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { color, dark, container, motion as m } from '../../lib/design-tokens'

type PageHeroProps = {
  /** Small blue label above the H1. */
  eyebrow: string
  /** The single H1 for the page. */
  title: ReactNode
  /** Supporting paragraph. */
  intro?: ReactNode
  /** Optional right-hand visual (image, card, form…). */
  aside?: ReactNode
  /** Extra controls rendered under the intro, e.g. buttons. */
  actions?: ReactNode
  children?: ReactNode
}

/**
 * The one hero every inner page uses.
 *
 * A variation of the Home hero, not a copy: same soft-blue atmosphere, same
 * container width, same type scale and same accent blue — but a centred,
 * editorial layout with an optional right-hand column. Home keeps its own
 * bespoke two-column hero.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  aside,
  actions,
  children,
}: PageHeroProps) {
  const reduce = useReducedMotion()
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: m.duration, ease: m.ease, delay },
        }

  return (
    <section className="relative overflow-hidden bg-[#F4FAFF] pt-14 pb-16 lg:pt-20 lg:pb-20 dark:bg-slate-950">
      {/* Soft glows — same recipe as Home's hero, quieter. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-gradient-to-bl from-sky-200/40 via-cyan-100/30 to-transparent blur-3xl dark:from-sky-950/30 dark:via-slate-900/40" />
        <div className="absolute top-1/2 -left-40 h-[440px] w-[440px] rounded-full bg-gradient-to-tr from-cyan-100/30 via-sky-100/20 to-transparent blur-3xl dark:from-cyan-950/20 dark:via-slate-900/30" />
      </div>

      <div className={container.wide}>
        <div
          className={
            aside
              ? 'grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16'
              : 'mx-auto max-w-4xl text-center'
          }
        >
          {/* Copy column */}
          <div className={aside ? '' : 'mx-auto'}>
            <motion.p
              {...enter(0)}
              className={`text-[13px] font-semibold tracking-[0.28em] uppercase ${color.blue} ${dark.eyebrow}`}
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              {...enter(0.07)}
              className={`mt-4 text-balance text-[36px] leading-[1.1] font-extrabold tracking-tight text-[#0B2347] sm:text-[46px] lg:text-[54px] ${dark.heading}`}
            >
              {title}
            </motion.h1>

            {intro && (
              <motion.p
                {...enter(0.14)}
                className={`mt-6 text-[16px] leading-[1.7] text-slate-600 sm:text-[17px] ${aside ? 'max-w-[560px]' : 'mx-auto max-w-[720px]'} ${dark.subheading}`}
              >
                {intro}
              </motion.p>
            )}

            {actions && (
              <motion.div
                {...enter(0.2)}
                className={`mt-8 flex flex-wrap items-center gap-4 ${aside ? '' : 'justify-center'}`}
              >
                {actions}
              </motion.div>
            )}

            {children}
          </div>

          {/* Optional visual column */}
          {aside && (
            <motion.div {...enter(0.12)} className="relative">
              {aside}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
