import { CapabilitiesSection } from '@/components/home/capabilities-section';
import { HeroSection } from '@/components/home/hero-section';
import { OutroSection } from '@/components/home/outro-section';
import { RoadmapSection } from '@/components/home/roadmap-section';
import { SiteHeader } from '@/components/home/site-header';
import { ScenarioShowcase } from '@/components/scenario-showcase';
import { SharedDeviceFrame } from '@/components/shared-device-frame';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#ededeb] text-[#202020]">
      <SiteHeader />
      <SharedDeviceFrame />
      <HeroSection />
      <ScenarioShowcase />
      <CapabilitiesSection />
      <RoadmapSection />
      <OutroSection />
    </main>
  );
}
