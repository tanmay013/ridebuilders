"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { CarBasic } from "./carDetail";

interface SimilarCarsProps {
  cars: CarBasic[];
  /** Controls headline and "Explore all" link. Defaults to "car". */
  kind?: "car" | "bike";
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const SimilarCard: FC<{ car: CarBasic; index: number; basePath: string }> = ({
  car,
  index,
  basePath,
}) => (
  <motion.a
    href={`${basePath}/${car.id}`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.7, delay: 0.05 + index * 0.07, ease: easeOut }}
    whileHover={{ y: -6 }}
    className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] ring-1 ring-white/[0.05] transition-all hover:ring-white/20"
  >
    <div className="relative aspect-[16/10] overflow-hidden">
      <motion.img
        src={car.image}
        alt={car.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.7, ease: easeOut }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Similar
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/65">
          {car.brand}
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h3
            className="text-xl font-semibold tracking-tight text-white md:text-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {car.name}
          </h3>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white/85 ring-1 ring-white/15 transition-all group-hover:bg-red-500 group-hover:text-white">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-1 border-t border-white/10 px-5 py-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
          Price
        </p>
        <p className="mt-1 text-sm font-semibold text-red-400">
          {car.price ?? "—"}
        </p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
          Power
        </p>
        <p className="mt-1 text-sm font-semibold text-white/85">
          {car.hp ?? "—"}
        </p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
          0-100
        </p>
        <p className="mt-1 text-sm font-semibold text-white/85">
          {car.zero ?? "—"}
        </p>
      </div>
    </div>
  </motion.a>
);

const SimilarCars: FC<SimilarCarsProps> = ({ cars, kind = "car" }) => {
  const basePath = kind === "bike" ? "/bikes" : "/cars";
  const headline = kind === "bike" ? "Similar bikes." : "Similar cars.";
  const exploreLabel = kind === "bike" ? "Explore all bikes" : "Explore all cars";
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const headingY = useTransform(smooth, [0, 1], [25, -25]);
  const gridY = useTransform(smooth, [0, 1], [18, -18]);

  if (!cars.length) return null;

  return (
    <section
      ref={sectionRef}
      id="similar"
      className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
              You might also like
            </p>
            <h2
              className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
            >
              {headline}
            </h2>
          </div>
          <a
            href={basePath}
            className="group inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
          >
            {exploreLabel}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </motion.div>

        <motion.div
          style={{ y: gridY }}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 md:gap-6"
        >
          {cars.map((c, i) => (
            <SimilarCard key={c.id} car={c} index={i} basePath={basePath} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SimilarCars;
