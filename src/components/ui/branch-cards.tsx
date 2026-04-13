import { motion } from 'framer-motion'

/* ─── Types ─── */

interface BranchItem {
  num: string
  name: string
  sub: string
  href: string
}

interface BranchCardsProps {
  branches: readonly BranchItem[]
}

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Accent colors per card ─── */
const ACCENTS = [
  { dot: '#06b6d4', tag: 'bg-cyan-500/10 text-cyan-300', hover: 'hover:border-cyan-500/30' },
  { dot: '#8b5cf6', tag: 'bg-violet-500/10 text-violet-300', hover: 'hover:border-violet-500/30' },
  { dot: '#10b981', tag: 'bg-emerald-500/10 text-emerald-300', hover: 'hover:border-emerald-500/30' },
  { dot: '#f59e0b', tag: 'bg-amber-500/10 text-amber-300', hover: 'hover:border-amber-500/30' },
  { dot: '#3b82f6', tag: 'bg-blue-500/10 text-blue-300', hover: 'hover:border-blue-500/30' },
  { dot: '#ec4899', tag: 'bg-pink-500/10 text-pink-300', hover: 'hover:border-pink-500/30' },
]

/* ─── Single card ─── */

function BranchCard({ branch, index }: { branch: BranchItem; index: number }) {
  const accent = ACCENTS[index] || ACCENTS[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
      viewport={{ once: true, margin: '-60px' }}
      className={`group relative flex items-center gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/20 ${accent.hover}`}
    >
      {/* Accent dot */}
      <div
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: accent.dot }}
      />

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="text-[14px] font-medium tracking-wide text-white/90">
          {branch.name}
        </h3>
        <p className="mt-0.5 text-[12px] tracking-wide text-white/40">
          {branch.sub}
        </p>
      </div>

      {/* Arrow */}
      <svg
        className="h-4 w-4 shrink-0 text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white/50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </motion.div>
  )
}

/* ─── Grid wrapper ─── */

export default function BranchCards({ branches }: BranchCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {branches.map((b, i) => (
        <BranchCard key={b.name} branch={b} index={i} />
      ))}
    </div>
  )
}

