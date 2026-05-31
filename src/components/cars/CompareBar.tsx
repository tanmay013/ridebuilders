"use client";

import type { FC } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import siteData from "@/data/site.json";

interface ComparePick {
  brand: string;
  name: string;
  image: string;
}

const compareBar = siteData.carsPage.compareBar as {
  left: ComparePick | null;
  right: ComparePick | null;
};

const Slot: FC<{ pick: ComparePick; onRemove: () => void }> = ({ pick, onRemove }) => (
  <div className="flex items-center gap-3 min-w-0">
    <div className="relative h-11 w-11 md:h-12 md:w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10">
      <img
        src={pick.image}
        alt={pick.name}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
      />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] md:text-xs text-white/55">{pick.brand}</p>
      <p className="text-sm md:text-[15px] font-semibold text-white truncate">
        {pick.name}
      </p>
    </div>
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${pick.name}`}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/55 hover:text-white hover:bg-white/[0.08] transition-colors"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 6 18 18M18 6 6 18" />
      </svg>
    </button>
  </div>
);

const CompareBar: FC = () => {
  const [left, setLeft] = useState<ComparePick | null>(compareBar.left);
  const [right, setRight] = useState<ComparePick | null>(compareBar.right);

  // If both slots are empty, hide the bar entirely.
  const visible = left || right;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="compare-bar"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 28, mass: 0.6 }}
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[min(96vw,1100px)] px-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] items-center gap-3 md:gap-5 rounded-2xl bg-neutral-950/85 backdrop-blur-md ring-1 ring-white/10 p-3 md:p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
            {/* Left pick */}
            <div className="px-2">
              {left ? (
                <Slot pick={left} onRemove={() => setLeft(null)} />
              ) : (
                <div className="flex items-center gap-3 text-white/40 text-sm italic">
                  Pick a car…
                </div>
              )}
            </div>

            {/* VS circle */}
            <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full ring-2 ring-red-500/70">
              <span className="text-red-500 text-sm font-bold tracking-tight">VS</span>
            </div>

            {/* Right pick */}
            <div className="px-2">
              {right ? (
                <Slot pick={right} onRemove={() => setRight(null)} />
              ) : (
                <div className="flex items-center gap-3 text-white/40 text-sm italic">
                  Pick a car…
                </div>
              )}
            </div>

            {/* CTA */}
            <a
              href="/compare"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm md:text-[15px] font-semibold px-5 py-3 md:px-6 md:py-3.5 transition-all whitespace-nowrap"
            >
              Compare Now
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareBar;
