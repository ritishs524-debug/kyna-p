/**
 * Cross-page conformance against the Home design tokens.
 * Answers: is every page built from the same system?
 */
import { chromium } from 'playwright'
const BASE = 'http://localhost:5173'
const PAGES = [['home','/'],['about','/about'],['services','/services'],['reviews','/reviews'],['team','/team'],['contact','/contact']]
const b = await chromium.launch()

const EXPECT = {
  container: 1160,      // inner sections
  navy: 'rgb(11, 35, 71)',
  blue: 'rgb(8, 124, 240)',
}
const rows=[]
for (const theme of ['light','dark']) {
  for (const [name,path] of PAGES) {
    const c = await b.newContext({ viewport:{width:1440,height:900}, colorScheme:theme, reducedMotion:'reduce' })
    await c.addInitScript(t=>localStorage.setItem('theme',t), theme)
    const p = await c.newPage()
    await p.goto(BASE+path,{waitUntil:'networkidle',timeout:45000})
    await p.waitForTimeout(400)
    const m = await p.evaluate(()=>{
      const h1=document.querySelector('h1'); const hs=h1?getComputedStyle(h1):null
      const hs2=Array.from(document.querySelectorAll('h2')).map(h=>getComputedStyle(h).fontSize)
      // container widths actually used by section inner wrappers
      const wraps=Array.from(document.querySelectorAll('main section > div'))
        .map(d=>Math.round(d.getBoundingClientRect().width))
        .filter(w=>w>200)
      const uniq=[...new Set(wraps)].sort((a,b)=>a-b)
      // eyebrow colours
      const eb=Array.from(document.querySelectorAll('p.uppercase')).map(p=>getComputedStyle(p).color)
      // card radii used
      const radii=[...new Set(Array.from(document.querySelectorAll('main article, main figure'))
        .map(e=>getComputedStyle(e).borderTopLeftRadius))].sort()
      // primary buttons
      const btns=[...new Set(Array.from(document.querySelectorAll('main button, main a'))
        .filter(b=>/book|send message/i.test(b.textContent||''))
        .map(b=>getComputedStyle(b).borderTopLeftRadius+'/'+getComputedStyle(b).fontSize))]
      // section background bands
      const bgs=[...new Set(Array.from(document.querySelectorAll('main section'))
        .map(s=>getComputedStyle(s).backgroundColor))]
      return {
        h1Size:hs?.fontSize, h1Weight:hs?.fontWeight, h1Color:hs?.color,
        h1Count:document.querySelectorAll('h1').length,
        h2Sizes:hs2, wrapWidths:uniq, eyebrowColors:[...new Set(eb)],
        cardRadii:radii, btnRadiusSize:btns, sectionBgs:bgs,
        imgNoAlt:Array.from(document.querySelectorAll('img')).filter(i=>!i.getAttribute('alt')).length,
        lazyBelowFold:Array.from(document.querySelectorAll('img')).filter(i=>i.loading==='lazy').length,
        imgTotal:document.querySelectorAll('img').length,
      }
    })
    rows.push({page:name,theme,...m})
    await c.close()
  }
}
await b.close()

console.log('\n═══ CROSS-PAGE CONSISTENCY (1440px) ═══\n')
const light=rows.filter(r=>r.theme==='light')
for (const r of light) {
  console.log(`── ${r.page.toUpperCase()}`)
  console.log(`   h1        ${r.h1Size} / ${r.h1Weight} / ${r.h1Color}  (count ${r.h1Count})`)
  console.log(`   h2        ${r.h2Sizes.join(', ')}`)
  console.log(`   wraps     ${r.wrapWidths.join(', ')}`)
  console.log(`   eyebrows  ${r.eyebrowColors.join(', ')}`)
  console.log(`   radii     ${r.cardRadii.join(', ')}`)
  console.log(`   buttons   ${r.btnRadiusSize.join(' , ')}`)
  console.log(`   img alt   ${r.imgNoAlt} missing of ${r.imgTotal} (lazy: ${r.lazyBelowFold})`)
  if (r.h1Color !== 'rgb(11, 35, 71)') console.log(`   ⚠ h1 colour drifts from navy`)
  const off = r.wrapWidths.filter(w=>w!==1160 && w<1300)
  if (off.length) console.log(`   ⚠ non-1160 inner wrap: ${off.join(', ')}`)
  console.log('')
}
const h1Colors=[...new Set(light.map(r=>r.h1Color))]
console.log(`h1 colours across site: ${h1Colors.join(' | ')}`)
const h1Weights=[...new Set(light.map(r=>r.h1Weight))]
console.log(`h1 weights across site: ${h1Weights.join(' | ')}`)
const allEyebrow=[...new Set(light.flatMap(r=>r.eyebrowColors))]
console.log(`eyebrow colours across site: ${allEyebrow.join(' | ')}`)
