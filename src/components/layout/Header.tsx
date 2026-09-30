import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { brandImages } from '../../lib/cloudinary-images'
import { useModalScrollLock } from '../../lib/useModalScrollLock'

const navItems = ['Home', 'About Us', 'Services', 'Reviews', 'Our Team', 'Contact'] as const

type PageLabel = 'home' | 'about' | 'services' | 'reviews' | 'team' | 'contact'

const labelToPage: Record<(typeof navItems)[number], PageLabel> = {
  Home: 'home',
  'About Us': 'about',
  Services: 'services',
  Reviews: 'reviews',
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const wasOpen = useRef(false)

  // The page must not glide behind the drawer — Lenis drives window scroll
  // directly, so plain `overflow: hidden` is not enough on its own.
  useModalScrollLock(mobileOpen)

  // Move focus in on open, hand it back to the toggle on close.
  useEffect(() => {
    if (mobileOpen) {
      wasOpen.current = true
      const first = panelRef.current?.querySelector<HTMLElement>('button')
      first?.focus()
      return
    }
    if (wasOpen.current) {
      wasOpen.current = false
      toggleRef.current?.focus()
    }
  }, [mobileOpen])

  const onPanelKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setMobileOpen(false)
      return
    }
    if (event.key !== 'Tab') return

    // Keep Tab inside the drawer so it never wanders into the dimmed page.
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    )
    if (!focusables || focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }, [])

  return (
    <>
      {/* Sits above the drawer backdrop (z-55) so the logo, theme toggle and
          close button stay crisp and clickable while the drawer is open. */}
      <header className="fixed inset-x-0 top-0 z-[60] h-[74px] border-b border-slate-100/90 bg-white/95 text-slate-800 shadow-[0_2px_15px_rgba(0,0,0,0.03)] backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95 dark:text-slate-100">
        <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between px-6 lg:px-10">
          {/* Logo on far left + any accompanying brand text, side-by-side & vertically centered */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              aria-label="Go to home page"
              className="group relative flex h-12 w-40 shrink-0 items-center overflow-hidden focus:outline-none"
            >
              <img
                src={brandImages.logoHeader}
                alt="KYNA Physiotherapy & Rehabilitation"
                className="absolute left-0 top-1/2 h-36 w-auto -translate-y-1/2 object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </button>
          </div>

          {/* Navigation in center/right */}
          <nav className="hidden items-center gap-8 text-[15px] font-medium text-slate-700 dark:text-slate-200 md:flex lg:gap-10">
            {navItems.map((label) => {
              const page = labelToPage[label]
              const isActive = currentPage === page
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onNavigate(page)}
                  className={`relative min-h-11 py-2 transition-colors duration-200 ${
                    isActive
                      ? 'font-semibold text-[#087CF0] dark:text-sky-400'
                      : 'hover:text-[#087CF0] dark:hover:text-sky-400'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="pointer-events-none absolute -bottom-[19px] left-0 h-[3px] w-full rounded-full bg-[#087CF0] dark:bg-sky-400 shadow-[0_2px_8px_rgba(8,124,240,0.4)]" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right side: Theme toggle pill & Mobile hamburger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="relative flex h-11 w-[62px] items-center rounded-full border border-slate-200 bg-slate-100/90 px-1 text-slate-600 shadow-inner transition hover:border-[#087CF0]/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition-transform duration-300 dark:bg-slate-900 dark:text-yellow-400 ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                }`}
              >
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true" fill="currentColor">
                    <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                    <path
                      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              className="inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-[#087CF0] hover:text-[#087CF0] dark:border-slate-700 dark:text-slate-200 md:hidden"
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <>
                  <span className="block h-[2px] w-5 bg-current rounded-full" />
                  <span className="block h-[2px] w-5 bg-current rounded-full" />
                  <span className="block h-[2px] w-5 bg-current rounded-full" />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — a real dialog: fills to the bottom of the viewport,
          locks the page behind it, and takes focus while it is open. */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[55] md:hidden">
          {/* Click-away layer. Not focusable — Escape and the header's close
              button are the accessible ways out. */}
          <div
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
          />

          <div
            id="mobile-drawer"
            ref={panelRef}
            role="dialog"
            aria-label="Site menu"
            data-lenis-prevent
            onKeyDown={onPanelKeyDown}
            className="absolute inset-x-0 top-[74px] bottom-0 flex flex-col bg-white shadow-[0_-8px_40px_rgba(11,35,71,0.18)] dark:bg-slate-900 dark:shadow-[0_-8px_40px_rgba(0,0,0,0.55)]"
          >
            <nav className="flex-1 overflow-y-auto overscroll-contain px-6 pt-5 pb-4">
              <div className="flex flex-col gap-1.5">
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
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex min-h-12 w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] font-semibold transition ${
                        isActive
                          ? 'bg-sky-50 text-[#087CF0] dark:bg-sky-950/40 dark:text-sky-400'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{label}</span>
                      {isActive && <span className="h-2 w-2 rounded-full bg-[#087CF0]" />}
                    </button>
                  )
                })}
              </div>
            </nav>

            {/* Pinned footer — never scrolls away, and clears the iOS home
                indicator so the button is never sat under the gesture bar. */}
            <div className="shrink-0 border-t border-slate-100 px-6 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onNavigate('contact')
                  setMobileOpen(false)
                }}
                className="w-full rounded-full bg-gradient-to-r from-[#087CF0] to-[#0284C7] py-3.5 text-center text-sm font-bold text-white shadow-md shadow-[#087CF0]/25"
              >
                Book a Session →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

