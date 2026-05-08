"use client";

import SubPageNav from "@/components/SubPageNav";
import AboutHero from "@/components/about/AboutHero";
import MissionSection from "@/components/about/MissionSection";
import ValuesSection from "@/components/about/ValuesSection";
import AboutStats from "@/components/about/AboutStats";
import TimelineSection from "@/components/about/TimelineSection";
import TeamSection from "@/components/about/TeamSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="about" />

      <AboutHero />
      <MissionSection />
      <ValuesSection />
      <AboutStats />
      <TimelineSection />
      <TeamSection />

      <CTASection />
      <Footer />
    </main>
  );
}
