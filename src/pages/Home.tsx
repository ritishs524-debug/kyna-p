import { HeroSection } from '../sections/home/HeroSection'
import { TrustSection } from '../sections/home/TrustSection'
import { AboutSection } from '../sections/home/AboutSection'
import { ServicesSection } from '../sections/home/ServicesSection'
import { TeamPreviewSection } from '../sections/home/TeamPreviewSection'
import { LocationsSection } from '../sections/home/LocationsSection'
import { FinalCtaSection } from '../sections/home/FinalCtaSection'

export function Home() {
  return (
    <div className="flex flex-col gap-0 pb-0 lg:pb-0">
      <HeroSection />
      <TrustSection />
      <AboutSection />
      <ServicesSection />
      <TeamPreviewSection />
      <LocationsSection />
      <FinalCtaSection />
    </div>
  )
}

