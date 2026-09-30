import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import {
  color,
  cardFeature,
  sectionWrap,
  eyebrow,
  btnPrimary,
  btnGhost,
  dark,
} from '../../lib/design-tokens'

interface FinalCtaSectionProps {
  onNavigate?: (page: 'home' | 'about' | 'services' | 'reviews' | 'team' | 'contact') => void
}

export function FinalCtaSection({ onNavigate }: FinalCtaSectionProps) {
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
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pt-16 pb-16 lg:pt-20 lg:pb-24 dark:bg-slate-950"
    >
      <div className={sectionWrap}>
        <div className={`cta-inner relative overflow-hidden ${cardFeature} ${dark.cardFeature} px-6 py-12 text-center sm:px-12`}>
          <div className="relative space-y-4">
            <p className={`${eyebrow} ${color.blue} ${dark.eyebrow}`}>
              Ready to Start Your Recovery Journey?
            </p>
            <h2 className={`text-balance text-[26px] leading-[1.2] font-bold tracking-tight ${color.navy} sm:text-[32px] ${dark.heading}`}>
              Book a free consultation at KYNA Physiotherapy today.
            </h2>
            <p className="mx-auto max-w-xl text-[15px] leading-[1.7] text-slate-500 dark:text-slate-400">
              Share your pain, sports injury or movement goals with our specialists and discover a
              personalised roadmap back to confident, pain-free movement.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <button
                type="button"
                onClick={() => onNavigate?.('contact')}
                className={`${btnPrimary} px-9 py-3 text-[11px]`}
              >
                Book Free Consultation
              </button>
              <a href="tel:9878182115" className={`${btnGhost} px-8 py-2.5 text-[11px]`}>
                Call 98781 82115
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

