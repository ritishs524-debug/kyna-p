'use client'

import { HeartHandshake, ShieldCheck, TrendingUp, UserRound } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { RevealGroup, RevealItem } from '../../components/ui/Reveal'
import { FeatureCard } from '../../components/ui/cards'
import { container, dark, sectionTint } from '../../lib/design-tokens'

/**
 * Our Approach. The four principles are the ones the clinic already states
 * across the Services page copy and the founding story — no new claims.
 */
const approach = [
  {
    icon: HeartHandshake,
    title: 'Personalised Care',
    body: 'Every protocol begins with your story, your goals and your lifestyle, so the plan is built around you rather than a template.',
    iconTone: 'bg-cyan-50 text-[#18C7D8] dark:bg-cyan-950/40 dark:text-cyan-400',
  },
  {
    icon: ShieldCheck,
    title: 'Evidence-Based Treatment',
    body: 'We share our knowledge, expertise and experience openly, using researched protocols across prevention, treatment and complete rehabilitation.',
    iconTone: 'bg-sky-50 text-[#087CF0] dark:bg-sky-950/40 dark:text-sky-400',
  },
  {
    icon: TrendingUp,
    title: 'Long-Term Recovery',
    body: 'We determine your functional ability and expected outcomes, then formulate a plan for obtaining and maintaining those results.',
    iconTone: 'bg-teal-50 text-[#00C9A7] dark:bg-teal-950/40 dark:text-teal-300',
  },
  {
    icon: UserRound,
    title: 'Patient-Centred',
    body: 'A memorable experience and a real patient-therapist relationship sit at the centre of every session you have with us.',
    iconTone: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400',
  },
] as const

export function AboutApproachSection() {
  return (
    <section className={`${sectionTint} ${dark.sectionTint}`}>
      <div className={`${container.content} py-16 lg:py-20`}>
        <SectionHeading
          eyebrow="Our Approach"
          title="How We Work With You"
          intro="Four principles guide every assessment, every protocol and every follow-up at KYNA."
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {approach.map((item) => (
            <FeatureCard
              key={item.title}
              icon={<item.icon className="h-6 w-6" aria-hidden="true" />}
              title={item.title}
              body={item.body}
              iconTone={item.iconTone}
            />
          ))}
        </RevealGroup>

        {/* Three spheres of healthcare, from the founding statement. */}
        <RevealGroup className="mt-6 grid gap-5 sm:grid-cols-3">
          {['Prevention', 'Treatment', 'Complete Rehabilitation'].map((sphere) => (
            <RevealItem key={sphere}>
              <div
                className={`flex min-h-11 items-center gap-3 rounded-[16px] border border-sky-100 bg-white/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: '#087CF0' }}
                  aria-hidden="true"
                />
                <span className="text-[14px] font-semibold text-[#0B2347] dark:text-white">
                  {sphere}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
