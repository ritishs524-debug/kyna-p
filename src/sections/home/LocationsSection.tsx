import { useRef } from 'react'
import { motion } from 'framer-motion'
import BranchCards from '../../components/ui/branch-cards'

type PageLabel = 'home' | 'about' | 'services' | 'team' | 'contact'

type LocationsSectionProps = {
  onNavigate?: (page: PageLabel) => void
}

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
] as const

const branches = [
  { num: '01', name: 'Kyna Physiotherapy Patiala', sub: 'Flagship Clinic · DLF Colony', href: '/patiala' },
  { num: '02', name: 'Kyna Physiotherapy Sangrur', sub: 'Full-service Rehab Centre', href: '/sangrur' },
  { num: '03', name: 'Kyna Physiotherapy Samana', sub: 'Community Clinic', href: '/samana' },
  { num: '04', name: 'Anamiva Physiotherapy', sub: 'Malwa Colony · Patiala', href: '/anamiva' },
  { num: '05', name: 'Good Life Physiotherapy', sub: 'Wellness & Recovery', href: '/goodlife' },
  { num: '06', name: "Women's Care Physiotherapy", sub: 'Specialised Women\u2019s Health', href: '/womenscare' },
] as const

const EASE = [0.22, 1, 0.36, 1] as const

export function LocationsSection({ onNavigate }: LocationsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)

  const handleViewAllBranches = () => {
    if (!onNavigate) return
    onNavigate('contact')
    setTimeout(() => {
      if (typeof window === 'undefined') return
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }

  return (
    <section
      ref={sectionRef}
      className="locations-section relative overflow-hidden bg-slate-950 text-slate-50"
    >
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      </div>

      <div className="relative z-20 mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-400">
            Our Network
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Branches Across Punjab
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
            A growing network of KYNA Physiotherapy clinics offering intelligent rehab in Patiala,
            Samana, Sangrur and beyond.
          </p>
        </motion.div>

        {/* Branch cards */}
        <div className="mx-auto max-w-5xl">
          <BranchCards branches={branches} />
        </div>

        {/* Clinic details */}
        <div className="mt-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            viewport={{ once: true }}
            className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500"
          >
            Clinic Locations
          </motion.p>

          <div className="grid gap-5 md:grid-cols-3">
            {locations.map((loc, i) => (
              <motion.div
                key={loc.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
                viewport={{ once: true, margin: '-60px' }}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-sm backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
                    {loc.name}
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-400">{loc.address}</p>
                </div>

                <div className="mt-4 h-36 overflow-hidden rounded-xl border border-white/[0.06]">
                  <iframe
                    title={`${loc.name} map`}
                    src={loc.mapEmbedSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                    allowFullScreen
                  />
                </div>

                <div className="mt-4">
                  <a
                    href="tel:9878182115"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-300 transition-all duration-300 hover:border-sky-500/30 hover:text-sky-300"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    Call Clinic
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <button
            type="button"
            onClick={handleViewAllBranches}
            className="rounded-full border border-white/[0.1] bg-white/[0.04] px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-300 transition-all duration-300 hover:border-sky-500/30 hover:bg-sky-500/5 hover:text-sky-300"
          >
            View all branches
          </button>
        </motion.div>
      </div>
    </section>
  )
}
