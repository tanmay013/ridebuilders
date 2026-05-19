"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { CarDetail } from "./carDetail";

interface ProsConsProps {
  detail: CarDetail;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

interface ListCardProps {
  variant: "pros" | "cons";
  items: string[];
}

const ListCard: FC<ListCardProps> = ({ variant, items }) => {
  const isPros = variant === "pros";
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.8,
        ease: easeOut,
        delay: isPros ? 0.05 : 0.15,
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:p-8"
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 30px 80px -20px rgba(0,0,0,0.55)",
      }}
    >
      {/* Tint glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-64 w-64 rounded-full blur-3xl"
        style={{
          background: isPros
            ? "radial-gradient(closest-side, rgba(45,212,131,0.18), transparent 70%)"
            : "radial-gradient(closest-side, rgba(239,68,68,0.18), transparent 70%)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
              isPros
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/40 bg-red-500/10 text-red-400"
            }`}
          >
            {isPros ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12l4 4 10-10" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            )}
          </div>
          <div>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                isPros ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPros ? "What we love" : "Where it falls short"}
            </p>
            <h3
              className="mt-0.5 text-2xl font-semibold tracking-tight text-white md:text-3xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {isPros ? "Pros" : "Cons"}
            </h3>
          </div>
        </div>
        <span className="text-xs uppercase tracking-[0.14em] text-white/35">
          {items.length}
        </span>
      </div>

      <ul className="relative mt-6 space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: isPros ? -16 : 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + i * 0.06,
              ease: easeOut,
            }}
            className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5"
          >
            <span
              className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white ${
                isPros ? "bg-emerald-500" : "bg-red-500"
              }`}
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isPros ? (
                  <path d="M5 12l4 4 10-10" />
                ) : (
                  <path d="M6 6l12 12M18 6 6 18" />
                )}
              </svg>
            </span>
            <span className="text-[13.5px] leading-relaxed text-white/80 md:text-[14.5px]">
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const ProsCons: FC<ProsConsProps> = ({ detail }) => {
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
  const gridY = useTransform(smooth, [0, 1], [18, -18]);

  return (
    <section
      ref={sectionRef}
      id="pros-cons"
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
            Pros & cons
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            The honest summary.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            Everything we&apos;d shout from the rooftop, and the niggles we&apos;d wish away.
          </p>
        </motion.div>

        <motion.div
          style={{ y: gridY }}
          className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 md:gap-6"
        >
          <ListCard variant="pros" items={detail.pros} />
          <ListCard variant="cons" items={detail.cons} />
        </motion.div>
      </div>
    </section>
  );
};

export default ProsCons;
