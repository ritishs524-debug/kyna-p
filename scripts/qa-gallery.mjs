/**
 * Gallery + lightbox functional checks for the About hero mosaic.
 * Usage: node scripts/qa-gallery.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:5173'
const browser = await chromium.launch()
const log = []
const ok = (l, p, d = '') => log.push(`${p ? '✓' : '✗'} ${l}${d ? ` — ${d}` : ''}`)

/* ─── DESKTOP ─── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript(() => localStorage.setItem('theme', 'light'))
  const page = await ctx.newPage()
  const errors = []
  const noise = (t) => /kyna-backend\.onrender\.com|Failed to load resource|net::ERR|CORS/i.test(t)
  page.on('console', (m) => { if (m.type() === 'error' && !noise(m.text())) errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

  await page.goto(BASE + '/about', { waitUntil: 'networkidle', timeout: 45000 })
  await page.waitForTimeout(900)

  // 1. all images present
  const tiles = page.locator('button[aria-label^="View larger image"]')
  const n = await tiles.count()
  ok('all 7 images rendered as tiles', n === 7, `${n} tiles`)

  // 2. no stretched images: every img fills its tile exactly
  const stretch = await page.evaluate(() => {
    const out = []
    document.querySelectorAll('button[aria-label^="View larger image"]').forEach((b) => {
      const img = b.querySelector('img')
      if (!img) { out.push('no img'); return }
      const br = b.getBoundingClientRect(); const ir = img.getBoundingClientRect()
      const dw = Math.abs(br.width - ir.width), dh = Math.abs(br.height - ir.height)
      if (dw > 2 || dh > 2) out.push(`${Math.round(dw)}x${Math.round(dh)}px off`)
      if (getComputedStyle(img).objectFit !== 'cover') out.push('object-fit not cover')
    })
    return out
  })
  ok('no image is stretched (fills tile, object-fit: cover)', stretch.length === 0, stretch.join(' | '))

  // 3. asymmetric: tiles must NOT all be the same size
  const sizes = await page.$$eval('button[aria-label^="View larger image"]', (els) =>
    els.map((e) => { const r = e.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}` }),
  )
  const unique = [...new Set(sizes)]
  ok('layout is asymmetric (varied tile sizes)', unique.length >= 3, `${unique.length} distinct sizes: ${unique.join(', ')}`)

  // 4. no holes: grid fully packed
  const gaps = await page.evaluate(() => {
    const grid = document.querySelector('button[aria-label^="View larger image"]').parentElement
    const gr = grid.getBoundingClientRect()
    let covered = 0
    document.querySelectorAll('button[aria-label^="View larger image"]').forEach((b) => {
      covered += b.getBoundingClientRect().width * b.getBoundingClientRect().height
    })
    return Math.round(100 - (covered / (gr.width * gr.height)) * 100)
  })
  ok('grid is fully packed (no dead space)', gaps <= 12, `${gaps}% uncovered`)

  // 5. hover affordance
  await tiles.first().hover()
  await page.waitForTimeout(450)
  const hover = await page.evaluate(() => {
    const b = document.querySelector('button[aria-label^="View larger image"]')
    const overlay = b.querySelector('span[aria-hidden="true"]')
    const img = b.querySelector('img')
    const cs = getComputedStyle(img)
    return {
      overlayOpacity: parseFloat(getComputedStyle(overlay).opacity),
      // Tailwind v4 sets scale-* via the `scale` property, not `transform`
      imgScale: cs.scale,
      imgTransform: cs.transform,
      transitionProperty: cs.transitionProperty,
    }
  })
  ok('hover reveals gradient overlay', hover.overlayOpacity > 0.5, `opacity ${hover.overlayOpacity}`)
  const scaled =
    (hover.imgScale && hover.imgScale !== 'none' && parseFloat(hover.imgScale) > 1.01) ||
    (hover.imgTransform !== 'none' && !hover.imgTransform.includes('matrix(1, 0, 0, 1, 0, 1)'))
  ok('hover zooms image subtly', scaled, `scale=${hover.imgScale} transform=${hover.imgTransform} transition=${hover.transitionProperty}`)

  // 6. scroll position preserved across open → close
  await page.evaluate(() => window.scrollTo(0, 420))
  await page.waitForTimeout(400)
  const before = await page.evaluate(() => window.scrollY)
  await tiles.nth(2).click()
  await page.waitForTimeout(500)
  ok('lightbox opens on click', !!(await page.$('[role="dialog"]')))
  const dlg = await page.$('[role="dialog"]')
  ok('dialog is aria-modal', (await dlg.getAttribute('aria-modal')) === 'true')
  ok('backdrop covers viewport', await page.evaluate(() => {
    const r = document.querySelector('[role="dialog"]').getBoundingClientRect()
    return r.width >= innerWidth - 1 && r.height >= innerHeight - 1
  }))
  ok('page scroll locked', (await page.evaluate(() => document.body.style.overflow)) === 'hidden')
  ok('focus moved into dialog', await page.evaluate(() =>
    document.querySelector('[role="dialog"]').contains(document.activeElement)))

  // 7. counter
  const counter1 = await page.textContent('[role="dialog"] p')
  ok('counter shows 3 / 7', /3\s*\/\s*7/.test(counter1.replace(/\s+/g, ' ')), counter1.trim())

  // 8. next / prev buttons
  ok('next button exists', !!(await page.$('button[aria-label="Next image"]')))
  await page.click('button[aria-label="Next image"]')
  await page.waitForTimeout(400)
  ok('next advances to 4 / 7', /4\s*\/\s*7/.test((await page.textContent('[role="dialog"] p')).replace(/\s+/g, ' ')))
  await page.click('button[aria-label="Previous image"]')
  await page.click('button[aria-label="Previous image"]')
  await page.waitForTimeout(400)
  ok('previous goes back to 2 / 7', /2\s*\/\s*7/.test((await page.textContent('[role="dialog"] p')).replace(/\s+/g, ' ')))

  // 9. keyboard arrows
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(350)
  ok('ArrowRight navigates → 3 / 7', /3\s*\/\s*7/.test((await page.textContent('[role="dialog"] p')).replace(/\s+/g, ' ')))
  await page.keyboard.press('ArrowLeft')
  await page.waitForTimeout(350)
  ok('ArrowLeft navigates → 2 / 7', /2\s*\/\s*7/.test((await page.textContent('[role="dialog"] p')).replace(/\s+/g, ' ')))

  // 10. wrap-around
  await page.keyboard.press('Home')
  await page.waitForTimeout(300)
  ok('Home → 1 / 7', /1\s*\/\s*7/.test((await page.textContent('[role="dialog"] p')).replace(/\s+/g, ' ')))
  await page.keyboard.press('ArrowLeft')
  await page.waitForTimeout(350)
  ok('wraps backwards 1 → 7', /7\s*\/\s*7/.test((await page.textContent('[role="dialog"] p')).replace(/\s+/g, ' ')))

  // 11. focus trap
  let escaped = false
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(() =>
      document.querySelector('[role="dialog"]').contains(document.activeElement))
    if (!inside) escaped = true
  }
  ok('focus trap holds over 10 tabs', !escaped)

  // 12. lightbox image is not cropped (object-contain)
  ok('viewer image uses object-contain (uncropped)', await page.evaluate(() => {
    const i = document.querySelector('[role="dialog"] img')
    return getComputedStyle(i).objectFit === 'contain'
  }))

  // 13. ESC closes + scroll restored
  await page.keyboard.press('Escape')
  await page.waitForTimeout(600)
  ok('Escape closes viewer', !(await page.$('[role="dialog"]')))
  ok('scroll lock released', (await page.evaluate(() => document.body.style.overflow)) !== 'hidden')
  const after = await page.evaluate(() => window.scrollY)
  ok('scroll position preserved', Math.abs(after - before) <= 2, `${before} → ${after}`)

  // 14. no horizontal overflow
  ok('no horizontal overflow', await page.evaluate(() =>
    document.documentElement.scrollWidth <= document.documentElement.clientWidth))

  ok('no console errors', errors.length === 0, errors.slice(0, 2).join(' | ').slice(0, 140))
  await ctx.close()
}

/* ─── MOBILE ─── */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true, isMobile: true,
  })
  await ctx.addInitScript(() => localStorage.setItem('theme', 'light'))
  const page = await ctx.newPage()
  await page.goto(BASE + '/about', { waitUntil: 'networkidle', timeout: 45000 })
  await page.waitForTimeout(900)

  ok('mobile: no horizontal overflow', await page.evaluate(() =>
    document.documentElement.scrollWidth <= document.documentElement.clientWidth))
  ok('mobile: all 7 tiles present', (await page.locator('button[aria-label^="View larger image"]').count()) === 7)

  const tooSmall = await page.$$eval('button[aria-label^="View larger image"]', (els) =>
    els.filter((e) => e.getBoundingClientRect().height < 70 || e.getBoundingClientRect().width < 70).length)
  ok('mobile: no tiny thumbnails (<70px)', tooSmall === 0, `${tooSmall} too small`)

  await page.locator('button[aria-label^="View larger image"]').first().click()
  await page.waitForTimeout(500)
  ok('mobile: lightbox opens', !!(await page.$('[role="dialog"]')))
  ok('mobile: image fits viewport', await page.evaluate(() => {
    const i = document.querySelector('[role="dialog"] img').getBoundingClientRect()
    return i.width <= innerWidth && i.height <= innerHeight
  }))
  const targets = await page.$$eval('[role="dialog"] button', (b) =>
    b
      // skip controls hidden at this breakpoint (the desktop side arrows)
      .filter((x) => x.offsetParent !== null)
      .map((x) => Math.round(x.getBoundingClientRect().height)))
  ok('mobile: all visible controls ≥44px', targets.length >= 3 && targets.every((h) => h >= 44), targets.join(','))

  // swipe next
  const box = await (await page.$('[role="dialog"] img')).boundingBox()
  const cy = box.y + box.height / 2
  await page.touchscreen.tap(box.x + box.width / 2, cy)
  const before2 = (await page.textContent('[role="dialog"] p')).replace(/\s+/g, ' ')
  await page.evaluate(() => {
    const el = document.querySelector('[role="dialog"] img')
    const r = el.getBoundingClientRect()
    const y = r.top + r.height / 2
    const mk = (type, x) => {
      const t = new Touch({ identifier: 1, target: el, clientX: x, clientY: y })
      el.dispatchEvent(new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true }))
    }
    mk('touchstart', 300); mk('touchend', 180)
  })
  await page.waitForTimeout(450)
  const after2 = (await page.textContent('[role="dialog"] p')).replace(/\s+/g, ' ')
  ok('mobile: swipe advances image', before2 !== after2, `${before2.trim()} → ${after2.trim()}`)

  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  ok('mobile: ESC closes', !(await page.$('[role="dialog"]')))
  await ctx.close()
}

await browser.close()
console.log('\n═══ GALLERY + LIGHTBOX QA ═══\n')
log.forEach((l) => console.log('  ' + l))
const f = log.filter((l) => l.startsWith('✗'))
console.log(`\n  ${f.length ? `✗ ${f.length} failed of ${log.length}` : `✓ ALL ${log.length} PASS`}\n`)
