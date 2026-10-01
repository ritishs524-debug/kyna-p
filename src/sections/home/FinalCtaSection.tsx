import { CTASection } from '../../components/ui/CTASection'

interface FinalCtaSectionProps {
  onNavigate?: (page: 'home' | 'about' | 'services' | 'reviews' | 'team' | 'contact') => void
}

/**
 * Home's closing CTA.
 *
 * This used to be a second, hand-maintained copy of the card with its own gsap
 * reveal and its own button metrics — which is exactly how it drifted away
 * from every other page's CTA (shorter buttons, a different blue). It is now a
 * thin wrapper over the shared `CTASection`, the same shape as
 * `AboutTeamCtaSection`, so the last thing a visitor sees is identical
 * everywhere and can only change in one place.
 */
export function FinalCtaSection({ onNavigate }: FinalCtaSectionProps) {
  return (
    <CTASection
      eyebrow="Ready to Start Your Recovery Journey?"
      title="Book a free consultation at KYNA Physiotherapy today."
      body="Share your pain, sports injury or movement goals with our specialists and discover a personalised roadmap back to confident, pain-free movement."
      primaryLabel="Book Free Consultation"
      onPrimary={() => onNavigate?.('contact')}
      secondaryLabel="Call 98781 82115"
      secondaryHref="tel:9878182115"
    />
  )
}
