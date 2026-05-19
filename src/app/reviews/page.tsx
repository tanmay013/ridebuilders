"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import PageHero from "@/components/shared/PageHero";
import siteData from "@/data/site.json";

interface ReviewsHero {
  eyebrow: string;
  headline: string;
  description: string;
  image: string;
}

interface ReviewsContent {
  hero: ReviewsHero;
  filters: string[];
}

interface VehicleBasic {
  id: string;
  brand: string;
  name: string;
  image: string;
  price?: string;
}

interface VehicleDetailRating {
  ratings?: { overall?: number; totalReviews?: number };
  expertReview?: { rating?: number; verdict?: string; reviewer?: string };
  tagline?: string;
}

const reviewsConfig = siteData.reviewsPage as ReviewsContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

interface ReviewCard {
  id: string;
  kind: "car" | "bike";
  brand: string;
  name: string;
  image: string;
  price?: string;
  rating: number;
  totalReviews: number;
  verdict: string;
  reviewer: string;
  href: string;
}

const buildReviewCards = (): ReviewCard[] => {
  const carDetails = (siteData.carsPage as unknown as { carDetails?: Record<string, VehicleDetailRating>; detailDefaults?: VehicleDetailRating }).carDetails ?? {};
  const carDefaults = (siteData.carsPage as unknown as { detailDefaults?: VehicleDetailRating }).detailDefaults ?? {};
  const bikeDetails = (siteData.bikesPage as unknown as { bikeDetails?: Record<string, VehicleDetailRating>; detailDefaults?: VehicleDetailRating }).bikeDetails ?? {};
  const bikeDefaults = (siteData.bikesPage as unknown as { detailDefaults?: VehicleDetailRating }).detailDefaults ?? {};

  const fromList = (
    list: VehicleBasic[],
    kind: "car" | "bike",
    overrides: Record<string, VehicleDetailRating>,
    defaults: VehicleDetailRating
  ): ReviewCard[] =>
    list.map((v) => {
      const o = overrides[v.id] ?? {};
      const ratings = o.ratings ?? defaults.ratings ?? {};
      const expert = o.expertReview ?? defaults.expertReview ?? {};
      return {
        id: v.id,
        kind,
        brand: v.brand,
        name: v.name,
        image: v.image,
        price: v.price,
        rating: ratings.overall ?? 4.4,
        totalReviews: ratings.totalReviews ?? 100,
        verdict:
          expert.verdict ??
          o.tagline ??
          defaults.tagline ??
          "An honest review by our editorial team.",
        reviewer: expert.reviewer ?? "RideBuilders Editorial",
        href: `/${kind === "car" ? "cars" : "bikes"}/${v.id}`,
      };
    });

  const cars = fromList(
    (siteData.carsPage.all ?? []) as VehicleBasic[],
    "car",
    carDetails,
    carDefaults
  );
  const bikes = fromList(
    (siteData.bikesPage.all ?? []) as VehicleBasic[],
    "bike",
    bikeDetails,
    bikeDefaults
  );

  return [...cars, ...bikes].sort((a, b) => b.rating - a.rating);
};

const StarRow = ({ value }: { value: number }) => (
  <div className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        viewBox="0 0 24 24"
        className={`h-3 w-3 ${
          value >= s - 0.25 ? "text-red-500" : "text-white/15"
        }`}
        fill="currentColor"
        aria-hidden
      >
        <path d="m12 3 2.7 6.6L22 11l-5.5 4.7L18 23l-6-3.7L6 23l1.5-7.3L2 11l7.3-1.4Z" />
      </svg>
    ))}
  </div>
);

export default function ReviewsPage() {
  const allCards = useMemo(buildReviewCards, []);
  const [filter, setFilter] = useState<string>("All");

  const visible = useMemo(() => {
    if (filter === "All") return allCards;
    if (filter === "Cars") return allCards.filter((c) => c.kind === "car");
    if (filter === "Bikes") return allCards.filter((c) => c.kind === "bike");
    return allCards;
  }, [allCards, filter]);

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="about" />

      <PageHero
        eyebrow={reviewsConfig.hero.eyebrow}
        headline={reviewsConfig.hero.headline}
        description={reviewsConfig.hero.description}
        image={reviewsConfig.hero.image}
      />

      <section className="relative bg-black px-6 pt-16 md:px-10 md:pt-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          {reviewsConfig.filters.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-red-500/60 bg-red-500/15 text-red-300"
                    : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white"
                }`}
              >
                {f}
              </button>
            );
          })}
          <p className="ml-auto text-[11px] uppercase tracking-[0.18em] text-white/45">
            {visible.length} {visible.length === 1 ? "review" : "reviews"}
          </p>
        </div>
      </section>

      <section className="relative bg-black px-6 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {visible.map((card, i) => (
            <motion.a
              key={`${card.kind}-${card.id}`}
              href={card.href}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.65,
                delay: 0.05 + (i % 3) * 0.06,
                ease: easeOut,
              }}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] ring-1 ring-white/5 transition-all hover:ring-white/20"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <motion.img
                  src={card.image}
                  alt={`${card.brand} ${card.name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.7, ease: easeOut }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0";
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.85) 100%)",
                  }}
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {card.kind === "car" ? "Car" : "Bike"} review
                </span>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3 text-red-500"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="m12 3 2.7 6.6L22 11l-5.5 4.7L18 23l-6-3.7L6 23l1.5-7.3L2 11l7.3-1.4Z" />
                  </svg>
                  {card.rating.toFixed(1)}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/65">
                    {card.brand}
                  </p>
                  <h3
                    className="mt-1 text-xl font-semibold tracking-tight text-white md:text-2xl"
                    style={{ letterSpacing: "-0.02em", lineHeight: "1.1" }}
                  >
                    {card.name}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="line-clamp-3 text-sm leading-relaxed text-white/65">
                  {card.verdict}
                </p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <div className="flex items-center gap-2">
                    <StarRow value={card.rating} />
                    <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                      {card.totalReviews.toLocaleString("en-IN")} reviews
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 group-hover:text-white">
                    Read
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/60">
            No reviews under this filter yet.
          </p>
        )}
      </section>

      <Footer />
    </main>
  );
}
