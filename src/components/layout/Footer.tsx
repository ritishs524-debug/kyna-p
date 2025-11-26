type FooterProps = {
  onNavigate: (page: 'home' | 'about' | 'services' | 'team' | 'contact') => void
}

const serviceLinks = [
  { label: 'Physiotherapy Offers', targetId: 'physiotherapy' },
  { label: 'Osteopathy (Cranial and Visceral)', targetId: 'osteopathy' },
  { label: 'Chiropractic', targetId: 'chiropractic' },
  { label: 'Exercise Therapy', targetId: 'exercise-therapy' },
  { label: 'Manual Physical Therapy', targetId: 'manual-therapy' },
  { label: "Women's Health Physiotherapy", targetId: 'womens-health' },
  { label: 'Pelvic Floor Rehabilitation', targetId: 'pelvic-floor' },
  { label: 'Evidence-Based Falls Prevention', targetId: 'falls-prevention' },
  { label: 'Physiotherapy at Home', targetId: 'home-physiotherapy' },
  { label: 'Antenatal / Childbirth Education', targetId: 'antenatal-education' },
] as const

export function Footer({ onNavigate }: FooterProps) {
  const handleServiceClick = (serviceId: (typeof serviceLinks)[number]['targetId']) => {
    onNavigate('services')

    setTimeout(() => {
      const element = document.getElementById('service-' + serviceId)
      if (!element) return

      const headerOffset = 96
      const rect = element.getBoundingClientRect()
      const offsetTop = rect.top + window.scrollY - headerOffset

      window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    }, 0)
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 lg:flex-row lg:justify-between lg:px-6">
        <div className="max-w-md space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sky-700 dark:bg-slate-900 dark:text-sky-300">
            KYNA
            <span className="h-1 w-1 rounded-full bg-sky-500 dark:bg-sky-400" />
            Intelligent Rehab
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            KYNA is a sovereign group, successfully operating physiotherapy clinics, pledged
            to provide an unforgettable experience of wellbeing by addressing problems
            related to all the systems of the human body and emphasising general wellbeing.
          </p>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Phone:{' '}
            <a
              href="tel:9878182115"
              className="font-semibold text-slate-900 hover:text-sky-700 dark:text-slate-200 dark:hover:text-sky-300"
            >
              98781 82115
            </a>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-8 text-sm text-slate-700 lg:flex-row lg:justify-end dark:text-slate-300">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Services
            </h3>
            <ul className="space-y-1 text-xs">
              {serviceLinks.map((item) => (
                <li key={item.targetId}>
                  <button
                    type="button"
                    onClick={() => handleServiceClick(item.targetId)}
                    className="text-left text-slate-700 underline-offset-2 hover:text-sky-700 hover:underline dark:text-slate-300 dark:hover:text-sky-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Our Branches
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-200">Patiala</div>
                <p className="text-slate-600 dark:text-slate-400">SCF-34, DLF Colony, Patiala</p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-200">Anamiva Physiotherapy</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Sco 7-8, behind moti Palace, Malwa Colony, Rose Avenue, New Officers Colony, Patiala, Punjab 147001
                </p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-200">Samana</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Krishna Basti, Opp Jain Terapanthi Sabha, Near Ganpati Jewellers, Samana
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900/60 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-[0.7rem] text-slate-400 sm:flex-row lg:px-6">
          <span>
            © {new Date().getFullYear()} KYNA Physiotherapy. All rights reserved.
          </span>
          <span className="text-slate-500">
            Privacy Policy • Website made by Ritish Sharma —
            <a
              href="https://portfolio-app-frontend.onrender.com/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-slate-300"
            >
              Contact
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

