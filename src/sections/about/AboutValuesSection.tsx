'use client'

import { Award, Compass, HeartHandshake, Target } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { RevealGroup } from '../../components/ui/Reveal'
import { container, dark, sectionTint } from '../../lib/design-tokens'

/**
 * The four values the original page listed as pills. Same content, now as a
 * clean card row. The "expertise → commitment → implementation" progression
 * that the original paragraph described is kept as a numbered sequence.
 */
const values = [
  {
    step: '01',
    icon: Award,
    title: 'Expertise',
    body: 'Advanced training across sports rehab, orthopaedics, neurology and women’s health — shared openly with you.',
    iconTone: 'bg-sky-50 text-[#087CF0] dark:bg-sky-950/40 dark:text-sky-400',
  },
  {
    step: '02',
    icon: Compass,
    title: 'Commitment',
    body: 'A patient-therapist relationship where your functional ability and expected outcomes are defined together.',
    iconTone: 'bg-cyan-50 text-[#18C7D8] dark:bg-cyan-950/40 dark:text-cyan-400',
  },
  {
    step: '03',
    icon: Target,
    title: 'Implementation',
    body: 'A clear plan to obtain those outcomes — then structured, evidence-based protocols carried out session by session.',
    iconTone: 'bg-teal-50 text-[#00C9A7] dark:bg-teal-950/40 dark:text-teal-300',
  },
  {
    step: '04',
    icon: HeartHandshake,
    title: 'Complete Wellness',
    body: 'The end result of that process: complete wellness and rehabilitation, not just the absence of pain.',
    iconTone: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400',
  },
] as const

export function AboutValuesSection() {
  return (
    <section className={`${sectionTint} ${dark.sectionTint}`}>
      <div className={`${container.content} py-16 lg:py-20`}>
        <SectionHeading
          eyebrow="Our Values"
          title="Expertise, Commitment, Implementation"
          intro="A simple process that turns a memorable experience into complete wellness and rehabilitation."
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {values.map((value) => (
            <article
              key={value.title}
              className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-sky-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(11,35,71,0.10)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_4px_18px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_18px_44px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${value.iconTone}`}
                >
                  <value.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="text-[13px] font-bold tracking-[0.1em] text-slate-300 dark:text-slate-600">
                  {value.step}
                </span>
              </div>

              <h3 className="mt-5 text-[17px] font-bold tracking-tight text-[#0B2347] dark:text-white">
                {value.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.7] text-slate-500 dark:text-slate-400">
                {value.body}
              </p>
            </article>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
