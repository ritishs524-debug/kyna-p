import { useEffect, useRef, useState } from 'react'

const services = [
  'Physiotherapy',
  'Osteopathy (Cranial and Visceral)',
  'Chiropractic',
  'Exercise Therapy',
  'Manual Physical Therapy',
  "Women's Health Physiotherapy",
  'Pelvic Floor Rehabilitation',
  'Evidence-Based Falls Prevention',
  'Physiotherapy at Home',
  'Antenatal / Childbirth Education',
]

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

	  const goToPrevious = () => {
	    setActiveIndex((prev) => (prev - 1 + services.length) % services.length)
	  }

	  const goToNext = () => {
	    setActiveIndex((prev) => (prev + 1) % services.length)
	  }

  useEffect(() => {
    if (isPaused) return

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length)
    }, 4500)

    return () => window.clearInterval(id)
  }, [isPaused])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden text-slate-900 dark:text-slate-50"
      style={{
        backgroundImage: 'url(/src/assets/images/services-section.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-white/65 dark:bg-slate-950/70" />

      <div className="relative z-20 mx-auto max-w-6xl px-4 py-20 lg:px-6">
        <div className="mb-10 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
            What We Offer
          </p>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            Services at KYNA Physiotherapy
          </h2>
          <p className="text-[0.7rem] text-slate-500 sm:text-xs dark:text-slate-400">About our services</p>
          <p className="mx-auto max-w-2xl text-xs text-slate-600 sm:text-sm dark:text-slate-500">
            From acute injury rehab to chronic pain management and preventive programmes, our
            clinics combine physiotherapy, osteopathy, chiropractic care and exercise therapy.
          </p>
        </div>

	        <div
	          className="space-y-6"
	          onMouseEnter={() => setIsPaused(true)}
	          onMouseLeave={() => setIsPaused(false)}
	        >
	          <div className="flex items-stretch justify-center sm:hidden">
	            <button
	              type="button"
	              className="service-card group relative flex w-full max-w-xs flex-row items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-5 text-left text-sm shadow-[0_18px_50px_rgba(15,23,42,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 dark:border-slate-800/80 dark:bg-slate-900/90"
	            >
	              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4b55ad] to-sky-500 text-[0.8rem] font-bold text-white shadow-[0_10px_28px_rgba(56,189,248,0.55)]">
	                ☆
	              </div>
	              <div className="space-y-2">
	                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
	                  {services[activeIndex]}
	                </p>
	                <p className="text-[0.7rem] text-slate-600 dark:text-slate-400">
	                  Evidence-based care tailored to your specific condition, with a focus on safer, faster recovery and long-term function.
	                </p>
	                <span className="mt-1 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">
	                  Read more
	                </span>
	              </div>
	            </button>
	          </div>

	          <div className="hidden items-stretch justify-center gap-4 sm:flex sm:gap-6">
            {[-1, 0, 1].map((offset) => {
              const index = (activeIndex + offset + services.length) % services.length
              const name = services[index]
              const isActive = offset === 0

              return (
                <button
                  key={offset}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`service-card group relative flex w-full max-w-xs flex-row items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-5 text-left text-sm shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 dark:border-slate-800/80 dark:bg-slate-900/90 ${isActive ? 'ring-1 ring-sky-400/60' : ''}`}
                >
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4b55ad] to-sky-500 text-[0.8rem] font-bold text-white shadow-[0_10px_28px_rgba(56,189,248,0.55)]">☆</div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</p>
                    <p className="text-[0.7rem] text-slate-600 dark:text-slate-400">
                      Evidence-based care tailored to your specific condition, with a focus on safer, faster recovery and long-term function.
                    </p>
                    <span className="mt-1 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">
                      Read more
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

	          <div className="mt-4 flex items-center justify-center gap-6">
	            <button
	              type="button"
	              onClick={goToPrevious}
	              aria-label="Previous service"
	              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/70 bg-white/80 text-sky-600 shadow-[0_10px_25px_rgba(56,189,248,0.45)] backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 dark:border-sky-500/60 dark:bg-slate-900/80"
	            >
	              <span className="text-lg leading-none">{'<'}</span>
	            </button>
	            <button
	              type="button"
	              onClick={goToNext}
	              aria-label="Next service"
	              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/70 bg-white/80 text-sky-600 shadow-[0_10px_25px_rgba(56,189,248,0.45)] backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 dark:border-sky-500/60 dark:bg-slate-900/80"
	            >
	              <span className="text-lg leading-none">{'>'}</span>
	            </button>
	          </div>

	          <div className="flex items-center justify-center gap-2">
            {services.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex
                    ? 'w-5 bg-sky-500 dark:bg-sky-400'
                    : 'w-2.5 bg-slate-400 hover:bg-slate-500 dark:bg-slate-600'
                }`}
              >
                <span className="sr-only">Go to slide {index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

