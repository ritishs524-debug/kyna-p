import { useLayoutEffect, useRef } from 'react'
import { BadgeCheck } from 'lucide-react'
import { gsap } from '../../lib/gsap'

const bulletsLeft = ['Whole-body, holistic assessment', 'Personalised follow-up and support']
const bulletsRight = ['Evidence-based treatment plans', 'Focus on long-term prevention']

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-col', {
        opacity: 0,
        y: 26,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const Bullet = ({ label }: { label: string }) => (
    <li className="flex items-start gap-3 text-[17px] text-slate-600 dark:text-slate-300">
      <span className="mt-[9px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#18C7D8] dark:bg-sky-400" />
      <span className="leading-[1.5]">{label}</span>
    </li>
  )

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      {/* Very subtle decorative curve on the far left */}
      <div className="pointer-events-none absolute inset-y-0 -left-40 -z-10 w-[420px] rounded-full bg-sky-50 blur-3xl dark:bg-sky-950/25" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1160px] px-6 py-16 lg:px-8 lg:py-20">
        <div className="about-col">
          {/* Eyebrow + rule */}
          <div>
            <p className="text-[15px] font-semibold tracking-[0.3em] text-[#1683FF] uppercase dark:text-sky-400">
              Discover a New You
            </p>
            <span className="mt-3 block h-[2px] w-10 rounded-full bg-[#1683FF] dark:bg-sky-400" />
          </div>

          {/* Heading */}
          <h2 className="mt-4 text-[34px] leading-[1.15] font-bold tracking-tight text-[#0B2347] sm:text-[40px] dark:text-white">
            Welcome to KYNA Physiotherapy
          </h2>

          {/* Paragraphs */}
          <p className="mt-6 max-w-[1000px] text-[18px] leading-[1.75] text-slate-500 dark:text-slate-400">
            KYNA runs advanced physiotherapy clinics focused on clear, structured rehab and
            long-term wellbeing.
          </p>
          <p className="mt-5 max-w-[1000px] text-[18px] leading-[1.75] text-slate-500 dark:text-slate-400">
            We treat sports injuries, post-surgery recovery, chronic pain and everyday stiffness
            with personalised, one-to-one guidance.
          </p>

          {/* Two-column bullets */}
          <div className="mt-7 grid max-w-[1000px] gap-3 sm:grid-cols-2 sm:gap-x-10">
            <ul className="flex flex-col gap-3">
              {bulletsLeft.map((b) => (
                <Bullet key={b} label={b} />
              ))}
            </ul>
            <ul className="flex flex-col gap-3">
              {bulletsRight.map((b) => (
                <Bullet key={b} label={b} />
              ))}
            </ul>
          </div>
        </div>

        {/* Specialist information card */}
        <div className="about-col mt-9 flex items-center gap-6 rounded-[26px] border border-sky-100 bg-gradient-to-r from-[#EAF4FE] via-[#F4FAFF] to-[#EAF4FE] px-7 py-7 shadow-[0_6px_24px_rgba(11,35,71,0.04)] sm:px-9 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          {/* Circular specialist badge */}
          <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border border-sky-100 bg-white shadow-[0_8px_24px_rgba(11,35,71,0.08)] dark:border-slate-700 dark:bg-slate-950">
            <BadgeCheck className="h-9 w-9 text-[#1683FF] dark:text-sky-400" strokeWidth={1.7} />
          </span>

          {/* Vertical divider */}
          <span
            className="hidden h-[68px] w-px shrink-0 bg-sky-200 sm:block dark:bg-slate-700"
            aria-hidden="true"
          />

          {/* Copy */}
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold tracking-[0.22em] text-[#1683FF] uppercase dark:text-sky-400">
              Highly Qualified Specialists
            </p>
            <p className="mt-2.5 text-[18px] leading-[1.45] font-semibold text-[#0B2347] dark:text-white">
              Our team is made up of licensed physiotherapists with advanced training in their
              specialities.
            </p>
            <p className="mt-2 text-[15px] leading-[1.6] text-slate-500 dark:text-slate-400">
              From sports and orthopaedic rehab to cranial osteopathy and women&apos;s health, our
              specialists plan your care together.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
