'use client'

import { ImageWithLoader } from '../../components/common/ImageWithLoader'
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal'
import { color, container, dark, eyebrow, sectionLight } from '../../lib/design-tokens'
import { aboutImages } from '../../lib/cloudinary-images'


/** The three founding statements, verbatim from the original page. */
const pillars = [
  {
    label: 'Our Aim',
    body: [
      'KYNA',
      ' means ',
      'Intelligent',
      '; as the name suggests, we are pledged to provide Complete Rehabilitation with a well-designed Intelligent Therapeutic and Holistic Solution for all problems.',
      'Team Kyna focuses on all three spheres of healthcare — Prevention, Treatment and Complete Rehabilitation with customised protocols for each individual.',
    ] as const,
  },
  {
    label: 'Our Vision',
    body: [
      'To become the preferred, integrated rehabilitation centre in India utilizing comprehensive professional resources to create a healthy and happy community where people enjoy, practice, share, learn and accomplish a deeper, stronger and more conscious sense of self.',
    ] as const,
  },
  {
    label: 'Our Mission',
    body: [
      'Our mission is to educate and inspire the budding physiotherapist for creating evidence based whole body treatment protocols by authentically sharing our knowledge, expertise and experience.',
    ] as const,
  },
] as const

/** Splits a pillar body on the token boundaries without losing the emphasis. */
function PillarText({ parts }: { parts: readonly string[] }) {
  return (
    <>
      {parts.map((part, i) => {
        if (part === 'KYNA') {
          return (
            <strong key={i} className="font-bold text-[#0B2347] dark:text-white">
              {part}
            </strong>
          )
        }
        if (part === 'Intelligent') {
          return (
            <em key={i} className="italic">
              {part}
            </em>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export function AboutStorySection() {
  return (
    <section className={`${sectionLight} ${dark.sectionLight}`}>
      <div className={`${container.content} py-16 lg:py-20`}>
        {/* ── Two-column story: image left, copy right ── */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[26px] border border-sky-100 shadow-[0_20px_60px_rgba(11,35,71,0.10)] dark:border-slate-800">
              <ImageWithLoader
                src={aboutImages.rehabCentre}
                alt="Patient receiving hands-on treatment at the KYNA rehabilitation centre"
                loading="lazy"
                containerClassName="aspect-[4/3] w-full"
                imageClassName="h-full w-full object-cover"
                spinnerSize={32}
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className={`${eyebrow} ${color.blue} ${dark.eyebrow}`}>Our Story</p>
              <h2
                className={`mt-4 text-balance text-[28px] leading-[1.15] font-bold tracking-tight sm:text-[34px] lg:text-[38px] ${color.navy} ${dark.heading}`}
              >
                Intelligent rehabilitation designed around your whole body.
              </h2>
            </Reveal>

            <Reveal index={1}>
              <p
                className={`mt-5 text-[15px] leading-[1.75] text-slate-600 sm:text-[16px] ${dark.subheading}`}
              >
                Every protocol at KYNA begins with understanding your story, your goals and your
                lifestyle, then aligning our clinical expertise to match your long-term recovery and
                prevention.
              </p>
            </Reveal>

            <Reveal index={2}>
              <p
                className={`mt-4 text-[15px] leading-[1.75] text-slate-600 sm:text-[16px] ${dark.subheading}`}
              >
                We work on providing you a memorable experience as well as building a
                patient-therapist relationship where we determine your existing level of functional
                ability and your expected outcomes. Together, we formulate a plan for obtaining and
                maintaining those outcomes.
              </p>
            </Reveal>
          </div>
        </div>

        {/* ── Aim / Vision / Mission ── */}
        <RevealGroup className="mt-16 grid gap-5 md:grid-cols-3 lg:mt-20 lg:gap-6">
          {pillars.map((pillar) => (
            <RevealItem key={pillar.label}>
              <article
                className={`group relative h-full overflow-hidden rounded-[20px] border border-sky-100 bg-[#F7FBFF] p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_44px_rgba(11,35,71,0.08)] dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900`}
              >
                <span
                  className={`absolute top-0 left-7 h-[3px] w-10 rounded-full transition-all duration-500 group-hover:w-16 ${color.blue}`}
                  style={{ backgroundColor: '#087CF0' }}
                  aria-hidden="true"
                />
                <h3 className="text-[13px] font-semibold tracking-[0.22em] text-[#087CF0] uppercase dark:text-sky-400">
                  {pillar.label}
                </h3>
                <p
                  className={`mt-4 text-[14px] leading-[1.75] text-slate-600 ${dark.subheading}`}
                >
                  <PillarText parts={pillar.body} />
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
