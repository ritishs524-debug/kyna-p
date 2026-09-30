'use client'

import { useEffect, useRef } from 'react'
import { getLenis } from './useSmoothScroll'

/**
 * Locks the page behind a modal and hands scrolling to the modal itself.
 *
 * Two separate things have to be handled:
 *
 * 1. **Lenis drives window scroll directly.** `body { overflow: hidden }` does
 *    not stop it, so the page keeps gliding behind the dialog and wheel events
 *    never reach the dialog's own scroll box. We call `lenis.stop()` and lock
 *    the root element as well as the body.
 *
 * 2. **The modal is the scroll container.** Lenis provides
 *    `data-lenis-prevent` for exactly this: any element carrying the attribute
 *    keeps native wheel/touch scrolling while Lenis ignores it. Put the
 *    attribute on the dialog panel and it scrolls on its own.
 */
export function useModalScrollLock(open: boolean) {
  const savedScroll = useRef(0)

  useEffect(() => {
    if (!open) return

    savedScroll.current = window.scrollY

    const lenis = getLenis()
    lenis?.stop()

    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    const prevScrollBehavior = document.documentElement.style.scrollBehavior

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.scrollBehavior = 'auto'

    return () => {
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
      document.documentElement.style.scrollBehavior = prevScrollBehavior
      lenis?.start()

      // Unlocking can drop the scroll position, so put it back exactly.
      window.scrollTo(0, savedScroll.current)
    }
  }, [open])
}
