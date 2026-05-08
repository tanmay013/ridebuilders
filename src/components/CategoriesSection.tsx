"use client";

import type { FC } from "react";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import siteData from "@/data/site.json";

interface Machine {
  id: number;
  type: "car" | "bike";
  eyebrow: string;
  title: string;
  count: number;
  image: string;
  href: string;
  /** CSS aspect-ratio value, e.g. "3/4", "1/1", "4/5" — varies card heights for masonry feel. */
  aspect: string;
}

const machines = siteData.machines as Machine[];

/* ────────────────────────────────────────────────────────────
   Distribute items evenly across N columns by interleaving
   (instead of greedy "shortest column wins") so each column
   has its own visual rhythm of car / bike entries.
   ──────────────────────────────────────────────────────────── */
const splitIntoColumns = <T,>(items: T[], cols: number): T[][] => {
  const result: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    result[i % cols].push(item);
  });
  return result;
};

/* ────────────────────────────────────────────────────────────
   Single tile in the wall.
   ──────────────────────────────────────────────────────────── */
const MasonryCard: FC<{ machine: Machine }> = ({ machine }) => {
  return (
    <a
      href={machine.href}
      style={{ aspectRatio: machine.aspect }}
      className="group relative block w-full overflow-hidden rounded-2xl bg-neutral-950 ring-1 ring-white/[0.07] hover:ring-white/20 transition-all"
    >
      {/* Fallback dark gradient — visible if image hasn't loaded */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />

      {/* Photo */}
      <img
        src={machine.image}
        alt={`${machine.eyebrow} ${machine.title}`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
      />

      {/* Bottom-up gradient for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/55 to-black/95" />

      {/* Subtle inner top highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
      />

      {/* Tiny type badge top-right */}
      <span className="absolute top-3 right-3 rounded-full bg-black/45 backdrop-blur-sm px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/75 ring-1 ring-white/10">
        {machine.type}
      </span>

      {/* Label content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-white/55">
          {machine.eyebrow}
        </p>
        <h3
          className="mt-1 text-xl md:text-2xl font-semibold text-white"
          style={{ letterSpacing: "-0.03em", lineHeight: "1" }}
        >
          {machine.title}
        </h3>
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs md:text-sm text-white/85 pb-0.5 border-b-2 border-red-600 group-hover:gap-2 transition-all">
          {machine.count} {machine.title}
          <span aria-hidden>→</span>
        </span>
      </div>
    </a>
  );
};

/* ────────────────────────────────────────────────────────────
   One vertical column of the masonry. Each column has its own
   parallax offset driven by the section's smoothed scroll.
   ──────────────────────────────────────────────────────────── */
const MasonryColumn: FC<{
  items: Machine[];
  speed: number;
  smoothProgress: MotionValue<number>;
}> = ({ items, speed, smoothProgress }) => {
  const y = useTransform(smoothProgress, [0, 1], [speed, -speed]);

  return (
    <motion.div style={{ y }} className="flex flex-col gap-4 md:gap-5">
      {items.map((m) => (
        <MasonryCard key={m.id} machine={m} />
      ))}
    </motion.div>
  );
};

/* ────────────────────────────────────────────────────────────
   The section itself.
   ──────────────────────────────────────────────────────────── */
const CategoriesSection: FC = () => {
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

  // Heading drifts at half the rate of the wall.
  const headingY = useTransform(smoothProgress, [0, 1], [25, -25]);

  // Each column gets a different parallax range so they slide past each
  // other slightly — that's what reads as "depth" in the wall.
  // Pattern: alternating fast/slow keeps neighbors offset.
  const columnSpeeds = [80, 30, 60, 20];

  // Distribute into 4 columns on desktop. On smaller breakpoints we render
  // fewer columns, but the data is split once for stability.
  const columns = splitIntoColumns(machines, 4);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="relative bg-black py-20 md:py-28 px-6 md:px-10 lg:px-16 overflow-hidden"
    >
      {/* Heading */}
      <motion.div
        className="text-center max-w-2xl mx-auto flex flex-col items-center"
        style={{ y: headingY }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-white/55 text-sm md:text-base">
          Cars and bikes — together in one wall
        </p>
        <h2
          className="mt-2 text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          Trending Categories
        </h2>

        {/* View all CTA — staggered slightly so it lands after the heading */}
        <motion.a
          href="#all-categories"
          className="group mt-7 md:mt-8 inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-6 py-3 hover:bg-neutral-200 hover:gap-3 transition-all"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          View all categories
          <span aria-hidden>→</span>
        </motion.a>
      </motion.div>

      {/* 3D MASONRY WALL
          - Outer wrapper sets `perspective` so the inner transform reads
            as 3D, with the vanishing point centered above the section.
          - Inner wrapper applies a small rotateX so the wall tilts
            slightly away from the viewer at the top — gives the "wall
            receding into the distance" feel.
          - Each column inside parallax-scrolls at its own speed; the
            mismatch between columns is what amplifies the depth.
       */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-14 md:mt-20 max-w-7xl mx-auto"
        style={{ perspective: "1600px", perspectiveOrigin: "50% 0%" }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
          style={{
            transformStyle: "preserve-3d",
            // Subtle X-axis tilt: top edge leans away by 6deg. Big enough
            // to read as 3D, small enough that text stays legible.
            transform: "rotateX(6deg)",
            transformOrigin: "50% 0%",
          }}
        >
          {columns.map((items, idx) => (
            <MasonryColumn
              key={idx}
              items={items}
              speed={columnSpeeds[idx % columnSpeeds.length]}
              smoothProgress={smoothProgress}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CategoriesSection;
