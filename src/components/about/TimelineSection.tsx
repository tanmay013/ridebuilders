"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import siteData from "@/data/site.json";

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface TimelineContent {
  eyebrow: string;
  headline: string;
  description: string;
  milestones: Milestone[];
}

const timeline = siteData.aboutPage.timeline as TimelineContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

const TimelineSection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 30%"],
  });
  const railFill = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });
  const railHeight = useTransform(railFill, [0, 1], ["0%", "100%"]);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sectionSmooth = useSpring(sectionProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const headingY = useTransform(sectionSmooth, [0, 1], [25, -25]);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative bg-black px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <motion.div
          className="max-w-2xl"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
            {timeline.eyebrow}
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            {timeline.headline}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            {timeline.description}
          </p>
        </motion.div>

        {/* Timeline rail */}
        <div ref={railRef} className="relative mt-14 md:mt-20">
          {/* Background rail */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-white/10 md:left-4" />
          {/* Animated red fill */}
          <motion.div
            className="absolute left-3 top-2 w-px bg-gradient-to-b from-red-500 via-red-500/70 to-red-500/0 md:left-4"
            style={{ height: railHeight }}
          />

          <ul className="space-y-10 md:space-y-14">
            {timeline.milestones.map((m, i) => (
              <motion.li
                key={`${m.year}-${m.title}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{
                  duration: 0.7,
                  delay: 0.05 + i * 0.05,
                  ease: easeOut,
                }}
                className="relative pl-12 md:pl-16"
              >
                {/* Dot */}
                <span
                  className="absolute left-0 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-red-500/45 bg-black md:h-8 md:w-8"
                  aria-hidden="true"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.7)]" />
                </span>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5 transition-colors hover:bg-white/[0.05] hover:ring-white/15 md:p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-red-500/35 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400">
                      {m.year}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight text-white md:text-xl">
                      {m.title}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                    {m.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
