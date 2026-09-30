/**
 * Interaction + a11y checks that a static screenshot cannot catch.
 * Usage: node scripts/qa-interact.mjs services
 */
import { chromium } from 'playwright'

const PAGE = process.argv[2] || 'services'
const PATH = process.argv[3] || `/${PAGE}`
const BASE = process.env.BASE_URL || 'http://localhost:5173'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await ctx.addInitScript(() => localStorage.setItem('theme', 'light'))
const page = await ctx.newPage()
const errors = []
const isEnvNoise = (t) =>
  /kyna-backend\.onrender\.com|Failed to load resource|net::ERR|CORS/i.test(t)
page.on('console', (m) => {
  if (m.type() === 'error' && !isEnvNoise(m.text())) errors.push(m.text())
})
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto(BASE + PATH, { waitUntil: 'networkidle', timeout: 45000 })
await page.waitForTimeout(500)

const log = []
const ok = (label, pass, detail = '') =>
  log.push(`${pass ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`)

/* ── 1. Deep-link target still exists (Home carousel relies on it) ── */
if (PAGE === 'services') {
  const ids = await page.$$eval('article[id^="service-"]', (els) =>
    els.map((e) => e.id),
  )
  ok('service-* anchor ids present', ids.length > 0, `${ids.length} found`)
  ok(
    'all 10 services present',
    ids.length === 10,
    ids.join(', '),
  )
  // highlight class is applied by Home's handler
  await page.evaluate(() => {
    const el = document.getElementById('service-physiotherapy')
    el?.classList.add('service-card--highlight')
  })
  const anim = await page.evaluate(() => {
    const el = document.getElementById('service-physiotherapy')
    return el ? getComputedStyle(el).animationName : null
  })
  ok('service-card--highlight animates', anim === 'service-card-highlight', String(anim))
}

/* ── 2. Modal: open, focus, trap, ESC, restore, scroll lock ── */
if (PAGE === 'services') {
  await page.getByRole('button', { name: /learn more/i }).first().click()
  await page.waitForTimeout(400)

  const dlg = await page.$('[role="dialog"]')
  ok('dialog opens', !!dlg)
  ok('aria-modal set', (await dlg?.getAttribute('aria-modal')) === 'true')
  ok(
    'aria-labelledby resolves',
    !!(await dlg?.getAttribute('aria-labelledby')) &&
      !!(await page.$('#' + (await dlg.getAttribute('aria-labelledby')))),
  )
  ok(
    'body scroll locked',
    (await page.evaluate(() => document.body.style.overflow)) === 'hidden',
  )
  const inDialog = await page.evaluate(() =>
    document.querySelector('[role="dialog"]').contains(document.activeElement),
  )
  ok('focus moved into dialog', inDialog)

  // cycle focus several times — it must never escape
  let escaped = false
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(() =>
      document.querySelector('[role="dialog"]').contains(document.activeElement),
    )
    if (!inside) escaped = true
  }
  ok('focus trap holds over 8 tabs', !escaped)

  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  ok('Escape closes dialog', !(await page.$('[role="dialog"]')))
  ok(
    'scroll lock released',
    (await page.evaluate(() => document.body.style.overflow)) !== 'hidden',
  )
  const restored = await page.evaluate(() =>
    document.activeElement?.textContent?.trim().slice(0, 20),
  )
  ok('focus restored to trigger', /learn more/i.test(restored || ''), restored)
}

/* ── 3. Contact form: labels, validation, a11y wiring ── */
if (PAGE === 'contact') {
  const labels = await page.$$eval('label', (ls) =>
    ls.map((l) => ({ for: l.getAttribute('for'), text: l.textContent.trim() })),
  )
  const inputs = await page.$$eval('input,textarea', (els) =>
    els.map((e) => ({ id: e.id, type: e.type, aria: e.getAttribute('aria-invalid') })),
  )
  ok('has visible labels', labels.length >= 4, `${labels.length} labels`)
  ok(
    'every label has for= matching an input',
    labels.every((l) => l.for && inputs.some((i) => i.id === l.for)),
    labels.map((l) => `${l.for}`).join(','),
  )
  ok('inputs are typeable', inputs.length >= 4, `${inputs.length} controls`)

  // submit empty -> inline errors, no crash
  await page.getByRole('button', { name: /send message/i }).click()
  await page.waitForTimeout(300)
  const errCount = await page.$$eval('[class*="text-red"]', (e) => e.length)
  ok('empty submit shows inline errors', errCount >= 4, `${errCount} errors`)
  ok('form not submitted (still on page)', page.url().endsWith('/contact'))
}

/* ── 4. Header / nav sanity on every page ── */
const navCount = await page.$$eval('header nav button', (b) => b.length)
ok('header nav has 6 items', navCount === 6, `${navCount}`)
const ariaCurrent = await page.$$eval('header nav button', (els) =>
  els.filter((e) => e.className.includes('font-semibold')).length,
)
ok('exactly one active nav item', ariaCurrent === 1, `${ariaCurrent} active`)

/* ── 5. Keyboard reachability of primary CTA ──
   On Contact the conversion point is the form's own submit, not a Book button. */
const ctaReachable = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('button, a'))
  const btn =
    all.find((b) => /book (a )?(free consultation|session)/i.test(b.textContent || '')) ||
    all.find((b) => /meet our team/i.test(b.textContent || '')) ||
    all.find((b) => /send message/i.test(b.textContent || ''))
  if (!btn) return 'no CTA found'
  btn.focus()
  return document.activeElement === btn ? 'focusable' : 'not focusable'
})
ok('primary CTA is focusable', ctaReachable === 'focusable', ctaReachable)

/* ── 6. Theme toggle works on this page ── */
await page.getByRole('button', { name: /switch to (dark|light) mode/i }).click()
await page.waitForTimeout(350)
const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
ok('theme toggle applies dark class', isDark)
const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
ok('body repaints in dark', bg !== 'rgb(255, 255, 255)', bg)

console.log(`\n═══ INTERACTION QA: ${PAGE} ═══\n`)
log.forEach((l) => console.log('  ' + l))
const fails = log.filter((l) => l.startsWith('✗'))
console.log(`\n  ${fails.length ? `✗ ${fails.length} failed` : '✓ ALL PASS'}`)
if (errors.length) {
  console.log('\n  console errors:')
  ;[...new Set(errors)].slice(0, 5).forEach((e) => console.log('   - ' + e.slice(0, 160)))
} else {
  console.log('  no console errors')
}
await browser.close()
