'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, Dumbbell, HeartPulse, UserRoundPlus } from 'lucide-react'
import { PageHero } from '../components/ui/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CTASection } from '../components/ui/CTASection'
import { RevealGroup } from '../components/ui/Reveal'
import { ServiceCard, FeatureCard } from '../components/ui/cards'
import { ServiceModal } from '../components/ui/ServiceModal'
import { getServices, type ServiceData } from '../lib/api'
import { serviceImages } from '../lib/cloudinary-images'
import { container, dark, sectionLight, sectionTint } from '../lib/design-tokens'


type ServiceId =
  | 'physiotherapy'
  | 'osteopathy'
  | 'chiropractic'
  | 'exercise-therapy'
  | 'manual-therapy'
  | 'womens-health'
  | 'pelvic-floor'
  | 'falls-prevention'
  | 'home-physiotherapy'
  | 'antenatal-education'

/**
 * The ten services, exactly as the original page listed them.
 *
 * `description` is preserved word-for-word and now lives in the detail
 * dialog. `summary` is a short lead-in distilled from that same description —
 * no new claims were introduced.
 */
const services: readonly {
  id: ServiceId
  title: string
  badge: string
  summary: string
  description: string
  accent: string
}[] = [
  {
    id: 'physiotherapy',
    title: 'Physiotherapy',
    badge: 'Core Rehabilitation',
    accent: '#087CF0',
    summary:
      'Pain-free movement and long-term strength, built on a structured plan from your first assessment.',
    description:
      'Our physiotherapy service focuses on restoring pain-free movement and building long-term strength so you can return to the activities you love. After a detailed assessment, we design a structured plan that blends hands-on therapy, targeted exercises, posture correction and education about your condition. Whether you are recovering from injury, surgery or dealing with chronic pain, we track your progress in every session and adjust the plan to keep you moving forward safely and confidently.',
  },
  {
    id: 'osteopathy',
    title: 'Osteopathy (Cranial and Visceral)',
    badge: 'Gentle Whole-Body Work',
    accent: '#00C9A7',
    summary:
      'Very gentle, precise hands-on work that looks beyond the painful area to how the whole body is moving.',
    description:
      'Our cranial and visceral osteopathy looks beyond the painful area to how the whole body is moving and adapting. Using very gentle, precise hands-on techniques, we work with the nervous system, fascia and internal structures to release long-held tension patterns. This approach is ideal for people who are sensitive to strong pressure, have recurring headaches, digestive discomfort or long-standing postural issues. Sessions feel calm, deeply relaxing and can support better balance, breathing and overall resilience.',
  },
  {
    id: 'chiropractic',
    title: 'Chiropractic',
    badge: 'Spine & Joint Alignment',
    accent: '#8B5CF6',
    summary:
      'Safe, controlled adjustments and soft-tissue work to restore healthy alignment and mobility.',
    description:
      'Our chiropractic care focuses on restoring healthy alignment and mobility of the spine and major joints so your body can function at its best. After analysing posture, movement and lifestyle factors, we use safe, controlled adjustments combined with soft-tissue work and stretching. This can help relieve neck and back pain, radiating nerve symptoms, stiffness and frequent headaches. We always explain what we are doing, work within your comfort zone and pair each session with simple home strategies.',
  },
  {
    id: 'exercise-therapy',
    title: 'Exercise Therapy',
    badge: 'Strength & Conditioning',
    accent: '#FF6B4A',
    summary:
      'Personalised programmes matched to your diagnosis, fitness level and goals — never a generic workout.',
    description:
      'Exercise therapy at KYNA is not a generic gym-style workout. We build personalised programmes that match your diagnosis, fitness level and goals, whether that means returning to sport, lifting your children comfortably or walking longer distances. Sessions combine mobility drills, strength training, balance work and endurance conditioning using scientifically designed progressions. We coach every repetition with correct form and breathing so your body learns safe, efficient movement patterns that last far beyond the treatment room.',
  },
  {
    id: 'manual-therapy',
    title: 'Manual Physical Therapy',
    badge: 'Hands-On Relief',
    accent: '#F43F5E',
    summary:
      'Skilled hands-on techniques to reduce pain, release stiff joints and reset overloaded muscles.',
    description:
      'Manual physical therapy uses skilled hands-on techniques to reduce pain, release stiff joints and reset overloaded muscles. Depending on your needs, sessions may include joint mobilisation, soft-tissue release, myofascial work and stretching combined with guided breathing. This approach is particularly effective for frozen shoulder, neck and back stiffness, sports injuries and postural strain from long hours at a desk. Every technique is explained in simple language so you feel safe, informed and actively involved in your recovery.',
  },
  {
    id: 'womens-health',
    title: "Women's Health Physiotherapy",
    badge: 'For Every Life Stage',
    accent: '#EC4899',
    summary:
      'Private, respectful care through pregnancy, postnatal recovery and hormonal transitions.',
    description:
      "Our women's health physiotherapy supports you through pregnancy, postnatal recovery and hormonal transitions with sensitivity and clinical expertise. We address pelvic pain, low back and hip issues, abdominal separation, incontinence and discomfort with daily activities or intimacy. Consultations are private, respectful and education-focused, helping you understand what is normal and what can be improved. Treatment plans blend gentle manual therapy, pelvic floor training, breathing work and lifestyle strategies so you feel more confident in your body.",
  },
  {
    id: 'pelvic-floor',
    title: 'Pelvic Floor Rehabilitation',
    badge: 'Confident Control',
    accent: '#6366F1',
    summary:
      'Targeted exercises, relaxation and strength work to restore pelvic control, comfort and confidence.',
    description:
      'Pelvic floor rehabilitation at KYNA is designed for people experiencing leakage, urgency, heaviness, postnatal weakness or pelvic pain. We begin with a thorough, respectful assessment and clear explanation of how the pelvic floor, breath and posture all interact. Treatment uses targeted exercises, biofeedback-style cues, relaxation and strength work to restore control and comfort. Our goal is to help you return to laughing, lifting, running or playing with your children without fear or embarrassment.',
  },
  {
    id: 'falls-prevention',
    title: 'Evidence-Based Falls Prevention',
    badge: 'Balance & Confidence',
    accent: '#D97706',
    summary:
      'Researched strength, balance and reaction-speed training in a safe, supervised environment.',
    description:
      'This programme is built for older adults and anyone who feels unsteady, fearful of falling or limited in daily activities. Using internationally researched exercises, we train strength, balance, reaction speed and confidence in a safe, closely supervised environment. Sessions also cover home safety, footwear, walking aids and practical tips for real-life situations like stairs or uneven ground. The aim is not only to prevent falls but to help you stay active, independent and socially engaged.',
  },
  {
    id: 'home-physiotherapy',
    title: 'Physiotherapy at Home',
    badge: 'Care That Comes to You',
    accent: '#06B6D4',
    summary:
      'Expert rehab delivered to your doorstep, adapted to the space and equipment you have.',
    description:
      'For patients who cannot easily travel to the clinic, our home physiotherapy service brings expert care to your doorstep. We come equipped with portable tools and clear treatment plans, adapting exercises to the space and equipment available in your home. This is ideal after surgery, during illness, for elderly family members or anyone who feels more comfortable in a familiar environment. We also involve caregivers, teaching safe handling techniques and simple routines to support daily progress.',
  },
  {
    id: 'antenatal-education',
    title: 'Antenatal / Childbirth Education',
    badge: 'Prepared Birth Journey',
    accent: '#65A30D',
    summary:
      'Physiotherapy insight and practical guidance for expecting parents and their partners.',
    description:
      'Our antenatal and childbirth education sessions combine physiotherapy insight with practical, real-world guidance for expecting parents. We cover posture, breathing, pelvic floor care, labour positions, pain-management options and safe movement in the last months of pregnancy. Partners learn how to support actively through massage, touch and communication. The focus is on informed choices and realistic preparation, so you approach birth with less fear, more confidence and a clear plan for early postnatal recovery.',
  },
]

const IMAGE_ALT: Record<ServiceId, string> = {
  physiotherapy: 'Physiotherapist helping a patient with exercises in the clinic',
  osteopathy: 'Osteopath providing gentle cranial or visceral treatment',
  chiropractic: "Chiropractor adjusting a patient's spine",
  'exercise-therapy': 'Patient performing guided exercise therapy with a physiotherapist',
  'manual-therapy': 'Manual physical therapy with hands-on treatment',
  'womens-health': "Women's health physiotherapy session",
  'pelvic-floor': 'Pelvic floor rehabilitation exercises',
  'falls-prevention': 'Senior person doing balance exercises for falls prevention',
  'home-physiotherapy': 'Physiotherapist visiting a patient at home',
  'antenatal-education': 'Couple attending antenatal or childbirth education session',
}

/** Benefits already claimed elsewhere on the site — no new claims added. */
const benefits = [
  {
    icon: ClipboardCheck,
    title: 'Assessment First',
    body: 'Every plan starts with a detailed assessment and clear explanation of what we found and why.',
    iconTone: 'bg-sky-50 text-[#087CF0] dark:bg-sky-950/40 dark:text-sky-400',
  },
  {
    icon: UserRoundPlus,
    title: 'Your Goals, Your Plan',
    body: 'Programmes are matched to your diagnosis, fitness level and the goals you actually want to reach.',
    iconTone: 'bg-cyan-50 text-[#18C7D8] dark:bg-cyan-950/40 dark:text-cyan-400',
  },
  {
    icon: HeartPulse,
    title: 'Tracked Every Session',
    body: 'We track your progress in every session and adjust the plan so you keep moving forward safely.',
    iconTone: 'bg-teal-50 text-[#00C9A7] dark:bg-teal-950/40 dark:text-teal-300',
  },
  {
    icon: Dumbbell,
    title: 'Built To Last',
    body: 'Correct form and breathing so your body learns safe, efficient patterns that outlast the treatment room.',
    iconTone: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400',
  },
] as const

type Resolved = {
  id: string
  title: string
  badge: string
  summary: string
  description: string
  image: string
  imageAlt: string
  accent: string
}

/** First sentence of the copy, used as the card summary for CMS entries. */
function leadSentence(text: string): string {
  const clean = text.trim()
  const stop = clean.search(/[.!?](\s|$)/)
  const first = stop > 40 ? clean.slice(0, stop + 1) : clean
  return first.length > 170 ? `${first.slice(0, 167).trimEnd()}…` : first
}

export function Services() {
  const navigate = useNavigate()
  const [dbServices, setDbServices] = useState<ServiceData[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  // Which card opened the dialog, so focus can be returned to its button
  // even if the grid remounts while the dialog is open.
  const lastIdRef = useRef<string | null>(null)

  useEffect(() => {
    getServices()
      .then((data) => {
        if (data.length > 0) setDbServices(data)
      })
      .catch(() => {
        /* keep the bundled copy when the CMS is unreachable */
      })
  }, [])

  const resolved = useMemo<Resolved[]>(() => {
    if (dbServices.length === 0) {
      return services.map((s) => ({
        id: s.id,
        title: s.title,
        badge: s.badge,
        summary: s.summary,
        description: s.description,
        image: serviceImages[s.id],
        imageAlt: IMAGE_ALT[s.id],
        accent: s.accent,
      }))
    }
    // CMS wins, but the accent and bundled photo fill any gaps it leaves.
    return dbServices
      .map((s, i) => {
        const fallback = services.find((x) => x.id === s.id) ?? services[i % services.length]
        return {
          id: s.id || fallback.id,
          title: s.title,
          badge: s.badge || fallback.badge,
          summary: leadSentence(s.description || fallback.description),
          description: s.description || fallback.description,
          image: s.image || serviceImages[fallback.id],
          imageAlt: s.imageAlt || IMAGE_ALT[fallback.id],
          accent: fallback.accent,
        }
      })
      .filter((s) => s.title && s.description)
  }, [dbServices])

  const active = resolved.find((s) => s.id === openId) ?? null

  return (
    <div className="flex flex-col pb-20 md:pb-0">
      <PageHero
        eyebrow="Our Specialised Services"
        title="Comprehensive Physiotherapy & Rehabilitation"
        intro="Explore the full range of hands-on treatments, corrective exercise and educational programmes available at KYNA Physiotherapy. Each service is designed to support you from first assessment to long-term recovery."
      />

      {/* ── Services grid ── */}
      <section className={`${sectionLight} ${dark.sectionLight}`}>
        <div className={`${container.content} py-16 lg:py-20`}>
          <SectionHeading
            eyebrow="What We Treat"
            title="Find the service that matches your goal"
            intro="Tap any service to read the full approach your therapist would follow."
          />

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {resolved.map((s) => (
              <ServiceCard
                key={s.id}
                id={'service-' + s.id}
                badge={s.badge}
                title={s.title}
                summary={s.summary}
                image={s.image}
                imageAlt={s.imageAlt}
                accent={s.accent}
                onLearnMore={() => {
                  lastIdRef.current = s.id
                  setOpenId(s.id)
                }}
              />
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── Why KYNA ── */}
      <section className={`${sectionTint} ${dark.sectionTint}`}>
        <div className={`${container.content} py-16 lg:py-20`}>
          <SectionHeading
            eyebrow="Why KYNA"
            title="Care that is measured, explained and adjusted"
            intro="The same four commitments on every service, from your first assessment onwards."
          />

          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
            {benefits.map((b) => (
              <FeatureCard
                key={b.title}
                icon={<b.icon className="h-6 w-6" aria-hidden="true" />}
                title={b.title}
                body={b.body}
                iconTone={b.iconTone}
              />
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTASection
        eyebrow="Ready to Start?"
        title="Ready to start your recovery?"
        body="Tell us where you are and where you want to get to. We will help you work out which service is the right starting point."
        primaryLabel="Book a Session"
        onPrimary={() => navigate('/contact')}
        secondaryLabel="Call 98781 82115"
        secondaryHref="tel:9878182115"
      />

      {active && (
        <ServiceModal
          open
          onClose={() => setOpenId(null)}
          badge={active.badge}
          title={active.title}
          body={active.description}
          image={active.image}
          imageAlt={active.imageAlt}
          accent={active.accent}
          getReturnFocus={() => {
            const card = document.getElementById('service-' + lastIdRef.current)
            return card?.querySelector<HTMLElement>('button') ?? null
          }}
          onBook={() => {
            setOpenId(null)
            navigate('/contact')
          }}
        />
      )}
    </div>
  )
}
