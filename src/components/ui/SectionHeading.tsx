'use client'

import type { ReactNode } from 'react'
import { color, dark, eyebrow, heading, subheading } from '../../lib/design-tokens'
import { Reveal } from './Reveal'

type SectionHeadingProps = {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  /** `center` matches Home's section rhythm; `left` for editorial splits. */
  align?: 'center' | 'left'
  className?: string
  /** Heading level — keeps exactly one h1 per page. */
  as?: 'h2' | 'h3'
}

/** The eyebrow + heading + sub block every section on the site shares. */
export function SectionHeading({
  eyebrow: eyebrowText,
  title,
  intro,
  align = 'center',
  className = '',
  as: Tag = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center'

  return (
    <Reveal className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrowText && (
        <p className={`${eyebrow} ${color.blue} ${dark.eyebrow}`}>{eyebrowText}</p>
      )}

      <Tag
        className={`${heading} ${centered ? '' : 'mt-4'} ${
          Tag === 'h3' ? '!mt-3 sm:!text-[26px] lg:!text-[30px]' : ''
        } ${color.navy} ${dark.heading}`}
      >
        {title}
      </Tag>

      {intro && (
        <p className={`${subheading} ${centered ? '' : 'mx-0'} ${color.muted} ${dark.subheading}`}>
          {intro}
        </p>
      )}
    </Reveal>
  )
}
