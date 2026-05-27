import { LayoutFooter } from '@/components/layout-footer';
import { LayoutHeader } from '@/components/layout-header';
import { PanelDatabaseStatus } from '@/components/panel-database-status';
import { SectionFeatures } from '@/components/section-features';
import { SectionHero } from '@/components/section-hero';
import { SectionRoadmap } from '@/components/section-roadmap';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LayoutHeader />
      <main>
        <SectionHero />
        <SectionFeatures />
        <SectionRoadmap />
        <PanelDatabaseStatus />
      </main>
      <LayoutFooter />
    </div>
  );
}
