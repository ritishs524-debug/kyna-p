/**
 * Every website image now comes from Cloudinary.
 *
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/generate-image-manifest.mjs
 * (after re-seeding with: node scripts/seed-cloudinary.mjs)
 *
 * Each delivery URL carries `c_limit,w_1600,q_auto:good,f_auto`, so Cloudinary serves a width-capped,
 * auto-compressed, right-format copy while the original stays untouched in the
 * media library for re-cropping later.
 *
 * The local files remain in `src/assets` and `public/` but nothing imports
 * them, so they are no longer bundled or shipped to visitors.
 */

const B = 'https://res.cloudinary.com/dal5pcjeq/image/upload'
const T = 'c_limit,w_1600,q_auto:good,f_auto'

/** Delivery URL for a Cloudinary public id, e.g. `kyna/brand/logo`. */
export function cdn(path: string): string {
  return `${B}/${T}/${path}`
}

/* ── Service imagery — keyed by service id, matching the services data. ── */
export const serviceImages = {
  physiotherapy: cdn('kyna/services/physiotherapist-doing-leg-exercises-with-female-patient'),
  osteopathy: cdn('kyna/services/young-woman-doctor-chiropractor-osteopath-fixing-lying-woman'),
  chiropractic: cdn('kyna/services/young-woman-with-back-problems-doing-physiotherapy-treatment'),
  'exercise-therapy': cdn('kyna/services/doctor-helping-patient-rehabilitation'),
  'manual-therapy': cdn('kyna/services/professional-therapists-is-stretching-muscles-patients-with'),
  'womens-health': cdn('kyna/services/pexels-karola-g-4506078'),
  'pelvic-floor': cdn('kyna/services/pexels-funkcines-terapijos-centras'),
  'falls-prevention': cdn('kyna/services/senior-man-nursing-home-with-doing-physical-therapy-with-hel'),
  'home-physiotherapy': cdn('kyna/services/front-view-young-male-sitting-with-broken-foot-crutches-grey'),
  'antenatal-education': cdn('kyna/services/side-view-pregnant-woman-midwife-home-woman-casual-clothes-s'),
} as const

/* ── About page imagery. ── */
export const aboutImages = {
  doctorHelping: cdn('kyna/about/doctor-helping-patient-rehabilitation'),
  shoulderSupport: cdn('kyna/about/female-therapist-rehabilitation-center-putting-shoulder-supp'),
  gymnastics: cdn('kyna/about/woman-doing-gymnastics-with-help-his-young-physical-therapis'),
  cupping: cdn('kyna/about/top-view-suction-cup-process'),
  kneeTape: cdn('kyna/about/physiotherapist-applies-knee-tape-woman-closeup-taping-appli'),
  rehabCentre: cdn('kyna/about/woman-rehabilitation-center-getting-treatment'),
  needle: cdn('kyna/about/close-up-therapist-holding-acupuncture-needle'),
  cuppingAlt: cdn('kyna/about/client-with-suction-cup-process'),
  dryNeedling: cdn('kyna/about/acupuncture-process-close-up'),
} as const

/* ── Brand assets. ── */
export const brandImages = {
  logoHeader: cdn('kyna/brand/kyna-withoutbg-01'),
  logoMark: cdn('kyna/brand/kyna-withoutbg-04'),
  teamHero: cdn('kyna/brand/drsorabh'),
  mainOutside: cdn('kyna/brand/main-outside'),
  favicon: cdn('kyna/brand/kyna-logo-wo-bg'),
} as const

/* ── Miscellaneous site imagery. ── */
export const siteImages = {
  servicesSection: cdn('kyna/site/services-section'),
} as const

/** Social share image, cropped to the 1200×630 link-preview ratio. */
export const ogImage = `${B}/c_fill,w_1200,h_630,q_auto:good,f_auto/kyna/brand/main-outside`

/* ── Raw manifest: original source path → Cloudinary URL ── */
export const imageManifest = {
  'public/kyna-logo-wo-bg.png': cdn('kyna/brand/kyna-logo-wo-bg'),
  'public/main-outside.png': cdn('kyna/brand/main-outside'),
  'src/assets/about/acupuncture-process-close-up.jpg': cdn('kyna/about/acupuncture-process-close-up'),
  'src/assets/about/client-with-suction-cup-process.jpg': cdn('kyna/about/client-with-suction-cup-process'),
  'src/assets/about/close-up-therapist-holding-acupuncture-needle (1) (1).jpg': cdn('kyna/about/close-up-therapist-holding-acupuncture-needle'),
  'src/assets/about/doctor-helping-patient-rehabilitation (1) (1).jpg': cdn('kyna/about/doctor-helping-patient-rehabilitation'),
  'src/assets/about/female-therapist-rehabilitation-center-putting-shoulder-support-man (1) (1).jpg': cdn('kyna/about/female-therapist-rehabilitation-center-putting-shoulder-supp'),
  'src/assets/about/physiotherapist-applies-knee-tape-woman-closeup-taping-application (1) (1).jpg': cdn('kyna/about/physiotherapist-applies-knee-tape-woman-closeup-taping-appli'),
  'src/assets/about/top-view-suction-cup-process (1) (1).jpg': cdn('kyna/about/top-view-suction-cup-process'),
  'src/assets/about/woman-doing-gymnastics-with-help-his-young-physical-therapist (1) (1).jpg': cdn('kyna/about/woman-doing-gymnastics-with-help-his-young-physical-therapis'),
  'src/assets/about/woman-rehabilitation-center-getting-treatment (1) (1).jpg': cdn('kyna/about/woman-rehabilitation-center-getting-treatment'),
  'src/assets/images/services-section.jpg': cdn('kyna/site/services-section'),
  'src/assets/logo/drsorabh.png': cdn('kyna/brand/drsorabh'),
  'src/assets/logo/kyna_withoutbg-01.PNG': cdn('kyna/brand/kyna-withoutbg-01'),
  'src/assets/logo/kyna_withoutbg-04.PNG': cdn('kyna/brand/kyna-withoutbg-04'),
  'src/assets/logo/main-outside.png': cdn('kyna/brand/main-outside'),
  'src/assets/services/doctor-helping-patient-rehabilitation.jpg': cdn('kyna/services/doctor-helping-patient-rehabilitation'),
  'src/assets/services/front-view-young-male-sitting-with-broken-foot-crutches-grey-wall-pain-accident-broken-twist-foot-leg.jpg': cdn('kyna/services/front-view-young-male-sitting-with-broken-foot-crutches-grey'),
  'src/assets/services/pexels-funkcines-terapijos-centras-927573878-20860591.jpg': cdn('kyna/services/pexels-funkcines-terapijos-centras'),
  'src/assets/services/pexels-karola-g-4506078.jpg': cdn('kyna/services/pexels-karola-g-4506078'),
  'src/assets/services/physiotherapist-doing-leg-exercises-with-female-patient.jpg': cdn('kyna/services/physiotherapist-doing-leg-exercises-with-female-patient'),
  'src/assets/services/professional-therapists-is-stretching-muscles-patients-with-abnormal-muscular-symptoms-physical-rehabilitation-therapies-treatment-physiological-disorders-by-physiotherapists-concept.jpg': cdn('kyna/services/professional-therapists-is-stretching-muscles-patients-with'),
  'src/assets/services/senior-man-nursing-home-with-doing-physical-therapy-with-help-from-nurse-using-dumbbells.jpg': cdn('kyna/services/senior-man-nursing-home-with-doing-physical-therapy-with-hel'),
  'src/assets/services/side-view-pregnant-woman-midwife-home-woman-casual-clothes-sitting-bed-asian-doula-holding-hand-pregnancy-medicine-home-birth-concept.jpg': cdn('kyna/services/side-view-pregnant-woman-midwife-home-woman-casual-clothes-s'),
  'src/assets/services/young-woman-doctor-chiropractor-osteopath-fixing-lying-womans-back-with-hands-movements-visit-manual-therapy-clinic-professional-chiropractor-work.jpg': cdn('kyna/services/young-woman-doctor-chiropractor-osteopath-fixing-lying-woman'),
  'src/assets/services/young-woman-with-back-problems-doing-physiotherapy-treatment.jpg': cdn('kyna/services/young-woman-with-back-problems-doing-physiotherapy-treatment'),
} as const
