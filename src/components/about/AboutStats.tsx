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

interface StatsContent {
  eyebrow: string;
  headline: string;
  description: string;
  items: Stat[];
}

const stats = siteData.aboutPage.stats as StatsContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

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
      ease: easeOut,
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

const AboutStats: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const headingY = useTransform(smooth, [0, 1], [20, -20]);
  const gridY = useTransform(smooth, [0, 1], [10, -10]);

  return (
    <section
      ref={sectionRef}
      id="about-stats"
      className="relative overflow-hidden bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
    >
      {/* Faint red spotlight to anchor numbers */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] rounded-full opacity-50 blur-[110px] bg-[radial-gradient(closest-side,rgba(239,68,68,0.10),rgba(255,255,255,0.04)_50%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
            {stats.eyebrow}
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            {stats.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg">
            {stats.description}
          </p>
        </motion.div>

        <motion.div
          style={{ y: gridY }}
          className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 md:mt-20 md:gap-y-14"
        >
          {stats.items.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: easeOut,
              }}
            >
              <div
                className="text-5xl font-semibold tabular-nums tracking-tight text-white md:text-6xl lg:text-7xl"
                style={{ letterSpacing: "-0.04em" }}
              >
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                  delay={i * 0.08}
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/55 md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutStats;
