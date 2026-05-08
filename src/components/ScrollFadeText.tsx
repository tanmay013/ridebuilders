"use client";

import type { FC, ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface ScrollFadeTextProps {
  /** The text to render. Lines can be separated with \n; each line wraps. */
  text: string;
  /** Tailwind classes applied to the wrapping <div>. Caller owns typography. */
  className?: string;
  /** Opacity at the start of each word's progress slice. Default 0.15. */
  inactiveOpacity?: number;
}

/**
 * Renders a single word whose opacity follows a slice of the parent's scroll
 * progress. We pass the parent's MotionValue down rather than each word
 * computing its own — keeps useScroll calls to one per ScrollFadeText.
 */
const Word: FC<{
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  inactive: number;
}> = ({ children, progress, range, inactive }) => {
  const opacity = useTransform(progress, range, [inactive, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
};

/**
 * Scroll-driven word fade. Each word in `text` lights up sequentially as the
 * section travels through the viewport. Inspired by Framer's ScrollFadeText
 * code component pattern; reimplemented here against framer-motion's hooks
 * so it lives inside the project rather than a remote ESM dependency.
 */
const ScrollFadeText: FC<ScrollFadeTextProps> = ({
  text,
  className = "",
  inactiveOpacity = 0.15,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Section enters at viewport's bottom 90% and finishes lighting up by the
  // time the section's top is 25% from the viewport's top — gives the user
  // a comfortable read-rhythm.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.25"],
  });

  // Split per line, then per word, preserving newlines so callers can pass
  // formatted multi-line copy. Whitespace gaps are added back via gap-x.
  const lines = text.split("\n").map((line) => line.split(" ").filter(Boolean));
  // Flat word index across all lines drives the per-word range.
  const totalWords = lines.reduce((n, words) => n + words.length, 0);
  let runningIndex = 0;

  return (
    <div ref={ref} className={className}>
      {lines.map((words, lineIdx) => (
        <span
          key={lineIdx}
          className="block flex-wrap justify-center inline-flex gap-x-[0.32em]"
        >
          {words.map((word, i) => {
            const idx = runningIndex++;
            const start = idx / totalWords;
            const end = start + 1 / totalWords;
            return (
              <Word
                key={`${lineIdx}-${i}`}
                progress={scrollYProgress}
                range={[start, end]}
                inactive={inactiveOpacity}
              >
                {word}
              </Word>
            );
          })}
        </span>
      ))}
    </div>
  );
};

export default ScrollFadeText;
