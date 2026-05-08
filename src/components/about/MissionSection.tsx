"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import siteData from "@/data/site.json";

interface MissionStat {
  label: string;
  value: string;
}

interface MissionContent {
  eyebrow: string;
  headline: string;
  description: string;
  stats: MissionStat[];
  image: string;
}

const mission = siteData.aboutPage.mission as MissionContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

const MissionSection: FC = () => {
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
  const textY = useTransform(smooth, [0, 1], [30, -30]);
  const imageY = useTransform(smooth, [0, 1], [50, -50]);
  const imageScale = useTransform(smooth, [0, 0.5, 1], [1.05, 1, 1.04]);

  return (
    <section
      ref={sectionRef}
      id="mission"
      className="relative bg-black px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
        {/* Left — copy + stats */}
        <motion.div
          className="md:col-span-6"
          style={{ y: textY }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
            {mission.eyebrow}
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            {mission.headline}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            {mission.description}
          </p>

          {/* Stat strip */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {mission.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.6,
                  delay: 0.05 + i * 0.08,
                  ease: easeOut,
                }}
              >
                <p
                  className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/55">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — glass image card */}
        <motion.div
          className="relative md:col-span-6"
          style={{ y: imageY }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
        >
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white/[0.05] ring-1 ring-white/15 shadow-2xl shadow-black/40"
            style={{
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 30px 80px -20px rgba(0,0,0,0.55)",
            }}
          >
            <motion.img
              src={mission.image}
              alt="RideBuilders mission"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ scale: imageScale }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0";
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            {/* Caption chip */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/40 px-4 py-3 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-medium tracking-wide text-white/85">
                Verified spec lab · Bengaluru
              </span>
            </div>
          </div>

          {/* Floating accent block */}
          <div
            className="pointer-events-none absolute -top-6 -left-6 hidden h-24 w-24 rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-md md:block"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;
