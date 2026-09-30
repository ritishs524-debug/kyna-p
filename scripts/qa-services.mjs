/**
 * Interaction QA for the Home liquid-glass services rail.
 * Usage: node scripts/qa-services.mjs
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE_URL || 'http://localhost:5173'
const OUT = 'qa-screenshots/services-interact'

await mkdir(OUT, { recursive: true })

const checks = []
const check = (name, pass, detail = '') => {
  checks.push({ name, pass, detail })
}

const browser = await chromium.launch()

async function open({ width, height, reducedMotion = false }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
  })
  await ctx.addInitScript(() => window.localStorage.setItem('theme', 'light'))
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find((el) =>
      (el.textContent || '').includes('Services at KYNA'),
    )
    ;(h ?? document.body).scrollIntoView({ block: 'center', behavior: 'instant' })
  })
  await page.waitForTimeout(8000)
  return { ctx, page, errors }
}

const stage = '[aria-roledescription="carousel"]'
const captionTitle = '[data-carousel-caption] h3'

/** Lenis animates, so page.settleScroll-ish waiting is needed before measuring. */
async function settleScroll(page) {
  let last = -1
  for (let i = 0; i < 40; i++) {
    const y = await page.evaluate(() => window.scrollY)
    if (y === last) return y
    last = y
    await page.waitForTimeout(100)
  }
  return last
}

/** A real press-and-release at (x, y) — closer to a human than a bare click. */
async function press(page, x, y) {
  await page.mouse.move(x, y)
  await page.waitForTimeout(200)
  await page.mouse.down()
  await page.waitForTimeout(50)
  await page.mouse.up()
}

/* ── 1. arrows advance the rail and the caption follows ───────────────── */
{
  const { ctx, page, errors } = await open({ width: 1440, height: 900 })
  const before = await page.locator(captionTitle).textContent()
  await page.getByRole('button', { name: 'Next services' }).click()
  await page.waitForTimeout(1400)
  const after = await page.locator(captionTitle).textContent()
  check('arrow advances caption', before !== after, `${before} -> ${after}`)

  const current = await page
    .locator('button[aria-current="true"]')
    .first()
    .getAttribute('aria-label')
  check(
    'dot follows arrow',
    current === `Show ${after}`,
    `dot=${current} caption=${after}`,
  )
  await page.screenshot({ path: `${OUT}/1440-arrow.png` })

  /* ── 2. dot jumps several steps ─────────────────────────────────────── */
  await page.getByRole('button', { name: 'Show Chiropractic Care' }).click()
  await page.waitForTimeout(1800)
  const jumped = await page.locator(captionTitle).textContent()
  check('dot jumps to target', jumped === 'Chiropractic Care', `caption=${jumped}`)

  /* ── 3. clicking the centre panel focuses it ────────────────────────── */
  // Clicking the dot auto-scrolled the page; bring the stage back on screen.
  await page.locator(stage).scrollIntoViewIfNeeded()
  await settleScroll(page)
  const box = await page.locator(stage).boundingBox()
  const el = await page.evaluate(([x, y]) => {
    const n = document.elementFromPoint(x, y)
    return n?.tagName ?? null
  }, [box.x + box.width / 2, box.y + box.height / 2])
  console.log('   stage box', JSON.stringify(box), 'elementAtCentre:', el)
  await press(page, box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(1600)
  const closeVisible = await page.getByRole('button', { name: 'Close focused project' }).evaluate(
    (el) => getComputedStyle(el).opacity,
  )
  check('click focuses a panel', Number(closeVisible) > 0.9, `close opacity=${closeVisible}`)
  await page.screenshot({ path: `${OUT}/1440-focused.png` })

  /* ── 4. Escape closes focus ─────────────────────────────────────────── */
  await page.locator(stage).press('Escape')
  await page.waitForTimeout(1400)
  const closed = await page.getByRole('button', { name: 'Close focused project' }).evaluate(
    (el) => getComputedStyle(el).opacity,
  )
  check('Escape closes focus', Number(closed) < 0.1, `close opacity=${closed}`)

  /* ── 5. keyboard arrows ─────────────────────────────────────────────── */
  const preKey = await page.locator(captionTitle).textContent()
  await page.locator(stage).press('ArrowLeft')
  await page.waitForTimeout(1400)
  const postKey = await page.locator(captionTitle).textContent()
  check('ArrowLeft steps back', preKey !== postKey, `${preKey} -> ${postKey}`)

  check('no runtime errors (1440)', errors.length === 0, errors.slice(0, 3).join(' | '))
  await ctx.close()
}

/* ── 5b. "View details" still deep-links to the Services page anchor ──── */
{
  const { ctx, page, errors } = await open({ width: 1440, height: 900 })
  const caption = await page.locator(captionTitle).textContent()
  await page.locator('[data-carousel-caption] button', { hasText: 'View details' }).click()
  await page.waitForTimeout(2500)
  const url = page.url()
  check('view details routes to /services', url.includes('/services'), url)

  const anchor = await page.evaluate(() => {
    const highlighted = document.querySelector('.service-card--highlight')
    const id = highlighted?.id ?? ''
    return { id, inView: highlighted ? highlighted.getBoundingClientRect().top < 400 : false }
  })
  check(
    'anchor is highlighted + scrolled into view',
    anchor.id.startsWith('service-') && anchor.inView,
    JSON.stringify(anchor),
  )
  check(`caption was "${caption}"`, true)
  check('no runtime errors (deep link)', errors.length === 0, errors.slice(0, 3).join(' | '))
  await ctx.close()
}

/* ── 6. reduced motion: no intro, rail usable immediately ─────────────── */
{
  const { ctx, page, errors } = await open({
    width: 1440,
    height: 900,
    reducedMotion: true,
  })
  const settled = await page
    .getByRole('button', { name: 'Next services' })
    .evaluate((el) => !el.disabled)
  check('reduced motion: arrows live at once', settled)

  const counter = await page.locator(`${stage} p`).last().textContent()
  check('reduced motion: counter rendered', /\d+\/\d+/.test(counter ?? ''), counter ?? '')
  check('no runtime errors (reduced)', errors.length === 0, errors.slice(0, 3).join(' | '))
  await page.screenshot({ path: `${OUT}/1440-reduced.png` })
  await ctx.close()
}

/* ── 7. mobile: no horizontal overflow, controls reachable ────────────── */
{
  const { ctx, page, errors } = await open({ width: 390, height: 844 })
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  check('390: no horizontal overflow', overflow <= 0, `overflow=${overflow}px`)

  const arrowBox = await page.getByRole('button', { name: 'Next services' }).boundingBox()
  check(
    '390: arrow tap target >= 40px',
    (arrowBox?.width ?? 0) >= 40 && (arrowBox?.height ?? 0) >= 40,
    `${arrowBox?.width}x${arrowBox?.height}`,
  )

  const before = await page.locator(captionTitle).textContent()
  await page.getByRole('button', { name: 'Next services' }).click()
  await page.waitForTimeout(1400)
  const after = await page.locator(captionTitle).textContent()
  check('390: arrow advances caption', before !== after, `${before} -> ${after}`)
  check('no runtime errors (390)', errors.length === 0, errors.slice(0, 3).join(' | '))
  await ctx.close()
}

await browser.close()

const failed = checks.filter((c) => !c.pass)
for (const c of checks) {
  console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? `  — ${c.detail}` : ''}`)
}
console.log(`\n${checks.length - failed.length}/${checks.length} passed`)
process.exit(failed.length ? 1 : 0)
