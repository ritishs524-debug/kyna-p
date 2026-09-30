'use client'

import { CTASection } from '../../components/ui/CTASection'

type AboutTeamCtaSectionProps = {
  onNavigateToTeam?: () => void
}

/** Closing CTA — "Meet the people behind KYNA" + Meet Our Team. */
export function AboutTeamCtaSection({ onNavigateToTeam }: AboutTeamCtaSectionProps) {
  return (
    <CTASection
      eyebrow="We Have High-Level Professionals in Our Team"
      title="Meet the people behind KYNA."
      body="Each member of our team has undergone extensive training and holds the necessary qualifications and certifications in their respective fields."
      primaryLabel="Meet Our Team"
      onPrimary={onNavigateToTeam}
      secondaryLabel="Call 98781 82115"
      secondaryHref="tel:9878182115"
    />
  )
}
