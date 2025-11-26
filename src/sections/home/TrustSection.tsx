import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

const stats = [
  {
    label: 'Patients treated',
    value: '1,00,000+',
    numericValue: 100000,
  },
  {
    label: 'Clinics across Punjab',
    value: '4+',
    numericValue: 4,
  },
  {
    label: 'Years of combined experience',
    value: '20+',
    numericValue: 20,
  },
  {
    label: 'Disciplines under one roof',
    value: 'Physio • Osteopathy • Chiropractic',
  },
]

export function TrustSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const valueEls = gsap.utils.toArray<HTMLSpanElement>('.trust-value')

      valueEls.forEach((el) => {
        const target = Number(el.dataset.target ?? '0')
        const suffix = el.dataset.suffix ?? ''

        const counter = { val: 0 }

        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
          onUpdate: () => {
            const formatted = Math.round(counter.val).toLocaleString('en-IN')
            el.textContent = `${formatted}${suffix}`
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-900 text-slate-50 dark:bg-black"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_transparent_70%)]" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 lg:px-6">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const hasNumericValue = typeof item.numericValue === 'number'

            let suffix = ''
            if (hasNumericValue) {
              const match = item.value.match(/[0-9,]+(.*)/)
              suffix = match && match[1] ? match[1] : ''
            }

            return (
              <div
                key={item.label}
                className="trust-card relative flex h-full min-h-[7.5rem] flex-col justify-between overflow-hidden rounded-[1.8rem] border border-sky-500/25 bg-slate-900/70 px-8 py-7 text-sm sm:text-base shadow-[0_26px_80px_rgba(15,23,42,0.9)] transition hover:-translate-y-1.5 hover:border-sky-400/60 hover:shadow-[0_32px_96px_rgba(15,23,42,1)]"
              >
                <div className="space-y-3">
                  <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-500" />
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-sky-300">
                    {item.label}
                  </div>
                  <div className="mt-1 text-lg text-slate-50">
                    {hasNumericValue ? (
                      <span
                        className="trust-value text-3xl sm:text-4xl font-semibold text-slate-50"
                        data-target={item.numericValue}
                        data-suffix={suffix}
                      >
                        0{suffix}
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-50">{item.value}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

