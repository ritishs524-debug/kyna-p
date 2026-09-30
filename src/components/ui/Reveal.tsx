'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { motion as m } from '../../lib/design-tokens'

/**
 * Pre-created motion components. Building these at render time would recreate
 * the component identity on every render and break reconciliation, so the map
 * is built once at module scope.
 */
const MOTION = {
  div: motion.div,
  article: motion.article,
  figure: motion.figure,
  section: motion.section,
  li: motion.li,
  span: motion.span,
} as const

type RevealTag = keyof typeof MOTION

type RevealProps = {
  children: ReactNode
  /** Stagger index — capped at the 80ms maximum from the motion spec. */
  index?: number
  className?: string
  as?: RevealTag
  /** Distance to travel, in px. Kept small (12–20px) per the motion spec. */
  distance?: number
}

/**
 * The only sanctioned scroll animation on the site: a single fade-up that
 * fires once when the element enters the viewport.
 *
 * Respects `prefers-reduced-motion` — when the user asks for less motion the
 * element simply renders in its final state, with no transform and no
 * transition, so nothing moves at all.
 */
export function Reveal({
  children,
  index = 0,
  className = '',
  as = 'div',
  distance = 18,
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = MOTION[as]

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: m.duration,
        ease: m.ease,
        // Capped at the 80ms maximum so long lists never feel sluggish.
        delay: Math.min(index * m.stagger, m.maxStagger * 2),
      }}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Grid/list wrapper: reveals its children one after another, capped at the
 * 80ms stagger maximum.
 */
const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: m.stagger } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: m.duration, ease: m.ease } },
}

export function RevealGroup({
  children,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: RevealTag
}) {
  const reduce = useReducedMotion()
  const MotionTag = MOTION[as]

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({
  children,
  className = '',
  as = 'div',
  index,
  animate = true,
}: {
  children: ReactNode
  className?: string
  as?: RevealTag
  /** Extra delay in 70ms steps, for staggered items inside a RevealGroup. */
  index?: number
  /**
   * Set false for items that appear *after* the group's reveal has already
   * fired (e.g. a "Show more" batch). Framer Motion propagates variants from
   * the parent, so children mounted after `whileInView` completed can sit at
   * `opacity: 0` while still occupying layout — visible as blank space.
   */
  animate?: boolean
}) {
  const reduce = useReducedMotion()
  const MotionTag = MOTION[as]
  const Tag = as

  if (reduce || !animate) {
    return <Tag className={className}>{children}</Tag>
  }

  // A sibling `index` stacks on top of the group's own stagger.
  const delay = index ? Math.min(index * m.stagger, m.maxStagger * 2) : undefined

  return (
    <MotionTag
      className={className}
      variants={itemVariants}
      custom={index}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  )
}
