/**
 * Vertical rhythm audit.
 * Reports each section's padding and the real whitespace gap between the
 * content boxes of neighbouring sections.
 *
 * Measurement uses the outermost *content boxes* of each section (cards,
 * wrappers) rather than text leaves: a card's own internal padding is not
 * page rhythm and must not inflate the number.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:5173'
const PAGES = [
  ['home', '/'],
  ['about', '/about'],
  ['services', '/services'],
  ['reviews', '/reviews'],
  ['team', '/team'],
  ['contact', '/contact'],
]
const W = Number(process.env.W || 1440)
const THEME = process.env.THEME || 'light'

const b = await chromium.launch()
const rows = []
const allGaps = []

for (const [name, path] of PAGES) {
  const ctx = await b.newContext({
    viewport: { width: W, height: 1000 },
    colorScheme: THEME,
    reducedMotion: 'reduce',
  })
  await ctx.addInitScript((t) => localStorage.setItem('theme', t), THEME)
  const p = await ctx.newPage()
  await p.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 })
  await p.evaluate(async () => {
    const s = innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += s) {
      scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 70))
    }
    scrollTo(0, 0)
  })
  await p.waitForTimeout(500)

  const data = await p.evaluate(() => {
    // A section's "content box" is the area the designer actually padded.
    // Some sections carry the padding themselves, others delegate it to an
    // inner wrapper — so walk the first-child chain until we find real
    // vertical padding, and measure that padding box.
    const contentBox = (section) => {
      const sr = section.getBoundingClientRect()
      let top = sr.top
      let bottom = sr.bottom

      let node = section
      let padT = parseFloat(getComputedStyle(node).paddingTop) || 0
      let padB = parseFloat(getComputedStyle(node).paddingBottom) || 0

      // Decoration layers are the first children of most sections and are
      // absolutely positioned — skip them and follow the in-flow content.
      const firstInFlow = (el) =>
        Array.from(el.children).find(
          (c) => {
            const p = getComputedStyle(c).position
            return p !== 'absolute' && p !== 'fixed'
          },
        )

      // Prefer the deepest wrapper in the chain that declares padding.
      for (let depth = 0; depth < 4; depth++) {
        const child = firstInFlow(node)
        if (!child) break
        const cs = getComputedStyle(child)
        const cpt = parseFloat(cs.paddingTop) || 0
        const cpb = parseFloat(cs.paddingBottom) || 0
        if (cpt > 0 || cpb > 0) {
          node = child
          padT = cpt
          padB = cpb
        } else {
          break
        }
      }

      const nr = node.getBoundingClientRect()
      top = nr.top + padT
      bottom = nr.bottom - padB
      return { top, bottom }
    }

    const boxes = contentBox

    const sections = Array.from(document.querySelectorAll('main > div > section'))
    const out = sections.map((s, i) => {
      const cs = getComputedStyle(s)
      const b = boxes(s)
      const sr = s.getBoundingClientRect()
      return {
        i: i + 1,
        label:
          (s.getAttribute('aria-labelledby')
            ? document.getElementById(s.getAttribute('aria-labelledby'))?.textContent
            : s.querySelector('h1,h2')?.textContent
          )
            ?.trim()
            .slice(0, 24) || `section${i + 1}`,
        padT: Math.round(parseFloat(cs.paddingTop)),
        padB: Math.round(parseFloat(cs.paddingBottom)),
        above: Math.round(b.top - sr.top),
        below: Math.round(sr.bottom - b.bottom),
      }
    })

    const gaps = []
    for (let i = 0; i < sections.length - 1; i++) {
      gaps.push({
        from: out[i].label,
        to: out[i + 1].label,
        gap: Math.round(boxes(sections[i + 1]).top - boxes(sections[i]).bottom),
      })
    }

    const foot = document.querySelector('footer')
    const head = document.querySelector('header')
    return {
      sections: out,
      gaps,
      toFooter: foot ? Math.round(foot.getBoundingClientRect().top - boxes(sections[sections.length - 1]).bottom) : null,
      headPad: head ? Math.round(boxes(sections[0]).top - head.getBoundingClientRect().bottom) : null,
    }
  })

  rows.push({ page: name, ...data })
  data.gaps.forEach((g) => allGaps.push({ page: name, ...g }))
  await ctx.close()
}
await b.close()

console.log(`\n═══ VERTICAL RHYTHM  ${W}px · ${THEME} ═══\n`)
for (const r of rows) {
  console.log(`── ${r.page.toUpperCase()}`)
  for (const s of r.sections) {
    console.log(
      `   ${String(s.i).padStart(2)}. ${s.label.padEnd(25).slice(0, 25)}  pad ${String(s.padT).padStart(3)}/${String(s.padB).padStart(3)}   above ${String(s.above).padStart(3)}   below ${String(s.below).padStart(3)}`,
    )
  }
  for (const g of r.gaps) {
    console.log(`        gap ${String(g.gap).padStart(4)}px   ${g.from} → ${g.to}`)
  }
  if (r.headPad != null) console.log(`        header → first content: ${r.headPad}px`)
  if (r.toFooter != null) console.log(`        last content → footer:  ${r.toFooter}px`)
  console.log()
}

const vals = allGaps.map((g) => g.gap)
const min = Math.min(...vals)
const max = Math.max(...vals)
const median = vals.slice().sort((a, b) => a - b)[Math.floor(vals.length / 2)]
console.log(`── SUMMARY ──`)
console.log(`   inter-section gaps: min ${min} · median ${median} · max ${max}  (spread ${max - min}px)`)
const out = vals.filter((v) => v > median + 12 || v < median - 12)
if (out.length) {
  console.log(`   outliers (|Δ| > 12px from median):`)
  for (const g of allGaps.filter((x) => Math.abs(x.gap - median) > 12)) {
    console.log(`      ${String(g.gap).padStart(4)}px  ${g.page}  ${g.from} → ${g.to}`)
  }
} else {
  console.log(`   ✓ every gap within 12px of the median`)
}
