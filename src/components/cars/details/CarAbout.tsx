"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import PriceToggle, { type PriceMode } from "./PriceToggle";
import type { CarDetail } from "./carDetail";

interface CarAboutProps {
  detail: CarDetail;
  priceMode: PriceMode;
  onPriceModeChange: (next: PriceMode) => void;
  /** Controls the eyebrow label. Defaults to "car". */
  kind?: "car" | "bike";
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const CarAbout: FC<CarAboutProps> = ({
  detail,
  priceMode,
  onPriceModeChange,
  kind = "car",
}) => {
  const { basic, about, highlights, priceNote } = detail;
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
  const textY = useTransform(smooth, [0, 1], [25, -25]);
  const cardY = useTransform(smooth, [0, 1], [40, -40]);

  const displayPrice =
    priceMode === "onRoad" ? detail.onRoadPrice : detail.showroomPrice;
  const altPrice =
    priceMode === "onRoad" ? detail.showroomPrice : detail.onRoadPrice;
  const altLabel =
    priceMode === "onRoad" ? "Ex-showroom" : "On-road";

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-black px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-16">
        {/* Left: copy */}
        <motion.div
          className="md:col-span-7"
          style={{ y: textY }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
            About the {kind}
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            {basic.name}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {about}
          </p>

          {highlights.length > 0 && (
            <ul className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 md:grid-cols-4">
              {highlights.map((chip, i) => (
                <motion.li
                  key={chip}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.08 + i * 0.06,
                    ease: easeOut,
                  }}
                  className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-white/65"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {chip}
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Right: price range glass card */}
        <motion.aside
          className="md:col-span-5"
          style={{ y: cardY }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
        >
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl md:p-8"
            style={{
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.55)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Price range
              </p>
              <PriceToggle
                value={priceMode}
                onChange={onPriceModeChange}
                size="sm"
              />
            </div>

            <div className="mt-5">
              <p
                className="text-4xl font-semibold tracking-tight text-white md:text-5xl"
                style={{ letterSpacing: "-0.025em" }}
              >
                {detail.priceRangeMin}
                <span className="px-2 text-white/35">–</span>
                {detail.priceRangeMax}
              </p>
              <p className="mt-2 text-xs text-white/55">
                {priceMode === "onRoad" ? "On-road, Delhi" : "Ex-showroom, Delhi"} • {detail.variants.length} variants
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                  {priceMode === "onRoad" ? "On-road" : "Ex-showroom"}, base
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  {displayPrice}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                  {altLabel}, base
                </p>
                <p className="mt-1 text-base font-semibold text-white/70">
                  {altPrice}
                </p>
              </div>
            </div>

            {priceNote && (
              <p className="mt-5 text-[11px] leading-relaxed text-white/45">
                {priceNote}
              </p>
            )}
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default CarAbout;
