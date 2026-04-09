import { Hero } from '../components/Hero.jsx'
import { StatsBar } from '../components/home/StatsBar.jsx'
import { AboutSection } from '../components/home/AboutSection.jsx'
import { FeaturesSection } from '../components/home/FeaturesSection.jsx'
import { ClassesPreview } from '../components/home/ClassesPreview.jsx'
import { FinalCTABanner } from '../components/home/FinalCTABanner.jsx'

export function HomePage() {
  return (
    <div>
      <Hero />
      <StatsBar />
      <AboutSection />
      <FeaturesSection />
      <ClassesPreview />
      <FinalCTABanner />
    </div>
  )
}

