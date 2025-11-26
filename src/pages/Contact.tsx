import type { FormEvent } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

const locations = [
  {
    name: 'Patiala',
    address: 'SCF-34, DLF Colony, Patiala',
  },
  {
    name: 'Anamiva Physiotherapy',
    address:
      'Sco 7-8, behind Moti Palace, Malwa Colony, Rose Avenue, New Officers Colony, Patiala, Punjab 147001',
  },
  {
    name: 'Samana',
    address:
      'Krishna Basti, Opp Jain Terapanthi Sabha, Near Ganpati Jewellers, Waraich Colony, Samana, Punjab 147101',
  },
] as const

export function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-hero', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from('.contact-location-card', {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      gsap.from('.contact-form-card', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-form-card',
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    // For now, just fake a short delay and reset. Later this can be wired to backend / email.
    setTimeout(() => {
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(148,163,184,0.18),_transparent_70%)]" />

	      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 lg:px-6">
	        {/* Top intro */}
	        <div className="contact-hero mb-12 space-y-4 text-center">
	          <p className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-sky-700 shadow-sm dark:bg-slate-900/80 dark:text-sky-300">
	            Contact Us
	          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Have a Question?
          </h1>
          <p className="text-sm font-medium text-slate-500 sm:text-base dark:text-slate-300/90">
            Drop a line, call us directly or visit any of our KYNA Physiotherapy clinics.
          </p>
        </div>

        {/* Locations row */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {locations.map((loc) => (
            <article
              key={loc.name}
              className="contact-location-card flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/95 p-5 text-sm shadow-[0_18px_55px_rgba(15,23,42,0.12)] dark:border-slate-800/80 dark:bg-slate-900/90"
            >
              <div className="space-y-2">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-500 dark:text-sky-300">
                  {loc.name}
                </p>
                <p className="text-slate-700 dark:text-slate-300">{loc.address}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
                <a
                  href="tel:9878182115"
                  className="rounded-full border border-sky-400/80 px-3 py-1.5 font-semibold uppercase tracking-[0.24em] text-sky-600 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900 dark:text-sky-200 dark:hover:bg-slate-800"
                >
                  Call Clinic
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Contact form */}
        <div className="contact-form-card mx-auto max-w-4xl rounded-[2.5rem] bg-white/95 p-8 shadow-[0_26px_80px_rgba(15,23,42,0.18)] backdrop-blur dark:bg-slate-900/95">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Your name*
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="h-12 w-full rounded-full border border-slate-200/80 bg-slate-50/60 px-4 text-sm text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-50 dark:focus:border-sky-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Your e-mail*
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-full border border-slate-200/80 bg-slate-50/60 px-4 text-sm text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-50 dark:focus:border-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Your message*
              </label>
              <textarea
                required
                rows={5}
                placeholder="Share your concern, pain area or goal..."
                className="w-full rounded-3xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-50 dark:focus:border-sky-400"
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
              <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                We typically respond within the same working day.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#4b55ad] to-sky-500 px-8 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_18px_45px_rgba(56,189,248,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(56,189,248,0.75)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

