"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { CarDetail } from "./carDetail";

interface ExpertReviewSectionProps {
  detail: CarDetail;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const StarRating: FC<{ value: number; size?: "sm" | "md" }> = ({
  value,
  size = "md",
}) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const dim = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="inline-flex items-center gap-0.5">
      {stars.map((s) => {
        const filled = value >= s - 0.25;
        const half = !filled && value >= s - 0.75;
        return (
          <svg
            key={s}
            viewBox="0 0 24 24"
            className={`${dim} ${filled || half ? "text-red-500" : "text-white/15"}`}
            fill="currentColor"
            aria-hidden
          >
            <defs>
              <linearGradient id={`half-${s}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
              </linearGradient>
            </defs>
            <path
              d="m12 3 2.7 6.6L22 11l-5.5 4.7L18 23l-6-3.7L6 23l1.5-7.3L2 11l7.3-1.4Z"
              fill={half ? `url(#half-${s})` : "currentColor"}
            />
          </svg>
        );
      })}
    </div>
  );
};

const ExpertReviewSection: FC<ExpertReviewSectionProps> = ({ detail }) => {
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
  const cardY = useTransform(smooth, [0, 1], [30, -30]);

  const er = detail.expertReview;
  if (!er) return null;

  return (
    <section
      ref={sectionRef}
      id="expert"
      className="relative overflow-hidden bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
    >
      {/* Faint red spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[60vw] max-h-[600px] w-[60vw] max-w-[600px] rounded-full opacity-40 blur-[100px] bg-[radial-gradient(closest-side,rgba(239,68,68,0.10),rgba(255,255,255,0.04)_50%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="max-w-2xl"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
            Expert review
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            What our editor thinks.
          </h2>
        </motion.div>

        <motion.div
          style={{ y: cardY }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: easeOut, delay: 0.1 }}
          className="mt-10 md:mt-14"
        >
          <div
            className="relative grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl md:grid-cols-12 md:gap-8 md:p-10"
            style={{
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.55)",
            }}
          >
            {/* Reviewer column */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-red-500/40">
                  <img
                    src={er.avatar}
                    alt={er.reviewer}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">
                    {er.reviewer}
                  </p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/55">
                    {er.title}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                  Editor&apos;s score
                </p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span
                    className="text-4xl font-semibold tracking-tight text-white"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {er.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-white/45">/ 5.0</span>
                </div>
                <div className="mt-3">
                  <StarRating value={er.rating} />
                </div>
              </div>
            </div>

            {/* Verdict column */}
            <div className="md:col-span-8">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-red-500/80"
                fill="currentColor"
                aria-hidden
              >
                <path d="M9 6c-3 0-5 2-5 5v7h6v-7H7c0-2 1-3 3-3zm9 0c-3 0-5 2-5 5v7h6v-7h-3c0-2 1-3 3-3z" />
              </svg>
              <p
                className="mt-3 text-xl font-medium leading-snug text-white/90 md:text-2xl"
                style={{ letterSpacing: "-0.01em" }}
              >
                {er.verdict}
              </p>

              {er.highlights?.length > 0 && (
                <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {er.highlights.map((h, i) => (
                    <motion.li
                      key={h}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + i * 0.06,
                        ease: easeOut,
                      }}
                      className="flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/[0.08] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-red-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      {h}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertReviewSection;
