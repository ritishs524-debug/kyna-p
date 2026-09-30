'use client'

import { useCallback, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useModalScrollLock } from '../../lib/useModalScrollLock'

type ServiceModalProps = {
  open: boolean
  onClose: () => void
  badge: string
  title: string
  body: string
  image: string
  imageAlt: string
  accent: string
  onBook?: () => void
  /**
   * Resolves the control to return focus to, evaluated at *restore* time.
   * A getter rather than a captured node: the services grid can remount while
   * the dialog is open, which would leave a captured node detached and drop
   * focus to <body> on close.
   */
  getReturnFocus?: () => HTMLElement | null
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Accessible detail dialog for the long-form service copy.
 *
 * Long descriptions live here instead of inside the service cards, so the
 * cards stay scannable without losing a single word of the original copy.
 * Handles: focus trap, Escape to close, focus restore, scroll lock and the
 * usual aria wiring.
 */
export function ServiceModal({
  open,
  onClose,
  badge,
  title,
  body,
  image,
  imageAlt,
  accent,
  onBook,
  getReturnFocus,
}: ServiceModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const restoreTo = useRef<HTMLElement | null>(null)
  // Keep the latest callback without making it an effect dependency, otherwise
  // the effect re-runs mid-dialog and captures the *dialog's* focused element
  // as the restore target, so focus is dropped on close instead of returning.
  const onCloseRef = useRef(onClose)
  const getReturnFocusRef = useRef(getReturnFocus)

  // Synced after render (not during it) so the dialog always calls the newest
  // callback without making it an effect dependency.
  useEffect(() => {
    onCloseRef.current = onClose
    getReturnFocusRef.current = getReturnFocus
  })

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

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
    },
    [],
  )

  useEffect(() => {
    if (!open) return

    restoreTo.current = getReturnFocusRef.current?.() ?? null

    document.addEventListener('keydown', handleKeyDown)
    // Move focus into the dialog
    const t = window.setTimeout(() => {
      const panel = panelRef.current
      if (!panel) return
      const target = panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel
      target.focus()
    }, 20)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(t)
      // Defer to the next tick: React removes the dialog's DOM in the same
      // commit, and detaching the focused node resets focus to <body> after
      // a synchronous focus() call. Waiting a tick makes the restore stick,
      // and re-resolving here survives a remount of the underlying grid.
      window.setTimeout(() => {
        const target = getReturnFocusRef.current?.() ?? restoreTo.current
        if (target && document.contains(target)) target.focus()
      }, 0)
    }
  }, [open, handleKeyDown])

  // Locks the page and hands wheel scrolling to this dialog.
  useModalScrollLock(open)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        aria-describedby="service-modal-body"
        tabIndex={-1}
        className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-[26px] bg-white shadow-[0_30px_90px_rgba(11,35,71,0.35)] sm:rounded-[26px] dark:bg-slate-900 dark:shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
        // Lenis ignores wheel events inside this element so the dialog can be
        // scrolled when the copy is taller than the viewport.
        data-lenis-prevent
      >
        {/* Hero image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0B2347]/70 via-[#0B2347]/20 to-transparent"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#0B2347] shadow-lg transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087CF0]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase"
            style={{ color: accent }}
          >
            {badge}
          </p>
          <h2
            id="service-modal-title"
            className="mt-2.5 text-[24px] leading-snug font-extrabold tracking-tight text-[#0B2347] sm:text-[28px] dark:text-white"
          >
            {title}
          </h2>
          <p
            id="service-modal-body"
            className="mt-4 text-[15px] leading-[1.75] text-slate-600 dark:text-slate-300"
          >
            {body}
          </p>

          {onBook && (
            <button
              type="button"
              onClick={onBook}
              className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#087CF0] to-[#0284C7] px-8 font-bold text-white shadow-[0_12px_30px_rgba(8,124,240,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(8,124,240,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087CF0] sm:w-auto"
            >
              Book a Session
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
