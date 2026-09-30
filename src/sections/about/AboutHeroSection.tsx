'use client'

import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import { ImageWithLoader } from '../../components/common/ImageWithLoader'
import { ImageLightbox } from '../../components/ui/ImageLightbox'
import { PageHero } from '../../components/ui/PageHero'
import { dark } from '../../lib/design-tokens'
import { aboutImages as cdnAbout } from '../../lib/cloudinary-images'


// The About hero keeps a photo mosaic on the right. Every tile is a real
// project asset, uniform crop, lazy-loaded.
const aboutImages = [
  { src: cdnAbout.doctorHelping, alt: 'Therapist guiding a patient through rehabilitation exercises' },
  { src: cdnAbout.shoulderSupport, alt: 'Therapist fitting a shoulder support in the clinic' },
  { src: cdnAbout.gymnastics, alt: 'Patient practising guided movement with a physiotherapist' },
  { src: cdnAbout.cupping, alt: 'Cupping therapy session viewed from above' },
  { src: cdnAbout.kneeTape, alt: 'Physiotherapist applying supportive tape to a patient’s knee' },
  { src: cdnAbout.rehabCentre, alt: 'Patient receiving treatment in the rehabilitation centre' },
  { src: cdnAbout.needle, alt: 'Close-up of a therapist holding a fine treatment needle' },
]

/**
 * Compact square mosaic.
 *
 * The grid is a fixed 4-row track inside an `aspect-square` box, so the whole
 * gallery is always exactly as tall as it is wide — never a long strip.
 *
 * Desktop, 3 columns × 4 rows — the seven tiles fill all 12 cells, no holes:
 *   rows 1–2 : one large feature (2×2) + a tall portrait (1×2)
 *   row 3    : three equal small squares
 *   row 4    : one wide strip (2×1) + one small square
 *
 * Below `lg`, 2 columns × 4 rows — a wide banner over six smalls (8 cells).
 *
 * Entries are complete literal class strings so Tailwind sees them, and the
 * list repeats so 6, 7 or 20 images all stay balanced.
 */
const SPAN_PATTERN = [
  'col-span-2 row-span-1 lg:col-span-2 lg:row-span-2',
  'col-span-1 row-span-1 lg:col-span-1 lg:row-span-2',
  'col-span-1 row-span-1 lg:col-span-1 lg:row-span-1',
  'col-span-1 row-span-1 lg:col-span-1 lg:row-span-1',
  'col-span-1 row-span-1 lg:col-span-1 lg:row-span-1',
  'col-span-1 row-span-1 lg:col-span-2 lg:row-span-1',
  'col-span-1 row-span-1 lg:col-span-1 lg:row-span-1',
] as const

export function AboutHeroSection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  return (
    <PageHero
      eyebrow="About KYNA"
      title="Rehabilitation Designed Around You"
      intro={
        <>
          KYNA is a sovereign physiotherapy group, successfully operating clinics across Punjab,
          pledged to provide an unforgettable experience of well-being by addressing problems
          related to all the systems of the human body.
        </>
      }
      aside={
        <div
          role="group"
          aria-label="Clinic photo gallery"
          className="grid aspect-square grid-cols-2 grid-rows-4 gap-2 [grid-auto-flow:dense] lg:grid-cols-3 lg:gap-2.5"
        >
          {aboutImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`View larger image ${index + 1} of ${aboutImages.length}: ${image.alt}`}
              className={`group/tile relative overflow-hidden rounded-[18px] border border-sky-100/90 bg-sky-50 text-left shadow-[0_4px_18px_rgba(11,35,71,0.07)] transition-all duration-300 hover:border-sky-200 hover:shadow-[0_18px_44px_rgba(11,35,71,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087CF0] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${SPAN_PATTERN[index % SPAN_PATTERN.length]}`}
            >
              <ImageWithLoader
                src={image.src}
                alt={image.alt}
                loading="lazy"
                containerClassName="h-full w-full"
                imageClassName="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover/tile:scale-[1.07] group-focus-visible/tile:scale-[1.07]"
                spinnerSize={20}
              />

              {/* Calm gradient wash, revealed on hover / keyboard focus */}
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B2347]/60 via-[#0B2347]/10 to-transparent opacity-0 transition-opacity duration-400 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100"
                aria-hidden="true"
              />

              {/* Expand affordance */}
              <span
                className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100"
                aria-hidden="true"
              >
                <span className="flex h-11 w-11 scale-90 items-center justify-center rounded-full bg-white/95 text-[#0B2347] shadow-[0_8px_24px_rgba(11,35,71,0.35)] transition-transform duration-300 group-hover/tile:scale-100 group-focus-visible/tile:scale-100">
                  <Maximize2 className="h-[18px] w-[18px]" />
                </span>
              </span>
            </button>
          ))}
        </div>
      }
    >
      {/* Founding detail, kept verbatim from the original hero copy. */}
      <p
        className={`mt-8 max-w-[600px] border-l-2 border-[#087CF0] pl-5 text-[14px] leading-[1.7] text-slate-500 ${dark.subheading}`}
      >
        The association between the two young physiotherapists who really want to provide unique
        evidence-based whole-body treatment to the patient resulted in the birth of KYNA in Oct 2021,
        registered with UDYAM certificate No.{' '}
        <span className="font-mono text-[13px] text-[#0B2347] dark:text-white">UDYAM-PB-17-0013557</span>.
      </p>

      {/* Full-screen viewer, portalled to <body> so it escapes the hero's transform. */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={aboutImages}
            index={lightboxIndex}
            onClose={closeLightbox}
            onIndexChange={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </PageHero>
  )
}
