"use client";

import type { FC } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress: FC = () => {
  // Page-wide scroll progress (0 → 1 from top to bottom of document).
  const { scrollYProgress } = useScroll();

  // Spring-smoothed so the bar lerps to its target rather than tracking the
  // raw scroll value 1:1. This is what gives the bar (and, combined with the
  // section parallax, the whole page) that "snappy" lagged feel.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <motion.div
      // origin-left so the bar grows from the leading edge as scaleX increases.
      className="fixed inset-x-0 top-0 z-[200] h-[2px] origin-left bg-white/85"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
};

export default ScrollProgress;
