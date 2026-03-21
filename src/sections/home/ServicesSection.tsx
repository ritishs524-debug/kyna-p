import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import servicesBg from '../../assets/images/services-section.jpg'
import Card from '../../components/ui/carousel-card'

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

const CARD_DATA = [
  { id: 1, imgUrl: physioDoingLegExercises, content: 'Physiotherapy — Expert physiotherapy treatment for pain relief and rehabilitation. Our team uses evidence-based techniques to help you recover faster and move better.' },
  { id: 2, imgUrl: youngWomanChiropractorOsteopath, content: 'Osteopathy (Cranial and Visceral) — Gentle cranial and visceral techniques for whole-body healing. A holistic approach to restore balance and wellness.' },
  { id: 3, imgUrl: youngWomanWithBackProblems, content: 'Chiropractic — Spinal adjustments and manual therapy for better movement. Precise corrections to improve alignment and reduce discomfort.' },
  { id: 4, imgUrl: doctorHelpingPatientRehabilitation, content: 'Exercise Therapy — Guided exercise programs for strength and recovery. Personalized routines designed to rebuild strength and prevent re-injury.' },
  { id: 5, imgUrl: professionalTherapistsStretching, content: 'Manual Physical Therapy — Hands-on techniques to restore mobility and reduce pain. Skilled manual interventions for faster functional recovery.' },
  { id: 6, imgUrl: pexelsKarola, content: "Women's Health Physiotherapy — Specialized care for women at every stage of life. From prenatal to postnatal and beyond, tailored treatments for your needs." },
  { id: 7, imgUrl: pexelsFunkcinesTerapijos, content: 'Pelvic Floor Rehabilitation — Targeted therapy for pelvic floor strength and function. Restore control and confidence with expert-guided rehabilitation.' },
  { id: 8, imgUrl: seniorManNursingHome, content: 'Evidence-Based Falls Prevention — Balance training and exercises to prevent falls. Stay steady and independent with our proven prevention programs.' },
  { id: 9, imgUrl: frontViewYoungMaleBrokenFoot, content: 'Physiotherapy at Home — Professional physiotherapy delivered to your doorstep. Convenient, personalized care in the comfort of your home.' },
  { id: 10, imgUrl: sideViewPregnantWomanMidwife, content: 'Antenatal / Childbirth Education — Comprehensive preparation for pregnancy and childbirth. Expert guidance to help you feel confident and prepared.' },
]

type ServicesSectionProps = {
  onNavigate?: (page: 'home' | 'about' | 'services' | 'team' | 'contact') => void
}

export function ServicesSection({ onNavigate: _onNavigate }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)

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
        <Card data={CARD_DATA} showCarousel={true} cardsPerView={3} />
      </div>
    </section>
  )
}

