import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import imgNeedle from '../../assets/about/close-up-therapist-holding-acupuncture-needle (1) (1).jpg'
import imgDoctorHelp from '../../assets/about/doctor-helping-patient-rehabilitation (1) (1).jpg'
import imgShoulderSupport from '../../assets/about/female-therapist-rehabilitation-center-putting-shoulder-support-man (1) (1).jpg'
import imgKneeTape from '../../assets/about/physiotherapist-applies-knee-tape-woman-closeup-taping-application (1) (1).jpg'
import imgCupping from '../../assets/about/top-view-suction-cup-process (1) (1).jpg'
import imgGymnastics from '../../assets/about/woman-doing-gymnastics-with-help-his-young-physical-therapist (1) (1).jpg'
import imgRehabCenter from '../../assets/about/woman-rehabilitation-center-getting-treatment (1) (1).jpg'

// NOTE: The video collage on the About hero is temporarily disabled to avoid
// missing-asset build errors and to keep the page lighter. All original
// imports and mapping logic are kept commented below so they can be restored
// easily later if needed.
// import { KynaSpinner } from '../../components/common/PageLoader'
// import chiropracticVideo from '../../assets/images/about-us/chiropractic.mp4'
// import cuppingVideo from '../../assets/images/about-us/cupping.mp4'
// import kneeVideo from '../../assets/images/about-us/knee.mp4'
// import neckVideo from '../../assets/images/about-us/neck.mp4'
// import neck2Video from '../../assets/images/about-us/neck2.mp4'
// import needleVideo from '../../assets/images/about-us/needle..mp4'
// import homePageVideo from '../../assets/images/about-us/home-page.mp4'

// type AboutMediaItem = { src: string }
// const aboutMedia: AboutMediaItem[] = [
//   { src: chiropracticVideo },
//   { src: cuppingVideo },
//   { src: kneeVideo },
//   { src: neckVideo },
//   { src: neck2Video },
//   { src: needleVideo },
//   { src: homePageVideo },
// ]
// const mediaSpanPattern = ['row-span-2', 'row-span-3', 'row-span-2', 'row-span-4']

const aboutImages = [
  { src: imgNeedle, alt: 'Close-up of therapist holding acupuncture needle' },
  { src: imgDoctorHelp, alt: 'Doctor helping patient with rehabilitation exercises' },
  { src: imgShoulderSupport, alt: 'Therapist putting shoulder support on patient' },
  { src: imgKneeTape, alt: 'Physiotherapist applying knee tape to patient' },
  { src: imgCupping, alt: 'Top view of suction cup therapy in progress' },
  { src: imgGymnastics, alt: 'Woman doing gymnastics with physical therapist assistance' },
  { src: imgRehabCenter, alt: 'Woman getting treatment at rehabilitation center' },
] as const

const mediaSpanPattern = ['row-span-2', 'row-span-3', 'row-span-2', 'row-span-4'] as const

export function AboutHeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

	  // const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({})
	  //
	  // // Fallback: ensure no tile spinner can get stuck forever (e.g. on hard refresh).
	  // // We also stagger the timeouts so, worst-case, tiles still appear one-by-one
	  // // instead of all popping in together after the same delay.
	  // useEffect(() => {
	  //   const baseDelay = 3500 // ms
	  //   const perTileStagger = 350 // ms
	  //
	  //   const timeouts = aboutMedia.map((item, index) =>
	  //     window.setTimeout(() => {
	  //       setLoadedMap((prev) => (prev[item.src] ? prev : { ...prev, [item.src]: true }))
	  //     }, baseDelay + index * perTileStagger),
	  //   )
	  //
	  //   return () => {
	  //     timeouts.forEach((id) => window.clearTimeout(id))
	  //   }
	  // }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.about-hero-badge', {
        opacity: 0,
        y: -20,
        duration: 0.6,
      })
        .from(
          '.about-hero-heading',
          {
            opacity: 0,
            y: 28,
            duration: 0.7,
            filter: 'blur(10px)',
          },
          '-=0.25',
        )
        .from(
          '.about-hero-copy',
          {
            opacity: 0,
            y: 22,
            duration: 0.7,
            stagger: 0.12,
          },
          '-=0.3',
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-sky-50/60 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-10 px-4 pb-20 pt-24 lg:flex-row lg:items-start lg:gap-16 lg:px-6 lg:pb-28">
        <div className="max-w-xl space-y-6">
          <p className="about-hero-badge inline-flex items-center gap-2 rounded-full bg-[#4b55ad] px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-sky-50 shadow-sm shadow-[0_10px_26px_rgba(15,23,42,0.45)] dark:bg-[#4b55ad] dark:text-sky-50">
            We Are Highly Recommended
            <span className="h-1 w-1 rounded-full bg-sky-200" />
            Since Oct 2021
          </p>

          <div className="space-y-4">
            <h1 className="about-hero-heading text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-50">
              KYNA is a sovereign physiotherapy group committed to unforgettable well-being.
            </h1>
            <p className="about-hero-copy text-base leading-relaxed text-slate-800 sm:text-lg dark:text-slate-300">
              KYNA is a sovereign group, successfully operating PHYSIOTHERAPY CLINICS, that is pledged to
              provide an unforgettable experience of well-being to the patients, by addressing the problems
              related to all the systems of the human body and understanding the importance of general
              well-being.
            </p>
            <p className="about-hero-copy text-base leading-relaxed text-slate-800 sm:text-lg dark:text-slate-300">
              The Association between the two young physiotherapists who really want to provide unique
              evidence-based whole-body treatment to the patient resulted in the birth of KYNA in OCT 2021
              registered with UDYAM certificate No.{' '}
              <span className="font-mono text-[0.85rem]">UDYAM-PB-17-0013557</span>.
            </p>
          </div>
        </div>

	        <div className="about-hero-media mt-4 w-full flex-1 lg:mt-0">
	          <div className="grid h-full grid-flow-row-dense auto-rows-[82px] grid-cols-3 overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-900/90 shadow-[0_22px_70px_rgba(15,23,42,0.7)] dark:border-slate-800/80 dark:bg-slate-950/90">
	            {/* Original video collage (disabled for now to prevent build errors)
	            {aboutMedia.map((item, index) => {
	              const spanClass = mediaSpanPattern[index % mediaSpanPattern.length]
	              const isLoaded = !!loadedMap[item.src]
	
	              return (
	                <div key={item.src} className={`relative overflow-hidden ${spanClass}`}>
	                  {!isLoaded && (
	                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
	                      <KynaSpinner size={40} />
	                    </div>
	                  )}
	
	                  <video
	                    className={`h-full w-full object-cover transition-opacity duration-700 ${
	                      isLoaded ? 'opacity-100' : 'opacity-0'
	                    }`}
	                    autoPlay
	                    muted
	                    loop
	                    playsInline
	                    preload="auto"
	                    disablePictureInPicture
	                    disableRemotePlayback
	                    onCanPlay={(event) => {
	                      const video = event.currentTarget
	                      if (video.paused) {
	                        void video.play().catch(() => {
	                          // Ignore autoplay errors; video will remain muted background.
	                        })
	                      }
	                    }}
	                    onLoadedMetadata={() =>
	                      setLoadedMap((prev) => ({
	                        ...prev,
	                        [item.src]: true,
	                      }))
	                    }
	                    onError={() =>
	                      setLoadedMap((prev) => ({
	                        ...prev,
	                        [item.src]: true,
	                      }))
	                    }
	                  >
	                    <source src={item.src} type="video/mp4" />
	                  </video>
	                </div>
	              )
	            })}
	            */}
	            {aboutImages.map((image, index) => {
	              const spanClass = mediaSpanPattern[index % mediaSpanPattern.length]
	              return (
	                <div key={image.src} className={`relative overflow-hidden ${spanClass}`}>
	                  <img
	                    src={image.src}
	                    alt={image.alt}
	                    loading="lazy"
	                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
	                  />
	                </div>
	              )
	            })}
	          </div>
	        </div>
      </div>
    </section>
  )
}

