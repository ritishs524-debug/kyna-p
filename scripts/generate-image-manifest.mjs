/**
 * Generates `src/lib/cloudinary-images.ts` from `cloudinary-manifest.json`.
 *
 * The manifest is written by seed-cloudinary.mjs and holds the real public ids,
 * so the typed module can never drift from what is actually stored in
 * Cloudinary (slugs get truncated to 60 chars, which is easy to get wrong by
 * hand).
 *
 * Usage: node scripts/generate-image-manifest.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifestFile = join(ROOT, 'cloudinary-manifest.json')

if (!existsSync(manifestFile)) {
  console.error('✗ cloudinary-manifest.json not found. Run: node scripts/seed-cloudinary.mjs')
  process.exit(1)
}

const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'))

/** public_id for a source path, or a hard failure — never a silent guess. */
function pid(sourcePath) {
  const url = manifest[sourcePath]
  if (!url) {
    console.error(`✗ ${sourcePath} is not in cloudinary-manifest.json`)
    process.exit(1)
  }
  return url.split('/upload/c_limit,w_1600,q_auto:good,f_auto/')[1]
}

const S = 'src/assets/services/'
const A = 'src/assets/about/'
const L = 'src/assets/logo/'

/** Logical name → the source file it came from. */
const GROUPS = [
  {
    name: 'serviceImages',
    doc: 'Service imagery — keyed by service id, matching the services data.',
    entries: {
      physiotherapy: S + 'physiotherapist-doing-leg-exercises-with-female-patient.jpg',
      osteopathy: S + 'young-woman-doctor-chiropractor-osteopath-fixing-lying-womans-back-with-hands-movements-visit-manual-therapy-clinic-professional-chiropractor-work.jpg',
      chiropractic: S + 'young-woman-with-back-problems-doing-physiotherapy-treatment.jpg',
      'exercise-therapy': S + 'doctor-helping-patient-rehabilitation.jpg',
      'manual-therapy': S + 'professional-therapists-is-stretching-muscles-patients-with-abnormal-muscular-symptoms-physical-rehabilitation-therapies-treatment-physiological-disorders-by-physiotherapists-concept.jpg',
      'womens-health': S + 'pexels-karola-g-4506078.jpg',
      'pelvic-floor': S + 'pexels-funkcines-terapijos-centras-927573878-20860591.jpg',
      'falls-prevention': S + 'senior-man-nursing-home-with-doing-physical-therapy-with-help-from-nurse-using-dumbbells.jpg',
      'home-physiotherapy': S + 'front-view-young-male-sitting-with-broken-foot-crutches-grey-wall-pain-accident-broken-twist-foot-leg.jpg',
      'antenatal-education': S + 'side-view-pregnant-woman-midwife-home-woman-casual-clothes-sitting-bed-asian-doula-holding-hand-pregnancy-medicine-home-birth-concept.jpg',
    },
  },
  {
    name: 'aboutImages',
    doc: 'About page imagery.',
    entries: {
      doctorHelping: A + 'doctor-helping-patient-rehabilitation (1) (1).jpg',
      shoulderSupport: A + 'female-therapist-rehabilitation-center-putting-shoulder-support-man (1) (1).jpg',
      gymnastics: A + 'woman-doing-gymnastics-with-help-his-young-physical-therapist (1) (1).jpg',
      cupping: A + 'top-view-suction-cup-process (1) (1).jpg',
      kneeTape: A + 'physiotherapist-applies-knee-tape-woman-closeup-taping-application (1) (1).jpg',
      rehabCentre: A + 'woman-rehabilitation-center-getting-treatment (1) (1).jpg',
      needle: A + 'close-up-therapist-holding-acupuncture-needle (1) (1).jpg',
      cuppingAlt: A + 'client-with-suction-cup-process.jpg',
      dryNeedling: A + 'acupuncture-process-close-up.jpg',
    },
  },
  {
    name: 'brandImages',
    doc: 'Brand assets.',
    entries: {
      logoHeader: L + 'kyna_withoutbg-01.PNG',
      logoMark: L + 'kyna_withoutbg-04.PNG',
      teamHero: L + 'drsorabh.png',
      mainOutside: L + 'main-outside.png',
      favicon: 'public/kyna-logo-wo-bg.png',
    },
  },
  {
    name: 'siteImages',
    doc: 'Miscellaneous site imagery.',
    entries: {
      servicesSection: 'src/assets/images/services-section.jpg',
    },
  },
]

const B = 'https://res.cloudinary.com/dal5pcjeq/image/upload'
const T = 'c_limit,w_1600,q_auto:good,f_auto'

const q = (s) => (/^[A-Za-z_$][\w$]*$/.test(s) ? s : `'${s}'`)

let out = `/**
 * Every website image now comes from Cloudinary.
 *
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/generate-image-manifest.mjs
 * (after re-seeding with: node scripts/seed-cloudinary.mjs)
 *
 * Each delivery URL carries \`${T}\`, so Cloudinary serves a width-capped,
 * auto-compressed, right-format copy while the original stays untouched in the
 * media library for re-cropping later.
 *
 * The local files remain in \`src/assets\` and \`public/\` but nothing imports
 * them, so they are no longer bundled or shipped to visitors.
 */

const B = '${B}'
const T = '${T}'

/** Delivery URL for a Cloudinary public id, e.g. \`kyna/brand/logo\`. */
export function cdn(path: string): string {
  return \`\${B}/\${T}/\${path}\`
}

`

for (const group of GROUPS) {
  out += `/* ── ${group.doc} ── */\n`
  out += `export const ${group.name} = {\n`
  for (const [key, src] of Object.entries(group.entries)) {
    out += `  ${q(key)}: cdn('${pid(src)}'),\n`
  }
  out += `} as const\n\n`
}

out += `/** Social share image, cropped to the 1200×630 link-preview ratio. */\n`
out += `export const ogImage = \`\${B}/c_fill,w_1200,h_630,q_auto:good,f_auto/${pid(L + 'main-outside.png')}\`\n\n`

out += `/* ── Raw manifest: original source path → Cloudinary URL ── */\n`
out += `export const imageManifest = {\n`
for (const src of Object.keys(manifest).sort()) {
  out += `  ${q(src)}: cdn('${pid(src)}'),\n`
}
out += `} as const\n`

writeFileSync(join(ROOT, 'src/lib/cloudinary-images.ts'), out)

console.log(
  `✓ src/lib/cloudinary-images.ts generated — ${Object.keys(manifest).length} images`,
)
