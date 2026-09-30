import { motion } from 'framer-motion'
import { MapPin, Sparkles, HeartHandshake, Users, Zap, Smile } from 'lucide-react'
import { brandImages } from '../../lib/cloudinary-images'

interface HeroSectionProps {
  onNavigate?: (page: 'home' | 'about' | 'services' | 'reviews' | 'team' | 'contact') => void
}

const benefits = [
  {
    icon: HeartHandshake,
    iconBg: 'bg-cyan-50 text-[#18C7D8] dark:bg-cyan-950/40 dark:text-cyan-400',
    title: 'Personalized Care',
    description: 'Customized treatment plans for your unique needs.',
  },
  {
    icon: Users,
    iconBg: 'bg-sky-50 text-[#087CF0] dark:bg-sky-950/40 dark:text-sky-400',
    title: 'Expert Team',
    description: 'Led by experienced and trusted physiotherapists.',
  },
  {
    icon: Zap,
    iconBg: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400',
    title: 'Faster Recovery',
    description: 'Get back to doing what you love, sooner.',
  },
  {
    icon: Smile,
    iconBg: 'bg-teal-50 text-[#20D4C4] dark:bg-teal-950/40 dark:text-teal-400',
    title: 'Better Quality of Life',
    description: 'Move freely. Feel stronger. Live healthier.',
  },
]

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#F4FAFF] pt-14 pb-16 lg:pt-20 lg:pb-20 dark:bg-slate-950">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-sky-200/40 via-cyan-100/30 to-transparent blur-3xl dark:from-sky-950/30 dark:via-slate-900/40" />
        <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-cyan-100/30 via-sky-100/20 to-transparent blur-3xl dark:from-cyan-950/20 dark:via-slate-900/30" />
      </div>

      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        {/* Hero Top Content: 2 Columns */}
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:gap-14">
          {/* LEFT COLUMN (~45-48%) */}
          <div className="flex flex-1 flex-col items-start text-left lg:max-w-[600px]">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-[#E8F4FD] px-4 py-1.5 shadow-sm dark:border-sky-800/60 dark:bg-sky-950/50"
            >
              <Sparkles className="h-4 w-4 text-[#087CF0] dark:text-sky-400" />
              <span className="text-xs font-semibold tracking-wide text-[#0B2347] dark:text-sky-200 sm:text-[13px]">
                Expert Physiotherapy &amp; Rehabilitation
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-[44px] font-extrabold tracking-tight text-[#0B2347] sm:text-[54px] lg:text-[62px] leading-[1.08] dark:text-white"
            >
              Where Recovery
              <br />
              Meets{' '}
              <span className="relative inline-block text-[#087CF0] dark:text-sky-400">
                Expertise
                {/* Thin cyan/blue decorative curved underline */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full text-[#18C7D8] dark:text-sky-400"
                  viewBox="0 0 250 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 11C65 3 185 3 247 11"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mt-7 text-base leading-[1.68] text-slate-600 sm:text-[17px] lg:max-w-[540px] dark:text-slate-300"
            >
              Expert physiotherapy led by{' '}
              <strong className="font-semibold text-[#087CF0] dark:text-sky-400">
                Dr. Sorabh &amp; Dr. Angad
              </strong>{' '}
              &amp; their dedicated team — helping you move better, heal faster, and live stronger.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-8 flex w-full flex-wrap items-center gap-5 sm:w-auto lg:mt-9"
            >
              <button
                type="button"
                onClick={() => onNavigate?.('contact')}
                className="group flex h-[58px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#087CF0] to-[#0284C7] px-8 text-base font-bold text-white shadow-[0_12px_30px_rgba(8,124,240,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#0770D8] hover:to-[#0275B1] hover:shadow-[0_16px_40px_rgba(8,124,240,0.45)] sm:w-[250px]"
              >
                <span>Book a Session</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('team')}
                className="flex h-[58px] w-full items-center justify-center rounded-full border border-slate-300 bg-white/80 px-8 text-base font-bold text-[#0B2347] shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-[#087CF0] sm:w-[195px] dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-400"
              >
                Meet the Team
              </button>
            </motion.div>

            {/* Locations */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[13px] lg:mt-9 dark:text-slate-400"
            >
              <MapPin className="h-4 w-4 shrink-0 text-[#087CF0] dark:text-sky-400" />
              <span>PATIALA · SAMANA · SANGRUR · NABHA</span>
            </motion.div>
          </div>

          {/* RIGHT COLUMN (~52-55% - Team Image with Healthcare Glow) */}
          <div className="relative flex flex-1 items-center justify-center lg:justify-end">
            {/* Subtle Abstract Healthcare Glow & Decor */}
            <div className="absolute -inset-4 -z-10 flex items-center justify-center">
              <div className="h-[460px] w-[460px] rounded-full bg-gradient-to-tr from-cyan-200/50 via-sky-200/40 to-blue-200/30 blur-3xl dark:from-cyan-900/30 dark:via-sky-900/25 dark:to-blue-950/20" />
            </div>

            {/* Minimal Medical Cross / Plus Accents */}
            <div className="pointer-events-none absolute top-4 right-10 -z-5 text-2xl font-light text-cyan-400/60 select-none">
              +
            </div>
            <div className="pointer-events-none absolute bottom-12 left-6 -z-5 text-xl font-light text-sky-400/50 select-none">
              +
            </div>
            <div className="pointer-events-none absolute top-1/2 left-2 -z-5 h-20 w-20 rounded-full border border-cyan-200/50 dark:border-cyan-800/30" />

            {/* 3-Doctor Team Image (Provided Exact Image) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-[660px]"
            >
              <img
                src={brandImages.teamHero}
                alt="KYNA Physiotherapy Team — Dr. Sorabh, Dr. Angad & Team"
                className="h-auto w-full object-contain drop-shadow-[0_20px_35px_rgba(11,35,71,0.12)]"
              />
            </motion.div>
          </div>
        </div>

        {/* BENEFITS SECTION: 4 Equal Columns in Rounded Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
          className="mt-12 lg:mt-14"
        >
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(11,35,71,0.06)] lg:p-7 dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {benefits.map((item) => {
                const IconComponent = item.icon
                return (
                  <div key={item.title} className="flex flex-col items-start text-left">
                    <div className="mb-3 flex items-center gap-3.5">
                      <div
                        className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl ${item.iconBg}`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-[#0B2347] dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
