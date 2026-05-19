"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import CarVideoPlayer from "./CarVideoPlayer";
import type { CarDetail } from "./carDetail";

interface CarDetailHeroProps {
  detail: CarDetail;
  /** Controls the breadcrumb root label/href. Defaults to "car". */
  kind?: "car" | "bike";
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const CarDetailHero: FC<CarDetailHeroProps> = ({ detail, kind = "car" }) => {
  const { basic, tagline, highlights } = detail;
  const rootHref = kind === "bike" ? "/bikes" : "/cars";
  const rootLabel = kind === "bike" ? "Bikes" : "Cars";
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const contentY = useTransform(smooth, [0, 1], [0, -60]);
  const contentOpacity = useTransform(smooth, [0, 0.7], [1, 0]);
  const vignetteOpacity = useTransform(smooth, [0, 1], [1, 0.6]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black text-white"
    >
      {/* Cinematic full-bleed autoplay video */}
      <CarVideoPlayer
        videoUrl={detail.videoUrl}
        posterUrl={basic.image}
        title={`${basic.brand} ${basic.name}`}
      />

      {/* Cinematic vignette + top/bottom darkening for legibility.
          Bottom darkening is intentionally light here — the smoke layer below
          handles the smooth transition into the next section. */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          opacity: vignetteOpacity,
          background:
            "radial-gradient(ellipse 110% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.8) 100%), linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.0) 45%, rgba(0,0,0,0.25) 85%, rgba(0,0,0,0.45) 100%)",
        }}
        aria-hidden
      />

      {/* Smoke / fog transition that dissolves the hero into the next section.
          Layered radial gradients create soft billows; the vertical fade
          guarantees a seamless meet with the page's bg-black underneath. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[7] h-[42vh] md:h-[36vh]"
        style={{
          background:
            "radial-gradient(70% 90% at 18% 110%, rgba(18,16,20,0.85) 0%, transparent 65%), radial-gradient(60% 80% at 78% 115%, rgba(22,16,20,0.8) 0%, transparent 60%), radial-gradient(90% 70% at 50% 120%, rgba(8,8,10,0.95) 0%, transparent 70%), linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.92) 90%, #000 100%)",
        }}
      />

      {/* Subtle drifting wisps for that 'smoke' feel — slow, ambient, low opacity */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[32vh] mix-blend-screen opacity-[0.18]"
        style={{
          background:
            "radial-gradient(40% 60% at 25% 95%, rgba(120,120,140,0.55) 0%, transparent 65%), radial-gradient(35% 55% at 70% 100%, rgba(140,120,130,0.45) 0%, transparent 60%), radial-gradient(45% 50% at 50% 100%, rgba(180,180,200,0.4) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
        animate={{ x: [0, 12, -8, 0], opacity: [0.16, 0.22, 0.14, 0.16] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle red ember glow that bleeds into the smoke — anchors the brand colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] h-[24vh]"
        style={{
          background:
            "radial-gradient(35% 45% at 78% 100%, rgba(215,46,46,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Inner film-frame border so the section reads as a "movie reel" */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 z-[6] rounded-2xl ring-1 ring-white/[0.06] md:inset-5 md:rounded-3xl"
      />


      {/* === Overlay UI === */}

      {/* Top-left: breadcrumb + intro tagline */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeOut, delay: 0.25 }}
        className="absolute left-6 top-24 z-20 max-w-md md:left-10 md:top-28 lg:left-16"
      >
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
      </motion.div>

      {/* Bottom content: brand, name, tagline, chips */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 px-6 pb-10 md:px-10 md:pb-14 lg:px-16"
        style={{ y: contentY, opacity: contentOpacity }}
      >
      
        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: easeOut, delay: 1.6 }}
          className="mx-auto mt-8 hidden max-w-9xl items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/50 md:flex"
        >
          <span>Scroll to explore</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CarDetailHero;
