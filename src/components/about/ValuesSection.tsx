"use client";

import type { FC, ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import siteData from "@/data/site.json";

type ValueIconKey = "shield" | "compass" | "sparkle" | "heart";

interface ValueItem {
  title: string;
  description: string;
  icon: ValueIconKey;
}

interface ValuesContent {
  eyebrow: string;
  headline: string;
  description: string;
  items: ValueItem[];
}

const values = siteData.aboutPage.values as ValuesContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

const valueIcons: Record<ValueIconKey, ReactNode> = {
  shield: (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  compass: (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 6-4 1 1-4 5-3Z" />
    </svg>
  ),
  sparkle: (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5 8 8M16 16l2.5 2.5M5.5 18.5 8 16M16 8l2.5-2.5" />
    </svg>
  ),
  heart: (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
    </svg>
  ),
};

interface ValueCardProps {
  item: ValueItem;
  index: number;
}

const ValueCard: FC<ValueCardProps> = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
      duration: 0.7,
      delay: (index % 4) * 0.08,
      ease: easeOut,
    }}
    whileHover={{ y: -4 }}
    className="group relative overflow-hidden rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/10 transition-colors hover:bg-white/[0.05] hover:ring-white/20 md:p-7"
  >
    {/* Hover red glow */}
    <div
      className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(180px circle at 30% 0%, rgba(239,68,68,0.18), transparent 70%)",
      }}
      aria-hidden
    />

    <div className="relative">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/85 ring-1 ring-white/10 transition-colors group-hover:text-white">
        {valueIcons[item.icon]}
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-white md:text-xl">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60 md:text-[15px]">
        {item.description}
      </p>
    </div>
  </motion.div>
);

const ValuesSection: FC = () => {
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
  const gridY = useTransform(smooth, [0, 1], [12, -12]);

  return (
    <section
      ref={sectionRef}
      id="values"
      className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="max-w-2xl"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
            {values.eyebrow}
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            {values.headline}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            {values.description}
          </p>
        </motion.div>

        <motion.div
          style={{ y: gridY }}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 md:gap-6"
        >
          {values.items.map((item, i) => (
            <ValueCard key={item.title} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;
