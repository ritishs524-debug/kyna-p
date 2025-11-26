import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

const locations = [
  {
    name: 'Patiala',
    address: 'SCF-34, DLF Colony, Patiala',
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.179410946937!2d76.37964937524664!3d30.344569104329872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3910288d9b66e069%3A0x6f21c2f478255502!2sKYNA%20Physiotherapy!5e0!3m2!1sen!2sin!4v1732171520000!5m2!1sen!2sin',
  },
  {
    name: 'Anamiva Physiotherapy',
    address:
      'Sco 7-8, behind moti Palace, Malwa Colony, Rose Avenue, New Officers Colony, Patiala, Punjab 147001',
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.179410946937!2d76.37964937524664!3d30.344569104329872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3910288d9b66e069%3A0x6f21c2f478255502!2sKYNA%20Physiotherapy!5e0!3m2!1sen!2sin!4v1732171520000!5m2!1sen!2sin',
  },
  {
    name: 'Samana',
    address:
      'Krishna Basti, opp. Jain Terapanthi Sabha, near Ganpati Jeweller, Waraich Colony, Samana, Punjab 147101',
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3435.9812221160025!2d76.19591007524107!3d30.188621706416732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39104411f0a0e529%3A0x7d597240fdfd1fab!2sKrishna%20Basti%2C%20Samana%2C%20Punjab%20147101!5e0!3m2!1sen!2sin!4v1732171860000!5m2!1sen!2sin',
  },
]

export function LocationsSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.location-card', {
        opacity: 0,
        y: 24,
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

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-900 text-slate-50 dark:bg-black"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_transparent_70%)]" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
            Our Clinics
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Locations Across Punjab
          </h2>
          <p className="mx-auto max-w-xl text-sm text-slate-300/90">
            Visit us at any of our KYNA Physiotherapy clinics conveniently located in Patiala and
            Samana.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {locations.map((loc) => (
            <div
              key={loc.name}
              className="location-card flex flex-col justify-between overflow-hidden rounded-3xl border border-sky-500/25 bg-slate-900/70 p-5 text-sm shadow-[0_26px_80px_rgba(15,23,42,0.9)]"
            >
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                  {loc.name}
                </div>
                <p className="text-slate-100">{loc.address}</p>
              </div>

              <div className="mt-4 h-40 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900">
                <iframe
                  title={`${loc.name} map`}
                  src={loc.mapEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                  allowFullScreen
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
                <a
                  href="tel:9878182115"
                  className="rounded-full border border-sky-400/80 px-3 py-1.5 font-semibold uppercase tracking-[0.24em] text-sky-200 transition hover:border-sky-300 hover:text-sky-50"
                >
                  Call Clinic
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

