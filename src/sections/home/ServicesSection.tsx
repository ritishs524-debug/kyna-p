import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'

// Re-use the same media used on the Services page for each topic
import physiotherapyImg from '../../assets/images/services/1. pyhsiotherapy.jpg'
import osteopathyVideo from '../../assets/images/services/2. osteopathy.mp4'
import chiropracticImg from '../../assets/images/services/3. chiropractic.jpg'
import exerciseTherapyVideo from '../../assets/images/services/4. exercise therapy.mp4'
import manualTherapyImg from '../../assets/images/services/5. manual pyhsical therapy.jpg'
import womensHealthVideo from '../../assets/images/services/6. woman healyh physiotherapy.mp4'
import pelvicFloorImg from '../../assets/images/services/7. Pelvic Floor Rehabilitation.jpg'
import fallsPreventionVideo from '../../assets/images/services/8.  Evidence-Based Falls Prevention.mp4'
import homePhysioImg from '../../assets/images/services/9 Physiotherapy at Home.jpg'
import childbirthEducationVideo from '../../assets/images/services/10 . Childbirth Education.mp4'

type PageLabel = 'home' | 'about' | 'services' | 'team' | 'contact'

const services = [
	  {
	    id: 'physiotherapy',
	    name: 'Physiotherapy',
	    mediaType: 'image' as const,
	    mediaSrc: physiotherapyImg,
	  },
	  {
	    id: 'osteopathy',
	    name: 'Osteopathy (Cranial and Visceral)',
	    mediaType: 'video' as const,
	    mediaSrc: osteopathyVideo,
	  },
	  {
	    id: 'chiropractic',
	    name: 'Chiropractic',
	    mediaType: 'image' as const,
	    mediaSrc: chiropracticImg,
	  },
	  {
	    id: 'exercise-therapy',
	    name: 'Exercise Therapy',
	    mediaType: 'video' as const,
	    mediaSrc: exerciseTherapyVideo,
	  },
	  {
	    id: 'manual-therapy',
	    name: 'Manual Physical Therapy',
	    mediaType: 'image' as const,
	    mediaSrc: manualTherapyImg,
	  },
	  {
	    id: 'womens-health',
	    name: "Women's Health Physiotherapy",
	    mediaType: 'video' as const,
	    mediaSrc: womensHealthVideo,
	  },
	  {
	    id: 'pelvic-floor',
	    name: 'Pelvic Floor Rehabilitation',
	    mediaType: 'image' as const,
	    mediaSrc: pelvicFloorImg,
	  },
	  {
	    id: 'falls-prevention',
	    name: 'Evidence-Based Falls Prevention',
	    mediaType: 'video' as const,
	    mediaSrc: fallsPreventionVideo,
	  },
	  {
	    id: 'home-physiotherapy',
	    name: 'Physiotherapy at Home',
	    mediaType: 'image' as const,
	    mediaSrc: homePhysioImg,
	  },
	  {
	    id: 'antenatal-education',
	    name: 'Antenatal / Childbirth Education',
	    mediaType: 'video' as const,
	    mediaSrc: childbirthEducationVideo,
	  },
	] as const

type ServicesSectionProps = {
  onNavigate?: (page: PageLabel) => void
}

	export function ServicesSection({ onNavigate }: ServicesSectionProps) {
	  const sectionRef = useRef<HTMLElement | null>(null)
	  const [isPaused, setIsPaused] = useState(false)

	  // Intro animation for heading + whole carousel (not individual cards)
	  useLayoutEffect(() => {
	    const ctx = gsap.context(() => {
	      gsap.from('.services-heading', {
	        opacity: 0,
	        y: 28,
	        duration: 0.8,
	        ease: 'power3.out',
	      })

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
	    }, 0)
	  }

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

	        {/* MOBILE: horizontally scrollable row of cards */}
	        <div className="sm:hidden">
	          <div className="services-carousel -mx-4 overflow-x-auto px-1 pb-3 pt-1">
	            <div className="flex gap-4 px-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleNavigateToService(service.id)}
                  className="services-card service-card group flex h-[290px] min-w-[240px] max-w-[260px] flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white bg-gradient-to-b from-white via-sky-50/70 to-sky-100/80 p-4 text-left text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 dark:border-slate-800/80 dark:bg-slate-900/90 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950"
                >
	                  <div className="mb-3 h-24 w-full overflow-hidden rounded-2xl bg-slate-100/90 dark:bg-slate-800/80">
	                    {service.mediaType === 'image' ? (
	                      <img
	                        src={service.mediaSrc}
	                        alt={service.name}
	                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
	                      />
	                    ) : (
	                      <video
	                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
	                        preload="metadata"
	                      >
	                        <source src={service.mediaSrc} type="video/mp4" />
	                      </video>
	                    )}
	                  </div>
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
              {[...services, ...services].map((service, index) => (
                <button
                  key={`${service.id}-${index}`}
                  type="button"
                  onClick={() => handleNavigateToService(service.id)}
                  className="services-card service-card group flex h-[290px] w-60 flex-shrink-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white bg-gradient-to-b from-white via-sky-50/70 to-sky-100/80 p-5 text-left text-sm transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 dark:border-slate-800/80 dark:bg-slate-950/90 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950"
                >
	                <div className="mb-4 h-28 w-full overflow-hidden rounded-2xl bg-slate-100/90 dark:bg-slate-800/80">
	                  {service.mediaType === 'image' ? (
	                    <img
	                      src={service.mediaSrc}
	                      alt={service.name}
	                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
	                    />
	                  ) : (
	                    <video
	                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
	                      preload="metadata"
	                    >
	                      <source src={service.mediaSrc} type="video/mp4" />
	                    </video>
	                  )}
	                </div>
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

