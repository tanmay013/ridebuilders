import Hero from "@/components/Hero";
import StorySection from "@/components/StorySection";
import ChooseSideSection from "@/components/ChooseSideSection";
import CategoriesSection from "@/components/CategoriesSection";
import WhyCompareSection from "@/components/WhyCompareSection";
import VehiclesSection from "@/components/VehiclesSection";
import TrustStatsSection from "@/components/TrustStatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SectionTransition from "@/components/SectionTransition";

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />
      {/* 1.5. Story / scroll-fade transition */}
      <StorySection />
      <SectionTransition variant="dot" />
      {/* 2. Choose Your Side */}
      <ChooseSideSection />
      <SectionTransition variant="line" />
      {/* 3. Trending Machines (CategoriesSection) */}
      <CategoriesSection />
      <SectionTransition variant="line" />
      {/* 4. Why Compare With Ridebuilders */}
      <WhyCompareSection />
      <SectionTransition variant="dot" />
      {/* 5. Explore All Cars & Bikes (VehiclesSection) */}
      <VehiclesSection />
      <SectionTransition variant="line" />
      {/* 6. Trust / Stats */}
      <TrustStatsSection />
      {/* 7. Final CTA / Contact (already has its own top fog, no spacer needed) */}
      <CTASection />
      {/* 8. Footer */}
      <Footer />
    </>
  );
}
