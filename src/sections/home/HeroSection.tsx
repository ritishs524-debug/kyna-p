import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import drSorabhImg from '../../assets/logo/drsorabh.png'
import { GridGlowBackground } from '../../components/ui/grid-glow-background'

interface HeroSectionProps {
  onNavigate?: (page: 'home' | 'about' | 'services' | 'reviews' | 'team' | 'contact') => void
}

const T = {
  slate950: '#020617', slate900: '#0f172a',
  slate700: '#334155', slate500: '#64748b', slate400: '#94a3b8',
  slate300: '#cbd5e1', slate50: '#f8fafc',
  sky400: '#38bdf8', sky500: '#0ea5e9', sky300: '#7dd3fc',
  indigo: '#4b55ad',
  fontD: "'Playfair Display', Georgia, serif",
  fontB: "'DM Sans', system-ui, sans-serif",
} as const

const KF_ID = 'kyna-hero-kf'
function injectKF() {
  if (typeof document === 'undefined' || document.getElementById(KF_ID)) return
  const s = document.createElement('style')
  s.id = KF_ID
  s.textContent = `
@keyframes kf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes kf-glow{0%,100%{transform:scale(1);opacity:.45}50%{transform:scale(1.06);opacity:.8}}
@keyframes kf-sweep{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}
@keyframes kf-border{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes kf-pulse{0%,100%{box-shadow:0 0 0 0 rgba(56,189,248,.35)}50%{box-shadow:0 0 0 14px rgba(56,189,248,0)}}
  `
  document.head.appendChild(s)
}


/* ─── Framer Motion Variants ─── */
const headlineWords = 'Where Recovery Meets Expertise'.split(' ')
const wordContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.8 } } }
const wordChild = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } }

const doctorSpring = { type: 'spring' as const, stiffness: 120, damping: 14 }

/* ─── Main Component ─── */
export function HeroSection({ onNavigate }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [, setReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    injectKF(); setReady(true)
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const floatWrap = (delay: number): React.CSSProperties => ({
    animation: `kf-float 3.2s ease-in-out ${delay}s infinite`,
  })

  const s = {
    section: {
      minHeight: '100vh', position: 'relative' as const,
      overflow: 'hidden', fontFamily: T.fontB, color: T.slate50,
      display: 'flex', flexDirection: 'column' as const,
    },
    content: {
      position: 'relative' as const, zIndex: 10, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '70px 20px 20px' : '0 24px 0',
      maxWidth: 1100, margin: '0 auto', width: '100%',
      height: '100%',
      pointerEvents: 'none' as const,
      gap: isMobile ? 8 : 40,
      flexWrap: 'wrap' as const,
      flexDirection: isMobile ? 'column' as const : 'row' as const,
    },
    leftCol: {
      flex: isMobile ? '1 1 auto' : '1 1 480px', display: 'flex', flexDirection: 'column' as const,
      alignItems: isMobile ? 'center' as const : 'flex-start' as const,
      justifyContent: 'center',
    },
    rightCol: {
      flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...(isMobile ? { width: '100%', marginTop: -10 } : {}),
    },
    headline: {
      fontFamily: T.fontD, fontSize: isMobile ? 'clamp(26px, 7vw, 38px)' : 'clamp(28px, 5vw, 56px)', fontWeight: 600,
      lineHeight: 1.15, textAlign: isMobile ? 'center' as const : 'left' as const, marginBottom: isMobile ? 12 : 16,
      color: T.slate50, display: 'flex', flexWrap: 'wrap' as const,
      justifyContent: isMobile ? 'center' : 'flex-start', gap: '0 10px',
    },
    subtext: {
      fontFamily: T.fontB, fontSize: isMobile ? 14 : 16, lineHeight: 1.7,
      color: T.slate400, textAlign: isMobile ? 'center' as const : 'left' as const, maxWidth: 520, marginBottom: isMobile ? 24 : 36,
    },
  }

  return (
    <section ref={sectionRef} style={s.section} aria-label="KYNA Physiotherapy Hero">
      {/* Grid Glow Background */}
      <GridGlowBackground
        backgroundColor={T.slate950}
        gridColor="rgba(255, 255, 255, 0.03)"
        glowColors={[T.indigo, T.sky500, '#4b55ad']}
        glowCount={8}
      >
        <div style={s.content}>
          {/* LEFT — Text content */}
          <div style={s.leftCol}>
            {/* Headline word by word */}
            <motion.h1 style={s.headline} variants={wordContainer} initial="hidden" animate="visible">
              {headlineWords.map((word, i) => (
                <motion.span key={i} variants={wordChild} style={word === 'Expertise' ? { color: T.sky400 } : {}}>
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtext */}
            <motion.p style={s.subtext}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.4, ease: 'easeOut' }}>
              Expert physiotherapy led by <span style={{ color: T.sky300, fontWeight: 600 }}>Dr. Sorabh</span> &amp; <span style={{ color: T.sky300, fontWeight: 600 }}>Dr. Angad</span> &amp; their dedicated team — helping you move better, heal faster, and live stronger.
            </motion.p>

            {/* CTA buttons */}
            <motion.div style={{ display: 'flex', gap: isMobile ? 12 : 16, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start', pointerEvents: 'auto', width: isMobile ? '100%' : 'auto' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}>
              <button type="button" aria-label="Book a session with KYNA Physiotherapy"
                onClick={() => onNavigate?.('contact')}
                style={{
                  position: 'relative', padding: isMobile ? '12px 28px' : '14px 36px', borderRadius: 999,
                  background: `linear-gradient(135deg, ${T.indigo}, ${T.sky500})`,
                  color: 'white', fontFamily: T.fontB, fontSize: isMobile ? 13 : 14, fontWeight: 700,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  border: 'none', cursor: 'pointer',
                  boxShadow: `0 12px 40px rgba(56,189,248,0.45)`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 18px 55px rgba(56,189,248,0.65)` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(56,189,248,0.45)` }}>
                Book a Session →
              </button>
              <button type="button" aria-label="Meet the KYNA physiotherapy team"
                onClick={() => onNavigate?.('team')}
                style={{
                  padding: isMobile ? '12px 28px' : '14px 36px', borderRadius: 999,
                  background: 'transparent',
                  color: T.slate300, fontFamily: T.fontB, fontSize: isMobile ? 13 : 14, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  border: `1.5px solid ${T.slate700}`, cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.sky400; e.currentTarget.style.color = T.sky300 }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.slate700; e.currentTarget.style.color = T.slate300 }}>
                Meet the Team
              </button>
            </motion.div>

            {/* Locations tag */}
            <motion.p style={{ fontFamily: T.fontB, fontSize: isMobile ? 10 : 11, fontWeight: 500, letterSpacing: '0.35em', color: T.slate500, textTransform: 'uppercase', marginTop: isMobile ? 20 : 32, textAlign: isMobile ? 'center' as const : 'left' as const }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
              Patiala · Samana · Sangrur · Nabha
            </motion.p>
          </div>

          {/* RIGHT — Dr. Sorabh logo */}
          <div style={s.rightCol}>
            <motion.div style={{ zIndex: 3, position: 'relative', ...floatWrap(0) }}
              initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }}
              transition={{ ...doctorSpring, delay: 0.3 }}>
              <img
                src={drSorabhImg}
                alt="Dr. Sorabh"
                style={{
                  width: isMobile ? 340 : 450,
                  height: 'auto',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                  filter: `drop-shadow(0 0 30px rgba(56,189,248,0.35))`,
                }}
              />
            </motion.div>
          </div>
        </div>
      </GridGlowBackground>
    </section>
  )
}
