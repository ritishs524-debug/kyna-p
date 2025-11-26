import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

import chiropracticVideo from '../../assets/images/about-us/chiropractic.mp4'
import cuppingVideo from '../../assets/images/about-us/cupping.mp4'
import kneeVideo from '../../assets/images/about-us/knee.mp4'
import neckVideo from '../../assets/images/about-us/neck.mp4'
import neck2Video from '../../assets/images/about-us/neck2.mp4'
import needleVideo from '../../assets/images/about-us/needle..mp4'
import homePageVideo from '../../assets/images/about-us/home-page.mp4'

type AboutMediaItem = { src: string }

const aboutMedia: AboutMediaItem[] = [
	{ src: chiropracticVideo },
	{ src: cuppingVideo },
	{ src: kneeVideo },
	{ src: neckVideo },
	{ src: neck2Video },
	{ src: needleVideo },
	{ src: homePageVideo },
]

const mediaSpanPattern = ['row-span-2', 'row-span-3', 'row-span-2', 'row-span-4']

export function AboutHeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

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
          <p className="about-hero-badge inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-sky-700 shadow-sm dark:bg-slate-900/80 dark:text-sky-300">
            We Are Highly Recommended
            <span className="h-1 w-1 rounded-full bg-sky-400" />
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
            {aboutMedia.map((item, index) => {
              const spanClass = mediaSpanPattern[index % mediaSpanPattern.length]
              return (
                <div key={item.src} className={`relative overflow-hidden ${spanClass}`}>
                  <video
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

