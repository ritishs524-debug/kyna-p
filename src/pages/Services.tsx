import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { KynaSpinner } from '../components/common/PageLoader'

import physiotherapyImg from '../assets/images/services/1. pyhsiotherapy.jpg'
import osteopathyVideo from '../assets/images/services/2. osteopathy.mp4'
import chiropracticImg from '../assets/images/services/3. chiropractic.jpg'
import exerciseTherapyVideo from '../assets/images/services/4. exercise therapy.mp4'
import manualTherapyImg from '../assets/images/services/5. manual pyhsical therapy.jpg'
import womensHealthVideo from '../assets/images/services/6. woman healyh physiotherapy.mp4'
import pelvicFloorImg from '../assets/images/services/7. Pelvic Floor Rehabilitation.jpg'
import fallsPreventionVideo from '../assets/images/services/8.  Evidence-Based Falls Prevention.mp4'
import homePhysioImg from '../assets/images/services/9 Physiotherapy at Home.jpg'
import childbirthEducationVideo from '../assets/images/services/10 . Childbirth Education.mp4'

const services = [
  {
    id: 'physiotherapy',
    title: 'Physiotherapy',
    badge: 'Core Rehabilitation',
    mediaType: 'image' as const,
	    mediaSrc: physiotherapyImg,
    description:
      'Our physiotherapy service focuses on restoring pain-free movement and building long-term strength so you can return to the activities you love. After a detailed assessment, we design a structured plan that blends hands-on therapy, targeted exercises, posture correction and education about your condition. Whether you are recovering from injury, surgery or dealing with chronic pain, we track your progress in every session and adjust the plan to keep you moving forward safely and confidently.',
  },
  {
    id: 'osteopathy',
    title: 'Osteopathy (Cranial and Visceral)',
    badge: 'Gentle Whole-Body Work',
    mediaType: 'video' as const,
	    mediaSrc: osteopathyVideo,
    description:
      'Our cranial and visceral osteopathy looks beyond the painful area to how the whole body is moving and adapting. Using very gentle, precise hands-on techniques, we work with the nervous system, fascia and internal structures to release long-held tension patterns. This approach is ideal for people who are sensitive to strong pressure, have recurring headaches, digestive discomfort or long-standing postural issues. Sessions feel calm, deeply relaxing and can support better balance, breathing and overall resilience.',
  },
  {
    id: 'chiropractic',
    title: 'Chiropractic',
    badge: 'Spine & Joint Alignment',
    mediaType: 'image' as const,
	    mediaSrc: chiropracticImg,
    description:
      'Our chiropractic care focuses on restoring healthy alignment and mobility of the spine and major joints so your body can function at its best. After analysing posture, movement and lifestyle factors, we use safe, controlled adjustments combined with soft-tissue work and stretching. This can help relieve neck and back pain, radiating nerve symptoms, stiffness and frequent headaches. We always explain what we are doing, work within your comfort zone and pair each session with simple home strategies.',
  },
  {
    id: 'exercise-therapy',
    title: 'Exercise Therapy',
    badge: 'Strength & Conditioning',
    mediaType: 'video' as const,
	    mediaSrc: exerciseTherapyVideo,
    description:
      'Exercise therapy at KYNA is not a generic gym-style workout. We build personalised programmes that match your diagnosis, fitness level and goals, whether that means returning to sport, lifting your children comfortably or walking longer distances. Sessions combine mobility drills, strength training, balance work and endurance conditioning using scientifically designed progressions. We coach every repetition with correct form and breathing so your body learns safe, efficient movement patterns that last far beyond the treatment room.',
  },
  {
    id: 'manual-therapy',
    title: 'Manual Physical Therapy',
    badge: 'Hands-On Relief',
    mediaType: 'image' as const,
	    mediaSrc: manualTherapyImg,
    description:
      'Manual physical therapy uses skilled hands-on techniques to reduce pain, release stiff joints and reset overloaded muscles. Depending on your needs, sessions may include joint mobilisation, soft-tissue release, myofascial work and stretching combined with guided breathing. This approach is particularly effective for frozen shoulder, neck and back stiffness, sports injuries and postural strain from long hours at a desk. Every technique is explained in simple language so you feel safe, informed and actively involved in your recovery.',
  },
  {
    id: 'womens-health',
    title: "Women's Health Physiotherapy",
    badge: 'For Every Life Stage',
    mediaType: 'video' as const,
	    mediaSrc: womensHealthVideo,
    description:
      'Our women\'s health physiotherapy supports you through pregnancy, postnatal recovery and hormonal transitions with sensitivity and clinical expertise. We address pelvic pain, low back and hip issues, abdominal separation, incontinence and discomfort with daily activities or intimacy. Consultations are private, respectful and education-focused, helping you understand what is normal and what can be improved. Treatment plans blend gentle manual therapy, pelvic floor training, breathing work and lifestyle strategies so you feel more confident in your body.',
  },
  {
    id: 'pelvic-floor',
    title: 'Pelvic Floor Rehabilitation',
    badge: 'Confident Control',
    mediaType: 'image' as const,
	    mediaSrc: pelvicFloorImg,
    description:
      'Pelvic floor rehabilitation at KYNA is designed for people experiencing leakage, urgency, heaviness, postnatal weakness or pelvic pain. We begin with a thorough, respectful assessment and clear explanation of how the pelvic floor, breath and posture all interact. Treatment uses targeted exercises, biofeedback-style cues, relaxation and strength work to restore control and comfort. Our goal is to help you return to laughing, lifting, running or playing with your children without fear or embarrassment.',
  },
  {
    id: 'falls-prevention',
    title: 'Evidence-Based Falls Prevention',
    badge: 'Balance & Confidence',
    mediaType: 'video' as const,
	    mediaSrc: fallsPreventionVideo,
    description:
      'This programme is built for older adults and anyone who feels unsteady, fearful of falling or limited in daily activities. Using internationally researched exercises, we train strength, balance, reaction speed and confidence in a safe, closely supervised environment. Sessions also cover home safety, footwear, walking aids and practical tips for real-life situations like stairs or uneven ground. The aim is not only to prevent falls but to help you stay active, independent and socially engaged.',
  },
  {
    id: 'home-physiotherapy',
    title: 'Physiotherapy at Home',
    badge: 'Care That Comes to You',
    mediaType: 'image' as const,
	    mediaSrc: homePhysioImg,
    description:
      'For patients who cannot easily travel to the clinic, our home physiotherapy service brings expert care to your doorstep. We come equipped with portable tools and clear treatment plans, adapting exercises to the space and equipment available in your home. This is ideal after surgery, during illness, for elderly family members or anyone who feels more comfortable in a familiar environment. We also involve caregivers, teaching safe handling techniques and simple routines to support daily progress.',
  },
  {
    id: 'antenatal-education',
    title: 'Antenatal / Childbirth Education',
    badge: 'Prepared Birth Journey',
    mediaType: 'video' as const,
	    mediaSrc: childbirthEducationVideo,
    description:
      'Our antenatal and childbirth education sessions combine physiotherapy insight with practical, real-world guidance for expecting parents. We cover posture, breathing, pelvic floor care, labour positions, pain-management options and safe movement in the last months of pregnancy. Partners learn how to support actively through massage, touch and communication. The focus is on informed choices and realistic preparation, so you approach birth with less fear, more confidence and a clear plan for early postnatal recovery.',
  },
] as const

export function Services() {
  const sectionRef = useRef<HTMLElement | null>(null)
	  const [loadedMedia, setLoadedMedia] = useState<Record<string, boolean>>({})

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services-hero', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from('.service-card', {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(148,163,184,0.18),_transparent_70%)]" />

	      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 lg:px-6">
	        <div className="services-hero mb-12 space-y-4 text-center">
	          <p className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-sky-700 shadow-sm dark:bg-slate-900/80 dark:text-sky-300">
	            Our Specialised Services
	          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Comprehensive Physiotherapy & Rehab Under One Roof
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:text-base dark:text-slate-300/90">
            Explore the full range of hands-on treatments, corrective exercise and educational programmes
            available at KYNA Physiotherapy. Each service is carefully designed to support you from
            first assessment to long-term recovery.
          </p>
        </div>

		        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
		          {services.map((service) => (
            <article
              id={'service-' + service.id}
              key={service.id}
              className="service-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_22px_70px_rgba(15,23,42,0.12)] transition-shadow duration-500 hover:shadow-[0_32px_95px_rgba(15,23,42,0.2)] dark:border-slate-800/80 dark:bg-slate-900/90"
            >
			              <div className="relative overflow-hidden rounded-3xl rounded-b-none">
			                {!loadedMedia[service.id] && (
			                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
			                    <KynaSpinner size={40} />
			                  </div>
			                )}
			                {service.mediaType === 'image' ? (
			                  <img
			                    src={service.mediaSrc}
			                    alt={service.title}
			                    onLoad={() =>
			                      setLoadedMedia((prev) => ({
			                        ...prev,
			                        [service.id]: true,
			                      }))
			                    }
			                    onError={() =>
			                      setLoadedMedia((prev) => ({
			                        ...prev,
			                        [service.id]: true,
			                      }))
			                    }
			                    className={`h-52 w-full object-cover transition-opacity duration-700 ease-out group-hover:scale-105 group-hover:brightness-110 md:h-64 ${
			                      loadedMedia[service.id] ? 'opacity-100' : 'opacity-0'
			                    }`}
			                  />
			                ) : (
			                  <video
			                    className={`h-52 w-full object-cover transition-opacity duration-700 md:h-64 ${
			                      loadedMedia[service.id] ? 'opacity-100' : 'opacity-0'
			                    }`}
			                    autoPlay
			                    muted
			                    loop
			                    playsInline
					            preload="auto"
			                    onLoadedMetadata={() =>
			                      setLoadedMedia((prev) => ({
			                        ...prev,
			                        [service.id]: true,
			                      }))
			                    }
			                    onError={() =>
			                      setLoadedMedia((prev) => ({
			                        ...prev,
			                        [service.id]: true,
			                      }))
			                    }
			                  >
			                    <source src={service.mediaSrc} type="video/mp4" />
			                  </video>
			                )}
			
		                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
		
		                <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
		                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/75 px-4 py-2 text-[0.7rem] font-medium text-slate-50 shadow-[0_16px_45px_rgba(15,23,42,0.7)] backdrop-blur-sm">
		                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-sky-300">
		                      {service.badge}
		                    </span>
		                  </span>
		                </div>
		              </div>

              <div className="flex-1 px-6 pb-6 pt-5 text-center text-xs sm:text-[0.8rem]">
                <h2 className="text-base font-semibold sm:text-lg">{service.title}</h2>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  {service.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

