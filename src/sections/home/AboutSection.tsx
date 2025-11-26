import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-col', {
        opacity: 0,
        y: 26,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.15,
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
      className="relative overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="relative z-20 mx-auto grid max-w-6xl gap-10 px-4 py-24 lg:grid-cols-[1.4fr,1fr] lg:px-6">
        <div className="about-col space-y-4">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.28em] text-sky-500 sm:text-sm dark:text-sky-300">
            Discover a New You
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            Welcome to KYNA Physiotherapy
          </h2>
          <p className="text-base leading-relaxed text-slate-800 sm:text-lg dark:text-slate-300">
            KYNA runs advanced physiotherapy clinics focused on clear, structured rehab and
            long-term wellbeing.
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-800 sm:text-lg dark:text-slate-300">
            We treat sports injuries, post-surgery recovery, chronic pain and everyday stiffness
            with personalised, one-to-one guidance.
          </p>
          <ul className="mt-4 grid gap-2 text-base text-slate-800 sm:grid-cols-2 dark:text-slate-200">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
              Whole-body, holistic assessment
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
              Evidence-based treatment plans
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
              Personalised follow-up and support
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
              Focus on long-term prevention
            </li>
          </ul>
        </div>

        <div className="about-col relative">
          <div className="relative flex items-center gap-5 overflow-hidden rounded-[2.4rem] border border-slate-200/80 bg-gradient-to-r from-[#e6f3ff] via-white to-[#e6f3ff] px-8 py-7 text-sm shadow-[0_26px_80px_rgba(15,23,42,0.18)] dark:border-slate-700/80 dark:bg-gradient-to-r dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-900/90 dark:shadow-[0_26px_80px_rgba(15,23,42,0.9)]">
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 opacity-90 blur-[1px]" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_16px_40px_rgba(15,23,42,0.28)]">
                <img
                  src="/src/assets/logo/kyna_withoutbg-04.PNG"
                  alt="Kyna logo"
                  className="h-7 w-7 object-contain"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.36em] text-sky-500">
                Highly Qualified Specialists
              </p>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Our team is made up of licensed physiotherapists with advanced training in their
                specialities.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                From sports and orthopaedic rehab to cranial osteopathy and women&apos;s health, our
                specialists plan your care together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

