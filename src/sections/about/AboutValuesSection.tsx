import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

export function AboutValuesSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-values-pill', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-slate-200/80 bg-slate-50/90 py-12 text-slate-900 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-50"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="max-w-xl space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500">Our Values</h2>
          <p className="leading-relaxed text-slate-800 dark:text-slate-200">
            We work on providing you a memorable experience as well as building a PATIENT-THERAPIST
            relationship where we determine your existing level of functional ability and your expected
            outcomes. Together, we formulate a plan for obtaining and maintaining those outcomes. It is a
            simple process  expertise  commitment  implementation. The end result is a complete wellness and
            Rehabilitation.
          </p>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300">
          <span className="about-values-pill rounded-full bg-white/90 px-4 py-2 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-slate-700/80">
            Expertise
          </span>
          <span className="about-values-pill rounded-full bg-white/90 px-4 py-2 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-slate-700/80">
            Commitment
          </span>
          <span className="about-values-pill rounded-full bg-white/90 px-4 py-2 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-slate-700/80">
            Implementation
          </span>
          <span className="about-values-pill rounded-full bg-gradient-to-r from-[#4b55ad] to-sky-500 px-4 py-2 text-slate-50 shadow-[0_16px_40px_rgba(15,23,42,0.45)]">
            Complete Wellness &amp; Rehabilitation
          </span>
        </div>
      </div>
    </section>
  )
}

