import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'

interface BranchItem {
  name: string
  subtitle?: string
}

interface BranchCardsProps {
  branches: readonly BranchItem[]
}

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const

/* ─── Single 3D card ─── */

function BranchCard({
  branch,
  index,
  scrollYProgress,
}: {
  branch: BranchItem
  index: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const [hovered, setHovered] = useState(false)

  /* ── mouse parallax ── */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(my, { stiffness: 150, damping: 20 })
  const rotateY = useSpring(mx, { stiffness: 150, damping: 20 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const px = ((e.clientX - cx) / (rect.width / 2)) * 12
    const py = ((e.clientY - cy) / (rect.height / 2)) * -12
    mx.set(px)
    my.set(py)
  }

  const handleLeave = () => {
    mx.set(0)
    my.set(0)
    setHovered(false)
  }

  /* ── scroll parallax (different offset per card for depth) ── */
  const direction = index % 2 === 0 ? 1 : -1
  const magnitude = 15 + (index % 3) * 10 // 15, 25, 35 cycling
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [magnitude * direction, -magnitude * direction]
  )

  return (
    <motion.div
      style={{ y, rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
      initial={{ opacity: 0, rotateX: 25, rotateY: -15, z: -200, y: 80 }}
      whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, y: 0 }}
      transition={{ duration: 0.9, ease: CINEMATIC_EASE, delay: index * 0.15 }}
      viewport={{ once: true, margin: '-100px' }}
      onMouseMove={(e) => {
        handleMouse(e)
        setHovered(true)
      }}
      onMouseLeave={handleLeave}
      className={`
        relative min-h-[120px] cursor-default rounded-2xl border p-8
        backdrop-blur-xl transition-colors duration-300
        ${hovered
          ? 'border-white/30 bg-white/10 shadow-[0_0_60px_rgba(255,255,255,0.12)]'
          : 'border-white/10 bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.08)]'
        }
      `}
    >
      {/* watermark number */}
      <span className="pointer-events-none absolute right-6 top-4 select-none text-5xl font-black text-white/[0.07]">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="relative z-10 flex h-full items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-light uppercase tracking-[0.25em] text-white sm:text-lg">
            {branch.name}
          </h3>
          {branch.subtitle && (
            <p className="mt-1 text-xs tracking-wide text-white/50">{branch.subtitle}</p>
          )}
        </div>

        {/* arrow */}
        <svg
          className={`h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 ${hovered ? 'translate-x-1 text-white/70' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>
      </div>
    </motion.div>
  )
}

/* ─── Grid wrapper ─── */

export default function BranchCards({ branches }: BranchCardsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return (
    <div ref={ref} style={{ perspective: 1200 }}>
      <div className="grid gap-6 sm:grid-cols-2">
        {branches.map((b, i) => (
          <BranchCard
            key={b.name}
            branch={b}
            index={i}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  )
}

