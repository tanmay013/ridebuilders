"use client";

import type { FC } from "react";
import CarVideoPlayer from "./CarVideoPlayer";
import type { CarDetail } from "./carDetail";

interface CarDetailHeroProps {
  detail: CarDetail;
  kind?: "car" | "bike";
}

const CarDetailHero: FC<CarDetailHeroProps> = ({ detail, kind = "car" }) => {
  const { basic, tagline } = detail;
  const rootHref = kind === "bike" ? "/bikes" : "/cars";
  const rootLabel = kind === "bike" ? "Bikes" : "Cars";

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black text-white">
      <CarVideoPlayer
        videoUrl={detail.videoUrl}
        posterUrl={basic.image}
        title={`${basic.brand} ${basic.name}`}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse 110% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.8) 100%), linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.0) 45%, rgba(0,0,0,0.25) 85%, rgba(0,0,0,0.45) 100%)",
        }}
        aria-hidden
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[7] h-[42vh] md:h-[36vh]"
        style={{
          background:
            "radial-gradient(70% 90% at 18% 110%, rgba(18,16,20,0.85) 0%, transparent 65%), radial-gradient(60% 80% at 78% 115%, rgba(22,16,20,0.8) 0%, transparent 60%), radial-gradient(90% 70% at 50% 120%, rgba(8,8,10,0.95) 0%, transparent 70%), linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.92) 90%, #000 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[32vh] mix-blend-screen opacity-[0.18]"
        style={{
          background:
            "radial-gradient(40% 60% at 25% 95%, rgba(120,120,140,0.55) 0%, transparent 65%), radial-gradient(35% 55% at 70% 100%, rgba(140,120,130,0.45) 0%, transparent 60%), radial-gradient(45% 50% at 50% 100%, rgba(180,180,200,0.4) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] h-[24vh]"
        style={{
          background:
            "radial-gradient(35% 45% at 78% 100%, rgba(215,46,46,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 z-[6] rounded-2xl ring-1 ring-white/[0.06] md:inset-5 md:rounded-3xl"
      />

      <div className="absolute left-6 top-24 z-20 max-w-md md:left-10 md:top-28 lg:left-16 animate-fade-in">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55"
        >
          <a href={rootHref} className="transition-colors hover:text-white">
            {rootLabel}
          </a>
          <span aria-hidden>/</span>
          <span className="text-white/80">{basic.brand}</span>
          <span aria-hidden>/</span>
          <span className="text-white">{basic.name}</span>
        </nav>

        <p className="mt-4 hidden border-l-2 border-red-500 pl-3 text-sm italic leading-snug text-white/75 md:block">
          {tagline}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-10 md:px-10 md:pb-14 lg:px-16 animate-fade-in">
        <div className="mx-auto mt-8 hidden max-w-9xl items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/50 md:flex">
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};

export default CarDetailHero;
