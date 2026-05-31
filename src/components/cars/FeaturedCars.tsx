"use client";

import type { FC } from "react";
import siteData from "@/data/site.json";

interface FeaturedCar {
  id: string;
  brand: string;
  name: string;
  image: string;
}

const featured = siteData.carsPage.featured as FeaturedCar[];

const StarBadge: FC = () => (
  <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-md bg-black/55 backdrop-blur-sm ring-1 ring-white/10 px-2.5 py-1">
    <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="currentColor" aria-hidden="true">
      <path d="m12 2 2.7 6.6L22 10l-5.5 4.7L18 22l-6-3.7L6 22l1.5-7.3L2 10l7.3-1.4Z" />
    </svg>
    <span className="text-[10px] uppercase tracking-[0.18em] text-white">Featured</span>
  </div>
);

const ArrowCircle: FC<{ size?: "sm" | "lg" }> = ({ size = "sm" }) => (
  <span
    className={`flex shrink-0 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/15 text-white/85 group-hover:ring-white/40 group-hover:bg-white/[0.12] group-hover:text-white transition-all ${
      size === "lg" ? "h-12 w-12 md:h-14 md:w-14" : "h-10 w-10"
    }`}
  >
    <svg viewBox="0 0 24 24" className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  </span>
);

interface CardProps {
  car: FeaturedCar;
  size: "big" | "small";
  delay?: number;
}

const FeaturedCard: FC<CardProps> = ({ car, size, delay = 0 }) => {
  const isBig = size === "big";

  return (
    <a
      href={`/cars/${car.id}`}
      className="group relative block h-full w-full overflow-hidden rounded-3xl bg-neutral-950 ring-1 ring-white/[0.07] hover:ring-white/20 transition-all animate-fade-in-up"
      style={{ animationDelay: `${delay * 1000}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />

      <img
        src={car.image}
        alt={car.name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <StarBadge />

      <div
        className={`absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 ${
          isBig ? "p-7 md:p-8" : "p-5 md:p-6"
        }`}
      >
        <div className="min-w-0">
          <p className={`text-white/65 ${isBig ? "text-sm md:text-base" : "text-xs md:text-sm"}`}>
            {car.brand}
          </p>
          <h3
            className={`text-white font-semibold ${
              isBig
                ? "mt-1 text-3xl md:text-4xl lg:text-5xl"
                : "mt-1 text-xl md:text-2xl"
            }`}
            style={{ letterSpacing: "-0.02em", lineHeight: "1.05" }}
          >
            {car.name}
          </h3>
        </div>
        <ArrowCircle size={isBig ? "lg" : "sm"} />
      </div>
    </a>
  );
};

const FeaturedCars: FC = () => {
  const [bigCar, ...smallCars] = featured;
  const small = smallCars.slice(0, 2);

  return (
    <section className="px-6 md:px-10 lg:px-16 mt-8 md:mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div className="md:row-span-2 min-h-[420px] md:min-h-0">
            <FeaturedCard car={bigCar} size="big" delay={0.05} />
          </div>

          {small.map((car, i) => (
            <div key={car.id} className="aspect-[16/10] md:aspect-auto">
              <FeaturedCard car={car} size="small" delay={0.15 + i * 0.08} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
