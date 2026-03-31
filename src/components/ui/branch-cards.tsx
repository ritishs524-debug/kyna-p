import { useRef, useEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'

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

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const

/* ─── Per-card color config ─── */
interface CardColors {
  bg: string
  border: string
  hoverBorder: string
  hoverShadow: string
  topGlow: string
  orb: string
  numColor: string
  subColor: string
  arrowHoverBg: string
  arrowHoverShadow: string
  starsExtra: string[]
}

const CARD_COLORS: CardColors[] = [
  // 01 — Patiala (cyan)
  {
    bg: 'linear-gradient(135deg, rgba(13,42,71,0.85) 0%, rgba(8,26,48,0.9) 60%, rgba(15,52,72,0.7) 100%)',
    border: 'rgba(34,211,238,0.18)',
    hoverBorder: 'rgba(34,211,238,0.45)',
    hoverShadow: '0 0 30px rgba(34,211,238,0.12), 0 20px 50px rgba(0,0,0,0.5)',
    topGlow: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5), rgba(6,182,212,0.5), transparent)',
    orb: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)',
    numColor: 'rgba(34,211,238,0.35)',
    subColor: 'rgba(103,232,249,0.5)',
    arrowHoverBg: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    arrowHoverShadow: '0 0 15px rgba(6,182,212,0.5)',
    starsExtra: ['rgba(34,211,238,0.9)', 'rgba(6,182,212,0.9)'],
  },
  // 02 — Sangrur (violet)
  {
    bg: 'linear-gradient(135deg, rgba(46,16,101,0.8) 0%, rgba(15,10,40,0.92) 55%, rgba(30,20,80,0.7) 100%)',
    border: 'rgba(139,92,246,0.2)',
    hoverBorder: 'rgba(167,139,250,0.5)',
    hoverShadow: '0 0 30px rgba(139,92,246,0.15), 0 20px 50px rgba(0,0,0,0.5)',
    topGlow: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(99,102,241,0.5), transparent)',
    orb: 'radial-gradient(circle, rgba(109,40,217,0.12), transparent 70%)',
    numColor: 'rgba(167,139,250,0.4)',
    subColor: 'rgba(196,181,253,0.5)',
    arrowHoverBg: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    arrowHoverShadow: '0 0 15px rgba(124,58,237,0.5)',
    starsExtra: ['rgba(167,139,250,0.9)', 'rgba(196,181,253,0.9)'],
  },
  // 03 — Samana (green)
  {
    bg: 'linear-gradient(135deg, rgba(6,50,30,0.85) 0%, rgba(5,30,20,0.92) 55%, rgba(10,50,35,0.7) 100%)',
    border: 'rgba(52,211,153,0.18)',
    hoverBorder: 'rgba(52,211,153,0.45)',
    hoverShadow: '0 0 30px rgba(52,211,153,0.12), 0 20px 50px rgba(0,0,0,0.5)',
    topGlow: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.5), rgba(16,185,129,0.5), transparent)',
    orb: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)',
    numColor: 'rgba(52,211,153,0.35)',
    subColor: 'rgba(110,231,183,0.5)',
    arrowHoverBg: 'linear-gradient(135deg, #059669, #10b981)',
    arrowHoverShadow: '0 0 15px rgba(16,185,129,0.5)',
    starsExtra: ['rgba(52,211,153,0.9)', 'rgba(110,231,183,0.9)'],
  },
  // 04 — Anamiva (orange)
  {
    bg: 'linear-gradient(135deg, rgba(120,40,10,0.7) 0%, rgba(50,15,8,0.92) 55%, rgba(100,30,10,0.6) 100%)',
    border: 'rgba(251,146,60,0.18)',
    hoverBorder: 'rgba(251,146,60,0.45)',
    hoverShadow: '0 0 30px rgba(251,146,60,0.12), 0 20px 50px rgba(0,0,0,0.5)',
    topGlow: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.5), rgba(245,158,11,0.5), transparent)',
    orb: 'radial-gradient(circle, rgba(234,88,12,0.12), transparent 70%)',
    numColor: 'rgba(251,146,60,0.4)',
    subColor: 'rgba(253,186,116,0.5)',
    arrowHoverBg: 'linear-gradient(135deg, #ea580c, #f59e0b)',
    arrowHoverShadow: '0 0 15px rgba(234,88,12,0.5)',
    starsExtra: ['rgba(251,146,60,0.9)', 'rgba(253,186,116,0.9)'],
  },
  // 05 — Good Life (blue)
  {
    bg: 'linear-gradient(135deg, rgba(10,20,80,0.85) 0%, rgba(8,15,55,0.92) 55%, rgba(20,30,100,0.7) 100%)',
    border: 'rgba(96,165,250,0.2)',
    hoverBorder: 'rgba(147,197,253,0.45)',
    hoverShadow: '0 0 30px rgba(59,130,246,0.15), 0 20px 50px rgba(0,0,0,0.5)',
    topGlow: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.5), rgba(139,92,246,0.4), transparent)',
    orb: 'radial-gradient(circle, rgba(37,99,235,0.12), transparent 70%)',
    numColor: 'rgba(96,165,250,0.35)',
    subColor: 'rgba(147,197,253,0.5)',
    arrowHoverBg: 'linear-gradient(135deg, #2563eb, #4f46e5)',
    arrowHoverShadow: '0 0 15px rgba(99,102,241,0.5)',
    starsExtra: ['rgba(96,165,250,0.9)', 'rgba(147,197,253,0.9)'],
  },
  // 06 — Women's Care (pink)
  {
    bg: 'linear-gradient(135deg, rgba(80,10,50,0.8) 0%, rgba(40,8,30,0.92) 55%, rgba(90,15,60,0.65) 100%)',
    border: 'rgba(244,114,182,0.2)',
    hoverBorder: 'rgba(249,168,212,0.5)',
    hoverShadow: '0 0 30px rgba(236,72,153,0.15), 0 20px 50px rgba(0,0,0,0.5)',
    topGlow: 'linear-gradient(90deg, transparent, rgba(244,114,182,0.6), rgba(236,72,153,0.5), transparent)',
    orb: 'radial-gradient(circle, rgba(219,39,119,0.12), transparent 70%)',
    numColor: 'rgba(244,114,182,0.4)',
    subColor: 'rgba(249,168,212,0.5)',
    arrowHoverBg: 'linear-gradient(135deg, #db2777, #ec4899)',
    arrowHoverShadow: '0 0 15px rgba(236,72,153,0.5)',
    starsExtra: ['rgba(244,114,182,0.9)', 'rgba(249,168,212,0.9)'],
  },
]

/* ─── Base star colors ─── */
const BASE_STAR_COLORS = [
  'rgba(252,211,77,0.9)',
  'rgba(255,255,255,0.95)',
]

/* ─── Canvas star field ─── */

interface Star {
  x: number
  y: number
  r: number
  color: string
  alpha: number
  speed: number
  twinkleSpeed: number
  phase: number
}

function useStarCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, extraColors: string[] = []) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const palette = [...BASE_STAR_COLORS, ...extraColors]

    let frame = 0
    let rafId: number

    const stars: Star[] = Array.from({ length: 28 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.3 + Math.random() * 1.4,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.2 + Math.random() * 0.6,
      speed: 0.003 + Math.random() * 0.008,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
    }))

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    function draw() {
      if (!ctx || !canvas) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      frame++

      for (const s of stars) {
        const twinkle = Math.sin(frame * s.twinkleSpeed + s.phase)
        const a = s.alpha * (0.5 + 0.5 * twinkle)
        const r = s.r * (0.85 + 0.15 * twinkle) * devicePixelRatio

        const px = s.x * w
        const py = s.y * h

        // glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 3)
        grad.addColorStop(0, s.color.replace(/[^,]+\)$/, `${a})`))
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(px, py, r * 3, 0, Math.PI * 2)
        ctx.fill()

        // core
        ctx.fillStyle = `rgba(255,255,255,${a})`
        ctx.beginPath()
        ctx.arc(px, py, r * 0.5, 0, Math.PI * 2)
        ctx.fill()

        // float up
        s.y -= s.speed / 60
        if (s.y < -0.02) {
          s.y = 1.02
          s.x = Math.random()
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [canvasRef, extraColors])
}

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
  const colors = CARD_COLORS[index] || CARD_COLORS[0]
  const [hovered, setHovered] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useStarCanvas(canvasRef, colors.starsExtra)

  /* ── mouse tilt ── */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 })
  const rY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(nx)
    mouseY.set(ny)
  }

  const handleLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }

  /* ── scroll parallax ── */
  const y = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -20 : 20])

  return (
    <motion.div
      style={{
        y,
        rotateX: rX,
        rotateY: rY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
        willChange: 'transform',
        background: colors.bg,
        borderColor: hovered ? colors.hoverBorder : colors.border,
        boxShadow: hovered ? colors.hoverShadow : 'none',
        backdropFilter: 'blur(20px) saturate(180%)',
      }}
      initial={{ opacity: 0, y: 60, rotateX: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      transition={{ duration: 0.85, ease: CINEMATIC_EASE, delay: index * 0.12 }}
      viewport={{ once: true, margin: '-80px' }}
      onMouseMove={(e) => { handleMouse(e); setHovered(true) }}
      onMouseLeave={handleLeave}
      className={`
        relative min-h-[140px] cursor-default overflow-hidden rounded-[18px] border p-7
        transition-all duration-300
        ${hovered ? '-translate-y-[5px]' : ''}
      `}
    >
      {/* Top glow line */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-px"
        style={{ background: hovered ? colors.topGlow : 'transparent', transition: 'background 0.3s' }}
      />

      {/* Background orb */}
      <div
        className="pointer-events-none absolute -right-1/4 -top-1/4 z-0 h-3/4 w-3/4 opacity-60"
        style={{ background: colors.orb }}
      />

      {/* Canvas stars */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[86px] flex-col justify-between">
        <div>
          <span
            className="text-[11px] font-light tracking-[0.3em]"
            style={{ color: colors.numColor }}
          >
            {branch.num}
          </span>
          <h3 className="mt-1 text-[15px] font-light uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.92)' }}>
            {branch.name}
          </h3>
          <p className="mt-0.5 text-[11px] tracking-wider" style={{ color: colors.subColor }}>{branch.sub}</p>
        </div>

        {/* Arrow button */}
        <div className="flex justify-end">
          <span
            className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border transition-all duration-300"
            style={hovered ? {
              transform: 'scale(1.1)',
              borderColor: 'transparent',
              background: colors.arrowHoverBg,
              color: '#fff',
              boxShadow: colors.arrowHoverShadow,
            } : {
              borderColor: 'rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </span>
        </div>
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
    <div ref={ref}>
      <div className="grid gap-5 sm:grid-cols-2">
        {branches.map((b, i) => (
          <BranchCard key={b.name} branch={b} index={i} scrollYProgress={scrollYProgress} />
        ))}
      </div>
    </div>
  )
}

