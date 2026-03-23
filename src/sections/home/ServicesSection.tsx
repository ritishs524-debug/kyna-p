import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from '../../lib/gsap'
import servicesBg from '../../assets/images/services-section.jpg'
import Card from '../../components/ui/carousel-card'
import { getServices, type ServiceData } from '../../lib/api'

// Fallback service card images
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

const FALLBACK_CARD_DATA = [
  { id: 1, imgUrl: physioDoingLegExercises, content: 'Physiotherapy', serviceId: 'physiotherapy' },
  { id: 2, imgUrl: youngWomanChiropractorOsteopath, content: 'Osteopathy (Cranial and Visceral)', serviceId: 'osteopathy' },
  { id: 3, imgUrl: youngWomanWithBackProblems, content: 'Chiropractic', serviceId: 'chiropractic' },
  { id: 4, imgUrl: doctorHelpingPatientRehabilitation, content: 'Exercise Therapy', serviceId: 'exercise-therapy' },
  { id: 5, imgUrl: professionalTherapistsStretching, content: 'Manual Physical Therapy', serviceId: 'manual-therapy' },
  { id: 6, imgUrl: pexelsKarola, content: "Women's Health Physiotherapy", serviceId: 'womens-health' },
  { id: 7, imgUrl: pexelsFunkcinesTerapijos, content: 'Pelvic Floor Rehabilitation', serviceId: 'pelvic-floor' },
  { id: 8, imgUrl: seniorManNursingHome, content: 'Evidence-Based Falls Prevention', serviceId: 'falls-prevention' },
  { id: 9, imgUrl: frontViewYoungMaleBrokenFoot, content: 'Physiotherapy at Home', serviceId: 'home-physiotherapy' },
  { id: 10, imgUrl: sideViewPregnantWomanMidwife, content: 'Antenatal / Childbirth Education', serviceId: 'antenatal-education' },
]

function dbToCardData(services: ServiceData[]) {
  return services.map((s, i) => ({
    id: i + 1,
    imgUrl: s.image,
    content: s.title,
    serviceId: s.id,
  }))
}

type ServicesSectionProps = {
  onNavigate?: (page: 'home' | 'about' | 'services' | 'team' | 'contact') => void
}

export function ServicesSection({ onNavigate }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [dbServices, setDbServices] = useState<ServiceData[]>([])

  useEffect(() => {
    getServices().then(setDbServices).catch(() => {/* fallback */})
  }, [])

  // Use DB services (with images) if available, otherwise show fallback cards
  const dbWithImages = dbServices.filter((s) => !!s.image)
  const cardData = dbWithImages.length > 0 ? dbToCardData(dbWithImages) : FALLBACK_CARD_DATA

  const handleCardClick = (card: { serviceId?: string }) => {
    if (!onNavigate || !card.serviceId) return
    onNavigate('services')
    setTimeout(() => {
      const el = document.getElementById('service-' + card.serviceId)
      if (!el) return
      const headerOffset = 96
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset
      window.scrollTo({ top, behavior: 'smooth' })
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

        {/* Carousel Card Component */}
        <Card data={cardData} showCarousel={true} cardsPerView={3} onCardClick={handleCardClick} />
      </div>
    </section>
  )
}

