import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import kynaLogo from '../../assets/logo/kyna_withoutbg-01.PNG'

const words = ['Patiala', 'Anamiva', 'Samana', 'Sangrur', 'Kyna Kids', 'Another Kyna']

export function KynaScrollAnimation() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!prefersReducedMotion) {
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.kyna-scroll-hero',
            start: 'top top',
            end: '+=200%',
            scrub: 1.1,
            pin: true,
            anticipatePin: 1,
          },
          defaults: { ease: 'power3.out' },
        })

        heroTimeline.to(
          '.kyna-logo-parallax',
          {
            yPercent: 15,
            duration: 1,
          },
          0
        )

        heroTimeline.fromTo(
          '.kyna-word',
          {
            opacity: 0,
            yPercent: 40,
            filter: 'blur(14px)',
          },
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.35,
          },
          0.1
        )

        heroTimeline.to(
          '.kyna-logo-parallax',
          {
            scale: 0.52,
            opacity: 0,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          '>-0.2'
        )
      } else {
        gsap.set('.kyna-word', { opacity: 1, yPercent: 0, filter: 'blur(0px)' })
      }

      gsap.from('.kyna-card', {
        opacity: 0,
        y: 40,
        scale: 0.9,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.kyna-scroll-cards',
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="kyna-scroll-animation relative bg-white text-black"
    >
      {/* HERO: Fullscreen logo with masked words */}
      <div className="kyna-scroll-hero relative h-screen overflow-hidden">
        <div className="kyna-logo-parallax relative flex h-full w-full items-center justify-center">
          {/* Giant logo filling the viewport */}
          <img
            src={kynaLogo}
            alt="KYNA logo"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-90"
          />

          {/* Masked words emerging from inside logo */}
          <div
            className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
            style={{
              WebkitMaskImage: `url(${kynaLogo})`,
              maskImage: `url(${kynaLogo})`,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          >
            {words.map((word) => (
              <span
                key={word}
                className="kyna-word uppercase tracking-[0.35em] text-black/90"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CARDS: premium grid revealed after hero */}
      <div className="kyna-scroll-cards mx-auto max-w-5xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:pt-28">
        <div className="mb-10 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Kyna Network
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
            Clinics that feel like the future
          </h2>
          <p className="mx-auto max-w-xl text-sm text-neutral-500 sm:text-base">
            Each KYNA location is a portal into intelligent rehab, carefully designed spaces,
            calm energy, and precise movement science.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <div
              key={word}
              className="kyna-card flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white/80 p-5 text-left shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm"
            >
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
                  {word}
                </div>
                <p className="text-sm text-neutral-600">
                  A KYNA experience tuned for this community; light, air, and movement
                  designed to make rehab feel cinematic.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
