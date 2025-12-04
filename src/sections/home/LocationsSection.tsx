import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import kynaLogo from '../../assets/logo/kyna_withoutbg-01.PNG'
import locationsVideo from '../../assets/images/locations/locations.mp4'

type PageLabel = 'home' | 'about' | 'services' | 'team' | 'contact'

type LocationsSectionProps = {
  onNavigate?: (page: PageLabel) => void
}

const locations = [
  {
    name: 'Patiala',
    address: 'SCF-34, DLF Colony, Patiala',
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.179410946937!2d76.37964937524664!3d30.344569104329872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3910288d9b66e069%3A0x6f21c2f478255502!2sKYNA%20Physiotherapy!5e0!3m2!1sen!2sin!4v1732171520000!5m2!1sen!2sin',
  },
  {
    name: 'Anamiva Physiotherapy',
    address:
      'Sco 7-8, behind moti Palace, Malwa Colony, Rose Avenue, New Officers Colony, Patiala, Punjab 147001',
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.179410946937!2d76.37964937524664!3d30.344569104329872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3910288d9b66e069%3A0x6f21c2f478255502!2sKYNA%20Physiotherapy!5e0!3m2!1sen!2sin!4v1732171520000!5m2!1sen!2sin',
  },
  {
    name: 'Samana',
    address:
      'Krishna Basti, opp. Jain Terapanthi Sabha, near Ganpati Jeweller, Waraich Colony, Samana, Punjab 147101',
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3435.9812221160025!2d76.19591007524107!3d30.188621706416732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39104411f0a0e529%3A0x7d597240fdfd1fab!2sKrishna%20Basti%2C%20Samana%2C%20Punjab%20147101!5e0!3m2!1sen!2sin!4v1732171860000!5m2!1sen!2sin',
  },
] as const

const logoNames = [
  'KYNA Physiotherapy Patiala',
  'KYNA Physiotherapy Sangrur',
  'KYNA Physiotherapy Samana',
  'Anamiva Physiotherapy',
  'Good Life Physiotherapy',
  "Women's Care Physiotherapy",
] as const

export function LocationsSection({ onNavigate }: LocationsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
	    const ctx = gsap.context(() => {
	      const prefersReducedMotion =
	        typeof window !== 'undefined' &&
	        window.matchMedia &&
	        window.matchMedia('(prefers-reduced-motion: reduce)').matches

	      if (!prefersReducedMotion) {
	        const tl = gsap.timeline({
	          scrollTrigger: {
	            trigger: '.locations-cinematic',
	            start: 'top top',
	            end: '+=200%',
	            scrub: 1.1,
	            pin: true,
	            anticipatePin: 1,
	          },
	          defaults: { ease: 'power3.out' },
	        })

	        tl
	          .from('.locations-hero-parallax', {
	            scale: 0.96,
	            duration: 0.5,
	          })
	          .to(
	            '.locations-hero-parallax',
	            {
	              yPercent: 12,
	              duration: 1.4,
	            },
	            0
	          )
	          .from(
	            '.locations-hero-logo',
	            {
	              scale: 0.9,
	              filter: 'blur(12px)',
	              duration: 0.6,
	              ease: 'power3.out',
	            },
	            0
	          )
	          .from(
	            '.locations-tree',
	            {
	              opacity: 0,
	              y: 32,
	              duration: 1,
	              ease: 'power3.out',
	            },
	            0.2
	          )
	          .from(
	            '.locations-trunk-line',
	            {
	              scaleY: 0,
	              transformOrigin: 'top center',
	              duration: 1,
	              ease: 'power2.out',
	            },
	            0.35
	          )
	          .from(
	            '.locations-branch-line',
	            {
	              scaleX: 0,
	              transformOrigin: 'center',
	              duration: 1,
	              ease: 'power2.out',
	              stagger: 0.16,
	            },
	            0.5
	          )
	          .from(
	            '.locations-branch-pill',
	            {
	              opacity: 0,
	              y: 18,
	              filter: 'blur(14px)',
	              duration: 1,
	              ease: 'power3.out',
	              stagger: 0.18,
	            },
	            0.58
	          )
	          .to(
	            '.locations-hero-parallax',
	            {
	              scale: 0.78,
	              opacity: 0,
	              duration: 0.9,
	              ease: 'power2.inOut',
	            },
	            '+=0.7'
	          )
	          .to(
	            '.locations-cinematic',
	            {
	              opacity: 0,
	              duration: 0.7,
	              ease: 'power2.inOut',
	            },
	            '<'
	          )
	      }

      gsap.from('.locations-static-heading', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.locations-static-heading',
          start: 'top 80%',
        },
      })

      gsap.from('.location-card', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.locations-grid',
          start: 'top 85%',
        },
      })

      gsap.from('.locations-branches-button', {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.locations-grid',
          start: 'bottom 90%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleViewAllBranches = () => {
    if (!onNavigate) return

    onNavigate('contact')

    setTimeout(() => {
      if (typeof window === 'undefined') return
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }

	  return (
	    <section
	      ref={sectionRef}
	      className="relative overflow-hidden bg-slate-900 text-slate-50 dark:bg-black"
	    >
	      {/* Subtle looping background video behind the locations hero */}
	      <video
	        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-25"
	        autoPlay
	        loop
	        muted
	        playsInline
	      >
	        <source src={locationsVideo} type="video/mp4" />
	      </video>

	      {/* Dark radial overlay on top of the video */}
	      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_transparent_70%)]" />

	      <div className="relative z-20">
	        {/* Cinematic hero: Big KYNA logo with branching clinics emerging like a tree */}
	        <div className="locations-cinematic">
		          <div className="flex min-h-[520px] items-start justify-center pt-6 sm:sticky sm:top-0 sm:h-screen sm:items-center sm:pt-0">
		            <div className="locations-hero-parallax relative mt-[-2.5rem] -translate-y-[10px] flex w-full max-w-5xl flex-col items-center justify-center px-4 py-10 sm:mt-[-5rem] lg:mt-[-7rem] lg:px-6 lg:py-16">
	              {/* Hero logo */}
	              <img
	                src={kynaLogo}
	                alt="KYNA Physiotherapy logo"
		                className="locations-hero-logo pointer-events-none w-auto max-w-sm opacity-100 drop-shadow-[0_0_40px_rgba(56,189,248,0.85)] sm:max-w-md md:max-w-lg"
	              />

		              {/* Branch / roots tree coming out from the logo */}
		              <div className="locations-tree relative -mt-30 w-full max-w-4xl">
	                {/* Central trunk coming down from the logo */}
	                <div className="locations-trunk-line absolute left-1/2 top-0 h-24 w-px -translate-x-1/2 rounded-full bg-sky-400/70 shadow-[0_0_40px_rgba(56,189,248,0.85)]" />
	                <div className="absolute left-1/2 top-24 h-2 w-2 -translate-x-1/2 rounded-full bg-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.9)]" />

	                {/* Branches spreading left and right with clinic names */}
	                <div className="mt-28 grid gap-y-4 gap-x-6 sm:grid-cols-2">
	                  {logoNames.map((name, index) => {
	                    const isLeft = index % 2 === 0
	
	                    return (
	                      <div
	                        key={name}
	                        className={`locations-branch flex items-center gap-3 ${
	                          isLeft ? 'justify-end' : 'justify-start'
	                        }`}
	                      >
	                        {isLeft ? (
	                          <>
	                            <div className="locations-branch-line h-px flex-1 rounded-full bg-sky-500/70" />
	                            <div className="locations-branch-pill whitespace-nowrap rounded-full border border-sky-400/70 bg-slate-950/80 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-100 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
	                              {name}
	                            </div>
	                          </>
	                        ) : (
	                          <>
	                            <div className="locations-branch-pill whitespace-nowrap rounded-full border border-sky-400/70 bg-slate-950/80 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-100 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
	                              {name}
	                            </div>
	                            <div className="locations-branch-line h-px flex-1 rounded-full bg-sky-500/70" />
	                          </>
	                        )}
	                      </div>
	                    )
	                  })}
	                </div>
	              </div>
	            </div>
	          </div>
	        </div>

	        {/* Final grounded layout with full clinic details */}
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 lg:px-6 lg:pt-16">
          <div className="locations-static-heading mb-8 space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
              Our Clinics
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Locations Across Punjab
            </h2>
            <p className="mx-auto max-w-xl text-sm text-slate-300/90">
              A growing network of KYNA Physiotherapy clinics offering intelligent rehab in Patiala,
              Samana and beyond.
            </p>
          </div>

	          <div className="locations-grid grid gap-6 md:grid-cols-3">
		            {locations.map((loc) => (
		              <div
		                key={loc.name}
		                className="location-card flex flex-col justify-between overflow-hidden rounded-3xl border border-sky-200/80 bg-slate-50/95 p-5 text-sm shadow-[0_22px_60px_rgba(15,23,42,0.85)]"
		              >
		                <div className="space-y-2">
		                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">
		                    {loc.name}
		                  </div>
		                  <p className="text-slate-700">{loc.address}</p>
		                </div>
		
		                <div className="mt-4 h-40 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <iframe
                    title={`${loc.name} map`}
                    src={loc.mapEmbedSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                    allowFullScreen
                  />
                </div>

		                <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
		                  <a
		                    href="tel:9878182115"
		                    className="rounded-full border border-slate-900/80 bg-slate-900 px-3 py-1.5 font-semibold uppercase tracking-[0.24em] text-slate-50 shadow-[0_10px_30px_rgba(15,23,42,0.55)] transition hover:bg-slate-800 hover:border-slate-900"
		                  >
		                    Call Clinic
		                  </a>
		                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleViewAllBranches}
              className="locations-branches-button rounded-full border border-sky-400/80 bg-slate-950/80 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.26em] text-sky-200 shadow-[0_18px_60px_rgba(15,23,42,0.85)] transition hover:border-sky-300 hover:bg-sky-500/10 hover:text-sky-50"
            >
              View all branches
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
