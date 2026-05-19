"use client";

import type { FC } from "react";
import { motion } from "framer-motion";

export type PriceMode = "showroom" | "onRoad";

interface PriceToggleProps {
  value: PriceMode;
  onChange: (next: PriceMode) => void;
  size?: "sm" | "md";
  className?: string;
}

const PriceToggle: FC<PriceToggleProps> = ({
  value,
  onChange,
  size = "md",
  className = "",
}) => {
  const padY = size === "sm" ? "py-1" : "py-1.5";
  const padX = size === "sm" ? "px-3" : "px-4";
  const text = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <div
      role="tablist"
      aria-label="Price type"
      className={`relative inline-flex items-center gap-1 rounded-full bg-white/[0.05] p-1 ring-1 ring-white/10 backdrop-blur-md ${className}`}
    >
      {(["onRoad", "showroom"] as const).map((mode) => {
        const isActive = mode === value;
        const label = mode === "onRoad" ? "On-road price" : "Showroom price";
        return (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(mode)}
            className={`relative ${padX} ${padY} ${text} font-semibold uppercase tracking-[0.14em] transition-colors ${
              isActive ? "text-white" : "text-white/55 hover:text-white/80"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="price-toggle-pill"
                className="absolute inset-0 rounded-full bg-red-500/90 shadow-[0_6px_18px_rgba(239,68,68,0.45)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PriceToggle;
