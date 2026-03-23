import './index.css'
import { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { PageLoader } from './components/common/PageLoader'

type Theme = 'light' | 'dark'

export type Page = 'home' | 'about' | 'services' | 'reviews' | 'team' | 'contact'

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const AboutUs = lazy(() => import('./pages/AboutUs').then((m) => ({ default: m.AboutUs })))
const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })))
const Team = lazy(() => import('./pages/Team').then((m) => ({ default: m.Team })))
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))
const Reviews = lazy(() => import('./pages/Reviews').then((m) => ({ default: m.Reviews })))
const Admin = lazy(() => import('./pages/Admin').then((m) => ({ default: m.Admin })))
const ChatbotWidget = lazy(() =>
  import('./components/common/ChatbotWidget').then((m) => ({ default: m.ChatbotWidget })),
)

// Map routes to page names
const routeToPage: Record<string, Page> = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/reviews': 'reviews',
  '/team': 'team',
  '/contact': 'contact',
}

// Map page names to routes
export const pageToRoute: Record<Page, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  reviews: '/reviews',
  team: '/team',
  contact: '/contact',
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const stored = window.localStorage.getItem('theme') as Theme | null
  if (stored === 'light' || stored === 'dark') return stored

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const location = useLocation()
  const navigate = useNavigate()

  // Derive current page from URL
  const currentPage: Page = routeToPage[location.pathname] || 'home'

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

  const handleNavigate = (page: Page) => {
    const route = pageToRoute[page]
    navigate(route)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const isAdmin = location.pathname.startsWith('/admin')

  // Admin gets its own standalone layout — no header, footer, or chatbot
  if (isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <main className="pt-18">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home onNavigate={handleNavigate} />} />
            <Route path="/about" element={<AboutUs onNavigate={handleNavigate} />} />
            <Route path="/services" element={<Services />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            {/* Fallback route - redirect to home */}
            <Route path="*" element={<Home onNavigate={handleNavigate} />} />
          </Routes>
        </Suspense>
      </main>
      <Footer onNavigate={handleNavigate} />
      <Suspense fallback={null}>
        <ChatbotWidget />
      </Suspense>
    </div>
  )
}

export default App
