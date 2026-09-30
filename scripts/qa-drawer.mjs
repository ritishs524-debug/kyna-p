/**
 * QA for the mobile navigation drawer.
 * Usage: node scripts/qa-drawer.mjs
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE_URL || 'http://localhost:5173'
const OUT = 'qa-screenshots/drawer'

await mkdir(OUT, { recursive: true })

const checks = []
const check = (name, pass, detail = '') => checks.push({ name, pass, detail })

const browser = await chromium.launch()

async function openDrawer({ width, height, theme = 'light' }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    hasTouch: true,
    deviceScaleFactor: 2,
  })
  await ctx.addInitScript(
    ([t]) => window.localStorage.setItem('theme', t),
    [theme],
  )
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Open menu' }).tap()
  await page.waitForTimeout(700)
  return { ctx, page, errors }
}

const drawer = '#mobile-drawer'

/* ── 1. fills the viewport, header stays live ─────────────────────────── */
for (const theme of ['light', 'dark']) {
  const { ctx, page, errors } = await openDrawer({ width: 390, height: 844, theme })
  const vh = 844

  const box = await page.locator(drawer).boundingBox()
  check(
    `390 ${theme}: drawer reaches viewport bottom`,
    box !== null && Math.abs(box.y + box.height - vh) <= 1,
    `bottom=${box ? Math.round(box.y + box.height) : 'n/a'} vh=${vh}`,
  )
  check(
    `390 ${theme}: drawer starts under the 74px header`,
    box !== null && Math.abs(box.y - 74) <= 1,
    `top=${box ? Math.round(box.y) : 'n/a'}`,
  )

  // The header must not be dimmed/intercepted by the backdrop.
  const toggle = page.getByRole('button', { name: 'Close menu' })
  const hit = await toggle.evaluate((el) => {
    const r = el.getBoundingClientRect()
    const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
    return { topmost: top === el || el.contains(top), tag: top?.tagName }
  })
  check(`390 ${theme}: close button is the topmost element`, hit.topmost, JSON.stringify(hit))

  await page.screenshot({ path: `${OUT}/390-${theme}.png` })
  check(`390 ${theme}: no runtime errors`, errors.length === 0, errors.slice(0, 2).join(' | '))
  await ctx.close()
}

/* ── 2. Escape closes, focus returns to the toggle ────────────────────── */
{
  const { ctx, page, errors } = await openDrawer({ width: 390, height: 844 })
  check('focus moves into the drawer on open', await page.evaluate(
    () => document.getElementById('mobile-drawer')?.contains(document.activeElement) ?? false,
  ))

  await page.locator(drawer).press('Escape')
  await page.waitForTimeout(500)
  check('Escape closes the drawer', (await page.locator(drawer).count()) === 0)
  check('focus returns to the toggle', await page.evaluate(
    () => document.activeElement?.getAttribute('aria-label') === 'Open menu',
  ))
  check('no runtime errors (escape)', errors.length === 0, errors.slice(0, 2).join(' | '))
  await ctx.close()
}

/* ── 3. the page behind cannot scroll ─────────────────────────────────── */
{
  const { ctx, page } = await openDrawer({ width: 390, height: 844 })
  await page.evaluate(() => window.scrollTo(0, 1200))
  await page.waitForTimeout(400)
  const before = await page.evaluate(() => window.scrollY)
  await page.mouse.move(195, 500)
  await page.mouse.wheel(0, 900)
  await page.waitForTimeout(600)
  const after = await page.evaluate(() => window.scrollY)
  check('page behind the drawer stays put', Math.abs(after - before) < 5, `${before} -> ${after}`)
  await ctx.close()
}

/* ── 4. a nav item navigates and closes ───────────────────────────────── */
{
  const { ctx, page, errors } = await openDrawer({ width: 390, height: 844 })
  const item = page.locator(drawer).getByRole('button', { name: 'Reviews' })
  const b = await item.boundingBox()
  check('nav item tap target >= 44px', (b?.height ?? 0) >= 44, `${b?.width}x${b?.height}`)
  await item.tap()
  await page.waitForTimeout(900)
  check('nav item routes to /reviews', page.url().includes('/reviews'), page.url())
  check('drawer closes after navigating', (await page.locator(drawer).count()) === 0)
  check('no runtime errors (navigate)', errors.length === 0, errors.slice(0, 2).join(' | '))
  await ctx.close()
}

/* ── 5. no overflow, and the CTA is reachable ─────────────────────────── */
{
  const { ctx, page } = await openDrawer({ width: 360, height: 640 })
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  check('360: no horizontal overflow', overflow <= 0, `overflow=${overflow}px`)

  const cta = page.locator(drawer).getByRole('button', { name: /Book a Session/ })
  const cb = await cta.boundingBox()
  check(
    '360: CTA is fully on screen',
    cb !== null && cb.y + cb.height <= 640 && cb.y >= 74,
    cb ? `y=${Math.round(cb.y)}..${Math.round(cb.y + cb.height)}` : 'n/a',
  )
  await page.screenshot({ path: `${OUT}/360-short-viewport.png` })
  await ctx.close()
}

/* ── 6. Tab stays inside the drawer ───────────────────────────────────── */
{
  const { ctx, page } = await openDrawer({ width: 390, height: 844 })
  for (let i = 0; i < 9; i++) await page.keyboard.press('Tab')
  const inside = await page.evaluate(
    () => document.getElementById('mobile-drawer')?.contains(document.activeElement) ?? false,
  )
  check('Tab cycles inside the drawer', inside)
  await ctx.close()
}

await browser.close()

const failed = checks.filter((c) => !c.pass)
for (const c of checks) {
  console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? `  — ${c.detail}` : ''}`)
}
console.log(`\n${checks.length - failed.length}/${checks.length} passed`)
process.exit(failed.length ? 1 : 0)
