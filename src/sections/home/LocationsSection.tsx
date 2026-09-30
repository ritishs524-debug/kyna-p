import { useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import BranchCards from '../../components/ui/branch-cards'
import { smoothScrollTo } from '../../lib/useSmoothScroll'

type PageLabel = 'home' | 'about' | 'services' | 'team' | 'contact'

type LocationsSectionProps = {
  onNavigate?: (page: PageLabel) => void
}

const locations = [
  {
    name: 'Patiala',
    address: 'SCF-34, DLF Colony, Patiala',
    pin: '#14B8A6',
    pinBg: '#DFF5F1',
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.179410946937!2d76.37964937524664!3d30.344569104329872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3910288d9b66e069%3A0x6f21c2f478255502!2sKYNA%20Physiotherapy!5e0!3m2!1sen!2sin!4v1732171520000!5m2!1sen!2sin',
  },
  {
    name: 'Anamiva Physiotherapy',
    address:
      'Sco 7-8, behind moti Palace, Malwa Colony, Rose Avenue, New Officers Colony, Patiala, Punjab 147001',
    pin: '#8B5CF6',
    pinBg: '#EFE9FC',
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.179410946937!2d76.37964937524664!3d30.344569104329872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3910288d9b66e069%3A0x6f21c2f478255502!2sKYNA%20Physiotherapy!5e0!3m2!1sen!2sin!4v1732171520000!5m2!1sen!2sin',
  },
  {
    name: 'Samana',
    address:
      'Krishna Basti, opp. Jain Terapanthi Sabha, near Ganpati Jeweller, Waraich Colony, Samana, Punjab 147101',
    pin: '#F0426B',
    pinBg: '#FDE7EC',
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
      smoothScrollTo(0)
    }, 0)
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white dark:bg-slate-950"
    >
      {/* ── Soft blue gradient atmosphere ── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1100px 520px at 8% 12%, #E3F0FD 0%, transparent 62%),' +
            'radial-gradient(900px 460px at 92% 22%, #E6F3FE 0%, transparent 60%),' +
            'radial-gradient(1000px 520px at 50% 100%, #EAF4FD 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* ── Decorative abstract shapes (behind content) ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {/* top-left pale blob */}
        <div className="absolute -top-6 -left-8 h-40 w-40 rounded-full bg-[#DCEBF9]/70" />
        {/* top-left thin cyan curve */}
        <svg className="absolute -top-2 left-0 h-[150px] w-[190px]" viewBox="0 0 190 150" fill="none">
          <path
            d="M-10 148C40 128 84 96 108 58c16-25 30-46 52-58"
            stroke="#7FD9E8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        {/* teal plus, top-left */}
        <svg className="absolute top-[86px] left-[140px] h-6 w-6 text-[#5FD3DE]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5 2h5a1.5 1.5 0 011.5 1.5V9h5.5A1.5 1.5 0 0122 10.5v5a1.5 1.5 0 01-1.5 1.5H16v5.5a1.5 1.5 0 01-1.5 1.5h-5a1.5 1.5 0 01-1.5-1.5V17H3.5A1.5 1.5 0 012 15.5v-5A1.5 1.5 0 013.5 9H9V3.5A1.5 1.5 0 0110.5 2z" />
        </svg>

        {/* top-right dot grid */}
        <svg className="absolute top-[38px] right-[110px] h-[74px] w-[74px]" viewBox="0 0 74 74" fill="#9BCDEF">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 6 }).map((__, c) => (
              <circle key={`${r}-${c}`} cx={6 + c * 12.4} cy={6 + r * 12.4} r="2.1" />
            )),
          )}
        </svg>
        {/* large pale plus, top-right */}
        <svg className="absolute top-[104px] right-[62px] h-10 w-10 text-[#C6E2F7]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5 2h5a1.5 1.5 0 011.5 1.5V9h5.5A1.5 1.5 0 0122 10.5v5a1.5 1.5 0 01-1.5 1.5H16v5.5a1.5 1.5 0 01-1.5 1.5h-5a1.5 1.5 0 01-1.5-1.5V17H3.5A1.5 1.5 0 012 15.5v-5A1.5 1.5 0 013.5 9H9V3.5A1.5 1.5 0 0110.5 2z" />
        </svg>

        {/* bottom-left cyan curve */}
        <svg className="absolute bottom-0 left-0 h-[170px] w-[150px]" viewBox="0 0 150 170" fill="none">
          <path
            d="M-8 6c34 34 66 66 96 104"
            stroke="#7FD9E8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* bottom-right pale blob */}
        <div className="absolute -right-10 -bottom-12 h-48 w-48 rounded-full bg-[#E4F1FC]/70" />
        {/* teal plus, bottom-right */}
        <svg className="absolute right-[118px] bottom-[104px] h-6 w-6 text-[#5FD3DE]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5 2h5a1.5 1.5 0 011.5 1.5V9h5.5A1.5 1.5 0 0122 10.5v5a1.5 1.5 0 01-1.5 1.5H16v5.5a1.5 1.5 0 01-1.5 1.5h-5a1.5 1.5 0 01-1.5-1.5V17H3.5A1.5 1.5 0 012 15.5v-5A1.5 1.5 0 013.5 9H9V3.5A1.5 1.5 0 0110.5 2z" />
        </svg>
      </div>

      {/* 1500px is the *content* width so the 3-up grid spans edge to edge, as in the reference. */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-16 lg:py-20">
        {/* ══ Top intro — centred ══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center"
        >
          <p className="text-[15px] font-semibold tracking-[0.32em] text-[#1683FF] uppercase dark:text-sky-400">
            Our Network
          </p>

          <h2 className="mt-5 text-[36px] leading-[1.1] font-extrabold tracking-tight text-[#0B2347] sm:text-[44px] lg:text-[48px] dark:text-white">
            Branches Across <span className="text-[#18C7D8] dark:text-sky-400">Punjab</span>
          </h2>

          <p className="mx-auto mt-6 max-w-[900px] text-[17px] leading-[1.6] text-slate-500 sm:text-[18px] dark:text-slate-400">
            A growing network of KYNA Physiotherapy clinics offering intelligent rehab in
            Patiala, Samana, Sangrur and beyond.
          </p>
        </motion.div>

        {/* ══ Branch grid — 3 × 2 ══ */}
        <div className="mt-12">
          <BranchCards branches={branches} />
        </div>

        {/* ══ Clinic locations label with side rules ══ */}
        <div className="mt-14 flex items-center justify-center gap-4 lg:mt-16">
          <span className="h-px w-[70px] bg-gradient-to-r from-transparent to-sky-300 lg:w-[110px]" aria-hidden="true" />
          <span className="flex shrink-0 items-center gap-2">
            <MapPin className="h-[15px] w-[15px] text-[#1683FF] dark:text-sky-400" strokeWidth={2.2} />
            <span className="text-[14px] font-semibold tracking-[0.28em] text-[#1683FF] uppercase dark:text-sky-400">
              Clinic Locations
            </span>
          </span>
          <span className="h-px w-[70px] bg-gradient-to-l from-transparent to-sky-300 lg:w-[110px]" aria-hidden="true" />
        </div>

        {/* ══ Clinic cards — 3 columns ══ */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
              viewport={{ once: true, margin: '-60px' }}
              className="flex h-full flex-col rounded-[20px] border border-sky-100 bg-white p-6 shadow-[0_4px_16px_rgba(11,35,71,0.05)] lg:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            >
              {/* Name + address */}
              <div className="flex items-start gap-3.5">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: loc.pinBg }}
                  aria-hidden="true"
                >
                  <MapPin className="h-[18px] w-[18px]" style={{ color: loc.pin }} strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] text-[#0B2347] uppercase dark:text-white">
                    {loc.name}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-[1.5] text-slate-500 dark:text-slate-400">
                    {loc.address}
                  </p>
                </div>
              </div>

              {/* Map */}
              <div className="mt-6 h-[150px] w-full overflow-hidden rounded-[13px] border border-sky-100 lg:h-[156px] dark:border-slate-800">
                <iframe
                  title={`${loc.name} map`}
                  src={loc.mapEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                  allowFullScreen
                />
              </div>

              {/* Call clinic */}
              <a
                href="tel:9878182115"
                className="mt-4 inline-flex h-[40px] w-fit items-center gap-2 rounded-full border border-[#1683FF] bg-white px-6 text-[12px] font-semibold tracking-[0.14em] text-[#1683FF] uppercase transition-colors duration-300 hover:bg-[#1683FF] hover:text-white dark:bg-slate-900 dark:text-sky-400 dark:hover:bg-sky-500 dark:hover:text-white"
              >
                <Phone className="h-[15px] w-[15px]" strokeWidth={2.2} />
                Call Clinic
              </a>
            </motion.div>
          ))}
        </div>

        {/* ══ Bottom CTA ══ */}
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
            className="inline-flex h-[44px] items-center gap-2.5 rounded-full border border-[#1683FF] bg-white px-8 text-[12px] font-semibold tracking-[0.16em] text-[#1683FF] uppercase transition-colors duration-300 hover:bg-[#1683FF] hover:text-white dark:bg-slate-900 dark:text-sky-400 dark:hover:bg-sky-500 dark:hover:text-white"
          >
            View All Branches
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
