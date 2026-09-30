/**
 * QA capture harness.
 * Screenshots every page at every required breakpoint, both themes.
 * Usage: node scripts/capture.mjs <label>   e.g. node scripts/capture.mjs before
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const LABEL = process.argv[2] || 'shot'
const BASE = process.env.BASE_URL || 'http://localhost:5173'
const OUT = `qa-screenshots/${LABEL}`

const PAGES = [
  ['home', '/'],
  ['about', '/about'],
  ['services', '/services'],
  ['reviews', '/reviews'],
  ['team', '/team'],
  ['contact', '/contact'],
]

const WIDTHS = [
  ['1440', 1440, 900],
  ['1280', 1280, 900],
  ['1024', 1024, 900],
  ['768', 768, 900],
  ['430', 430, 900],
  ['390', 390, 900],
  ['375', 375, 800],
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
const report = []

for (const theme of ['light', 'dark']) {
  for (const [name, path] of PAGES) {
    for (const [wLabel, width, height] of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        colorScheme: theme,
        reducedMotion: 'reduce',
      })
      await ctx.addInitScript((t) => {
        localStorage.setItem('theme', t)
      }, theme)

      const page = await ctx.newPage()
      const errors = []
      // The dev backend does not allow the localhost origin — that CORS noise is
      // environmental, not a page defect, so it is filtered out of the report.
      const isEnvNoise = (t) =>
        /kyna-backend\.onrender\.com|Failed to load resource|net::ERR|CORS/i.test(t)
      page.on('console', (m) => {
        if (m.type() === 'error' && !isEnvNoise(m.text())) errors.push(m.text())
      })
      page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 })
      // settle reveal animations
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(700)
      // trigger every in-view section by scrolling through the page
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 90))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(500)

      const file = `${OUT}/${name}-${wLabel}-${theme}.png`
      await page.screenshot({ path: file, fullPage: true })

      // measurements
      const m = await page.evaluate(() => {
        const doc = document.documentElement
        const h1s = Array.from(document.querySelectorAll('h1')).map((h) =>
          h.textContent.trim().slice(0, 70),
        )
        const overflow = doc.scrollWidth - doc.clientWidth
        // find elements that actually cause horizontal overflow (skip anything
        // inside an ancestor that clips, e.g. carousel tracks)
        const wide = []
        const isClipped = (el) => {
          let p = el.parentElement
          while (p && p !== document.body) {
            const cs = getComputedStyle(p)
            if (cs.overflowX !== 'visible') return true
            p = p.parentElement
          }
          return false
        }
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect()
          if (r.right <= doc.clientWidth + 2) return
          const cs = getComputedStyle(el)
          if (cs.position === 'fixed' || cs.pointerEvents === 'none') return
          if (isClipped(el)) return
          wide.push(
            el.tagName.toLowerCase() +
              '.' +
              (el.className || '').toString().split(' ').slice(0, 3).join('.') +
              ` w=${Math.round(r.width)} right=${Math.round(r.right)}`,
          )
        })
        return {
          h1Count: h1s.length,
          h1s,
          title: document.title,
          overflowPx: overflow,
          wideCount: wide.length,
          wideSample: wide.slice(0, 4),
          // touch targets under 44px among visible interactive elements
          smallTargets: Array.from(
            document.querySelectorAll('a[href], button, input, textarea, select'),
          ).filter((el) => {
            const r = el.getBoundingClientRect()
            if (r.width === 0 || r.height === 0) return false
            if (r.height < 44 && window.innerWidth <= 768) {
              return !el.closest('footer') && el.offsetParent !== null
            }
            return false
          })
            .slice(0, 5)
            .map((el) => `${el.tagName.toLowerCase()} h=${Math.round(el.getBoundingClientRect().height)}`),
        }
      })

      report.push({ page: name, w: wLabel, theme, ...m, errors: errors.slice(0, 3) })
      await ctx.close()
    }
  }
}

await browser.close()

// ── summary ──
let bad = 0
console.log(`\n=== ${LABEL.toUpperCase()} QA REPORT ===\n`)
for (const r of report) {
  const probs = []
  if (r.h1Count !== 1) probs.push(`h1 count = ${r.h1Count}`)
  if (r.overflowPx > 0) probs.push(`h-overflow ${r.overflowPx}px`)
  if (r.wideCount > 0) probs.push(`${r.wideCount} wide els`)
  if (r.smallTargets.length) probs.push(`small targets: ${r.smallTargets.join(', ')}`)
  if (r.errors.length) probs.push(`console: ${r.errors.join(' | ').slice(0, 120)}`)
  if (probs.length) {
    bad++
    console.log(`✗ ${r.page} @${r.w} ${r.theme}\n    ${probs.join('\n    ')}`)
    if (r.wideCount) r.wideSample.forEach((s) => console.log(`      ${s}`))
  }
}
console.log(`\n${bad === 0 ? '✓ ALL CLEAN' : `${bad} rows with issues`} (of ${report.length} captures)`)
console.log(`Saved to ${OUT}/`)
