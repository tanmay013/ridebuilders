"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import PriceToggle, { type PriceMode } from "./PriceToggle";
import type { CarDetail, CarVariant } from "./carDetail";

interface VariantsPricingProps {
  detail: CarDetail;
  priceMode: PriceMode;
  onPriceModeChange: (next: PriceMode) => void;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

interface VariantRowProps {
  variant: CarVariant;
  index: number;
  highlighted: boolean;
}

const VariantRow: FC<VariantRowProps> = ({ variant, index, highlighted }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
      duration: 0.55,
      delay: 0.04 + index * 0.05,
      ease: easeOut,
    }}
    whileHover={{ y: -2 }}
    className={`group relative grid grid-cols-12 items-center gap-3 rounded-2xl border px-4 py-4 transition-all md:px-6 md:py-5 ${
      highlighted
        ? "border-red-500/40 bg-red-500/[0.06]"
        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
    }`}
  >
    {highlighted && (
      <span className="absolute -top-2.5 left-5 rounded-full border border-red-500/40 bg-red-500/95 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_6px_18px_rgba(239,68,68,0.45)]">
        Popular
      </span>
    )}

    <div className="col-span-12 md:col-span-5">
      <p className="text-base font-semibold tracking-tight text-white md:text-lg">
        {variant.name}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/50">
        {variant.fuel} • {variant.transmission}
      </p>
    </div>

    <div className="col-span-6 md:col-span-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
        Showroom
      </p>
      <p className="mt-1 text-sm font-semibold text-white/85 md:text-base">
        {variant.showroomPrice}
      </p>
    </div>

    <div className="col-span-6 md:col-span-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
        On-road
      </p>
      <p
        className={`mt-1 text-sm font-semibold md:text-base ${
          highlighted ? "text-red-300" : "text-white"
        }`}
      >
        {variant.onRoadPrice}
      </p>
    </div>

  </motion.div>
);

const VariantsPricing: FC<VariantsPricingProps> = ({
  detail,
  priceMode,
  onPriceModeChange,
}) => {
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
  const tableY = useTransform(smooth, [0, 1], [18, -18]);

  return (
    <section
      ref={sectionRef}
      id="variants"
      className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end"
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
              Pricing & variants
            </p>
            <h2
              className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
            >
              All {detail.variants.length} variants, both prices.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              Toggle between ex-showroom and on-road pricing. Default city is Delhi — actual numbers vary by city and dealer.
            </p>
          </div>
          {/* <PriceToggle value={priceMode} onChange={onPriceModeChange} /> */}
        </motion.div>

        {/* Table */}
        <motion.div
          style={{ y: tableY }}
          className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-3 backdrop-blur-md md:mt-14 md:p-4"
        >
          {/* Table header (desktop only) */}
          <div className="hidden grid-cols-12 gap-3 px-6 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 md:grid">
            <p className="col-span-5">Variant</p>
            <p className="col-span-3">Ex-showroom</p>
            <p className="col-span-3">On-road</p>
            {/* <p className="col-span-1 text-right">Quote</p> */}
          </div>

          <div className="space-y-3">
            {detail.variants.map((v, i) => (
              <VariantRow
                key={v.name}
                variant={v}
                index={i}
                highlighted={Boolean(v.highlight)}
              />
            ))}
          </div>
        </motion.div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-[12px] leading-relaxed text-white/45">
          On-road price is indicative and includes road tax, insurance, registration and handling. Final numbers depend on city, variant, and selected accessories.
        </p>
      </div>
    </section>
  );
};

export default VariantsPricing;
