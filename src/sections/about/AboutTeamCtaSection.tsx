import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

export function AboutTeamCtaSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-team-cta-inner', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="pb-6">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="about-team-cta-inner relative mt-6 overflow-hidden rounded-[2.2rem] border border-sky-100/90 bg-gradient-to-r from-[#e3f2ff] via-[#f5f9ff] to-[#dceeff] px-6 py-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.18)] dark:border-slate-700/70 dark:bg-slate-900/95 dark:bg-none sm:px-12">
          <div className="relative space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700/90 dark:text-sky-300">
              We have High-Level Professionals in our Team
            </p>
            <p className="mx-auto max-w-2xl text-sm text-slate-700 dark:text-slate-300">
              Each member of our team has undergone extensive training and holds the necessary qualifications
              and certifications in their respective fields.
            </p>
            <div className="flex justify-center pt-2">
              <button
                type="button"
                className="rounded-full bg-gradient-to-r from-[#4b55ad] to-sky-500 px-10 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white shadow-[0_18px_45px_rgba(56,189,248,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(56,189,248,0.75)]"
              >
                Our Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

