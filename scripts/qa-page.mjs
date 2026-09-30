/**
 * Single-page QA capture. Usage: node scripts/qa-page.mjs about
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const PAGE = process.argv[2] || 'about'
const PATH = process.argv[3] || `/${PAGE === 'home' ? '' : PAGE}`
const BASE = process.env.BASE_URL || 'http://localhost:5173'
const OUT = `qa-screenshots/qa-${PAGE}`

const WIDTHS = [
  ['1440', 1440, 900],
  ['1024', 1024, 900],
  ['768', 768, 900],
  ['390', 390, 900],
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()
const rows = []

for (const theme of ['light', 'dark']) {
  for (const [label, width, height] of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      colorScheme: theme,
      reducedMotion: 'reduce',
    })
    await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme)
    const page = await ctx.newPage()

    const errors = []
    const isEnvNoise = (t) =>
      /kyna-backend\.onrender\.com|Failed to load resource|net::ERR|CORS/i.test(t)
    page.on('console', (m) => {
      if (m.type() === 'error' && !isEnvNoise(m.text())) errors.push(m.text())
    })
    page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

    await page.goto(BASE + PATH, { waitUntil: 'networkidle', timeout: 45000 })
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 90))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(600)

    await page.screenshot({ path: `${OUT}/${PAGE}-${label}-${theme}.png`, fullPage: true })

    const m = await page.evaluate(() => {
      const doc = document.documentElement
      const isClipped = (el) => {
        let p = el.parentElement
        while (p && p !== document.body) {
          if (getComputedStyle(p).overflowX !== 'visible') return true
          p = p.parentElement
        }
        return false
      }
      const wide = []
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.right <= doc.clientWidth + 2) return
        const cs = getComputedStyle(el)
        if (cs.position === 'fixed' || cs.pointerEvents === 'none') return
        if (isClipped(el)) return
        wide.push(
          el.tagName.toLowerCase() + '.' +
            (el.className || '').toString().split(' ').slice(0, 3).join('.') +
            ` right=${Math.round(r.right)}`,
        )
      })

      // token conformance: collect the actual computed values in play
      const h1 = document.querySelector('h1')
      const hs = h1 ? getComputedStyle(h1) : null
      const eyebrows = Array.from(
        document.querySelectorAll('p.uppercase'),
      ).map((p) => getComputedStyle(p).color)
      const sections = Array.from(document.querySelectorAll('main > div > section')).map(
        (s) => {
          const b = s.getBoundingClientRect()
          return {
            bg: getComputedStyle(s).backgroundColor,
            padTop: getComputedStyle(s).paddingTop,
            padBottom: getComputedStyle(s).paddingBottom,
            h: Math.round(b.height),
          }
        },
      )
      // Sections sit edge-to-edge by design (Home does the same) and their
      // padding lives on an inner wrapper, so structural boxes always touch.
      // Measure the real whitespace between the last *text leaf* of one
      // section and the first text leaf of the next.
      const textLeaves = (section) =>
        Array.from(
          section.querySelectorAll('h1,h2,h3,h4,p,li,span,a,button,figcaption,blockquote'),
        )
          .filter((el) => {
            // a "leaf" is an element with its own visible text and no child
            // element that also carries text
            if (!el.textContent.trim()) return false
            const r = el.getBoundingClientRect()
            if (r.height === 0 || r.width === 0) return false
            return !Array.from(el.children).some((c) => c.textContent.trim())
          })
          .map((el) => el.getBoundingClientRect())
          .sort((a, b) => a.top - b.top)

      let contentCollisions = 0
      let minGap = Infinity
      const collisionDetail = []
      const kids = Array.from(document.querySelectorAll('main > div > section'))
      for (let i = 0; i < kids.length - 1; i++) {
        const a = textLeaves(kids[i])
        const b = textLeaves(kids[i + 1])
        if (!a.length || !b.length) continue
        const aEnd = a[a.length - 1].bottom
        const bStart = b[0].top
        const gap = Math.round(bStart - aEnd)
        if (gap < minGap) minGap = gap
        if (gap < 24) {
          contentCollisions++
          collisionDetail.push(`section${i + 1}→${i + 2} gap=${gap}px`)
        }
      }

      return {
        h1Count: document.querySelectorAll('h1').length,
        h1: h1 ? { size: hs.fontSize, weight: hs.fontWeight, lh: hs.lineHeight } : null,
        h2Count: document.querySelectorAll('h2').length,
        overflow: doc.scrollWidth - doc.clientWidth,
        wide: wide.slice(0, 4),
        wideCount: wide.length,
        eyebrowColors: [...new Set(eyebrows)],
        sections,
        contentCollisions,
        collisionDetail,
        minGap: minGap === Infinity ? null : minGap,
        imgsNoAlt: Array.from(document.querySelectorAll('img')).filter(
          (i) => i.alt === null || i.alt === undefined,
        ).length,
        imgsNoDims: Array.from(document.querySelectorAll('img')).filter(
          (i) => !i.getAttribute('width'),
        ).length,
      }
    })
    rows.push({ w: label, theme, ...m, errors })
    await ctx.close()
  }
}

await browser.close()

console.log(`\n═══ QA: ${PAGE} ═══\n`)
for (const r of rows) {
  const probs = []
  if (r.h1Count !== 1) probs.push(`h1 count = ${r.h1Count}`)
  if (r.overflow > 0) probs.push(`H-OVERFLOW ${r.overflow}px`)
  if (r.wideCount) probs.push(`${r.wideCount} wide: ${r.wide.join(' | ')}`)
  if (r.contentCollisions)
    probs.push(
      `TIGHT/TOUCHING CONTENT at ${r.collisionDetail.join(', ')}`,
    )
  if (r.imgsNoAlt) probs.push(`${r.imgsNoAlt} img without alt`)
  if (r.errors.length) probs.push(`console: ${r.errors.slice(0, 2).join(' | ').slice(0, 160)}`)
  console.log(
    `${probs.length ? '✗' : '✓'} ${r.w} ${r.theme}  h1=${r.h1?.size}/${r.h1?.weight} h2=${r.h2Count} sections=${r.sections.length}` +
      (probs.length ? `\n    ${probs.join('\n    ')}` : ''),
  )
}
console.log(`\n${r0(rows)}`)
function r0(a) {
  return a.every(
    (r) =>
      r.h1Count === 1 && r.overflow <= 0 && !r.wideCount && !r.contentCollisions,
  )
    ? '✓ PASS'
    : '✗ issues above'
}
console.log(`Screens: ${OUT}/`)
