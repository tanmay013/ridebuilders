"use client";

import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import siteData from "@/data/site.json";

type BrandIconKey =
  | "chevron"
  | "bars"
  | "triangle"
  | "asterisk"
  | "circle"
  | "hexagon"
  | "squares";

type Brand = {
  name: string;
  category: "car" | "bike";
  icon: BrandIconKey;
};

const brands = siteData.brands as Brand[];

// Number of fixed slots visible across the strip and how often each
// slot rerolls to a new brand.
const SLOT_COUNT = 7;
const CYCLE_INTERVAL_MS = 1800;

const brandIcons: Record<BrandIconKey, ReactNode> = {
  chevron: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M6 19 L12 5 M14 19 L20 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  ),
  bars: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 7 H20 M4 12 H20 M4 17 H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  triangle: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M12 3 L21 20 L3 20 Z" fill="currentColor" />
    </svg>
  ),
  asterisk: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 2 V22 M2 12 H22 M5 5 L19 19 M19 5 L5 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  ),
  hexagon: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ),
  squares: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <rect
        x="13"
        y="13"
        width="8"
        height="8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ),
};

// Glitch in: blur dissolves, position jitters horizontally, opacity flickers.
const enterAnim = {
  opacity: [0, 1, 0.35, 1, 0.7, 1],
  x: [-6, 2, -3, 1, 0],
  filter: ["blur(4px)", "blur(0px)", "blur(2px)", "blur(0px)"],
};

// Glitch out: jitter the other direction, blur up, fade.
const exitAnim = {
  opacity: [1, 0.4, 0.7, 0],
  x: [0, 3, -2, 6],
  filter: ["blur(0px)", "blur(2px)", "blur(4px)"],
};

const pickDifferent = (current: number): number => {
  if (brands.length <= 1) return current;
  let next = Math.floor(Math.random() * brands.length);
  while (next === current) {
    next = Math.floor(Math.random() * brands.length);
  }
  return next;
};

const BrandsCarousel: FC = () => {
  // SSR-safe initial state: deterministic 0..N-1, then randomize after mount.
  const [slotBrands, setSlotBrands] = useState<number[]>(() =>
    Array.from({ length: SLOT_COUNT }, (_, i) => i % brands.length),
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlotBrands((prev) => prev.map((idx) => pickDifferent(idx)));
    }, CYCLE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div
      className="relative flex items-stretch w-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {slotBrands.map((brandIdx, slotIdx) => {
        const brand = brands[brandIdx];
        return (
          <div
            key={slotIdx}
            className="relative flex-1 h-5 md:h-6 overflow-visible"
          >
            <AnimatePresence>
              <motion.div
                // Keying on slot+brand makes AnimatePresence treat each swap
                // as a new element, so exit and enter run together.
                key={`${slotIdx}-${brand.name}`}
                initial={{ opacity: 0, x: -6, filter: "blur(4px)" }}
                animate={enterAnim}
                exit={exitAnim}
                transition={{
                  duration: 0.5,
                  // Tiny per-slot stagger so the row glitches in waves
                  // rather than firing as a single block.
                  delay: (slotIdx % 3) * 0.06,
                  ease: "easeOut",
                }}
                className="absolute inset-0 flex items-center justify-center gap-2 text-xs md:text-sm text-white/70"
              >
                {brandIcons[brand.icon]}
                <span className="select-none">{brand.name}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
};

export default BrandsCarousel;
