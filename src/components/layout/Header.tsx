import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import kynaLogo from '../../assets/logo/kyna_withoutbg-01.PNG'

const navItems = ['Home', 'About Us', 'Services', 'Our Team', 'Contact'] as const

type PageLabel = 'home' | 'about' | 'services' | 'team' | 'contact'

const labelToPage: Record<(typeof navItems)[number], PageLabel> = {
  Home: 'home',
  'About Us': 'about',
  Services: 'services',
  'Our Team': 'team',
  Contact: 'contact',
}

type HeaderProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  currentPage: PageLabel
  onNavigate: (page: PageLabel) => void
}

export function Header({ theme, onToggleTheme, currentPage, onNavigate }: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const header = headerRef.current
      if (!header) return

      gsap.from(header.querySelectorAll('[data-nav-item]'), {
        opacity: 0,
        y: -12,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      })

      gsap.to(header, {
        backgroundColor: 'rgba(10,19,35,0.95)',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 18px 55px rgba(2,6,23,0.7)',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, headerRef)

    return () => ctx.revert()
  }, [])

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-900/50 bg-gradient-to-r from-[#0b1220]/95 via-[#0e1c34]/95 to-[#0b1220]/95 text-slate-50 shadow-[0_18px_55px_rgba(2,6,23,0.7)] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            aria-label="Go to home page"
            className="relative flex h-[3.5rem] w-[8rem] items-center focus:outline-none"
          >
            <img
	              src={kynaLogo}
              alt="KYNA Physiotherapy — Intelligent Rehab Clinics"
              className="absolute left-0 top-1/2 h-[10rem] w-auto -translate-y-1/2 object-contain"
            />
          </button>
          <div className="hidden sm:block"></div>
        </div>

        <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 md:flex">
          {navItems.map((label) => {
            const page = labelToPage[label]
            const isActive = currentPage === page
            return (
              <button
                key={label}
                type="button"
                data-nav-item
                onClick={() => onNavigate(page)}
                className={`relative transition-colors ${
                  isActive ? 'text-sky-300' : 'hover:text-sky-300'
                }`}
              >
                {label}
                {isActive && (
                  <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-[#4b55ad] to-sky-400" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-700/70 p-2 text-slate-200 transition hover:border-sky-500/60 hover:text-sky-300 md:hidden"
          >
            <span className="block h-[2px] w-5 bg-current"></span>
            <span className="block h-[2px] w-5 bg-current"></span>
            <span className="block h-[2px] w-5 bg-current"></span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative flex h-8 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-1 text-[0.6rem] font-semibold tracking-[0.18em] text-slate-400 shadow-sm transition hover:border-sky-400 hover:text-sky-200"
          >
            <span
              className={`absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-900 shadow-md ring-1 ring-white/10 transition-transform duration-300 ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
              }`}
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" fill="currentColor" />
                  <path
                    d="M12 3v2.5M12 18.5V21M4.22 4.22l1.77 1.77M17.9 17.9l1.88 1.88M3 12h2.5M18.5 12H21M4.22 19.78l1.77-1.77M17.9 6.1l1.88-1.88"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                  <path
                    d="M21 12.79A9 9 0 0111.21 3 7 7 0 1019 14.79 9.05 9.05 0 0121 12.79z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden absolute inset-x-0 top-full border-t border-slate-800/60 bg-gradient-to-b from-[#0b1220]/98 via-[#10223b]/98 to-[#0b1220]/98 px-4 py-5 lg:px-6 shadow-[0_18px_55px_rgba(2,6,23,0.85)]">
          <nav className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
            {navItems.map((label) => {
              const page = labelToPage[label]
              const isActive = currentPage === page
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    onNavigate(page)
                    setMobileOpen(false)
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-left transition hover:border-sky-500/60 hover:text-sky-300 ${
                    isActive ? 'border-sky-500/80 text-sky-300' : 'border-slate-700/70'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="tel:9878182115"
              className="flex-1 rounded-full border border-slate-700/70 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-200 transition hover:border-sky-500/60 hover:text-sky-300"
            >
              Call 98781 82115
            </a>
            <button
              type="button"
              className="flex-1 rounded-full bg-gradient-to-r from-[#4b55ad] to-sky-500 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-sky-500/30"
            >
              Free Consultation
            </button>
          </div>
        </div>
      )}

    </header>
  )
}

