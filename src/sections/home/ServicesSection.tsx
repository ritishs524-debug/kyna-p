import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import servicesBg from '../../assets/images/services-section.jpg'

type PageLabel = 'home' | 'about' | 'services' | 'team' | 'contact'

	const services = [
	  {
	    id: 'physiotherapy',
	    name: 'Physiotherapy',
	  },
	  {
	    id: 'osteopathy',
	    name: 'Osteopathy (Cranial and Visceral)',
	  },
	  {
	    id: 'chiropractic',
	    name: 'Chiropractic',
	  },
	  {
	    id: 'exercise-therapy',
	    name: 'Exercise Therapy',
	  },
	  {
	    id: 'manual-therapy',
	    name: 'Manual Physical Therapy',
	  },
	  {
	    id: 'womens-health',
	    name: "Women's Health Physiotherapy",
	  },
	  {
	    id: 'pelvic-floor',
	    name: 'Pelvic Floor Rehabilitation',
	  },
	  {
	    id: 'falls-prevention',
	    name: 'Evidence-Based Falls Prevention',
	  },
	  {
	    id: 'home-physiotherapy',
	    name: 'Physiotherapy at Home',
	  },
	  {
	    id: 'antenatal-education',
	    name: 'Antenatal / Childbirth Education',
	  },
	] as const

	const marqueeServices = [...services, ...services]

type ServicesSectionProps = {
  onNavigate?: (page: PageLabel) => void
}

	export function ServicesSection({ onNavigate }: ServicesSectionProps) {
	  const sectionRef = useRef<HTMLElement | null>(null)
	  const [isPaused, setIsPaused] = useState(false)

	  // Intro animation for heading + whole carousel (desktop only for performance)
	  useLayoutEffect(() => {
	    const ctx = gsap.context(() => {
	      const prefersReducedMotion =
	        typeof window !== 'undefined' &&
	        window.matchMedia &&
	        window.matchMedia('(prefers-reduced-motion: reduce)').matches

	      const isMobile =
	        typeof window !== 'undefined' &&
	        window.matchMedia &&
	        window.matchMedia('(max-width: 639px)').matches

	      gsap.from('.services-heading', {
	        opacity: 0,
	        y: 28,
	        duration: 0.8,
	        ease: 'power3.out',
	      })

	      // Scroll-triggered animation only on larger screens to avoid jank on mobile
	      if (!prefersReducedMotion && !isMobile) {
	        gsap.from('.services-carousel', {
	          opacity: 0,
	          y: 30,
	          duration: 0.9,
	          ease: 'power3.out',
	          scrollTrigger: {
	            trigger: sectionRef.current,
	            start: 'top 75%',
	          },
	        })
	      }
	    }, sectionRef)

	    return () => ctx.revert()
	  }, [])

	  const handleNavigateToService = (serviceId: (typeof services)[number]['id']) => {
	    if (!onNavigate) return

	    onNavigate('services')

	    // Wait for Services page to render, then smooth-scroll to the card
	    setTimeout(() => {
	      const element = document.getElementById('service-' + serviceId)
	      if (!element) return

	      const headerOffset = 96
	      const rect = element.getBoundingClientRect()
	      const offsetTop = rect.top + window.scrollY - headerOffset

		      window.scrollTo({ top: offsetTop, behavior: 'smooth' })

		      // Briefly highlight the target card so the user sees which one they selected
		      element.classList.add('service-card--highlight')
		      setTimeout(() => {
		        element.classList.remove('service-card--highlight')
		      }, 2600)
	    }, 0)
	  }

	  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden text-slate-900 dark:text-slate-50"
      style={{
		        backgroundImage: `url(${servicesBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
			      {/* Overlay: softer fade in light mode, stronger tint in dark mode */}
			      <div
			        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/65 via-white/45 to-white/30 dark:from-slate-950/40 dark:via-slate-950/75 dark:to-slate-950/95"
			      />
			      <div className="relative z-20 mx-auto max-w-6xl px-4 py-20 lg:px-6">
	        <div className="mb-10 space-y-3 text-center">
	          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
	            What We Offer
	          </p>
	          <h2 className="services-heading text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
	            Services at KYNA Physiotherapy
	          </h2>
	          <p className="text-[0.7rem] text-slate-500 sm:text-xs dark:text-slate-400">About our services</p>
	          <p className="mx-auto max-w-2xl text-xs text-slate-600 sm:text-sm dark:text-slate-500">
	            From acute injury rehab to chronic pain management and preventive programmes, our
	            clinics combine physiotherapy, osteopathy, chiropractic care and exercise therapy.
	          </p>
	        </div>

	        {/* MOBILE: auto-scrolling marquee of cards (infinite loop) */}
	        <div className="sm:hidden">
	          <div className="services-carousel services-marquee-viewport-mobile pb-4 pt-1">
	            <div className="services-marquee-track-mobile">
			              {marqueeServices.map((service, index) => (
	                <button
	                  key={`${service.id}-mobile-${index}`}
	                  type="button"
	                  onClick={() => handleNavigateToService(service.id)}
		                  className="services-card service-card group flex h-[280px] w-[230px] flex-shrink-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white bg-gradient-to-b from-white via-sky-50/70 to-sky-100/80 p-4 text-left text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 dark:border-slate-800/80 dark:bg-slate-900/90 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950"
		                >
		                  <div className="mb-3 h-24 w-full rounded-2xl bg-gradient-to-br from-sky-50 via-sky-100 to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950" />
	                  <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
	                    {service.name}
	                  </p>
	                  <p className="line-clamp-2 text-[0.72rem] leading-relaxed text-slate-600 dark:text-slate-400">
	                    Evidence-based care tailored to your specific condition, with a focus on safer, faster
	                    recovery and long-term function.
	                  </p>
	                  <span className="mt-3 inline-flex cursor-pointer items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-600 group-hover:text-sky-500 dark:text-sky-300 dark:group-hover:text-sky-200">
	                    Read more
	                    <span aria-hidden="true">→</span>
	                  </span>
	                </button>
	              ))}
	            </div>
	          </div>
	        </div>
	      </div>

	      {/* DESKTOP/TABLET: full-width, infinite auto-scrolling row of cards */}
	      <div
	        className="relative z-20 hidden w-screen -translate-x-1/2 transform left-1/2 sm:block"
	        onMouseEnter={() => setIsPaused(true)}
	        onMouseLeave={() => setIsPaused(false)}
	      >
	        <div className="services-carousel services-marquee-viewport overflow-hidden px-4 pb-8 sm:px-8 lg:px-16">
	          <div
	            className="services-marquee-track flex gap-5"
	            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
	          >
			            {marqueeServices.map((service, index) => (
                <button
                  key={`${service.id}-${index}`}
                  type="button"
                  onClick={() => handleNavigateToService(service.id)}
                  className="services-card service-card group flex h-[290px] w-60 flex-shrink-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white bg-gradient-to-b from-white via-sky-50/70 to-sky-100/80 p-5 text-left text-sm transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 dark:border-slate-800/80 dark:bg-slate-950/90 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950"
		                >
		                <div className="mb-4 h-28 w-full rounded-2xl bg-gradient-to-br from-sky-50 via-sky-100 to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950" />
	                <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
	                  {service.name}
	                </p>
	                <p className="mb-3 line-clamp-2 text-[0.72rem] leading-relaxed text-slate-600 dark:text-slate-400">
	                  Evidence-based care tailored to your specific condition, with a focus on safer, faster
	                  recovery and long-term function.
	                </p>
	                <span className="mt-auto inline-flex cursor-pointer items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-600 group-hover:text-sky-500 dark:text-sky-300 dark:group-hover:text-sky-200">
	                  Read more
	                  <span aria-hidden="true">→</span>
	                </span>
	              </button>
	            ))}
	          </div>
	        </div>
	      </div>
	    </section>
	  )
}

