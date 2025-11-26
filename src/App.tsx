import './index.css'
import { useEffect, useState } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { AboutUs } from './pages/AboutUs'
import { Services } from './pages/Services'
import { Team } from './pages/Team'
import { Contact } from './pages/Contact'

type Theme = 'light' | 'dark'

type Page = 'home' | 'about' | 'services' | 'team' | 'contact'

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
        {currentPage === 'home' && <Home />}
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'services' && <Services />}
        {currentPage === 'team' && <Team />}
        {currentPage === 'contact' && <Contact />}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  )
}

export default App
