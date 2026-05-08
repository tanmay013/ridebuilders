"use client";

import type { FC } from "react";
import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import siteData from "@/data/site.json";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface TrustStatsContent {
  eyebrow: string;
  headline: string;
  description: string;
  stats: Stat[];
}

const trust = siteData.trustStats as TrustStatsContent;

// Pretty-format an integer with thousand separators (12000 → "12,000").
const formatNumber = (n: number) => Math.round(n).toLocaleString("en-US");

interface CounterProps {
  value: number;
  suffix: string;
  inView: boolean;
  delay?: number;
}

const Counter: FC<CounterProps> = ({ value, suffix, inView, delay = 0 }) => {
  const motionValue = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, motionValue, value, delay]);

  useEffect(() => {
    return motionValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatNumber(latest);
      }
    });
  }, [motionValue]);

  return (
    <span className="inline-flex items-baseline">
      <span ref={ref}>0</span>
      <span>{suffix}</span>
    </span>
  );
};

const TrustStatsSection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const headingY = useTransform(smoothProgress, [0, 1], [20, -20]);
  const gridY = useTransform(smoothProgress, [0, 1], [10, -10]);

  return (
    <section
      ref={sectionRef}
      id="trust"
      className="relative bg-black py-20 md:py-28 px-6 md:px-10 lg:px-16 overflow-hidden"
    >
      {/* Faint radial spotlight behind the headline so the numbers feel anchored */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full opacity-40 blur-[100px] bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center max-w-2xl mx-auto"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] md:text-xs uppercase tracking-[0.22em] text-white/45">
            {trust.eyebrow}
          </p>
          <h2
            className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            {trust.headline}
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/60 leading-relaxed">
            {trust.description}
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          style={{ y: gridY }}
          className="mt-14 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-14 max-w-5xl mx-auto"
        >
          {trust.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div
                className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight tabular-nums"
                style={{ letterSpacing: "-0.04em" }}
              >
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                  delay={i * 0.08}
                />
              </div>
              <p className="mt-3 text-xs md:text-sm uppercase tracking-[0.18em] text-white/55">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustStatsSection;
