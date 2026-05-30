import { LayoutFooter } from '@/components/layout-footer';
import { LayoutHeader } from '@/components/layout-header';
import { SectionFeatures } from '@/components/section-features';
import { SectionHero } from '@/components/section-hero';
import { SectionRoadmap } from '@/components/section-roadmap';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LayoutHeader />
      <main>
        <SectionHero />
        <SectionFeatures />
        <SectionRoadmap />
      </main>
      <LayoutFooter />
    </div>
  );
}
