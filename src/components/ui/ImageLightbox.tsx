'use client'

import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useModalScrollLock } from '../../lib/useModalScrollLock'

export type LightboxImage = {
  src: string
  alt: string
}

type ImageLightboxProps = {
  images: LightboxImage[]
  /** Index of the open image, or null when closed. */
  index: number | null
  onClose: () => void
  onIndexChange: (next: number) => void
}

const FOCUSABLE =
  'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

/**
 * Full-screen image viewer.
 *
 * Renders through a portal because the hero wraps its content in a
 * framer-motion node, and that transform would otherwise become the
 * containing block for `position: fixed` — the overlay would be clipped to
 * the hero instead of covering the viewport.
 */
export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const restoreTo = useRef<HTMLElement | null>(null)
  const touchStartX = useRef<number | null>(null)

  const total = images.length
  const isOpen = index !== null && index >= 0 && index < total
  const current = isOpen ? images[index] : null

  const go = useCallback(
    (delta: number) => {
      if (index === null || total === 0) return
      onIndexChange((index + delta + total) % total)
    },
    [index, total, onIndexChange],
  )

  // ── Keyboard: Escape, arrows, Home/End ──
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          onClose()
          break
        case 'ArrowRight':
          event.preventDefault()
          go(1)
          break
        case 'ArrowLeft':
          event.preventDefault()
          go(-1)
          break
        case 'Home':
          event.preventDefault()
          onIndexChange(0)
          break
        case 'End':
          event.preventDefault()
          onIndexChange(total - 1)
          break
        case 'Tab': {
          // Keep focus inside the dialog
          const panel = panelRef.current
          if (!panel) return
          const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (el) => el.offsetParent !== null || el === document.activeElement,
          )
          if (items.length === 0) {
            event.preventDefault()
            return
          }
          const first = items[0]
          const last = items[items.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
          break
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, go, onClose, onIndexChange, total])

  // ── Lock the page behind the viewer, then restore exactly where we were ──
  useEffect(() => {
    if (!isOpen) return

    restoreTo.current = document.activeElement as HTMLElement | null

    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current
      if (!panel) return
      const target = panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel
      target.focus()
    }, 30)

    return () => {
      window.clearTimeout(focusTimer)
      // Defer focus restore past the unmount commit, otherwise detaching the
      // focused node resets focus to <body>.
      window.setTimeout(() => {
        const target = restoreTo.current
        if (target && document.contains(target)) target.focus()
      }, 0)
    }
  }, [isOpen])

  // Shared lock: stops Lenis driving the window and locks the root element.
  useModalScrollLock(isOpen)

  // This app is a client-only SPA (no SSR), so `document.body` is always
  // available here — no mounted flag needed.
  if (!isOpen || !current) return null

  const enter = reduce
    ? { initial: false as const }
    : {
        initial: { opacity: 0, scale: 0.97, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: 8 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
      }

  const slide = reduce ? 0 : 14

  return createPortal(
    <motion.div
      {...enter}
      className="fixed inset-0 z-[90] flex flex-col bg-slate-950/88 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${total}`}
      onClick={onClose}
    >
      {/* ── Top bar: counter + close ── */}
      <div
        className="flex shrink-0 items-center justify-between gap-4 px-4 py-4 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[13px] font-semibold tracking-[0.18em] text-white/85 tabular-nums sm:text-sm">
          {index + 1} <span className="text-white/40">/ {total}</span>
        </p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors duration-200 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* ── Image stage ── */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-3 sm:px-16 sm:pb-6"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current
          const end = e.changedTouches[0]?.clientX
          touchStartX.current = null
          if (start === null || end === undefined) return
          const dx = end - start
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        }}
      >
        {/* Prev / next — overlaid on the sides from `sm` up, where there is
            room beside the image. On phones they move to the bottom bar
            instead, so they never sit on top of the photograph. */}
        {total > 1 && (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 hidden items-center justify-between px-2 sm:flex">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors duration-200 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors duration-200 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Crossfade between images */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={current.src}
            ref={panelRef}
            tabIndex={-1}
            initial={reduce ? { opacity: 1 } : { opacity: 0, x: slide }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -slide }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full w-full min-h-0 items-center justify-center outline-none"
          >
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-full max-w-full rounded-[16px] object-contain shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            />
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* ── Caption + mobile paging controls ── */}
      <div
        className="shrink-0 px-4 pb-5 text-center sm:px-6 sm:pb-7"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mx-auto max-w-2xl text-[13px] leading-relaxed text-white/70 sm:text-sm">
          {current.alt}
        </p>

        {total > 1 && (
          <>
            <p className="mt-2 hidden text-[12px] text-white/35 sm:block">
              Use ← → to browse · Esc to close
            </p>
            {/* Phones get their own thumb-reachable pager below the image */}
            <div className="mt-4 flex items-center justify-center gap-4 sm:hidden">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors duration-200 active:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <span className="text-[13px] font-semibold tracking-[0.14em] text-white/70 tabular-nums">
                {index + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors duration-200 active:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>,
    document.body,
  )
}
