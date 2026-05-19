"use client";

import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { CarColor, CarDetail } from "./carDetail";

interface ColorCustomizationProps {
  detail: CarDetail;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const FALLBACK_COLORS: CarColor[] = [
  { name: "Glacier White",  hex: "#f1f3f6", tint: "#ffffff", blend: "screen",   tintOpacity: 0.18 },
  { name: "Obsidian Black", hex: "#1b1c1f", tint: "#0b0c0f", blend: "multiply", tintOpacity: 0.55 },
  { name: "Crimson Red",    hex: "#c41e2a", tint: "#c41e2a", blend: "multiply", tintOpacity: 0.45 },
  { name: "Marina Blue",    hex: "#1f4d8c", tint: "#1f4d8c", blend: "multiply", tintOpacity: 0.5 },
];

interface ColorStageProps {
  color: CarColor;
  baseImage: string;
  alt: string;
}

/**
 * The actual visual stage. Renders either a per-colour image (preferred) or
 * the base car image with a tint overlay (fallback). Image loading errors
 * gracefully fall back to the base car image.
 */
const ColorStage: FC<ColorStageProps> = ({ color, baseImage, alt }) => {
  const hasOwnImage = Boolean(color.image);
  const imageSrc = color.image ?? baseImage;
  const showTint = !hasOwnImage && Boolean(color.tint);

  return (
    <>
      {/* Soft gradient backdrop that subtly picks up the active hue */}
      <motion.div
        key={`bg-${color.hex}`}
        aria-hidden
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: easeOut }}
        style={{
          background: `radial-gradient(60% 60% at 50% 60%, ${color.hex}22 0%, transparent 70%), linear-gradient(180deg, #0d0d10 0%, #0a0a0a 100%)`,
        }}
      />

      {/* Floor reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/3"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Car image — crossfades between per-colour variants */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={imageSrc}
          className="absolute inset-0 z-[2] flex items-center justify-center p-6 md:p-12"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          <img
            src={imageSrc}
            alt={alt}
            className="h-full w-full max-w-[800px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              // If the per-colour image fails, fall back to the base car image.
              if (img.src !== baseImage) {
                img.src = baseImage;
              } else {
                img.style.opacity = "0";
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Tint overlay — only in fallback mode (no per-colour image) */}
      <AnimatePresence mode="popLayout" initial={false}>
        {showTint && (
          <motion.div
            key={`tint-${color.hex}`}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[3]"
            initial={{ opacity: 0 }}
            animate={{ opacity: color.tintOpacity ?? 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOut }}
            style={{
              backgroundColor: color.tint,
              mixBlendMode:
                (color.blend as React.CSSProperties["mixBlendMode"]) ??
                "multiply",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const ColorCustomization: FC<ColorCustomizationProps> = ({ detail }) => {
  const colors = useMemo(
    () => (detail.colors.length > 0 ? detail.colors : FALLBACK_COLORS),
    [detail.colors]
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const active = colors[activeIdx];
  const usingPerColorImage = Boolean(active.image);

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
  const stageY = useTransform(smooth, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      id="colors"
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
            Color customization
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            Pick your hue.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            Cycle through the available finishes. Where we have official photography, swatches load the real car in that colour — otherwise we render a tinted preview.
          </p>
        </motion.div>

        <motion.div
          style={{ y: stageY }}
          className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-12 md:gap-8"
        >
          {/* Stage */}
          <div className="md:col-span-8">
            <div
              className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]"
              style={{
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.55)",
              }}
            >
              <ColorStage
                color={active}
                baseImage={detail.basic.image}
                alt={`${detail.basic.name} in ${active.name}`}
              />

              {/* Color name chip — top left */}
              <div className="absolute left-4 top-4 z-[5] flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-xl">
                <span
                  aria-hidden
                  className="h-3 w-3 rounded-full ring-1 ring-white/30"
                  style={{ backgroundColor: active.hex }}
                />
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
                  {active.name}
                </span>
              </div>

              {/* Mode chip — top right */}
              <div className="absolute right-4 top-4 z-[5] flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/55 backdrop-blur-xl">
                {usingPerColorImage ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <circle cx="9" cy="11" r="2" />
                      <path d="m3 17 6-5 4 4 3-2 5 4" />
                    </svg>
                    Real photo
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 3a9 9 0 0 0 0 18 4.5 4.5 0 0 0 0-9 4.5 4.5 0 0 1 0-9z" />
                    </svg>
                    Tinted preview
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Swatches panel */}
          <div className="md:col-span-4">
            <div
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl md:p-7"
              style={{
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.55)",
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Available shades
              </p>
              <h3
                className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                {colors.length} finishes
              </h3>

              <ul className="mt-6 space-y-2">
                {colors.map((color, i) => {
                  const isActive = i === activeIdx;
                  const hasPhoto = Boolean(color.image);
                  return (
                    <li key={color.name}>
                      <button
                        type="button"
                        onClick={() => setActiveIdx(i)}
                        aria-pressed={isActive}
                        className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all ${
                          isActive
                            ? "border-red-500/40 bg-red-500/10"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 transition-all ${
                            isActive
                              ? "ring-red-500/70"
                              : "ring-white/15 group-hover:ring-white/30"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {/* highlight ring */}
                          <span
                            aria-hidden
                            className="absolute inset-0 rounded-full"
                            style={{
                              background:
                                "radial-gradient(120% 80% at 30% 25%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)",
                            }}
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p
                              className={`truncate text-sm font-semibold transition-colors ${
                                isActive ? "text-white" : "text-white/85"
                              }`}
                            >
                              {color.name}
                            </p>
                            {hasPhoto && (
                              <span
                                title="Real photo available"
                                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/75"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-2.5 w-2.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden
                                >
                                  <rect x="3" y="5" width="18" height="14" rx="2" />
                                  <circle cx="9" cy="11" r="2" />
                                  <path d="m3 17 6-5 4 4 3-2 5 4" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">
                            {color.hex}
                          </p>
                        </div>
                        {isActive && (
                          <motion.span
                            layoutId="color-active-tick"
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <path d="M5 12l4 4 10-10" />
                            </svg>
                          </motion.span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-white/45">
                Selected colour does not affect price unless it&apos;s a premium-paint option. Confirm with the dealer at booking.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ColorCustomization;
