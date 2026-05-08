"use client";

import type { FC, ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import siteData from "@/data/site.json";

type FeatureIconKey = "compare" | "shield" | "rotate" | "map";

interface Feature {
  title: string;
  description: string;
  icon: FeatureIconKey;
}

interface WhyCompareContent {
  eyebrow: string;
  headline: string;
  description: string;
  features: Feature[];
}

const why = siteData.whyCompare as WhyCompareContent;

const featureIcons: Record<FeatureIconKey, ReactNode> = {
  compare: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h12l-3-3" />
      <path d="M20 17H8l3 3" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  rotate: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
};

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard: FC<FeatureCardProps> = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
      duration: 0.7,
      delay: (index % 4) * 0.08,
      ease: [0.16, 1, 0.3, 1],
    }}
    className="group relative rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-6 md:p-7 hover:bg-white/[0.05] hover:ring-white/20 transition-colors"
  >
    {/* Icon chip */}
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] ring-1 ring-white/10 text-white/85 group-hover:text-white transition-colors">
      {featureIcons[feature.icon]}
    </div>

    <h3 className="mt-5 text-lg md:text-xl font-semibold text-white tracking-tight">
      {feature.title}
    </h3>
    <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-white/60">
      {feature.description}
    </p>
  </motion.div>
);

const WhyCompareSection: FC = () => {
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
  const gridY = useTransform(smoothProgress, [0, 1], [12, -12]);

  return (
    <section
      ref={sectionRef}
      id="why"
      className="relative bg-black py-20 md:py-28 px-6 md:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          className="max-w-2xl"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] md:text-xs uppercase tracking-[0.22em] text-white/45">
            {why.eyebrow}
          </p>
          <h2
            className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            {why.headline}
          </h2>
          <p className="mt-5 text-base md:text-lg text-white/60 leading-relaxed max-w-xl">
            {why.description}
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          style={{ y: gridY }}
          className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {why.features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyCompareSection;
