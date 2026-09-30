import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const LiquidGlassCarousel = lazy(() =>
  import('../../components/ui/liquid-glass-carousel').then((m) => ({
    default: m.LiquidGlassCarousel,
  })),
)

type Engine = { next: () => void; previous: () => void }

/**
 * Probed once. When it's false we never import `three` at all — the visitor
 * gets a plain, fully keyboard-accessible grid instead of a dead canvas.
 */
function detectWebGL() {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** Panel aspect. Every image is cropped server-side to the same ratio. */
const PANEL_ASPECT = 4 / 5

const CROP_W = 720
const CROP_H = 900

/**
 * The rise-and-grow intro is a flourish, not navigation feedback. Replaying
 * five seconds of it every time someone returns to Home from another page
 * reads as lag, so it plays once per session.
 */
let introPlayed = false

/**
 * The rail draws each texture straight onto its plane, so an image whose ratio
 * doesn't match the panel would be squashed. Cloudinary crops to the panel's
 * exact ratio instead (`c_fill` + `g_auto` picks the interesting crop), which
 * keeps `object-fit: cover` semantics without a per-frame shader branch.
 */
function cropToPanel(url: string) {
  const marker = '/image/upload/'
  const at = url.indexOf(marker)
  if (at === -1) return url
  const tail = url.slice(at + marker.length)
  const slash = tail.indexOf('/')
  if (slash === -1) return url
  return (
    url.slice(0, at + marker.length) +
    `${tail.slice(0, slash)}/c_fill,g_auto,w_${CROP_W},h_${CROP_H}/${tail.slice(slash + 1)}`
  )
}

export type CarouselService = {
  id: string
  title: string
  description: string
  image: string
  icon: LucideIcon
  iconTone: string
  accent: string
}

type Props = {
  services: CarouselService[]
  /** Resolves the Services page anchor for a service. */
  onOpenService: (serviceId: string) => void
}

/**
 * Home's services rail — a WebGL "liquid glass" strip of the ten services.
 *
 * Three additions over the vendored carousel, all driven by props:
 *   • it is code-split and only mounted once the section is near the viewport,
 *     so `three` never lands in Home's critical path;
 *   • arrows and dots (the raw component is drag / wheel / keyboard only);
 *   • a caption carrying the active service's copy and its call to action.
 *
 * Without WebGL the whole rail is replaced by a static grid, so every service
 * stays reachable and `three` is never fetched.
 */
export function ServicesCarousel({ services, onOpenService }: Props) {
  const [webgl] = useState(detectWebGL)

  if (!webgl) {
    return <ServiceGrid services={services} onOpenService={onOpenService} />
  }

  return <ServiceRail services={services} onOpenService={onOpenService} />
}

function ServiceRail({ services, onOpenService }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const engineRef = useRef<Engine | null>(null)
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)
  const [settled, setSettled] = useState(false)
  const [focused, setFocused] = useState(false)
  const [dark, setDark] = useState(false)

  // Don't boot WebGL (or download three) until the section is nearly on screen.
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setInView(true)
        io.disconnect()
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // The WebGL clear colour is an inline value, so the theme has to be read.
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setDark(root.classList.contains('dark'))
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  const index =
    services.length === 0 ? 0 : ((active % services.length) + services.length) % services.length
  const current = services[index]
  const Icon = current?.icon
  // The engine locks input during the intro and while a panel is focused, so
  // the controls that drive the engine must visibly stand down in both states.
  const locked = !settled || focused

  /**
   * `items` must keep a stable identity: the carousel tears its WebGL engine
   * down and rebuilds it whenever this array changes, so a fresh array on every
   * render would restart the intro on every scroll tick.
   */
  const items = useMemo(
    () =>
      services.map((s) => ({
        src: cropToPanel(s.image),
        title: s.title,
        aspect: PANEL_ASPECT,
      })),
    [services],
  )

  /** The engine reports raw looping indices; fold them and skip no-op updates. */
  const handleActiveChange = useCallback(
    (raw: number) => {
      const folded = services.length === 0 ? 0 : ((raw % services.length) + services.length) % services.length
      setActive((prev) => (prev === folded ? prev : folded))
    },
    [services.length],
  )

  const step = (direction: 1 | -1) => {
    const engine = engineRef.current
    if (!engine) return
    if (direction === 1) engine.next()
    else engine.previous()
  }

  /**
   * `next()` is relative to the engine's current position, which is only
   * updated on the next frame — so queue the whole delta in one go.
   */
  const goTo = (target: number) => {
    const engine = engineRef.current
    if (!engine || services.length === 0) return
    const delta = (((target - index) % services.length) + services.length) % services.length
    for (let i = 0; i < delta; i++) engine.next()
  }

  return (
    <div ref={hostRef} className="relative">
      {/* Stage — reserves the layout box only; the canvas inside is
          transparent, so there is no panel behind the photos. The height lives
          here rather than on the carousel so the skeleton and the live stage
          occupy the same box and nothing shifts on mount. */}
      <div className="relative h-[460px] sm:h-[540px] lg:h-[620px]">
        {inView ? (
          <Suspense fallback={<StageSkeleton dark={dark} />}>
            <LiquidGlassCarousel
              items={items}
              panelHeight={420}
              gap={16}
              tone={dark ? 'dark' : 'light'}
              label="Services at KYNA Physiotherapy"
              showTitle={false}
              // No refraction lens and a transparent canvas: the photos sit
              // straight on the section instead of inside a tinted panel.
              refraction={false}
              transparent
              entry={!introPlayed}
              onActiveChange={handleActiveChange}
              onFocusChange={setFocused}
              onEntryDone={(done) => {
                setSettled(done)
                if (done) introPlayed = true
              }}
              onReady={(engine) => {
                engineRef.current = engine
              }}
            />
          </Suspense>
        ) : (
          <StageSkeleton dark={dark} />
        )}

        {/* Circular arrows — same recipe as the rest of the site */}
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={locked}
          aria-label="Previous services"
          className="absolute top-1/2 left-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white/90 text-[#0B2347] shadow-[0_8px_24px_rgba(11,35,71,0.14)] backdrop-blur-md transition hover:scale-105 hover:border-[#087CF0] hover:bg-[#087CF0] hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-0 sm:left-4 lg:left-6 lg:h-12 lg:w-12 dark:border-slate-700 dark:bg-slate-900/85 dark:text-white dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        >
          <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => step(1)}
          disabled={locked}
          aria-label="Next services"
          className="absolute top-1/2 right-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white/90 text-[#0B2347] shadow-[0_8px_24px_rgba(11,35,71,0.14)] backdrop-blur-md transition hover:scale-105 hover:border-[#087CF0] hover:bg-[#087CF0] hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-0 sm:right-4 lg:right-6 lg:h-12 lg:w-12 dark:border-slate-700 dark:bg-slate-900/85 dark:text-white dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        >
          <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>

      {/* Caption — the active service's copy and its call to action */}
      {current ? (
        <div
          data-carousel-caption
          className="mx-auto mt-8 flex max-w-[720px] flex-col items-center text-center lg:mt-10"
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full border border-sky-100 bg-white shadow-[0_8px_20px_rgba(11,35,71,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_8px_20px_rgba(0,0,0,0.5)] ${current.iconTone}`}
          >
            {Icon ? <Icon className="h-[22px] w-[22px]" aria-hidden="true" /> : null}
          </span>

          <h3 className="mt-4 text-[22px] leading-snug font-bold tracking-tight text-[#0B2347] sm:text-[26px] dark:text-white">
            {current.title}
          </h3>

          <p className="mt-2.5 max-w-[520px] text-[14.5px] leading-[1.65] text-slate-500 sm:text-[15px] dark:text-slate-400">
            {current.description}
          </p>

          <button
            type="button"
            onClick={() => onOpenService(current.id)}
            className="group mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#087CF0] transition-colors hover:text-[#0B2347] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087CF0] dark:text-sky-400 dark:hover:text-white"
          >
            View details
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </div>
      ) : null}

      {/* Pagination dots — the active page elongates into a pill */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-0.5 lg:mt-7">
        {services.map((service, i) => (
          <button
            key={service.id}
            type="button"
            onClick={() => goTo(i)}
            disabled={locked}
            aria-label={`Show ${service.title}`}
            aria-current={i === index}
            className="group flex h-11 min-w-6 items-center justify-center px-0.5 disabled:cursor-default"
          >
            <span
              className={`block h-2.5 rounded-full transition-all duration-400 ease-out ${
                i === index
                  ? 'w-9 bg-[#087CF0] shadow-[0_2px_8px_rgba(8,124,240,0.45)]'
                  : 'w-2.5 bg-slate-300 group-hover:w-5 group-hover:bg-slate-400 dark:bg-slate-700 dark:group-hover:bg-slate-500'
              }`}
            />
          </button>
        ))}
      </div>

      {/* The rail is a canvas, so every service also needs a real, focusable link
          for keyboard and screen-reader visitors. */}
      <ul className="sr-only">
        {services.map((service) => (
          <li key={service.id}>
            <button type="button" onClick={() => onOpenService(service.id)}>
              {service.title} — {service.description}
            </button>
          </li>
        ))}
      </ul>

      <p className="sr-only" aria-live="polite">
        {current?.title}
      </p>

      <p className="mt-4 text-center text-[12.5px] text-slate-400 dark:text-slate-500">
        Drag, scroll or use the arrow keys to browse · tap a service to focus it
      </p>
    </div>
  )
}

/**
 * Shown when WebGL is unavailable. Same ten services, same call to action, no
 * canvas — so nothing becomes unreachable and `three` is never downloaded.
 */
function ServiceGrid({ services, onOpenService }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const Icon = service.icon
        return (
          <li key={service.id}>
            <button
              type="button"
              onClick={() => onOpenService(service.id)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-sky-100 bg-white text-left shadow-[0_4px_18px_rgba(11,35,71,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-12px_rgba(11,35,71,0.22)] focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087CF0] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_4px_18px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)]"
            >
              <span className="relative block aspect-[4/5] w-full overflow-hidden">
                <img
                  src={cropToPanel(service.image)}
                  alt=""
                  loading="lazy"
                  width={CROP_W}
                  height={CROP_H}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <span
                  className={`absolute bottom-0 left-5 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full border-4 border-white shadow-[0_10px_24px_rgba(11,35,71,0.18)] dark:border-slate-900 ${service.iconTone}`}
                >
                  {Icon ? <Icon className="h-[22px] w-[22px]" aria-hidden="true" /> : null}
                </span>
              </span>

              <span className="block px-5 pt-8 pb-6">
                <span className="block text-[17px] leading-snug font-bold tracking-tight text-[#0B2347] dark:text-white">
                  {service.title}
                </span>
                <span className="mt-2.5 block text-[13.5px] leading-[1.6] text-slate-500 dark:text-slate-400">
                  {service.description}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function StageSkeleton({ dark }: { dark: boolean }) {
  return (
    <div aria-hidden="true" className="h-full w-full">
      <div className="flex h-full w-full items-center justify-center gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-[38%] w-[24%] animate-pulse rounded-[14px] ${
              dark ? 'bg-slate-800/60' : 'bg-slate-300/40'
            }`}
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
