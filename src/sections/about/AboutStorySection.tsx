import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

export function AboutStorySection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-story-col', {
        opacity: 0,
        y: 26,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.16,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 lg:px-6">
        <div className="about-story-col mb-10 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500">
            Our Aim • Vision • Mission
          </p>
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Intelligent rehabilitation designed around your whole body.
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Every protocol at KYNA begins with understanding your story, your goals and your lifestyle, then
            aligning our clinical expertise to match your long-term recovery and prevention.
          </p>
        </div>

        <div className="about-story-col grid gap-6 md:grid-cols-3">
          <article className="h-full rounded-3xl border border-slate-200/80 bg-slate-50/80 p-6 text-sm shadow-[0_18px_55px_rgba(15,23,42,0.12)] dark:border-slate-800/80 dark:bg-slate-900/80">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-sky-500">Our Aim</p>
            <p className="mt-3 leading-relaxed text-slate-800 dark:text-slate-100">
              <span className="font-semibold">KYNA</span> means <span className="italic">Intelligent</span>; as the name suggests, we are pledged
              to provide Complete Rehabilitation with a well-designed Intelligent Therapeutic and Holistic
              Solution for all problems.
            </p>
            <p className="mt-3 leading-relaxed text-slate-800 dark:text-slate-100">
              Team Kyna focuses on all three spheres of healthcare — Prevention, Treatment and Complete
              Rehabilitation with customised protocols for each individual.
            </p>
          </article>

          <article className="h-full rounded-3xl border border-slate-200/80 bg-slate-50/80 p-6 text-sm shadow-[0_18px_55px_rgba(15,23,42,0.12)] dark:border-slate-800/80 dark:bg-slate-900/80">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-sky-500">Our Vision</p>
            <p className="mt-3 leading-relaxed text-slate-800 dark:text-slate-100">
              To become the preferred, integrated rehabilitation centre in India utilizing comprehensive
              professional resources to create a healthy and happy community where people enjoy, practice,
              share, learn and accomplish a deeper, stronger and more conscious sense of self.
            </p>
          </article>

          <article className="h-full rounded-3xl border border-slate-200/80 bg-slate-50/80 p-6 text-sm shadow-[0_18px_55px_rgba(15,23,42,0.12)] dark:border-slate-800/80 dark:bg-slate-900/80">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-sky-500">Our Mission</p>
            <p className="mt-3 leading-relaxed text-slate-800 dark:text-slate-100">
              Our mission is to educate and inspire the budding physiotherapist for creating evidence based
              whole body treatment protocols by authentically sharing our knowledge, expertise and experience.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

