"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface SectionTransitionProps {
  /** Visual mode. Default 'line' draws a thin centered horizontal line.
      'dot' renders a single pulsing dot. 'fade' renders empty space only. */
  variant?: "line" | "dot" | "fade";
  /** Override Tailwind height classes. Defaults to h-24 md:h-32. */
  className?: string;
}

/**
 * Breathing-room break between sections. Acts as a deliberate pause in the
 * vertical scroll rhythm so adjacent sections don't feel jammed together.
 * The decorative element scales/fades in based on the spacer's own scroll
 * progress, so the transition is *part of* the scroll experience rather
 * than a static gap.
 */
const SectionTransition: FC<SectionTransitionProps> = ({
  variant = "line",
  className = "h-24 md:h-32",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Spring-smooth so the line growth feels lerped, matching the rest of
  // the site's motion language.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  // Triangle envelope: 0 → 1 by midpoint, then 1 → 0 by exit. Means the
  // decoration is most prominent when the spacer is centered in viewport.
  const envelope = useTransform(smooth, [0, 0.5, 1], [0, 1, 0]);

  return (
    <div
      ref={ref}
      className={`relative w-full bg-black flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      {variant === "line" && (
        <motion.div
          style={{ scaleX: envelope, opacity: envelope }}
          className="h-px w-32 md:w-48 bg-white/30 origin-center"
        />
      )}

      {variant === "dot" && (
        <motion.div
          style={{ scale: envelope, opacity: envelope }}
          className="h-1.5 w-1.5 rounded-full bg-white/40"
        />
      )}

      {/* 'fade' variant renders nothing — just the spacer height itself */}
    </div>
  );
};

export default SectionTransition;
