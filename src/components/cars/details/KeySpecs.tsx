"use client";

import type { FC, ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { CarDetail } from "./carDetail";

interface KeySpecsProps {
  detail: CarDetail;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const Icon: FC<{ children: ReactNode }> = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-[18px] w-[18px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

const specIcons: Record<string, ReactNode> = {
  engine: (
    <Icon>
      <path d="M4 9h3l2-2h6l2 2h3v6h-3l-2 2H9l-2-2H4z" />
      <path d="M12 9v6" />
    </Icon>
  ),
  power: (
    <Icon>
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </Icon>
  ),
  torque: (
    <Icon>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
      <path d="M12 8v4l3 2" />
    </Icon>
  ),
  zero: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  ),
  speed: (
    <Icon>
      <path d="M3 13a9 9 0 0 1 18 0" />
      <path d="M12 13l4-3" />
      <circle cx="12" cy="13" r="1.4" fill="currentColor" stroke="none" />
    </Icon>
  ),
  fuel: (
    <Icon>
      <path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />
      <path d="M4 21h11" />
      <path d="M15 9h2l2 2v6a2 2 0 0 1-2 2" />
    </Icon>
  ),
  fueltype: (
    <Icon>
      <path d="M12 2 4 12h5v8h6v-8h5z" />
    </Icon>
  ),
  gears: (
    <Icon>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <path d="M6 8v4M6 16v0M6 12h6M18 8v8" />
    </Icon>
  ),
  star: (
    <Icon>
      <path d="m12 3 2.7 6.6L22 11l-5.5 4.7L18 23l-6-3.7L6 23l1.5-7.3L2 11l7.3-1.4Z" />
    </Icon>
  ),
};

const KeySpecs: FC<KeySpecsProps> = ({ detail }) => {
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
  const gridY = useTransform(smooth, [0, 1], [16, -16]);

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
              Key specifications
            </p>
            <h2
              className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
            >
              The numbers that matter.
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/55 md:text-right md:text-base">
            Verified from the manufacturer&apos;s spec sheet. Real-world performance can vary with conditions and trim.
          </p>
        </motion.div>

        <motion.div
          style={{ y: gridY }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-14 lg:grid-cols-3 md:gap-4"
        >
          {detail.keySpecs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: 0.05 + (i % 6) * 0.06,
                ease: easeOut,
              }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5 transition-colors hover:bg-white/[0.05] hover:ring-white/15 md:p-6"
            >
              <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(180px circle at 30% 0%, rgba(239,68,68,0.16), transparent 70%)",
                }}
                aria-hidden
              />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-red-400 ring-1 ring-white/10">
                  {specIcons[spec.icon] ?? specIcons.engine}
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  {spec.label}
                </p>
              </div>
              <p
                className="mt-5 text-lg font-semibold tracking-tight text-white md:text-xl"
                style={{ letterSpacing: "-0.01em" }}
              >
                {spec.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default KeySpecs;
