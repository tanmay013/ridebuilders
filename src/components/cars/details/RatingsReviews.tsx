"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { CarDetail, OwnerReview, RatingBreakdown } from "./carDetail";

interface RatingsReviewsProps {
  detail: CarDetail;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const StarRow: FC<{ value: number; size?: "sm" | "md" }> = ({
  value,
  size = "sm",
}) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const dim = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="inline-flex items-center gap-0.5">
      {stars.map((s) => {
        const filled = value >= s - 0.25;
        return (
          <svg
            key={s}
            viewBox="0 0 24 24"
            className={`${dim} ${filled ? "text-red-500" : "text-white/15"}`}
            fill="currentColor"
            aria-hidden
          >
            <path d="m12 3 2.7 6.6L22 11l-5.5 4.7L18 23l-6-3.7L6 23l1.5-7.3L2 11l7.3-1.4Z" />
          </svg>
        );
      })}
    </div>
  );
};

const BreakdownRow: FC<{ row: RatingBreakdown; index: number }> = ({
  row,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: 0.05 + index * 0.05, ease: easeOut }}
    className="grid grid-cols-12 items-center gap-3 py-2.5"
  >
    <p className="col-span-4 text-xs uppercase tracking-[0.14em] text-white/55 md:text-[13px]">
      {row.label}
    </p>
    <div className="col-span-6">
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: `${(row.value / 5) * 100}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.1 + index * 0.06, ease: easeOut }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-500 via-red-400 to-red-500/70"
        />
      </div>
    </div>
    <p className="col-span-2 text-right text-sm font-semibold tabular-nums text-white">
      {row.value.toFixed(1)}
    </p>
  </motion.div>
);

interface ReviewCardProps {
  review: OwnerReview;
  index: number;
}

const ReviewCard: FC<ReviewCardProps> = ({ review, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
      duration: 0.65,
      delay: 0.05 + index * 0.07,
      ease: easeOut,
    }}
    whileHover={{ y: -3 }}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05] md:p-6"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
          {review.name.slice(0, 1)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{review.name}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/45">
            {review.city} • {review.date}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <StarRow value={review.rating} />
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
          Owned {review.owned}
        </p>
      </div>
    </div>

    <h4 className="mt-4 text-base font-semibold tracking-tight text-white md:text-lg">
      {review.title}
    </h4>
    <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-[14.5px]">
      {review.body}
    </p>
  </motion.article>
);

const RatingsReviews: FC<RatingsReviewsProps> = ({ detail }) => {
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
  const contentY = useTransform(smooth, [0, 1], [18, -18]);

  const ratings = detail.ratings;
  if (!ratings) return null;

  return (
    <section
      ref={sectionRef}
      id="reviews"
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
            Ratings & owner reviews
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            Verified by owners.
          </h2>
        </motion.div>

        <motion.div
          style={{ y: contentY }}
          className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-12 md:gap-8"
        >
          {/* Summary card */}
          <div className="md:col-span-4">
            <div
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl md:p-8"
              style={{
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.55)",
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Overall rating
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <span
                  className="text-6xl font-semibold tracking-tight text-white"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  {ratings.overall.toFixed(1)}
                </span>
                <span className="text-sm text-white/45">/ 5.0</span>
              </div>
              <div className="mt-3">
                <StarRow value={ratings.overall} size="md" />
              </div>
              <p className="mt-3 text-xs text-white/55">
                Based on {ratings.totalReviews.toLocaleString("en-IN")} verified
                owner reviews
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                {ratings.breakdown.map((row, i) => (
                  <BreakdownRow key={row.label} row={row} index={i} />
                ))}
              </div>

              {/* <button
                type="button"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
              >
                Write a review
                <span aria-hidden>→</span>
              </button> */}
            </div>
          </div>

          {/* Reviews list */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 gap-4 md:gap-5">
              {ratings.reviews.map((r, i) => (
                <ReviewCard key={`${r.name}-${i}`} review={r} index={i} />
              ))}
            </div>

            <div className="mt-6 flex justify-center md:mt-8">
              <button
                type="button"
                className="group inline-flex items-center gap-2 px-6 py-3 text-sm text-white/85 transition-colors hover:text-white"
              >
                Load more reviews
                <motion.span
                  aria-hidden
                  className="text-red-500"
                  initial={{ y: 0 }}
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                </motion.span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RatingsReviews;
