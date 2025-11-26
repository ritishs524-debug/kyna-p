import { AboutHeroSection } from '../sections/about/AboutHeroSection'
import { AboutStorySection } from '../sections/about/AboutStorySection'
import { AboutTherapiesSection } from '../sections/about/AboutTherapiesSection'
import { AboutValuesSection } from '../sections/about/AboutValuesSection'
import { AboutTeamCtaSection } from '../sections/about/AboutTeamCtaSection'

export function AboutUs() {
  return (
    <div className="flex flex-col gap-0 pb-4 lg:pb-6">
      <AboutHeroSection />
      <AboutStorySection />
      <AboutTherapiesSection />
      <AboutValuesSection />
      <AboutTeamCtaSection />
    </div>
  )
}

