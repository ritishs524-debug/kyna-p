import { useRef } from 'react'
import { motion } from 'framer-motion'
import kynaLogo from '../../assets/logo/kyna_withoutbg-01.PNG'
import branchesVideo from '../../assets/videos/branches.mp4'
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
  { name: 'KYNA Physiotherapy Patiala', subtitle: 'Flagship Clinic · DLF Colony' },
  { name: 'KYNA Physiotherapy Sangrur', subtitle: 'Full-service Rehab Centre' },
  { name: 'KYNA Physiotherapy Samana', subtitle: 'Community Clinic' },
  { name: 'Anamiva Physiotherapy', subtitle: 'Malwa Colony · Patiala' },
  { name: 'Good Life Physiotherapy', subtitle: 'Wellness & Recovery' },
  { name: "Women's Care Physiotherapy", subtitle: 'Specialised Women\u2019s Health' },
] as const

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const

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
      className="relative overflow-hidden bg-slate-900 text-slate-50 dark:bg-black"
    >
      {/* Background: branches video */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video
          className="h-full w-full object-cover"
          src={branchesVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/80 to-slate-900/90" />
      </div>

      {/* Dark radial overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_transparent_70%)]" />

      <div className="relative z-20">
        {/* Hero: Logo + BranchCards */}
        <div className="flex min-h-[520px] flex-col items-center justify-center px-4 py-16 sm:min-h-screen sm:py-0">
          {/* Logo reveal */}
          <motion.img
            src={kynaLogo}
            alt="KYNA Physiotherapy logo"
            loading="lazy"
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: CINEMATIC_EASE }}
            viewport={{ once: true }}
            className="pointer-events-none mb-4 w-auto max-w-xs drop-shadow-[0_0_40px_rgba(56,189,248,0.85)] sm:max-w-sm md:max-w-md"
          />

          {/* Trunk line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: CINEMATIC_EASE, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-2 h-20 w-px origin-top bg-sky-400/70 shadow-[0_0_40px_rgba(56,189,248,0.85)]"
          />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4, ease: CINEMATIC_EASE, delay: 0.9 }}
            viewport={{ once: true }}
            className="mb-10 h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.9)]"
          />

          {/* Branch cards grid */}
          <div className="w-full max-w-4xl">
            <BranchCards branches={branches} />
          </div>
        </div>

        {/* Clinic details section */}
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 lg:px-6 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
            viewport={{ once: true, margin: '-80px' }}
            className="mb-8 space-y-3 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
              Our Clinics
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Locations Across Punjab
            </h2>
            <p className="mx-auto max-w-xl text-sm text-slate-300/90">
              A growing network of KYNA Physiotherapy clinics offering intelligent rehab in Patiala,
              Samana and beyond.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {locations.map((loc, i) => (
              <motion.div
                key={loc.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: CINEMATIC_EASE, delay: i * 0.12 }}
                viewport={{ once: true, margin: '-60px' }}
                className="location-card flex flex-col justify-between overflow-hidden rounded-3xl border border-sky-200/80 bg-slate-50/95 p-5 text-sm shadow-[0_22px_60px_rgba(15,23,42,0.85)]"
              >
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">
                    {loc.name}
                  </div>
                  <p className="text-slate-700">{loc.address}</p>
                </div>

                <div className="mt-4 h-40 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
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
                    className="rounded-full border border-slate-900/80 bg-slate-900 px-3 py-1.5 font-semibold uppercase tracking-[0.24em] text-slate-50 shadow-[0_10px_30px_rgba(15,23,42,0.55)] transition hover:bg-slate-800 hover:border-slate-900"
                  >
                    Call Clinic
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <button
              type="button"
              onClick={handleViewAllBranches}
              className="rounded-full border border-sky-400/80 bg-slate-950/80 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.26em] text-sky-200 shadow-[0_18px_60px_rgba(15,23,42,0.85)] transition hover:border-sky-300 hover:bg-sky-500/10 hover:text-sky-50"
            >
              View all branches
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
