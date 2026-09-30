'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { PageHero } from '../components/ui/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CTASection } from '../components/ui/CTASection'
import { RevealGroup } from '../components/ui/Reveal'
import { TeamCard, type TeamMember } from '../components/ui/cards'
import { getTeamMembers, type TeamMemberData } from '../lib/api'
import { container, dark, sectionLight, sectionTint } from '../lib/design-tokens'

/**
 * The ten therapists, unchanged. Images come from the CMS when it responds;
 * without one, each card falls back to initials so the grid never breaks.
 */
const teamMembers: readonly TeamMember[] = [
  {
    name: 'Sorabh Sharma (PT)',
    primaryRole: 'Sports Specialist · Osteopath',
    tags: ['Sports Rehab', 'Manual Therapy'],
    focus:
      'Blends sports physiotherapy with gentle osteopathic techniques to keep active people training safely.',
    initials: 'SS',
    location: 'Patiala',
  },
  {
    name: 'Pradeep Kumar (PT)',
    primaryRole: 'Ortho & Neuro Specialist',
    tags: ['Spine Care', 'Neuro Rehab'],
    focus:
      'Helps patients with spine, joint and nerve conditions regain strength, balance and everyday confidence.',
    initials: 'PK',
    location: 'Patiala',
  },
  {
    name: 'Angadjot Singh (PT)',
    primaryRole: 'Ortho Specialist · Osteopath',
    tags: ['Joint Health', 'Posture'],
    focus:
      'Focuses on joint alignment, posture and osteopathic release work for long-term comfort, not quick fixes.',
    initials: 'AS',
    location: 'Samana',
  },
  {
    name: 'Pratima Chakraborty (PT)',
    primaryRole: 'Gynae Specialist · Lamaze Practitioner',
    tags: ['Women’s Health', 'Birth Prep'],
    focus:
      'Supports women through pregnancy, postnatal recovery and pelvic health with calm, practical guidance.',
    initials: 'PC',
    location: 'Patiala',
  },
  {
    name: 'Aakash Kalra (PT)',
    primaryRole: 'Ortho Specialist',
    tags: ['Knee & Shoulder', 'Return to Sport'],
    focus:
      'Designs structured plans for joint injuries so patients can return to sport and daily life with confidence.',
    initials: 'AK',
    location: 'Patiala',
  },
  {
    name: 'Harpreet Kaur (PT)',
    primaryRole: 'Ortho Specialist',
    tags: ['Chronic Pain', 'Posture'],
    focus:
      'Combines hands-on work and education to ease long-standing neck, back and postural discomfort.',
    initials: 'HK',
    location: 'Patiala',
  },
  {
    name: 'Naina Rattan (PT)',
    primaryRole: 'Ortho Specialist',
    tags: ['Spine', 'Everyday Mobility'],
    focus:
      'Helps people move more freely in daily life with practical exercises that actually fit busy routines.',
    initials: 'NR',
    location: 'Patiala',
  },
  {
    name: 'Divyansh Bansal (PT)',
    primaryRole: 'Sports Specialist',
    tags: ['Athlete Care', 'Performance'],
    focus:
      'Guides athletes and weekend players from acute injury back to confident performance on the field.',
    initials: 'DB',
    location: 'Patiala',
  },
  {
    name: 'Komalpreet Kaur (PT)',
    primaryRole: 'Physiotherapist',
    tags: ['Rehab Support', 'Education'],
    focus:
      'Provides calm, consistent support through each phase of rehab so patients never feel they are guessing.',
    initials: 'KK',
    location: 'Patiala',
  },
  {
    name: 'Mansi (PT)',
    primaryRole: 'Physiotherapist',
    tags: ['Exercise Therapy', 'Recovery'],
    focus:
      'Uses movement-based therapy and simple home plans to turn small daily wins into long-term recovery.',
    initials: 'M',
    location: 'Patiala',
  },
]

/** Team philosophy, drawn from the About page's existing approach copy. */
const philosophy = [
  {
    icon: Compass,
    title: 'Your Story First',
    body: 'Every protocol begins with understanding your story, your goals and your lifestyle before a plan is written.',
  },
  {
    icon: ShieldCheck,
    title: 'Qualified & Continuously Trained',
    body: 'Every therapist holds the necessary qualifications and certifications, and keeps building on them.',
  },
  {
    icon: HeartHandshake,
    title: 'Specialists, Not Generalists',
    body: 'Sports rehab, orthopaedics, neurology and women’s health — you work with the person who knows your condition.',
  },
  {
    icon: Sparkles,
    title: 'Care That Feels Personal',
    body: 'The goal is a memorable experience built on a real patient-therapist relationship, not a conveyor belt.',
  },
] as const

export function Team() {
  const navigate = useNavigate()
  const [dbTeam, setDbTeam] = useState<TeamMemberData[]>([])

  useEffect(() => {
    getTeamMembers()
      .then((data) => {
        if (data.length > 0) setDbTeam(data)
      })
      .catch(() => {
        /* keep the bundled team list when the CMS is unreachable */
      })
  }, [])

  // The CMS wins when it responds; the bundled list is the fallback. The page
  // never returns null, so there is no blank flash while it loads.
  const members: TeamMember[] =
    dbTeam.length > 0
      ? dbTeam.map((m) => ({
          name: m.name,
          primaryRole: m.primaryRole,
          focus: m.focus,
          initials: m.initials,
          image: m.image || undefined,
          location: 'Patiala',
          tags: m.tags,
        }))
      : teamMembers.map((m) => ({ ...m, tags: m.tags ? [...m.tags] : undefined }))

  return (
    <div className="flex flex-col pb-20 md:pb-0">
      <PageHero
        eyebrow="Our Expert Team"
        title="Meet the Experts Behind KYNA"
        intro="Every therapist at KYNA is a licensed professional with advanced training in their area of practice. Together, they combine sports rehab, orthopaedics, neurology and women's health to build truly personalised treatment journeys."
      />

      {/* ── Team grid ── */}
      <section className={`${sectionLight} ${dark.sectionLight}`}>
        <div className={`${container.content} py-16 lg:py-20`}>
          <SectionHeading
            eyebrow={`${members.length} Specialists`}
            title="Specialists Who Treat You Like Family"
            intro="Each member of our team has undergone extensive training and holds the necessary qualifications and certifications in their respective fields."
          />

          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {members.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── Team philosophy ── */}
      <section className={`${sectionTint} ${dark.sectionTint}`}>
        <div className={`${container.content} py-16 lg:py-20`}>
          <SectionHeading
            eyebrow="Team Philosophy"
            title="How we work, together and with you"
            intro="Four things every KYNA therapist holds to, whichever clinic you visit."
          />

          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
            {philosophy.map((item) => (
              <article
                key={item.title}
                className="group h-full rounded-[20px] border border-sky-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(11,35,71,0.10)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_4px_18px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_18px_44px_rgba(0,0,0,0.5)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-[#087CF0] transition-transform duration-300 group-hover:scale-105 dark:bg-sky-950/40 dark:text-sky-400">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[17px] font-bold tracking-tight text-[#0B2347] dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.7] text-slate-500 dark:text-slate-400">
                  {item.body}
                </p>
              </article>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTASection
        eyebrow="Work With Us"
        title="Ready to work with our team?"
        body="Tell us what you are dealing with and we will pair you with the specialist who knows that area best."
        primaryLabel="Book a Session"
        onPrimary={() => navigate('/contact')}
        secondaryLabel="Call 98781 82115"
        secondaryHref="tel:9878182115"
      />
    </div>
  )
}
