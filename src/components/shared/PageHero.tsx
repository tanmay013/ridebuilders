"use client";

import type { FC, ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface PageHeroProps {
  /** Small uppercase tagline (red). */
  eyebrow: string;
  /** Big page title. Supports a `\n` to split into two lines. */
  headline: string;
  /** One-paragraph subhead. */
  description?: string;
  /**
   * Optional background image URL. When provided, the hero gets a
   * subtle parallax + dark overlay treatment matching `AboutHero`.
   * When omitted, a pure-black hero with a soft red glow is rendered
   * (lighter feel — good for legal / list pages).
   */
  image?: string;
  /** Render extra controls (buttons, links, chips) under the description. */
  children?: ReactNode;
  /** Optional last-updated date shown above the eyebrow (used by legal). */
  meta?: string;
  /** Compact vertical rhythm for legal / list pages (vs. tall marketing). */
  compact?: boolean;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const PageHero: FC<PageHeroProps> = ({
  eyebrow,
  headline,
  description,
  image,
  children,
  meta,
  compact = false,
}) => {
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
  const bgY = useTransform(smooth, [0, 1], [0, 100]);
  const bgScale = useTransform(smooth, [0, 1], [1.05, 1.14]);
  const textY = useTransform(smooth, [0, 1], [0, -36]);

  const [line1, line2] = headline.split("\n");

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-black text-white ${
        compact
          ? "min-h-[52vh] md:min-h-[58vh]"
          : "min-h-[72vh] md:min-h-[78vh]"
      }`}
    >
      {/* Background image (optional) */}
      {image && (
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            y: bgY,
            scale: bgScale,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1.2, ease: easeOut }}
          aria-hidden
        />
      )}

      {/* Dark legibility overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,1) 100%)",
        }}
        aria-hidden
      />

      {/* Red glow accent — lower right */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 z-[1] h-[420px] w-[420px] rounded-full opacity-50 blur-[110px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(215,46,46,0.32), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Pulse dot (decorative) */}
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

      {/* Content anchored bottom */}
      <motion.div
        className="absolute inset-x-0 bottom-[50px] z-[2] px-6 md:bottom-[80px] md:px-16"
        style={{ y: textY }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            {meta && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easeOut, delay: 0.05 }}
                className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/45"
              >
                {meta}
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500"
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: easeOut, delay: 0.2 }}
              className="mt-4 max-w-[640px] text-[clamp(36px,4.6vw,64px)] font-medium leading-[1.05] tracking-[-0.02em]"
            >
              {line1}
              {line2 && (
                <>
                  <br />
                  <span className="text-white/85">{line2}</span>
                </>
              )}
            </motion.h1>
          </div>

          {(description || children) && (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: easeOut, delay: 0.3 }}
              className="md:col-span-5 md:justify-self-end md:text-right"
            >
              {description && (
                <p className="max-w-[480px] text-base leading-[1.65] text-white/80 md:ml-auto">
                  {description}
                </p>
              )}
              {children && (
                <div className="mt-5 flex flex-wrap items-center gap-2 md:justify-end">
                  {children}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default PageHero;
