import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenisInstance: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function useSmoothScroll(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      lerp: 0.09,
    })

    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}

export function smoothScrollTo(target: number | string | HTMLElement, offset = 0) {
  const lenis = lenisInstance
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 })
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target + offset, behavior: 'smooth' })
  } else if (typeof target === 'string') {
    const el = document.querySelector(target) as HTMLElement | null
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  } else if (target instanceof HTMLElement) {
    const top = target.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
