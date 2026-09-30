import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Users, Building2, CalendarDays, ShieldCheck } from 'lucide-react'
import { gsap } from '../../lib/gsap'

const stats: {
  label: string
  value: string
  numericValue?: number
  icon: LucideIcon
  iconTone: string
}[] = [
  {
    label: 'Patients treated',
    value: '99,999+',
    numericValue: 99999,
    icon: Users,
    iconTone: 'bg-[#E8F4FD] text-[#1683FF] dark:bg-sky-950/50 dark:text-sky-400',
  },
  {
    label: 'Clinics across Punjab',
    value: '4+',
    numericValue: 4,
    icon: Building2,
    iconTone: 'bg-[#E6F8F0] text-[#12A87A] dark:bg-emerald-950/50 dark:text-emerald-400',
  },
  {
    label: 'Years of combined experience',
    value: '20+',
    numericValue: 20,
    icon: CalendarDays,
    iconTone: 'bg-[#F1EBFC] text-[#7C5CE0] dark:bg-violet-950/50 dark:text-violet-300',
  },
  {
    label: 'Disciplines under one roof',
    value: 'Physio • Osteopathy • Chiropractic',
    icon: ShieldCheck,
    iconTone: 'bg-[#E4F7F5] text-[#00C9A7] dark:bg-teal-950/50 dark:text-teal-300',
  },
]

export function TrustSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [, setHasRun] = useState(false)

  useEffect(() => setHasRun(true), [])

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
          // The real value is already rendered on first paint, so leave it in
          // place if the trigger never fires (e.g. reduced motion / no scroll).
          onComplete: () => {
            el.textContent = `${target.toLocaleString('en-IN')}${suffix}`
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F2F9FF] dark:bg-slate-950"
    >
      {/* Subtle background wash */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-28 -left-24 h-[320px] w-[420px] rounded-full bg-sky-100/60 blur-3xl dark:bg-sky-950/25" />
        <div className="absolute -right-24 -bottom-24 h-[320px] w-[420px] rounded-full bg-sky-100/50 blur-3xl dark:bg-sky-950/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const numeric = item.numericValue
            const hasNumericValue = typeof numeric === 'number'
            const IconComponent = item.icon

            let suffix = ''
            if (hasNumericValue) {
              const match = item.value.match(/[0-9,]+(.*)/)
              suffix = match && match[1] ? match[1] : ''
            }

            return (
              <div
                key={item.label}
                className="flex h-full min-h-[150px] items-center gap-4 rounded-[18px] border border-sky-100 bg-white px-6 py-7 shadow-[0_6px_22px_rgba(11,35,71,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_6px_22px_rgba(0,0,0,0.3)]"
              >
                {/* Circular icon */}
                <span
                  className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ${item.iconTone}`}
                >
                  <IconComponent className="h-[22px] w-[22px]" strokeWidth={1.9} />
                </span>

                {/* Label + value */}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] leading-[1.5] font-semibold tracking-[0.14em] text-slate-500 uppercase dark:text-slate-400">
                    {item.label}
                  </p>

                  {hasNumericValue ? (
                    <span
                      className="trust-value mt-2 block text-[38px] leading-none font-bold tracking-tight text-[#0B2347] dark:text-white"
                      data-target={numeric}
                      data-suffix={suffix}
                    >
                      {numeric.toLocaleString('en-IN')}
                      {suffix}
                    </span>
                  ) : (
                    <p className="mt-2 text-[15px] leading-[1.45] font-semibold text-[#0B2347] dark:text-white">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
