import './index.css'
import { Suspense, lazy, useEffect, useState } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { PageLoader } from './components/common/PageLoader'

type Theme = 'light' | 'dark'

type Page = 'home' | 'about' | 'services' | 'team' | 'contact'

const Home = lazy(() => import('./pages/Home.tsx').then((m) => ({ default: m.Home })))
const AboutUs = lazy(() => import('./pages/AboutUs.tsx').then((m) => ({ default: m.AboutUs })))
const Services = lazy(() => import('./pages/Services.tsx').then((m) => ({ default: m.Services })))
const Team = lazy(() => import('./pages/Team.tsx').then((m) => ({ default: m.Team })))
const Contact = lazy(() => import('./pages/Contact.tsx').then((m) => ({ default: m.Contact })))

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const stored = window.localStorage.getItem('theme') as Theme | null
  if (stored === 'light' || stored === 'dark') return stored

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function App() {
	  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    window.localStorage.setItem('theme', theme)
  }, [theme])

	  const toggleTheme = () => {
	    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
	  }

	  const [currentPage, setCurrentPage] = useState<Page>(() => {
	    if (typeof window === 'undefined') return 'home'

	    const stored = window.localStorage.getItem('currentPage') as Page | null
	    if (stored === 'home' || stored === 'about' || stored === 'services' || stored === 'team' || stored === 'contact') {
	      return stored
	    }

	    return 'home'
	  })

	  useEffect(() => {
	    if (typeof window === 'undefined') return
	    window.localStorage.setItem('currentPage', currentPage)
	  }, [currentPage])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
	      <main className="pt-18">
	        <Suspense fallback={<PageLoader />}>
	          {currentPage === 'home' && <Home />}
	          {currentPage === 'about' && <AboutUs />}
	          {currentPage === 'services' && <Services />}
	          {currentPage === 'team' && <Team />}
	          {currentPage === 'contact' && <Contact />}
	        </Suspense>
	      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  )
}

export default App
