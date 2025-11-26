import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import homePageVideo from '../../assets/videos/home-page2.mp4'

const heroHighlights = [
  {
    label: 'Expert Physiotherapy Service',
    title: 'Revealing, restoring, and enhancing muscles',
    description: 'with extra care and attention.',
  },
  {
    label: 'Holistic Approach to Rehabilitation',
    title: 'Integrative therapies for whole-body wellness',
    description: 'with an emphasis on injury prevention.',
  },
  {
    label: 'Personalized Treatment Plans',
    title: 'Tailored programmes for each patient',
    description: 'with progress monitoring and adjustments.',
  },
]

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-overlay', {
        opacity: 0,
        duration: 0.6,
      })
        .from(
          '.hero-badge',
          {
            opacity: 0,
            y: -20,
            duration: 0.6,
          },
          '-=0.3',
        )
        .from(
          '.hero-heading',
          {
            opacity: 0,
            y: 32,
            duration: 0.8,
            filter: 'blur(8px)',
          },
          '-=0.2',
        )
        .from(
          '.hero-copy',
          {
            opacity: 0,
            y: 24,
            duration: 0.7,
          },
          '-=0.4',
        )
        .from(
          '.hero-actions',
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          '-=0.4',
        )
        .from(
          '.hero-highlight-card',
          {
            opacity: 0,
            y: 28,
            scale: 0.96,
            duration: 0.7,
            stagger: 0.15,
            clearProps: 'all',
          },
          '-=0.2',
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={homePageVideo} type="video/mp4" />
      </video>

      <div className="pointer-events-none hero-overlay absolute inset-0 z-10 bg-slate-100/10 dark:bg-slate-950/60" />

      <div className="relative z-20 mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-28 lg:flex-row lg:items-center lg:gap-16 lg:px-6 lg:pb-28 lg:pt-32">
        <div className="max-w-xl space-y-6">
          <div className="hero-badge inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm dark:bg-slate-900/80 dark:text-sky-300">
            Intelligent Rehab
            <span className="h-1 w-1 rounded-full bg-sky-400" />
            Punjab Clinics
          </div>

          <div className="space-y-4">
            <h1 className="hero-heading text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-50">
              Expert Physiotherapy &amp; Holistic Rehab for a New You.
            </h1>
            <p className="hero-copy max-w-lg text-base leading-relaxed text-slate-800 sm:text-lg dark:text-slate-300">
              KYNA Physiotherapy operates advanced physiotherapy clinics in Patiala and Samana,
              delivering intelligent, evidence-based rehabilitation with a focus on whole body
              wellbeing and long-term recovery.
            </p>
          </div>

          <div className="hero-actions flex flex-wrap items-center gap-4 pt-2">
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

          <p className="text-xs font-medium uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
            Patiala • Samana
          </p>
        </div>

        <div className="relative flex-1">
          <div className="grid gap-4 sm:grid-cols-1">
            {heroHighlights.map((item) => (
              <div
                key={item.label}
                className="hero-highlight-card relative flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-sm shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.28)] dark:border-slate-800/80 dark:bg-slate-900/90"
              >
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4b55ad] to-sky-500 text-[0.8rem] font-bold text-white shadow-[0_10px_28px_rgba(56,189,248,0.55)]">
                  ☆
                </div>
                <div className="space-y-1">
                  <div className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-sky-500/80">
                    {item.label}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

