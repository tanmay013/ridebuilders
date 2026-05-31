"use client";

import type { FC } from "react";
import siteData from "@/data/site.json";

type PageKey = "carsPage" | "bikesPage";

interface CarsHeroProps {
  pageKey?: PageKey;
}

const CarsHero: FC<CarsHeroProps> = ({ pageKey = "carsPage" }) => {
  const hero = (siteData as typeof siteData & Record<PageKey, { hero: { headline: string; description: string; image: string } }>)[pageKey].hero;
  const headline = hero.headline || "Discover The Icons\nOf Performance";
  const description =
    hero.description ||
    "Immerse yourself in a handpicked collection of the world's finest vehicles, where every car is a masterpiece of design and engineering.";
  const [line1, line2] = headline.split("\n");

  return (
    <section className="relative min-h-[56vh] w-full overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 animate-hero-zoom"
        style={{
          backgroundImage: `url(${hero.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.20) 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,1) 100%)",
        }}
        aria-hidden
      />

      <span
        className="pointer-events-none absolute left-1/2 top-[55%] z-[2] h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d72e2e] animate-pulse-glow"
        aria-hidden
      />

      <div className="absolute bottom-[50px] left-0 right-0 z-[2] px-6 md:px-16 animate-fade-in">
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-[60px]">
          <h1 className="max-w-[620px] text-[clamp(32px,3.8vw,52px)] font-medium leading-[1.1] tracking-[-0.5px]">
            {line1 || "Discover The Icons"}
            <br />
            {line2 || "Of Performance"}
          </h1>

          <div className="max-w-[460px] md:ml-auto">
            <p className="text-base leading-[1.6] text-white/90">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarsHero;
