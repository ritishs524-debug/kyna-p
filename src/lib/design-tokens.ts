/**
 * Shared design language for KYNA Physiotherapy.
 *
 * The Home page is the single source of truth. Every token below was measured
 * from Home (HeroSection, TrustSection, AboutSection, ServicesSection,
 * FinalCtaSection, Header) — nothing here is invented.
 *
 * Every page imports these instead of re-declaring colours, radii, type and
 * shadow recipes, so a change here propagates site-wide.
 */

/* ── Colour ───────────────────────────────────────────────────────────── */
export const color = {
  /** Headings / strong copy */
  navy: '#0B2347',
  /** Primary accent — hero CTAs, active nav, buttons. Home's real value. */
  blue: '#087CF0',
  /** Secondary blue used for eyebrow text (design-tokens original). */
  blueAlt: '#1683FF',
  /** Dark end of the primary button gradient */
  blueDeep: '#0284C7',
  /** Secondary accent — bullets, dots, soft highlights */
  cyan: '#18C7D8',
  /** Tertiary accent — specialty tags */
  teal: '#00C9A7',
  /** Quaternary accent */
  coral: '#FF6B4A',
  /** Muted body copy */
  muted: 'text-slate-500',
  mutedDark: 'dark:text-slate-400',
} as const

/* ── Containers ───────────────────────────────────────────────────────
 * Home uses ONE container width. Every section used to declare its own
 * (1360 / 1160 / 6xl) which made pages visibly jump. These are the only
 * two allowed; `wide` is for page heroes, `content` for inner sections.
 */
export const container = {
  /** Page hero + full-bleed sections — matches Header and Home hero. */
  wide: 'mx-auto max-w-[1360px] px-6 lg:px-10',
  /** Inner content sections. */
  content: 'mx-auto max-w-[1160px] px-6 lg:px-8',
} as const

/* ── Section shells ───────────────────────────────────────────────────── */
export const sectionLight = 'relative overflow-hidden bg-white'
/** Very light blue band (used to break up long white pages). */
export const sectionTint = 'relative overflow-hidden bg-[#F2F9FF]'
/** Standard inner wrapper. */
export const sectionWrap = container.content
/** Standard vertical rhythm — the rhythm every Home section uses. */
export const sectionPad = 'py-16 lg:py-20'

/* ── Vertical rhythm ───────────────────────────────────────────────────
 * One spacing scale for the whole site. Sections previously shipped five
 * different paddings (56 / 64 / 80 / 96 / 120px), so the whitespace between
 * them swung between 144px and 269px. Everything now uses these three:
 *
 *   hero     — page hero, once per page
 *   section  — every content section. Its bottom (96) plus the next
 *              section's top (80) gives a constant 176px between blocks at
 *              desktop and 128px on mobile.
 *   cta      — the closing block; same bottom rhythm as a section
 */
export const rhythm = {
  hero: 'pt-14 pb-16 lg:pt-20 lg:pb-20',
  section: 'py-16 lg:py-20',
  cta: 'pb-16 lg:pb-24',
} as const

/* ── Section heading block (centred) ──────────────────────────────────── */
export const eyebrow = 'text-[13px] font-semibold tracking-[0.28em] uppercase'
export const heading = 'mt-4 text-[30px] leading-[1.15] font-bold tracking-tight sm:text-[38px] lg:text-[42px]'
export const subheading = 'mx-auto mt-5 max-w-[820px] text-[15px] leading-[1.75] sm:text-[16px]'

/* ── Cards ────────────────────────────────────────────────────────────── */
export const card = 'rounded-[18px] border border-sky-100 bg-white'
export const cardShadow = 'shadow-[0_6px_22px_rgba(11,35,71,0.04)]'
export const cardShadowHover = 'hover:shadow-[0_18px_44px_rgba(11,35,71,0.10)]'
/** Large feature card (specialists / CTA). */
export const cardFeature =
  'rounded-[26px] border border-sky-100 bg-gradient-to-r from-[#EAF4FE] via-[#F4FAFF] to-[#EAF4FE] shadow-[0_6px_24px_rgba(11,35,71,0.04)]'

/** 20px variant used by the redesigned services carousel. */
export const cardCarousel =
  'rounded-[22px] border border-sky-100 bg-white shadow-[0_4px_18px_rgba(11,35,71,0.07)]'

/* ── Decoration ───────────────────────────────────────────────────────── */
/** Very subtle left-edge curve used on white sections. */
export const decoLeftCurve =
  'pointer-events-none absolute inset-y-0 -left-40 -z-10 w-[420px] rounded-full bg-sky-50 blur-3xl dark:bg-sky-950/25'
/** Soft blue wash used on tinted bands. */
export const decoWashTopLeft =
  'absolute -top-28 -left-24 h-[320px] w-[420px] rounded-full bg-sky-100/60 blur-3xl dark:bg-sky-950/25'
export const decoWashBottomRight =
  'absolute -right-24 -bottom-24 h-[320px] w-[420px] rounded-full bg-sky-100/50 blur-3xl dark:bg-sky-950/20'

/* ── Dark-mode counterparts (theme toggle still works everywhere) ────── */
export const dark = {
  sectionLight: 'dark:bg-slate-950 dark:text-slate-50',
  sectionTint: 'dark:bg-slate-950',
  wrap: '',
  card: 'dark:border-slate-800 dark:bg-slate-900',
  cardShadow: 'dark:shadow-[0_6px_22px_rgba(0,0,0,0.3)]',
  cardFeature: 'dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900',
  heading: 'dark:text-white',
  subheading: 'dark:text-slate-400',
  eyebrow: 'dark:text-sky-400',
} as const

/* ── Buttons ────────────────────────────────────────────────────────────
 * Two recipes only:
 *   btnPrimary — filled brand gradient (Home's hero button)
 *   btnGhost   — outlined (Home's secondary)
 * The old `btnPrimary` exported here was uppercase/letter-spaced; Home's
 * real buttons are sentence-case and bold. Both variants are kept so
 * existing Home sections keep working untouched.
 */

/** Home's hero-style filled button. */
export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#087CF0] to-[#0284C7] px-8 font-bold text-white shadow-[0_12px_30px_rgba(8,124,240,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#0770D8] hover:to-[#0275B1] hover:shadow-[0_16px_40px_rgba(8,124,240,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087CF0]'

/** Home's outlined secondary button. */
export const btnOutline =
  'inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-8 font-bold text-[#0B2347] shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:text-[#087CF0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087CF0] dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-400'

/** Small uppercase pill — the button pair inside the shared CTA card. */
export const btnPrimaryLegacy =
  'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#1683FF] to-[#0284C7] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_30px_rgba(22,131,255,0.28)] transition hover:-translate-y-0.5'
export const btnGhost =
  'inline-flex items-center justify-center rounded-full border border-slate-200 bg-white font-semibold uppercase tracking-[0.2em] text-[#0B2347] transition hover:-translate-y-0.5 hover:border-[#1683FF]/50 hover:text-[#1683FF] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

/** Standard button heights, straight from Home. */
export const btnHeight = 'h-[52px] lg:h-[58px]'

/* ── Motion ────────────────────────────────────────────────────────────
 * One shared easing curve + the reveal distances Home already uses.
 * Reveal is the only sanctioned scroll animation; it fades and lifts 16–28px
 * over 0.55s, staggered 0.07s, once.
 */
export const motion = {
  ease: [0.22, 1, 0.36, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
  /** fade-up entry for a section heading block */
  fadeUp: { initial: { opacity: 0, y: 20 }, while: { opacity: 1, y: 0 } },
  duration: 0.55,
  stagger: 0.07,
  maxStagger: 0.08,
} as const

/* ── Misc ─────────────────────────────────────────────────────────────── */

/** Standard section header spacing (heading block → content). */
export const sectionHeaderGap = 'mt-12 lg:mt-16'

/** Shared focus ring for anything interactive. */
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087CF0]'

/**
 * Reserve room at the bottom of the page on small screens so the fixed chat
 * bubble never sits on top of the last CTA or form field.
 */
export const chatSafeBottom = 'pb-24 md:pb-4'
