"use client";

import type { FC } from "react";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { CarDetail } from "./carDetail";

interface FaqSectionProps {
  detail: CarDetail;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

interface FaqItemProps {
  q: string;
  a: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem: FC<FaqItemProps> = ({ q, a, index, isOpen, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.55, delay: 0.05 + index * 0.05, ease: easeOut }}
    className={`overflow-hidden rounded-2xl border transition-colors ${
      isOpen
        ? "border-red-500/30 bg-red-500/[0.05]"
        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
    }`}
  >
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6 md:py-6"
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
          isOpen ? "bg-red-500 text-white" : "bg-white/[0.08] text-white/70"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex-1 text-base font-semibold tracking-tight text-white md:text-lg">
        {q}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.3, ease: easeOut }}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          isOpen ? "text-red-400" : "text-white/65"
        }`}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </motion.span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="overflow-hidden"
        >
          <div className="border-t border-white/10 px-5 pb-5 pl-[68px] pt-4 text-sm leading-relaxed text-white/70 md:px-6 md:pb-6 md:pl-[72px] md:pt-5 md:text-[15px]">
            {a}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FaqSection: FC<FaqSectionProps> = ({ detail }) => {
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
  const listY = useTransform(smooth, [0, 1], [18, -18]);

  const [openIdx, setOpenIdx] = useState<number>(0);

  if (!detail.faqs?.length) return null;

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* Left heading */}
        <motion.div
          className="md:col-span-5"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
            Frequently asked
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            Need clarity?
            <br />
            <span className="text-white/70">We&apos;ve got you.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
            The questions we hear most about the {detail.basic.name}, answered straight.
          </p>

          {/* <a
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 border-b-2 border-red-500 pb-1 text-sm font-medium text-white transition-all hover:gap-3"
          >
            Talk to an advisor
            <span aria-hidden>→</span>
          </a> */}
        </motion.div>

        {/* FAQ list */}
        <motion.div
          style={{ y: listY }}
          className="md:col-span-7"
        >
          <div className="space-y-3 md:space-y-4">
            {detail.faqs.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                index={i}
                isOpen={i === openIdx}
                onToggle={() => setOpenIdx(i === openIdx ? -1 : i)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
