import { motion } from 'framer-motion'

/* ─── Types ─── */

export interface BranchItem {
  num: string
  name: string
  sub: string
  href: string
}

interface BranchCardsProps {
  branches: readonly BranchItem[]
}

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Accent per card (matches reference) ─── */

const ACCENTS = [
  '#14B8A6', // 01 teal
  '#8B5CF6', // 02 purple
  '#10B981', // 03 green
  '#F59E0B', // 04 orange
  '#1683FF', // 05 blue
  '#EC4899', // 06 pink
] as const

/* ─── Single card ─── */

function BranchCard({ branch, index }: { branch: BranchItem; index: number }) {
  const dot = ACCENTS[index] ?? ACCENTS[0]

  return (
    <motion.a
      href={branch.href}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.07 }}
      viewport={{ once: true, margin: '-60px' }}
      className="group flex h-[105px] items-center gap-4 rounded-[20px] border border-sky-100 bg-white px-6 shadow-[0_4px_16px_rgba(11,35,71,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_12px_30px_rgba(11,35,71,0.09)] lg:px-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
    >
      {/* Coloured indicator */}
      <span
        className="h-[11px] w-[11px] shrink-0 rounded-full"
        style={{ backgroundColor: dot }}
        aria-hidden="true"
      />

      {/* Title + subtitle */}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-semibold text-[#0B2347] dark:text-white">
          {branch.name}
        </span>
        <span className="mt-1 block truncate text-[14px] leading-[1.4] text-slate-500 dark:text-slate-400">
          {branch.sub}
        </span>
      </span>

      {/* Circular arrow button */}
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F4FD] transition-colors duration-300 group-hover:bg-[#1683FF] dark:bg-sky-950/50 dark:group-hover:bg-sky-500"
        aria-hidden="true"
      >
        <svg
          className="h-4 w-4 text-[#0B2347] transition-colors duration-300 group-hover:text-white dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </span>
    </motion.a>
  )
}

/* ─── Grid wrapper — 3 × 2 on desktop, 2 on tablet, 1 on mobile ─── */

export default function BranchCards({ branches }: BranchCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-6">
      {branches.map((b, i) => (
        <BranchCard key={b.name} branch={b} index={i} />
      ))}
    </div>
  )
}
