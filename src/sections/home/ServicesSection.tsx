import { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  UserRoundPlus,
  ShieldCheck,
  Bone,
  Dumbbell,
  HeartPulse,
  Accessibility,
  Footprints,
  PersonStanding,
  Activity,
  Baby,
} from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { smoothScrollTo } from '../../lib/useSmoothScroll'
import { ServicesCarousel, type CarouselService } from './ServicesCarousel'
import { getServices, type ServiceData } from '../../lib/api'
import { color, sectionTint, sectionWrap, sectionPad, eyebrow, heading, subheading, dark } from '../../lib/design-tokens'
import { serviceImages } from '../../lib/cloudinary-images'

// Service card images (reused from the existing KYNA photo set)

type Featured = {
  serviceId: string
  title: string
  description: string
  image: string
  icon: LucideIcon
  iconTone: string
  /** Hex accent for the card's top hairline, icon badge and hover glow. */
  accent: string
}

/**
 * The four headline services carry the approved card design (icon, title,
 * description). The remaining services keep the same card treatment so the
 * carousel has real pages to scroll through.
 */const FEATURED_SERVICES: Featured[] = [
  {
    serviceId: 'physiotherapy',
    title: 'Physiotherapy',
    description: 'Personalized treatment plans for your unique needs.',
    image: serviceImages.physiotherapy,
    icon: UserRoundPlus,
    iconTone: 'bg-sky-50 text-[#1683FF] dark:bg-sky-950/40 dark:text-sky-400',
    accent: '#1683FF',
  },
  {
    serviceId: 'osteopathy',
    title: 'Osteopathy',
    description: 'Gentle, hands-on therapy to restore natural movement.',
    image: serviceImages.osteopathy,
    icon: ShieldCheck,
    iconTone: 'bg-teal-50 text-[#00C9A7] dark:bg-teal-950/40 dark:text-teal-300',
    accent: '#00C9A7',
  },
  {
    serviceId: 'chiropractic',
    title: 'Chiropractic Care',
    description: 'Improve alignment, reduce pain, restore mobility.',
    image: serviceImages.chiropractic,
    icon: Bone,
    iconTone: 'bg-violet-50 text-violet-500 dark:bg-violet-950/40 dark:text-violet-300',
    accent: '#8B5CF6',
  },
  {
    serviceId: 'exercise-therapy',
    title: 'Exercise & Manual Therapy',
    description: 'Build strength, improve function, prevent future injuries.',
    image: serviceImages['exercise-therapy'],
    icon: Dumbbell,
    iconTone: 'bg-orange-50 text-[#FF6B4A] dark:bg-orange-950/40 dark:text-orange-400',
    accent: '#FF6B4A',
  },
  {
    serviceId: 'manual-therapy',
    title: 'Manual Physical Therapy',
    description: 'Hands-on techniques that ease pain and restore movement.',
    image: serviceImages['manual-therapy'],
    icon: HeartPulse,
    iconTone: 'bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-300',
    accent: '#F43F5E',
  },
  {
    serviceId: 'womens-health',
    title: "Women's Health Physiotherapy",
    description: 'Specialist care through pregnancy and beyond.',
    image: serviceImages['womens-health'],
    icon: PersonStanding,
    iconTone: 'bg-pink-50 text-pink-500 dark:bg-pink-950/40 dark:text-pink-300',
    accent: '#EC4899',
  },
  {
    serviceId: 'pelvic-floor',
    title: 'Pelvic Floor Rehabilitation',
    description: 'Confident, discreet support for pelvic health.',
    image: serviceImages['pelvic-floor'],
    icon: Accessibility,
    iconTone: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300',
    accent: '#6366F1',
  },
  {
    serviceId: 'falls-prevention',
    title: 'Evidence-Based Falls Prevention',
    description: 'Stronger balance for safer, steadier movement.',
    image: serviceImages['falls-prevention'],
    icon: Footprints,
    iconTone: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
    accent: '#D97706',
  },
  {
    serviceId: 'home-physiotherapy',
    title: 'Physiotherapy at Home',
    description: 'Expert rehab delivered to your doorstep.',
    image: serviceImages['home-physiotherapy'],
    icon: Activity,
    iconTone: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-300',
    accent: '#06B6D4',
  },
  {
    serviceId: 'antenatal-education',
    title: 'Antenatal / Childbirth Education',
    description: 'Feel prepared for every stage of childbirth.',
    image: serviceImages['antenatal-education'],
    icon: Baby,
    iconTone: 'bg-lime-50 text-lime-600 dark:bg-lime-950/40 dark:text-lime-300',
    accent: '#65A30D',
  },
]

type ServicesSectionProps = {
  onNavigate?: (page: 'home' | 'about' | 'services' | 'team' | 'contact') => void
}

export function ServicesSection({ onNavigate }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [dbServices, setDbServices] = useState<ServiceData[]>([])

  useEffect(() => {
    getServices().then(setDbServices).catch(() => {/* fallback */})
  }, [])

  // Prefer the CMS image for a service when one exists, else the bundled photo.
  const imageFor = (serviceId: string, fallback: string) => {
    const match = dbServices.find((s) => s.id === serviceId && s.image)
    return match ? match.image : fallback
  }

  // Memoised: a fresh array here would rebuild the carousel's WebGL engine on
  // every render of this section.
  const carouselServices: CarouselService[] = useMemo(
    () =>
      FEATURED_SERVICES.map((s) => ({
        id: s.serviceId,
        title: s.title,
        description: s.description,
        image: imageFor(s.serviceId, s.image),
        icon: s.icon,
        iconTone: s.iconTone,
        accent: s.accent,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dbServices],
  )

  const handleOpenService = (serviceId: string) => {
    if (!onNavigate || !serviceId) return
    onNavigate('services')
    setTimeout(() => {
      const el = document.getElementById('service-' + serviceId)
      if (!el) return
      smoothScrollTo(el, -96)
      el.classList.add('service-card--highlight')
      setTimeout(() => el.classList.remove('service-card--highlight'), 2600)
    }, 300)
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services-heading', {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={`${sectionTint} ${dark.sectionTint}`}>
      {/* Soft abstract decorative shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-24 -left-40 h-[520px] w-[720px] rounded-full bg-gradient-to-br from-sky-100/70 via-sky-50/40 to-transparent blur-3xl dark:from-sky-950/30 dark:via-sky-950/10 dark:to-transparent" />
        <div className="absolute -right-32 top-10 h-[460px] w-[560px] rounded-full bg-gradient-to-bl from-sky-100/60 via-cyan-50/40 to-transparent blur-3xl dark:from-sky-950/25 dark:via-cyan-950/10 dark:to-transparent" />
        <div className="absolute bottom-0 left-1/3 h-[320px] w-[520px] rounded-full bg-gradient-to-tr from-cyan-50/50 to-transparent blur-3xl dark:from-cyan-950/15 dark:to-transparent" />
        <svg
          viewBox="0 0 48 48"
          className="absolute top-16 right-[14%] h-9 w-9 text-[#00C9A7]/70 dark:text-[#00C9A7]/40"
          fill="currentColor"
        >
          <path d="M20 4h8a4 4 0 014 4v8h8a4 4 0 014 4v8a4 4 0 01-4 4h-8v8a4 4 0 01-4 4h-8a4 4 0 01-4-4v-8H8a4 4 0 01-4-4v-8a4 4 0 014-4h8V8a4 4 0 014-4z" />
        </svg>
      </div>

      <div className={`${sectionWrap} ${sectionPad} lg:py-20`}>
        {/* Heading block */}
        <div className="mx-auto max-w-3xl text-center">
          <p className={`${eyebrow} ${color.blue} ${dark.eyebrow}`}>What We Offer</p>

          <h2
            className={`services-heading text-balance ${heading} ${color.navy} ${dark.heading}`}
          >
            Services at KYNA{' '}
            <span className={color.blue + ' dark:text-sky-400'}>Physiotherapy</span>
          </h2>

          <p className={`${subheading} ${color.muted} ${dark.subheading}`}>
            From acute injury rehab to chronic pain management and preventive programmes, our
            clinics combine physiotherapy, osteopathy, chiropractic care and exercise therapy.
          </p>
        </div>

        {/* Carousel */}
        <div className="mt-14 lg:mt-16">
          <ServicesCarousel services={carouselServices} onOpenService={handleOpenService} />
        </div>
      </div>
    </section>
  )
}
