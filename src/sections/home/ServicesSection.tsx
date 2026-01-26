import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import servicesBg from '../../assets/images/services-section.jpg'
import { ImageWithLoader } from '../../components/common/ImageWithLoader'

// Service card images – use the actual filenames from src/assets/services
import doctorHelpingPatientRehabilitation from '../../assets/services/doctor-helping-patient-rehabilitation.jpg'
import frontViewYoungMaleBrokenFoot from '../../assets/services/front-view-young-male-sitting-with-broken-foot-crutches-grey-wall-pain-accident-broken-twist-foot-leg.jpg'
import pexelsFunkcinesTerapijos from '../../assets/services/pexels-funkcines-terapijos-centras-927573878-20860591.jpg'
import pexelsKarola from '../../assets/services/pexels-karola-g-4506078.jpg'
import physioDoingLegExercises from '../../assets/services/physiotherapist-doing-leg-exercises-with-female-patient.jpg'
import professionalTherapistsStretching from '../../assets/services/professional-therapists-is-stretching-muscles-patients-with-abnormal-muscular-symptoms-physical-rehabilitation-therapies-treatment-physiological-disorders-by-physiotherapists-concept.jpg'
import seniorManNursingHome from '../../assets/services/senior-man-nursing-home-with-doing-physical-therapy-with-help-from-nurse-using-dumbbells.jpg'
import sideViewPregnantWomanMidwife from '../../assets/services/side-view-pregnant-woman-midwife-home-woman-casual-clothes-sitting-bed-asian-doula-holding-hand-pregnancy-medicine-home-birth-concept.jpg'
import youngWomanChiropractorOsteopath from '../../assets/services/young-woman-doctor-chiropractor-osteopath-fixing-lying-womans-back-with-hands-movements-visit-manual-therapy-clinic-professional-chiropractor-work.jpg'
import youngWomanWithBackProblems from '../../assets/services/young-woman-with-back-problems-doing-physiotherapy-treatment.jpg'

type PageLabel = 'home' | 'about' | 'services' | 'team' | 'contact'

const services = [
  {
    id: 'physiotherapy',
    name: 'Physiotherapy',
    description: 'Expert physiotherapy treatment for pain relief and rehabilitation.',
  },
  {
    id: 'osteopathy',
    name: 'Osteopathy (Cranial and Visceral)',
    description: 'Gentle cranial and visceral techniques for whole-body healing.',
  },
  {
    id: 'chiropractic',
    name: 'Chiropractic',
    description: 'Spinal adjustments and manual therapy for better movement.',
  },
  {
    id: 'exercise-therapy',
    name: 'Exercise Therapy',
    description: 'Guided exercise programs for strength and recovery.',
  },
  {
    id: 'manual-therapy',
    name: 'Manual Physical Therapy',
    description: 'Hands-on techniques to restore mobility and reduce pain.',
  },
  {
    id: 'womens-health',
    name: "Women's Health Physiotherapy",
    description: 'Specialized care for women at every stage of life.',
  },
  {
    id: 'pelvic-floor',
    name: 'Pelvic Floor Rehabilitation',
    description: 'Targeted therapy for pelvic floor strength and function.',
  },
  {
    id: 'falls-prevention',
    name: 'Evidence-Based Falls Prevention',
    description: 'Balance training and exercises to prevent falls.',
  },
  {
    id: 'home-physiotherapy',
    name: 'Physiotherapy at Home',
    description: 'Professional physiotherapy delivered to your doorstep.',
  },
  {
    id: 'antenatal-education',
    name: 'Antenatal / Childbirth Education',
    description: 'Comprehensive preparation for pregnancy and childbirth.',
  },
] as const

type ServiceId = (typeof services)[number]['id']

const serviceImages: Record<ServiceId, { src: string; alt: string }> = {
  physiotherapy: {
    src: physioDoingLegExercises,
    alt: 'Physiotherapist helping a patient with exercises in the clinic',
  },
  osteopathy: {
    src: youngWomanChiropractorOsteopath,
    alt: 'Osteopath providing gentle cranial or visceral treatment',
  },
  chiropractic: {
    src: youngWomanWithBackProblems,
    alt: "Chiropractor adjusting a patient's spine",
  },
  'exercise-therapy': {
    src: doctorHelpingPatientRehabilitation,
    alt: 'Patient performing guided exercise therapy with a physiotherapist',
  },
  'manual-therapy': {
    src: professionalTherapistsStretching,
    alt: 'Manual physical therapy with hands-on treatment',
  },
  'womens-health': {
    src: pexelsKarola,
    alt: "Women's health physiotherapy session",
  },
  'pelvic-floor': {
    src: pexelsFunkcinesTerapijos,
    alt: 'Pelvic floor rehabilitation exercises',
  },
  'falls-prevention': {
    src: seniorManNursingHome,
    alt: 'Senior person doing balance exercises for falls prevention',
  },
  'home-physiotherapy': {
    src: frontViewYoungMaleBrokenFoot,
    alt: 'Physiotherapist visiting a patient at home',
  },
  'antenatal-education': {
    src: sideViewPregnantWomanMidwife,
    alt: 'Couple attending antenatal or childbirth education session',
  },
}

const CARDS_PER_VIEW = 3

type ServicesSectionProps = {
  onNavigate?: (page: PageLabel) => void
}

export function ServicesSection({ onNavigate }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Calculate visible services (3 at a time)
  const visibleServices = services.slice(currentIndex, currentIndex + CARDS_PER_VIEW)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? services.length - CARDS_PER_VIEW : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= services.length - CARDS_PER_VIEW ? 0 : prev + 1))
  }

  // Intro animation for heading + cards
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services-heading', {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from('.service-card', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
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

    setTimeout(() => {
      const element = document.getElementById('service-' + serviceId)
      if (!element) return

      const headerOffset = 96
      const rect = element.getBoundingClientRect()
      const offsetTop = rect.top + window.scrollY - headerOffset

      window.scrollTo({ top: offsetTop, behavior: 'smooth' })

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
      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/65 via-white/45 to-white/30 dark:from-slate-950/40 dark:via-slate-950/75 dark:to-slate-950/95" />

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

        {/* Service Cards Container with Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute -left-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg transition-all hover:bg-sky-500 hover:text-white lg:-left-6 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-sky-500"
            aria-label="Previous services"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute -right-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg transition-all hover:bg-sky-500 hover:text-white lg:-right-6 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-sky-500"
            aria-label="Next services"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Grid - Simple CSS Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleServices.map((service) => (
              <div key={service.id} className="service-card">
                <button
                  type="button"
                  onClick={() => handleNavigateToService(service.id)}
                  className="group relative block h-80 w-full overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {/* Background Image - Full cover */}
                  <div className="absolute inset-0 h-full w-full">
                    <ImageWithLoader
                      src={serviceImages[service.id].src}
                      alt={serviceImages[service.id].alt}
                      loading="lazy"
                      containerClassName="h-full w-full"
                      imageClassName="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Gradient Overlay - Stronger for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />

                  {/* Content - Fixed at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                    <h3 className="mb-2 text-xl font-bold text-white drop-shadow-lg">{service.name}</h3>
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-100">{service.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition-colors group-hover:text-sky-300">
                      Read More
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

