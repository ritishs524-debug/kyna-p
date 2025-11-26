import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-inner', {
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
    <section ref={sectionRef} className="pb-4">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="cta-inner relative mt-[18px] overflow-hidden rounded-[2.5rem] border border-sky-100/90 bg-gradient-to-r from-[#e3f2ff] via-[#f5f9ff] to-[#dceeff] px-6 py-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.18)] dark:border-sky-500/60 dark:bg-gradient-to-r dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-900/90 dark:shadow-[0_24px_80px_rgba(15,23,42,0.9)] sm:px-12">
          <div className="relative space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700/90 dark:text-sky-300">
              Ready to Start Your Recovery Journey?
            </p>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
              Book a free consultation at KYNA Physiotherapy today.
            </h2>
            <p className="mx-auto max-w-xl text-sm text-slate-600 dark:text-slate-300">
              Share your pain, sports injury or movement goals with our specialists and discover a
              personalised roadmap back to confident, pain-free movement.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                className="rounded-full bg-gradient-to-r from-[#4b55ad] to-sky-500 px-10 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white shadow-[0_18px_45px_rgba(56,189,248,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(56,189,248,0.75)]"
              >
                Book Free Consultation
              </button>
              <a
                href="tel:9878182115"
                className="rounded-full border border-slate-200/80 bg-white/90 px-9 py-2.5 text-xs font-semibold uppercase tracking-[0.32em] text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-300/80 hover:text-slate-900/90 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-50 dark:hover:border-sky-400/80"
              >
                Call 98781 82115
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

