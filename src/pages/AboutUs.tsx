import { AboutHeroSection } from '../sections/about/AboutHeroSection'
import { AboutStorySection } from '../sections/about/AboutStorySection'
import { AboutApproachSection } from '../sections/about/AboutApproachSection'
import { AboutTherapiesSection } from '../sections/about/AboutTherapiesSection'
import { AboutValuesSection } from '../sections/about/AboutValuesSection'
import { AboutTeamCtaSection } from '../sections/about/AboutTeamCtaSection'

type PageLabel = 'home' | 'about' | 'services' | 'team' | 'contact'

type AboutUsProps = {
  onNavigate?: (page: PageLabel) => void
}

/**
 * About Us — mirrors the Home page rhythm: soft-blue hero, white editorial
 * split, tinted band, white cards, tinted band, shared CTA.
 */
export function AboutUs({ onNavigate }: AboutUsProps) {
  return (
    <div className="flex flex-col pb-20 md:pb-0">
      <AboutHeroSection />
      <AboutStorySection />
      <AboutApproachSection />
      <AboutTherapiesSection />
      <AboutValuesSection />
      <AboutTeamCtaSection
        onNavigateToTeam={onNavigate ? () => onNavigate('team') : undefined}
      />
    </div>
  )
}
