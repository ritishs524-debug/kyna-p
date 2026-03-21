import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeamMembers, type TeamMemberData } from '../../lib/api'

interface SimpleTeamMember {
  name: string
  role: string
  initials: string
  image?: string
}

const fallbackMembers: SimpleTeamMember[] = [
  { name: 'Sorabh Sharma (PT)', role: 'Sports Specialist & Osteopath', initials: 'Dr' },
  { name: 'Pradeep Kumar (PT)', role: 'Ortho & Neuro Specialist', initials: 'Dr' },
  { name: 'Angadjot Singh (PT)', role: 'Ortho Specialist & Osteopath', initials: 'Dr' },
]

export function TeamPreviewSection() {
  const [members, setMembers] = useState<SimpleTeamMember[]>(fallbackMembers)

  useEffect(() => {
    getTeamMembers()
      .then((data) => {
        const onHome = data.filter((m) => m.showOnHome)
        const list = onHome.length > 0 ? onHome : data.slice(0, 3)
        if (list.length > 0) {
          setMembers(
            list.map((m) => ({
              name: m.name,
              role: m.primaryRole,
              initials: m.initials || 'Dr',
              image: m.image || undefined,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        {/* Header */}
        <div className="mb-10 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 dark:text-sky-300">
            Our Team
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            High-Level Professionals in Our Team
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Each member of our team has undergone extensive training and holds the necessary
            qualifications and certifications in their respective fields.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Avatar circle */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-600 dark:bg-sky-900/50 dark:text-sky-300">
                {member.initials}
              </div>

              {/* Name & role */}
              <h3 className="text-center text-base font-semibold text-slate-900 dark:text-slate-50">
                {member.name}
              </h3>
              <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
                {member.role}
              </p>

              {/* Image placeholder */}
              <div className="mt-5 flex h-28 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Doctor image coming soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/team"
            className="rounded-full border border-sky-400/70 bg-slate-900 px-7 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-sky-200 transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-100 dark:bg-slate-900/70 dark:backdrop-blur"
          >
            Meet the full team
          </Link>
        </div>
      </div>
    </section>
  )
}

