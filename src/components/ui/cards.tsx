'use client'

import type { ReactNode } from 'react'
import { MapPin, Phone, Quote, Star } from 'lucide-react'
import {
  card,
  cardCarousel,
  cardShadow,
  cardShadowHover,
  dark,
  focusRing,
} from '../../lib/design-tokens'
import { RevealItem } from './Reveal'

/* ══════════════════════════════════════════════════════════════════════
   FeatureCard — line-icon feature (Our Approach, Why KYNA, Values)
   ══════════════════════════════════════════════════════════════════════ */

type FeatureCardProps = {
  icon: ReactNode
  title: string
  body: string
  /** Tailwind bg+text pair for the icon tile, matching Home's icon tones. */
  iconTone?: string
}

export function FeatureCard({
  icon,
  title,
  body,
  iconTone = 'bg-sky-50 text-[#087CF0] dark:bg-sky-950/40 dark:text-sky-400',
}: FeatureCardProps) {
  return (
    <RevealItem className="h-full">
      <article
        className={`group flex h-full flex-col ${card} ${dark.card} ${cardShadow} ${cardShadowHover} p-7 transition-all duration-300 hover:-translate-y-1`}
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${iconTone}`}
        >
          {icon}
        </span>
        <h3 className="mt-5 text-[17px] font-bold tracking-tight text-[#0B2347] dark:text-white">
          {title}
        </h3>
        <p className="mt-2.5 text-[14px] leading-[1.7] text-slate-500 dark:text-slate-400">
          {body}
        </p>
      </article>
    </RevealItem>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   ServiceCard — image + eyebrow + name + short copy + Learn More
   Long copy lives in the detail modal, never in the card.
   ══════════════════════════════════════════════════════════════════════ */

type ServiceCardProps = {
  badge: string
  title: string
  /** Short, scannable summary shown on the card face. */
  summary: string
  image: string
  imageAlt: string
  accent: string
  /** Receives the trigger element so focus can be returned to it on close. */
  onLearnMore: (trigger: HTMLElement) => void
  /**
   * DOM id for the card. Home's services carousel deep-links to
   * `#service-<id>` and highlights it, so this must stay stable.
   */
  id?: string
}

export function ServiceCard({
  badge,
  title,
  summary,
  image,
  imageAlt,
  accent,
  onLearnMore,
  id,
}: ServiceCardProps) {
  return (
    <RevealItem className="h-full">
      <article
        id={id}
        className={`group relative flex h-full flex-col overflow-hidden ${cardCarousel} transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-12px_rgba(11,35,71,0.22)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_4px_18px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)]`}
      >
        {/* Accent hairline on the top edge, revealed on hover */}
        <span
          className="absolute inset-x-0 top-0 z-20 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />

        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            width={640}
            height={400}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0B2347]/40 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase"
            style={{ color: accent }}
          >
            {badge}
          </p>
          <h3 className="mt-2.5 text-[18px] leading-snug font-bold tracking-tight text-[#0B2347] dark:text-white">
            {title}
          </h3>
          <p className="mt-2.5 text-[14px] leading-[1.65] text-slate-500 dark:text-slate-400">
            {summary}
          </p>

          <button
            type="button"
            onClick={(e) => onLearnMore(e.currentTarget)}
            className={`mt-5 inline-flex min-h-11 items-center gap-2 self-start text-[13px] font-bold text-[#087CF0] transition-colors hover:text-[#0B2347] dark:text-sky-400 dark:hover:text-white ${focusRing} rounded-md`}
          >
            Learn More
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </article>
    </RevealItem>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   TestimonialCard — quote, name, category, rating
   ══════════════════════════════════════════════════════════════════════ */

export type Testimonial = {
  name: string
  rating: number
  text: string
  /** Treatment / category, when the data has one. */
  category?: string
  /** Renders as the large featured review. */
  featured?: boolean
}

function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  const full = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < full
              ? 'fill-[#FFB020] text-[#FFB020]'
              : i === full && hasHalf
                ? 'fill-[#FFB020]/50 text-[#FFB020]'
                : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
          }`}
        />
      ))}
    </span>
  )
}

export function TestimonialCard({ t, animate = true }: { t: Testimonial; animate?: boolean }) {
  if (t.featured) {
    return (
      <RevealItem className="h-full" animate={animate}>
        <figure
          className={`relative flex h-full flex-col overflow-hidden rounded-[26px] border border-sky-100 bg-gradient-to-br from-[#EAF4FE] via-[#F7FBFF] to-[#E6F2FE] p-8 shadow-[0_18px_50px_rgba(11,35,71,0.08)] lg:p-10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900`}
        >
          <Quote
            className="absolute top-7 right-7 h-12 w-12 text-[#087CF0]/10"
            fill="currentColor"
            aria-hidden="true"
          />
          <Stars rating={t.rating} />
          <blockquote className="mt-5 flex-1 text-[19px] leading-[1.6] font-medium text-[#0B2347] lg:text-[21px] dark:text-white">
            “{t.text}”
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 border-t border-sky-200/70 pt-5 dark:border-slate-700">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#087CF0] text-[15px] font-bold text-white"
              aria-hidden="true"
            >
              {t.name.charAt(0)}
            </span>
            <span>
              <span className="block text-[15px] font-bold text-[#0B2347] dark:text-white">
                {t.name}
              </span>
              {t.category && (
                <span className="block text-[13px] text-slate-500 dark:text-slate-400">
                  {t.category}
                </span>
              )}
            </span>
          </figcaption>
        </figure>
      </RevealItem>
    )
  }

  return (
    <RevealItem className="h-full" animate={animate}>
      <figure
        className={`flex h-full flex-col rounded-[20px] border border-sky-100 bg-white p-6 shadow-[0_4px_18px_rgba(11,35,71,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(11,35,71,0.10)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_4px_18px_rgba(0,0,0,0.3)]`}
      >
        <Stars rating={t.rating} />
        <blockquote className="mt-3.5 flex-1 text-[14px] leading-[1.7] text-slate-600 dark:text-slate-300">
          “{t.text}”
        </blockquote>
        <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[13px] font-bold text-[#0B2347] dark:bg-sky-950/50 dark:text-sky-200"
            aria-hidden="true"
          >
            {t.name.charAt(0)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-semibold text-[#0B2347] dark:text-white">
              {t.name}
            </span>
            {t.category && (
              <span className="block truncate text-[12px] text-slate-500 dark:text-slate-400">
                {t.category}
              </span>
            )}
          </span>
        </figcaption>
      </figure>
    </RevealItem>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   TeamCard — portrait 4:5, name, designation, specialty
   ══════════════════════════════════════════════════════════════════════ */

export type TeamMember = {
  name: string
  primaryRole: string
  focus: string
  initials: string
  image?: string
  location?: string
  tags?: readonly string[] | string[]
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <RevealItem className="h-full">
      <article
        className={`group flex h-full flex-col overflow-hidden ${cardCarousel} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-12px_rgba(11,35,71,0.22)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_4px_18px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)]`}
      >
        {/* Portrait — uniform 4:5 across every card, object-cover, no stretch */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-sky-50 dark:bg-slate-800">
          {member.image ? (
            <img
              src={member.image}
              alt={`${member.name} — ${member.primaryRole} at KYNA Physiotherapy`}
              loading="lazy"
              width={480}
              height={600}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[44px] font-bold text-[#087CF0]/25 dark:text-sky-300/25">
              {member.initials}
            </span>
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0B2347]/45 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-[17px] leading-snug font-bold tracking-tight text-[#0B2347] dark:text-white">
            {member.name}
          </h3>
          <p className="mt-1.5 text-[12px] font-semibold tracking-[0.14em] uppercase text-[#087CF0] dark:text-sky-400">
            {member.primaryRole}
          </p>
          {member.location && (
            <p className="mt-2 flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {member.location}
            </p>
          )}
          <p className="mt-3.5 flex-1 text-[13.5px] leading-[1.65] text-slate-500 dark:text-slate-400">
            {member.focus}
          </p>

          {member.tags && member.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {member.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </RevealItem>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   LocationCard — pin, branch name, address, call + directions
   ══════════════════════════════════════════════════════════════════════ */

export type Clinic = {
  name: string
  address: string
  phone: string
  mapsUrl?: string
  pin?: string
  pinBg?: string
}

export function LocationCard({ clinic }: { clinic: Clinic }) {
  const accent = clinic.pin ?? '#087CF0'
  const tint = clinic.pinBg ?? '#E8F4FD'

  return (
    <RevealItem className="h-full">
      <article
        className={`flex h-full flex-col rounded-[20px] border border-sky-100 bg-white p-6 shadow-[0_4px_18px_rgba(11,35,71,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(11,35,71,0.10)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_4px_18px_rgba(0,0,0,0.3)]`}
      >
        <div className="flex items-start gap-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: tint }}
            aria-hidden="true"
          >
            <MapPin className="h-5 w-5" style={{ color: accent }} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold tracking-tight text-[#0B2347] dark:text-white">
              {clinic.name}
            </h3>
            <p className="mt-1.5 text-[13.5px] leading-[1.6] text-slate-500 dark:text-slate-400">
              {clinic.address}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
          <a
            href={`tel:${clinic.phone}`}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-[#087CF0] bg-white px-5 text-[12px] font-bold tracking-[0.12em] text-[#087CF0] uppercase transition-colors duration-300 hover:bg-[#087CF0] hover:text-white dark:bg-slate-900 dark:hover:bg-sky-500 dark:hover:text-white ${focusRing}`}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Call Clinic
          </a>
          {clinic.mapsUrl && (
            <a
              href={clinic.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-[12px] font-bold tracking-[0.12em] text-slate-600 uppercase transition-colors duration-300 hover:border-slate-300 hover:text-[#0B2347] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white ${focusRing}`}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Get Directions
            </a>
          )}
        </div>
      </article>
    </RevealItem>
  )
}
