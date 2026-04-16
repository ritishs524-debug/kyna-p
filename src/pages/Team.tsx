import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion'
import { MapPin, Sparkles } from 'lucide-react'
import { getTeamMembers, type TeamMemberData } from '../lib/api'

const teamMembers = [
  {
    id: 'sorabh-sharma',
    name: 'Sorabh Sharma (PT)',
    primaryRole: 'Sports Specialist · Osteopath',
    tags: ['Sports Rehab', 'Manual Therapy'],
    focus:
      'Blends sports physiotherapy with gentle osteopathic techniques to keep active people training safely.',
    initials: 'SS',
    location: 'Patiala',
  },
  {
    id: 'pradeep-kumar',
    name: 'Pradeep Kumar (PT)',
    primaryRole: 'Ortho & Neuro Specialist',
    tags: ['Spine Care', 'Neuro Rehab'],
    focus:
      'Helps patients with spine, joint and nerve conditions regain strength, balance and everyday confidence.',
    initials: 'PK',
    location: 'Patiala',
  },
  {
    id: 'angadjot-singh',
    name: 'Angadjot Singh (PT)',
    primaryRole: 'Ortho Specialist · Osteopath',
    tags: ['Joint Health', 'Posture'],
    focus:
      'Focuses on joint alignment, posture and osteopathic release work for long-term comfort, not quick fixes.',
    initials: 'AS',
    location: 'Samana',
  },
  {
    id: 'pratima-chakraborty',
    name: 'Pratima Chakraborty (PT)',
    primaryRole: 'Gynae Specialist · Lamaze Practitioner',
    tags: ['Women’s Health', 'Birth Prep'],
    focus:
      'Supports women through pregnancy, postnatal recovery and pelvic health with calm, practical guidance.',
    initials: 'PC',
    location: 'Patiala',
  },
  {
    id: 'aakash-kalra',
    name: 'Aakash Kalra (PT)',
    primaryRole: 'Ortho Specialist',
    tags: ['Knee & Shoulder', 'Return to Sport'],
    focus:
      'Designs structured plans for joint injuries so patients can return to sport and daily life with confidence.',
    initials: 'AK',
    location: 'Patiala',
  },
  {
    id: 'harpreet-kaur',
    name: 'Harpreet Kaur (PT)',
    primaryRole: 'Ortho Specialist',
    tags: ['Chronic Pain', 'Posture'],
    focus:
      'Combines hands-on work and education to ease long-standing neck, back and postural discomfort.',
    initials: 'HK',
    location: 'Patiala',
  },
  {
    id: 'naina-rattan',
    name: 'Naina Rattan (PT)',
    primaryRole: 'Ortho Specialist',
    tags: ['Spine', 'Everyday Mobility'],
    focus:
      'Helps people move more freely in daily life with practical exercises that actually fit busy routines.',
    initials: 'NR',
    location: 'Patiala',
  },
  {
    id: 'divyansh-bansal',
    name: 'Divyansh Bansal (PT)',
    primaryRole: 'Sports Specialist',
    tags: ['Athlete Care', 'Performance'],
    focus:
      'Guides athletes and weekend players from acute injury back to confident performance on the field.',
    initials: 'DB',
    location: 'Patiala',
  },
  {
    id: 'komalpreet-kaur',
    name: 'Komalpreet Kaur (PT)',
    primaryRole: 'Physiotherapist',
    tags: ['Rehab Support', 'Education'],
    focus:
      'Provides calm, consistent support through each phase of rehab so patients never feel they are guessing.',
    initials: 'KK',
    location: 'Patiala',
  },
  {
    id: 'mansi',
    name: 'Mansi (PT)',
    primaryRole: 'Physiotherapist',
    tags: ['Exercise Therapy', 'Recovery'],
    focus:
      'Uses movement-based therapy and simple home plans to turn small daily wins into long-term recovery.',
    initials: 'M',
    location: 'Patiala',
  },
] as const

/* ─── Animation variants ─── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] },
  },
}

/* ─── Single card ─── */
interface MemberForCard {
  id?: string
  name: string
  primaryRole: string
  tags: readonly string[] | string[]
  focus: string
  initials: string
  image?: string
  location?: string
}

function TeamMemberCard({ member }: { member: MemberForCard }) {
  const [isHovered, setIsHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2))
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2))
  }

  const handleMouseLeave = () => {
    mouseX.set(0); mouseY.set(0); setIsHovered(false)
  }

  return (
    <motion.div variants={itemVariants} style={{ perspective: 1000 }}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group relative"
      >
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm backdrop-blur-xl transition-shadow duration-500 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-900">
          {/* Hover gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-white/5 to-transparent"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Sparkle */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
            className="absolute right-4 top-4 z-10"
          >
            <Sparkles className="h-4 w-4 text-sky-500 dark:text-sky-400" />
          </motion.div>

          <div className="relative z-10 p-6">
            {/* Avatar */}
            <div className="mb-4 flex justify-center">
              <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-slate-200/60 bg-gradient-to-br from-sky-100 to-sky-50 dark:border-slate-700/60 dark:from-sky-900/40 dark:to-slate-800">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-sky-600 dark:text-sky-300">
                      {member.initials}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Info */}
            <div className="text-center">
              <h3 className="mb-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{member.name}</h3>
              <span className="mb-2 inline-block rounded-full bg-sky-50 px-3 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                {member.primaryRole}
              </span>

              {member.location && (
                <div className="mt-1.5 flex items-center justify-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                  <MapPin className="h-3 w-3" />
                  <span>{member.location}</span>
                </div>
              )}

              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{member.focus}</p>

              {/* Tags */}
              <motion.div className="mt-3 flex flex-wrap justify-center gap-1.5" animate={isHovered ? { opacity: 1 } : { opacity: 0.7 }} transition={{ duration: 0.3 }}>
                {member.tags.map((tag, idx) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.08 * idx, type: 'spring' }}
                    className="rounded-full border border-slate-200/60 bg-slate-50 px-2.5 py-0.5 text-[0.6rem] font-medium text-slate-500 transition-colors hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-sky-900/30 dark:hover:text-sky-300"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Page ─── */
export function Team() {
  const [dbTeam, setDbTeam] = useState<TeamMemberData[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getTeamMembers()
      .then((data) => { if (data.length > 0) setDbTeam(data) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const useDb = dbTeam.length > 0

  const members: MemberForCard[] = useDb
    ? dbTeam.map((m) => ({ ...m, location: 'Patiala' }))
    : teamMembers.map((m) => ({ ...m, tags: [...m.tags] }))

  if (!loaded) return null

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-400/25 blur-[180px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-[180px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="mb-14 text-center"
        >
          <motion.span
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-sky-700 shadow-sm dark:bg-slate-900/80 dark:text-sky-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="h-3 w-3" />
            Our Team
          </motion.span>

          <motion.h1
            className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Specialists Who Treat You
            <br />
            <span className="bg-gradient-to-r from-sky-500 to-sky-400 bg-clip-text text-transparent">
              Like Family
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm text-slate-500 sm:text-base dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Every therapist at KYNA is a licensed professional with advanced training in their area of
            practice. Together, they combine sports rehab, orthopaedics, neurology and women&apos;s health to
            build truly personalised treatment journeys.
          </motion.p>
        </motion.div>

        {/* Team grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {members.map((member) => (
            <TeamMemberCard key={member.id ?? member.name} member={member} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
