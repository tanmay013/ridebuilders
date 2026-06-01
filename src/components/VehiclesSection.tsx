"use client";

import type { FC } from "react";
import { Fragment, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import siteData from "@/data/site.json";

interface Vehicle {
  id: number;
  slug: string;
  name: string;
  price: string;
  image: string;
  category: "car" | "bike";
  /** Large faded model-name text shown behind the photo. e.g. "GT3", "H2". */
  watermark: string;
  /** Short spec strings, joined with bullets in the card footer. */
  specs: string[];
}

const vehicles = siteData.vehicles as Vehicle[];

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
}

const VehicleCard: FC<VehicleCardProps> = ({ vehicle, index }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  // Per-card scroll-driven image parallax (kept light — wall is calm).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const imageY = useTransform(smoothProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.a
      ref={ref}
      href={
        vehicle.category === "car"
          ? `/cars/${vehicle.slug}`
          : `/bikes/${vehicle.slug}`
      }
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
        delay: (index % 2) * 0.1,
      }}
      className="group relative block aspect-[16/10] overflow-hidden rounded-3xl bg-neutral-950 ring-1 ring-white/[0.08] hover:ring-white/20 transition-all"
    >
      {/* Fallback gradient — visible if image hasn't loaded */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />

      {/* Photo, slight scroll parallax + hover scale */}
      <motion.img
        src={vehicle.image}
        alt={vehicle.name}
        loading="lazy"
        decoding="async"
        style={{ y: imageY }}
        className="absolute inset-x-0 -top-[8%] w-full h-[116%] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
      />

      {/* Watermark — large faded model name. White at very low alpha so it
          reads as a ghost overlay regardless of photo brightness. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-4 md:left-6 select-none font-bold leading-[0.85] text-white/[0.07] tracking-tighter"
        style={{
          fontSize: "clamp(6rem, 18vw, 14rem)",
          letterSpacing: "-0.06em",
        }}
      >
        {vehicle.watermark}
      </div>

      {/* Bottom-up gradient for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

      {/* Subtle inner top highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)" }}
      />

      {/* Bottom content row: price/name/specs on left, arrow on right */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 lg:p-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs md:text-sm text-white/70">{vehicle.price}</p>
          <h3
            className="mt-1 text-xl md:text-2xl lg:text-3xl font-semibold text-white"
            style={{ letterSpacing: "-0.02em", lineHeight: "1.05" }}
          >
            {vehicle.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] md:text-xs uppercase tracking-[0.18em] text-white/55">
            {vehicle.specs.map((spec, i) => (
              <Fragment key={spec}>
                {i > 0 && (
                  <span className="text-white/25" aria-hidden>
                    •
                  </span>
                )}
                <span>{spec}</span>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Circular arrow button */}
        <span className="flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full ring-1 ring-white/25 text-white/85 group-hover:ring-white/50 group-hover:bg-white/10 group-hover:text-white transition-all">
          <span aria-hidden className="text-base md:text-lg">
            →
          </span>
        </span>
      </div>
    </motion.a>
  );
};

const VehiclesSection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const headingY = useTransform(smoothProgress, [0, 1], [25, -25]);

  return (
    <section
      ref={sectionRef}
      id="models"
      className="relative bg-black py-24 md:py-32 px-6 md:px-10 lg:px-16"
    >
      {/* Heading block */}
      <motion.div
        className="text-center max-w-2xl mx-auto flex flex-col items-center"
        style={{ y: headingY }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[11px] md:text-xs uppercase tracking-[0.32em] text-red-500">
          Collection
        </p>
        <h2
          className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          Explore all cars &amp; bikes
        </h2>
        <p className="mt-4 text-white/60 text-base md:text-lg leading-relaxed">
          From everyday rides to redline machines —
          <br className="hidden sm:block" />
          {" "}side-by-side, in one place.
        </p>

        {/* Two CTAs — primary white pill (cars) + outlined (bikes) */}
        <motion.div
          className="mt-7 md:mt-8 flex flex-col sm:flex-row items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="/cars"
            className="group inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-6 py-3 hover:bg-neutral-200 hover:gap-3 transition-all"
          >
            View all cars
            <span aria-hidden>→</span>
          </a>
          <a
            href="#all-bikes"
            className="group inline-flex items-center gap-2 bg-transparent text-white text-sm font-medium rounded-full px-6 py-3 ring-1 ring-white/25 hover:ring-white/45 hover:bg-white/[0.06] hover:gap-3 transition-all"
          >
            View all bikes
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Card grid — 2 columns on desktop, single column on mobile */}
      <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-7xl mx-auto">
        {vehicles.map((v, i) => (
          <VehicleCard key={v.id} vehicle={v} index={i} />
        ))}
      </div>
    </section>
  );
};

export default VehiclesSection;
