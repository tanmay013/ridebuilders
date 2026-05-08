"use client";

import type { FC, MouseEvent } from "react";
import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import siteData from "@/data/site.json";

interface SideCard {
  label: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

interface ChooseSideContent {
  eyebrow: string;
  headline: string;
  description: string;
  left: SideCard;
  right: SideCard;
}

const choose = siteData.chooseSide as ChooseSideContent;

// Small icon at the top of the center column.
const PersonIcon: FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 80 100"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="40" cy="22" r="14" />
    <path d="M22 50 Q40 42 58 50 L60 100 L20 100 Z" />
  </svg>
);

// Larger back-facing standing figure rendered at the bottom of the
// center column. Geometric, no facial features — a pure silhouette.
const StandingFigure: FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 220"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    {/* head */}
    <ellipse cx="50" cy="22" rx="13" ry="15" />
    {/* shoulders + torso (with hood-like rounded top) */}
    <path d="M28 50 Q35 44 50 42 Q65 44 72 50 Q74 80 72 110 L70 145 L62 145 L58 122 L50 122 L42 122 L38 145 L30 145 L28 110 Q26 80 28 50 Z" />
    {/* left arm */}
    <path d="M28 52 Q22 75 22 110 L24 145 L30 145 L31 120 L33 90 L34 65 Z" />
    {/* right arm */}
    <path d="M72 52 Q78 75 78 110 L76 145 L70 145 L69 120 L67 90 L66 65 Z" />
    {/* left leg */}
    <path d="M37 145 L34 180 L33 215 L43 215 L44 180 L46 145 Z" />
    {/* right leg */}
    <path d="M54 145 L56 180 L57 215 L67 215 L66 180 L63 145 Z" />
  </svg>
);

interface TiltCardProps {
  side: SideCard;
  glow: "warm" | "cool";
  parallaxY: MotionValue<number>;
  delay?: number;
}

// Rest shadow is the same shape (5 layers, matching offset/spread) as the
// hover shadow but with the colored halos zeroed out — keeping the structure
// identical lets CSS interpolate cleanly between rest and hover.
const REST_SHADOW = [
  "0 0 0 1px rgba(255,255,255,0.08)",
  "0 0 60px 8px rgba(0,0,0,0)",
  "0 0 140px 30px rgba(0,0,0,0)",
  "0 0 60px 0 rgba(0,0,0,0.55)",
  "inset 0 0 0 1px rgba(255,255,255,0.05)",
].join(", ");

const GLOW_PRESETS = {
  warm: {
    // Each layer uses POSITIVE spread so the halo radiates evenly on all
    // four sides. The centered drop shadow (offset 0) replaces the old
    // bottom-heavy 0/30/80 drop, balancing top vs bottom lighting.
    hoverShadow: [
      "0 0 0 1px rgba(255,180,80,0.4)",
      "0 0 60px 8px rgba(255,150,50,0.28)",
      "0 0 140px 30px rgba(255,140,40,0.18)",
      "0 0 60px 0 rgba(0,0,0,0.5)",
      "inset 0 0 0 1px rgba(255,210,140,0.25)",
    ].join(", "),
    floorTint: "rgba(255,160,50,0.55)",
    streakTint: "rgba(255,170,60,0.4)",
  },
  cool: {
    hoverShadow: [
      "0 0 0 1px rgba(255,255,255,0.32)",
      "0 0 60px 8px rgba(255,255,255,0.16)",
      "0 0 140px 30px rgba(255,255,255,0.10)",
      "0 0 60px 0 rgba(0,0,0,0.5)",
      "inset 0 0 0 1px rgba(255,255,255,0.3)",
    ].join(", "),
    floorTint: "rgba(255,255,255,0.4)",
    streakTint: "rgba(255,255,255,0.3)",
  },
} as const;

const TiltCard: FC<TiltCardProps> = ({ side, glow, parallaxY, delay = 0 }) => {
  // Mouse-tracked tilt — subtler than before so the still glow stays primary.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 240, damping: 24 });
  const sy = useSpring(my, { stiffness: 240, damping: 24 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-7deg", "7deg"]);

  const glareX = useTransform(sx, [-0.5, 0.5], ["15%", "85%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["15%", "85%"]);
  const glare = useMotionTemplate`radial-gradient(at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 55%)`;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    mx.set(0);
    my.set(0);
  };

  const preset = GLOW_PRESETS[glow];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      style={{ y: parallaxY, perspective: "1500px" }}
      className="relative w-full"
    >
      <motion.a
        href={side.href}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: isHovered ? preset.hoverShadow : REST_SHADOW,
          // CSS transition picks up the change because both presets share
          // the same 5-layer structure with matching offset/spread values —
          // only the colour/alpha values differ.
          transition: "box-shadow 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="group relative block aspect-[3/4.4] rounded-[1.75rem] overflow-hidden bg-neutral-950"
      >
        {/* Fallback gradient — shows when the image isn't there */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />

        {/* Vehicle image — fills the card; object-fill stretches to the frame when aspect ratios differ */}
        <img
          src={side.image}
          alt={side.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-fill object-center opacity-90"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />

        {/* Vertical gradient — fades the photo into black for the label half */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black" />

        {/* Cursor-following glare — only visible while hovered. The radial
            gradient itself never goes away (it's spring-tracked), but its
            opacity is bound to the hover state so the still card stays clean. */}
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            background: glare,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Label content — translateZ so it sits forward as the card tilts */}
        <div
          style={{ transform: "translateZ(50px)" }}
          className="absolute bottom-0 left-0 right-0 p-7 md:p-9 lg:p-10"
        >
          <p className="text-[11px] md:text-xs uppercase tracking-[0.22em] text-white/55">
            {side.label}
          </p>
          <h3
            className="mt-3 text-4xl md:text-5xl lg:text-6xl font-semibold text-white"
            style={{ letterSpacing: "-0.03em", lineHeight: "1" }}
          >
            {side.title}
          </h3>
          <p className="mt-3 text-sm md:text-base text-white/65 leading-relaxed max-w-[22ch]">
            {side.description}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm text-white group-hover:gap-3 transition-all">
            Explore
            <span aria-hidden>→</span>
          </span>
        </div>
      </motion.a>
    </motion.div>
  );
};

const ChooseSideSection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Section-scoped scroll progress. 0 = section just entering viewport,
  // 1 = section just leaving. We map the same range to multiple parallax
  // layers running at different rates.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Spring-smooth the raw scroll value once, then derive every transform off
  // the smoothed signal. This means the parallax layers all share the same
  // lerped lag — the whole stage moves with one cohesive springy feel rather
  // than tracking the mousewheel literally.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });

  const cardYLeft = useTransform(smoothProgress, [0, 1], [90, -90]);
  const cardYRight = useTransform(smoothProgress, [0, 1], [80, -100]);
  const centerY = useTransform(smoothProgress, [0, 1], [50, -50]);
  const figureY = useTransform(smoothProgress, [0, 1], [25, -25]);
  // Floor opacity + slight scale: feels like the "stage" rising into view
  // as you scroll down to it.
  const floorOpacity = useTransform(smoothProgress, [0.1, 0.5, 0.9], [0, 1, 1]);

  return (
    <section
      ref={sectionRef}
      id="choose"
      className="relative bg-black overflow-hidden min-h-[800px] md:min-h-[900px] lg:min-h-[960px] py-24 md:py-32 px-6 md:px-10 lg:px-16"
    >
      {/* Distant ambient halo behind everything, hinted by both glows */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[80vw] h-[80vw] max-w-[1100px] max-h-[1100px] rounded-full opacity-50 blur-[120px] bg-[radial-gradient(closest-side,rgba(255,150,40,0.08)_0%,rgba(255,255,255,0.04)_50%,transparent_75%)]" />
      </div>

      {/* Top fog — bleeds the previous section into this one so the
          band of the choose-side stage doesn't begin at a hard line. */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-32 md:h-48 z-[5] bg-gradient-to-b from-black via-black/60 to-transparent"
        aria-hidden="true"
      />

      {/* Full-bleed figure behind the card grid (md+ only). Sized + anchored
          so its top edge always sits BELOW the centered headline, regardless
          of section height. */}
      <motion.div
        style={{ y: figureY }}
        className="pointer-events-none absolute bottom-[2%] left-1/2 z-1 hidden w-screen -translate-x-1/2 md:bottom-[3%] md:block"
        aria-hidden="true"
      >
        <img
          src="/person.png"
          alt=""
          className="h-auto w-full max-h-[min(50vh,460px)] object-contain object-bottom"
          style={{
            mixBlendMode: "screen",
            // Mask shows only the lower ~55% of the image (centered at 78%
            // vertically), so even at the larger size the figure's top edge
            // stays below the headline area.
            WebkitMaskImage:
              "radial-gradient(ellipse 22% 60% at 50% 78%, black 58%, transparent 94%)",
            maskImage:
              "radial-gradient(ellipse 22% 60% at 50% 78%, black 58%, transparent 94%)",
          }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto h-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 lg:gap-10 items-center">
          {/* Left tilt card */}
          <div className="md:col-span-4">
            <TiltCard side={choose.left} glow="warm" parallaxY={cardYLeft} delay={0.05} />
          </div>

          {/* Center column — vertically centered so the headline sits on
              the same baseline as the card titles, not at the top. */}
          <motion.div
            className="md:col-span-4 text-center order-first md:order-none flex flex-col items-center justify-center"
            style={{ y: centerY }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-white/45">
              {choose.eyebrow}
            </p>
            <h2
              className="mt-3 text-4xl md:text-5xl lg:text-6xl font-semibold text-white"
              style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
            >
              {choose.headline}
            </h2>
          </motion.div>

          {/* Right tilt card */}
          <div className="md:col-span-4">
            <TiltCard side={choose.right} glow="cool" parallaxY={cardYRight} delay={0.18} />
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          FLOOR — wet/glossy reflection at the bottom. Three layers:
          1) horizontal ripple stripes masked to fade upward
          2) a colored glow under each card (warm left, cool right)
          3) a black-fade gradient so the floor blends back into bg
          ──────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: floorOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-5 h-[28%] md:h-[32%]"
        aria-hidden="true"
      >
        {/* Horizontal water-ripple stripes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 5px)",
            WebkitMaskImage:
              "linear-gradient(to top, black 0%, black 30%, transparent 90%)",
            maskImage:
              "linear-gradient(to top, black 0%, black 30%, transparent 90%)",
          }}
        />

        {/* Warm glow under left card */}
        <div
          className="absolute bottom-0 left-[5%] md:left-[8%] w-[28%] md:w-[26%] h-full opacity-80"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 10%, rgba(255,160,40,0.55), transparent 70%)",
            filter: "blur(14px)",
          }}
        />

        {/* Cool glow under right card */}
        <div
          className="absolute bottom-0 right-[5%] md:right-[8%] w-[28%] md:w-[26%] h-full opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 10%, rgba(255,255,255,0.4), transparent 70%)",
            filter: "blur(14px)",
          }}
        />

        {/* Bottom black fade so the section blends into the next */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </motion.div>

      {/* Hard bottom seal — sits above the floor reflection so the very
          last few pixels are pure black, removing any seam where the
          ripple stripes meet the next section. */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 md:h-32 z-[6] bg-gradient-to-t from-black to-transparent"
        aria-hidden="true"
      />
    </section>
  );
};

export default ChooseSideSection;
