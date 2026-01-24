import './index.css'
import { Suspense, lazy, useEffect, useState } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { PageLoader } from './components/common/PageLoader'
import { ChatbotWidget } from './components/common/ChatbotWidget'

type Theme = 'light' | 'dark'

type Page = 'home' | 'about' | 'services' | 'reviews' | 'team' | 'contact'

	const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
		const AboutUs = lazy(() => import('./pages/AboutUs').then((m) => ({ default: m.AboutUs })))
	const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })))
	const Team = lazy(() => import('./pages/Team').then((m) => ({ default: m.Team })))
	const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))
		const Reviews = lazy(() => import('./pages/Reviews').then((m) => ({ default: m.Reviews })))

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
		    if (
		      stored === 'home' ||
		      stored === 'about' ||
		      stored === 'services' ||
		      stored === 'reviews' ||
		      stored === 'team' ||
		      stored === 'contact'
		    ) {
	      return stored
	    }

	    return 'home'
	  })

	  useEffect(() => {
	    if (typeof window === 'undefined') return
	    window.localStorage.setItem('currentPage', currentPage)
	  }, [currentPage])

	  return (
	    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
			      <main className="pt-18">
			        <Suspense fallback={<PageLoader />}>
          {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
			          {currentPage === 'about' && <AboutUs onNavigate={setCurrentPage} />}
			          {currentPage === 'services' && <Services />}
				          {currentPage === 'reviews' && <Reviews />}
			          {currentPage === 'team' && <Team />}
			          {currentPage === 'contact' && <Contact />}
			        </Suspense>
			      </main>
	      <Footer onNavigate={setCurrentPage} />
	      <ChatbotWidget />
    </div>
  )
}

export default App
