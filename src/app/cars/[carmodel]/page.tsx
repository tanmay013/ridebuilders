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
import { getCarDetail, getSimilarCars } from "@/components/cars/details/carDetail";

export type PriceMode = "showroom" | "onRoad";

interface CarDetailPageProps {
  params: Promise<{ carmodel: string }>;
}

export default function CarDetailPage({ params }: CarDetailPageProps) {
  const { carmodel } = use(params);
  const detail = getCarDetail(carmodel);
  const [priceMode, setPriceMode] = useState<PriceMode>("onRoad");

  if (!detail) {
    notFound();
  }

  const similar = getSimilarCars(carmodel, 3);

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="cars" />

      <CarDetailHero detail={detail} />

      <CarAbout
        detail={detail}
        priceMode={priceMode}
        onPriceModeChange={setPriceMode}
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
      <SimilarCars cars={similar} />
      <FaqSection detail={detail} />

      <CTASection />
      <Footer />
    </main>
  );
}
