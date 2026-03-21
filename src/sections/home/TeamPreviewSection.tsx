import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from '../../lib/gsap'
import { getTeamMembers, type TeamMemberData } from '../../lib/api'

const fallbackMembers = [
	  {
	    name: 'Sorabh Sharma (PT)',
	    specialties: ['Sports Specialist', 'Osteopath'],
	  },
	  {
	    name: 'Pradeep Kumar (PT)',
	    specialties: ['Ortho & Neuro Specialist'],
	  },
	  {
	    name: 'Angadjot Singh (PT)',
	    specialties: ['Ortho Specialist', 'Osteopath'],
	  },
	]

export function TeamPreviewSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [homeMembers, setHomeMembers] = useState<TeamMemberData[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getTeamMembers()
      .then((data) => {
        const onHome = data.filter((m) => m.showOnHome)
        if (onHome.length > 0) setHomeMembers(onHome)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const useDb = homeMembers.length > 0

  useLayoutEffect(() => {
    if (!loaded) return
    const ctx = gsap.context(() => {
      gsap.from('.team-card', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [loaded, homeMembers])

  return (
    <section ref={sectionRef} className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
            Our Team
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            High-Level Professionals in Our Team
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-700 dark:text-slate-300">
            Each member of our team has undergone extensive training and holds the necessary
            qualifications and certifications in their respective fields.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useDb
            ? homeMembers.map((member) => (
                <div
                  key={member.id}
                  className="team-card flex flex-col items-center gap-4 rounded-3xl border border-slate-200/80 bg-white/95 px-6 py-8 text-center shadow-[0_22px_60px_rgba(15,23,42,0.08)] dark:border-white/5 dark:bg-slate-900/80 dark:shadow-slate-950/70"
                >
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="h-20 w-20 rounded-full object-cover shadow-lg shadow-sky-500/50" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#4b55ad] to-sky-500 text-xl font-semibold text-white shadow-lg shadow-sky-500/50">
                      {member.initials || 'Dr'}
                    </div>
                  )}
                  <div className="space-y-1 text-sm">
                    <div className="font-semibold text-slate-900 dark:text-slate-50">{member.name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {member.primaryRole}
                    </div>
                  </div>
                  <div className="mt-4 h-32 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[0.7rem] font-medium text-slate-400 dark:text-slate-500">
                        Doctor image coming soon
                      </div>
                    )}
                  </div>
                </div>
              ))
            : fallbackMembers.map((member) => (
                <div
                  key={member.name}
                  className="team-card flex flex-col items-center gap-4 rounded-3xl border border-slate-200/80 bg-white/95 px-6 py-8 text-center shadow-[0_22px_60px_rgba(15,23,42,0.08)] dark:border-white/5 dark:bg-slate-900/80 dark:shadow-slate-950/70"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#4b55ad] to-sky-500 text-xl font-semibold text-white shadow-lg shadow-sky-500/50">
                    Dr
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="font-semibold text-slate-900 dark:text-slate-50">{member.name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {member.specialties.join(' & ')}
                    </div>
                  </div>
                  <div className="mt-4 h-32 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <div className="flex h-full items-center justify-center text-[0.7rem] font-medium text-slate-400 dark:text-slate-500">
                      Doctor image coming soon
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="rounded-full border border-sky-400/70 bg-slate-900/70 px-6 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-sky-200 backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-100"
          >
            Meet the full team
          </button>
        </div>
      </div>
    </section>
  )
}

