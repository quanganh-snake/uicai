import { HeroSection } from "@/components/home/HeroSection";
import { MilestonesSection } from "@/components/home/MilestonesSection";
import { PublicationSection } from "@/components/home/PublicationSection";
import { ScopeSection } from "@/components/home/ScopeSection";
import { KeynotesSection } from "@/components/home/KeynotesSection";
import { CommitteeSection } from "@/components/home/CommitteeSection";
import { PartnersSection } from "@/components/home/PartnersSection";

export default function Home() {
  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white">
      <HeroSection />
      <MilestonesSection />
      <PublicationSection />
      <ScopeSection />
      <KeynotesSection />
      <CommitteeSection />
      <PartnersSection />
    </div>
  );
}

