"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import CarDetailHero from "@/components/cars/details/CarDetailHero";
import CarAbout from "@/components/cars/details/CarAbout";
import ColorCustomization from "@/components/cars/details/ColorCustomization";
import KeySpecs from "@/components/cars/details/KeySpecs";
import VariantsPricing from "@/components/cars/details/VariantsPricing";
import ExpertReviewSection from "@/components/cars/details/ExpertReviewSection";
import ProsCons from "@/components/cars/details/ProsCons";
import RatingsReviews from "@/components/cars/details/RatingsReviews";
import SimilarCars from "@/components/cars/details/SimilarCars";
import FaqSection from "@/components/cars/details/FaqSection";
import {
  getBikeDetail,
  getSimilarBikes,
} from "@/components/bikes/details/bikeDetail";

export type PriceMode = "showroom" | "onRoad";

interface BikeDetailPageProps {
  params: Promise<{ bikemodel: string }>;
}

export default function BikeDetailPage({ params }: BikeDetailPageProps) {
  const { bikemodel } = use(params);
  const detail = getBikeDetail(bikemodel);
  const [priceMode, setPriceMode] = useState<PriceMode>("onRoad");

  if (!detail) {
    notFound();
  }

  const similar = getSimilarBikes(bikemodel, 3);

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="bikes" />

      <CarDetailHero detail={detail} kind="bike" />

      <CarAbout
        detail={detail}
        priceMode={priceMode}
        onPriceModeChange={setPriceMode}
        kind="bike"
      />

      <ColorCustomization detail={detail} />
      <KeySpecs detail={detail} />
      <VariantsPricing
        detail={detail}
        priceMode={priceMode}
        onPriceModeChange={setPriceMode}
      />
      <ExpertReviewSection detail={detail} />
      <ProsCons detail={detail} />
      <RatingsReviews detail={detail} />
      <SimilarCars cars={similar} kind="bike" />
      <FaqSection detail={detail} />

      <CTASection />
      <Footer />
    </main>
  );
}
