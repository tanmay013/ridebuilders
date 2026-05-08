"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import siteData from "@/data/site.json";

interface HeroContent {
  eyebrow: string;
  headline: string;
  description: string;
  image: string;
}

const hero = siteData.aboutPage.hero as HeroContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

const AboutHero: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const bgY = useTransform(smooth, [0, 1], [0, 120]);
  const bgScale = useTransform(smooth, [0, 1], [1.05, 1.15]);
  const textY = useTransform(smooth, [0, 1], [0, -40]);
  const textOpacity = useTransform(smooth, [0, 0.7], [1, 0]);

  const [line1, line2] = hero.headline.split("\n");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] w-full overflow-hidden bg-black text-white"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${hero.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          y: bgY,
          scale: bgScale,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 1.2, ease: easeOut }}
        aria-hidden
      />

      {/* Gradient overlays for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,1) 100%)",
        }}
        aria-hidden
      />

      {/* Soft red glow accent in lower-right */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 z-[1] h-[460px] w-[460px] rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(215,46,46,0.35), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Pulse dot accent (top-right) */}
      <motion.span
        className="pointer-events-none absolute right-10 top-32 z-[2] h-[10px] w-[10px] rounded-full bg-[#d72e2e] md:right-24 md:top-40"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.8, 1, 0.8],
          boxShadow: [
            "0 0 0px rgba(215,46,46,0.35)",
            "0 0 18px rgba(215,46,46,0.7)",
            "0 0 0px rgba(215,46,46,0.35)",
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      {/* Bottom-anchored content */}
      <motion.div
        className="absolute bottom-[60px] left-0 right-0 z-[2] px-6 md:bottom-[80px] md:px-16"
        style={{ y: textY, opacity: textOpacity }}
      >
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-[60px]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500"
            >
              {hero.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: easeOut, delay: 0.18 }}
              className="mt-4 max-w-[640px] text-[clamp(36px,4.6vw,64px)] font-medium leading-[1.05] tracking-[-0.02em]"
            >
              {line1}
              <br />
              <span className="text-white/90">{line2}</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: easeOut, delay: 0.28 }}
            className="max-w-[480px] md:ml-auto"
          >
            <p className="text-base leading-[1.65] text-white/80">
              {hero.description}
            </p>
            <a
              href="#mission"
              className="mt-6 inline-flex items-center gap-2 border-b-2 border-red-500 pb-1 text-sm font-medium text-white transition-all hover:gap-3"
            >
              Read our story
              <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutHero;
