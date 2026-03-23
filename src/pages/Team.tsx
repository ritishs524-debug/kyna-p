import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from '../lib/gsap'
import { getTeamMembers, type TeamMemberData } from '../lib/api'
import { ShootingStars } from '../components/ui/shooting-stars'
import { StarsBackground } from '../components/ui/stars-background'

const teamMembers = [
  {
    id: 'sorabh-sharma',
    name: 'Sorabh Sharma (PT)',
    primaryRole: 'Sports Specialist · Osteopath',
    tags: ['Sports Rehab', 'Manual Therapy'],
    focus:
      'Blends sports physiotherapy with gentle osteopathic techniques to keep active people training safely.',
    initials: 'SS',
  },
  {
    id: 'pradeep-kumar',
    name: 'Pradeep Kumar (PT)',
    primaryRole: 'Ortho & Neuro Specialist',
    tags: ['Spine Care', 'Neuro Rehab'],
    focus:
      'Helps patients with spine, joint and nerve conditions regain strength, balance and everyday confidence.',
    initials: 'PK',
  },
  {
    id: 'angadjot-singh',
    name: 'Angadjot Singh (PT)',
    primaryRole: 'Ortho Specialist · Osteopath',
    tags: ['Joint Health', 'Posture'],
    focus:
      'Focuses on joint alignment, posture and osteopathic release work for long-term comfort, not quick fixes.',
    initials: 'AS',
  },
  {
    id: 'pratima-chakraborty',
    name: 'Pratima Chakraborty (PT)',
    primaryRole: 'Gynae Specialist · Lamaze Practitioner',
    tags: ['Women’s Health', 'Birth Prep'],
    focus:
      'Supports women through pregnancy, postnatal recovery and pelvic health with calm, practical guidance.',
    initials: 'PC',
  },
  {
    id: 'aakash-kalra',
    name: 'Aakash Kalra (PT)',
    primaryRole: 'Ortho Specialist',
    tags: ['Knee & Shoulder', 'Return to Sport'],
    focus:
      'Designs structured plans for joint injuries so patients can return to sport and daily life with confidence.',
    initials: 'AK',
  },
  {
    id: 'harpreet-kaur',
    name: 'Harpreet Kaur (PT)',
    primaryRole: 'Ortho Specialist',
    tags: ['Chronic Pain', 'Posture'],
    focus:
      'Combines hands-on work and education to ease long-standing neck, back and postural discomfort.',
    initials: 'HK',
  },
  {
    id: 'naina-rattan',
    name: 'Naina Rattan (PT)',
    primaryRole: 'Ortho Specialist',
    tags: ['Spine', 'Everyday Mobility'],
    focus:
      'Helps people move more freely in daily life with practical exercises that actually fit busy routines.',
    initials: 'NR',
  },
  {
    id: 'divyansh-bansal',
    name: 'Divyansh Bansal (PT)',
    primaryRole: 'Sports Specialist',
    tags: ['Athlete Care', 'Performance'],
    focus:
      'Guides athletes and weekend players from acute injury back to confident performance on the field.',
    initials: 'DB',
  },
  {
    id: 'komalpreet-kaur',
    name: 'Komalpreet Kaur (PT)',
    primaryRole: 'Physiotherapist',
    tags: ['Rehab Support', 'Education'],
    focus:
      'Provides calm, consistent support through each phase of rehab so patients never feel they are guessing.',
    initials: 'KK',
  },
  {
    id: 'mansi',
    name: 'Mansi (PT)',
    primaryRole: 'Physiotherapist',
    tags: ['Exercise Therapy', 'Recovery'],
    focus:
      'Uses movement-based therapy and simple home plans to turn small daily wins into long-term recovery.',
    initials: 'M',
  },
] as const

export function Team() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [dbTeam, setDbTeam] = useState<TeamMemberData[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getTeamMembers()
      .then((data) => { if (data.length > 0) setDbTeam(data) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const useDb = dbTeam.length > 0

  useLayoutEffect(() => {
    if (!loaded) return
    const ctx = gsap.context(() => {
      gsap.from('.team-hero', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from('.team-card', {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.16,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [loaded, dbTeam])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(148,163,184,0.22),_transparent_70%)]" />

      {/* Static twinkling stars background */}
      <StarsBackground
        starDensity={0.0004}
        allStarsTwinkle
        twinkleProbability={0.7}
        minTwinkleSpeed={0.5}
        maxTwinkleSpeed={1}
        className="pointer-events-none z-[1]"
      />

      {/* Shooting stars — light mode: black, dark mode: white */}
      <div className="block dark:hidden">
        <ShootingStars
          starColor="#1e293b"
          trailColor="#64748b"
          minSpeed={15}
          maxSpeed={35}
          minDelay={1000}
          maxDelay={3000}
          starWidth={14}
          starHeight={2}
          className="pointer-events-none z-[1]"
        />
        <ShootingStars
          starColor="#0f172a"
          trailColor="#94a3b8"
          minSpeed={10}
          maxSpeed={25}
          minDelay={2000}
          maxDelay={4000}
          starWidth={14}
          starHeight={2}
          className="pointer-events-none z-[1]"
        />
      </div>
      <div className="hidden dark:block">
        <ShootingStars
          starColor="#ffffff"
          trailColor="#94a3b8"
          minSpeed={15}
          maxSpeed={35}
          minDelay={1000}
          maxDelay={3000}
          starWidth={14}
          starHeight={2}
          className="pointer-events-none z-[1]"
        />
        <ShootingStars
          starColor="#e2e8f0"
          trailColor="#64748b"
          minSpeed={10}
          maxSpeed={25}
          minDelay={2000}
          maxDelay={4000}
          starWidth={14}
          starHeight={2}
          className="pointer-events-none z-[1]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 lg:px-6">
	        <div className="team-hero mb-12 space-y-4 text-center">
	          <p className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-sky-700 shadow-sm dark:bg-slate-900/80 dark:text-sky-300">
	            Our Team
	          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Specialists Who Treat You Like Family
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:text-base dark:text-slate-300/90">
            Every therapist at KYNA is a licensed professional with advanced training in their area of
            practice. Together, they combine sports rehab, orthopaedics, neurology and women&apos;s health to
            build truly personalised treatment journeys.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(useDb ? dbTeam : teamMembers).map((member, idx) => {
            const isPrimaryMember = idx < 3

            return (
              <article
                key={member.id ?? member.name}
                className={`team-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_22px_70px_rgba(15,23,42,0.12)] transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-slate-800/80 dark:bg-slate-900/90 ${
                  isPrimaryMember ? 'border-sky-200/80 dark:border-sky-500/70' : ''
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden bg-gradient-to-br from-[#4b55ad]/70 via-sky-500/70 to-emerald-400/60 ${
                    isPrimaryMember ? 'h-36' : 'h-32'
                  }`}
                >
                  {useDb && (member as TeamMemberData).image ? (
                    <img src={(member as TeamMemberData).image} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.25),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(15,23,42,0.7),transparent_55%)] mix-blend-screen opacity-80" />
                      <div className="relative z-10 flex h-full items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950/70 text-lg font-semibold uppercase tracking-wide text-slate-50 shadow-xl shadow-sky-900/40">
                          {member.initials}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`flex-1 px-6 pb-6 pt-5 text-center text-xs sm:text-[0.8rem] ${
                    isPrimaryMember ? 'pb-7 pt-6' : ''
                  }`}
                >
                  <h2 className="text-base font-semibold sm:text-lg">{member.name}</h2>
                  <p className="mt-1 font-medium text-sky-600 dark:text-sky-300">
                    {member.primaryRole}
                  </p>

                  <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800/90 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                    {member.focus}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

