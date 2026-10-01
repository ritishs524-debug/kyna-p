/**
 * Asserts every page's closing CTA is the *same* card — same container, same
 * button metrics, same tel link. This is the check that would have caught
 * Home's CTA drifting away from the inner pages in the first place.
 *
 * Usage: node scripts/qa-cta.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:5173'

// Contact deliberately ends on its form + locations rather than a CTA card.
const PAGES = [
  ['home', '/'],
  ['about', '/about'],
  ['services', '/services'],
  ['reviews', '/reviews'],
  ['team', '/team'],
  ['contact', '/contact'],
]

const checks = []
const check = (name, pass, detail = '') => checks.push({ name, pass, detail })

const browser = await chromium.launch()

/** Measured off the shared CTA card, found via its `data-cta` section. */
const PROBE = () => {
  const section = document.querySelector('[data-cta]')
  if (!section) return null
  // The card is the first child of the container inside the section.
  const card = section.querySelector(':scope > div > div')
  if (!card) return null
  const heading = card.querySelector('h2')
  const primary = [...card.querySelectorAll('button')][0]
  const secondary = card.querySelector('a[href^="tel:"]')

  const r = (el) => {
    if (!el) return null
    const b = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return {
      h: Math.round(b.height),
      radius: s.borderTopLeftRadius,
      fontSize: s.fontSize,
      letterSpacing: s.letterSpacing,
      textTransform: s.textTransform,
      fontWeight: s.fontWeight,
      fill: s.backgroundImage === 'none' ? 'none' : 'gradient',
      bg: s.backgroundColor,
      borderColor: s.borderColor,
      // Width follows the label's length, so it is reported, never compared.
      labelWidth: Math.round(b.width),
    }
  }

  const cardStyle = getComputedStyle(card)
  return {
    cardRadius: cardStyle.borderTopLeftRadius,
    cardFill: cardStyle.backgroundImage.slice(0, 46),
    cardPad: `${cardStyle.paddingTop}/${cardStyle.paddingLeft}`,
    container: Math.round(section.querySelector(':scope > div').getBoundingClientRect().width),
    sectionBg: getComputedStyle(section).backgroundColor,
    heading: {
      size: getComputedStyle(heading).fontSize,
      weight: getComputedStyle(heading).fontWeight,
    },
    eyebrow: card.querySelector('p')?.textContent ?? null,
    primary: r(primary),
    secondary: r(secondary),
    tel: secondary?.getAttribute('href') ?? null,
  }
}

const results = {}
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript(
    ([t]) => window.localStorage.setItem('theme', t),
    [theme],
  )
  const page = await ctx.newPage()

  for (const [name, path] of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    // Scroll so the reveal animation has completed before measuring.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1400)
    results[`${name}:${theme}`] = await page.evaluate(PROBE)
  }
  await ctx.close()
}

await browser.close()

/** Everything except the copy-dependent label width. */
const styleOf = (b) => {
  if (!b) return null
  const { labelWidth: _ignored, ...rest } = b
  return rest
}

// Each theme is compared against Home in the *same* theme — the ghost button's
// background and border legitimately differ between light and dark.
const baselines = { light: results['home:light'], dark: results['home:dark'] }
const missing = Object.entries(results).filter(([, v]) => !v).map(([k]) => k)
check(
  'every non-contact page has a CTA card',
  missing.every((k) => k.startsWith('contact:')),
  missing.length ? `missing: ${missing.join(', ')}` : 'all present',
)

if (baselines.light) {
  for (const [key, r] of Object.entries(results)) {
    if (!r) continue
    const base = baselines[key.endsWith(':dark') ? 'dark' : 'light']
    const same =
      r.cardRadius === base.cardRadius &&
      r.cardFill === base.cardFill &&
      r.cardPad === base.cardPad &&
      r.container === base.container &&
      JSON.stringify(r.heading) === JSON.stringify(base.heading) &&
      r.tel === base.tel &&
      JSON.stringify(styleOf(r.primary)) === JSON.stringify(styleOf(base.primary)) &&
      JSON.stringify(styleOf(r.secondary)) === JSON.stringify(styleOf(base.secondary))
    check(`${key} matches Home's CTA`, same,
      same ? '' : JSON.stringify({
        card: [r.cardRadius, r.cardPad],
        container: r.container,
        heading: r.heading,
        primary: r.primary,
        secondary: r.secondary,
        tel: r.tel,
      }))
  }

  const b = baselines.light
  console.log('\nHome CTA measurements (label width follows the copy)')
  console.log('  card      ', b.cardRadius, 'pad', b.cardPad, b.cardFill)
  console.log('  container ', b.container, 'px  heading', JSON.stringify(b.heading))
  console.log('  primary   ', JSON.stringify(b.primary))
  console.log('  secondary ', JSON.stringify(b.secondary))
  console.log('  tel       ', b.tel)
  console.log('\nEyebrow (copy is expected to differ per page):')
  for (const [k, v] of Object.entries(results)) {
    if (!k.endsWith(':light') || !v) continue
    console.log(`  ${k.replace(':light','').padEnd(10)} ${v.eyebrow}`)
  }
}

const failed = checks.filter((c) => !c.pass)
for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? `\n${c.detail}` : ''}`)
console.log(`\n${checks.length - failed.length}/${checks.length} passed`)
process.exit(failed.length ? 1 : 0)
