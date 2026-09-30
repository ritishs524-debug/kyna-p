/**
 * Focused capture of the Home services section (the liquid-glass rail).
 * Usage: node scripts/capture-services.mjs [label]
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const LABEL = process.argv[2] || 'services'
const BASE = process.env.BASE_URL || 'http://localhost:5173'
const OUT = `qa-screenshots/${LABEL}`

const CASES = [
  ['1440-light', 1440, 900, 'light'],
  ['1440-dark', 1440, 900, 'dark'],
  ['1280-light', 1280, 900, 'light'],
  ['768-light', 768, 900, 'light'],
  ['390-light', 390, 844, 'light'],
  ['390-dark', 390, 844, 'dark'],
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
const report = []

for (const [name, width, height, theme] of CASES) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  })
  await ctx.addInitScript(
    ([t]) => window.localStorage.setItem('theme', t),
    [theme],
  )
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  // Scroll the section into view (by its heading — the carousel region only
  // exists once the deferred mount fires) and let the WebGL rail settle.
  await page.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find((el) =>
      (el.textContent || '').includes('Services at KYNA'),
    )
    ;(h ?? document.body).scrollIntoView({ block: 'center', behavior: 'instant' })
    window.scrollBy(0, 320)
  })
  await page.waitForTimeout(9000)

  const stage = page.locator('[aria-roledescription="carousel"]').first()
  const canvasCount = await page.locator('canvas').count()

  await page.screenshot({ path: `${OUT}/${name}-viewport.png` })
  if (await stage.count()) {
    await stage.screenshot({ path: `${OUT}/${name}-stage.png` }).catch(() => {})
  }
  const section = page.locator('section', { has: page.locator('[aria-roledescription="carousel"]') }).first()
  if (await section.count()) {
    await section.screenshot({ path: `${OUT}/${name}-section.png` }).catch(() => {})
  }

  const box = canvasCount ? await page.locator('canvas').first().boundingBox() : null
  report.push({ name, width, theme, canvasCount, canvasBox: box, errors: errors.slice(0, 5) })
  await ctx.close()
}

await browser.close()
console.log(JSON.stringify(report, null, 2))
