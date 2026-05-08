"use client";

import type { FC } from "react";
import { motion } from "framer-motion";

/* ────────────────────────────────────────────────────────────
   Tiled SVG noise — used for film-grain texture.
   ──────────────────────────────────────────────────────────── */
const NOISE_DATA_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/**
 * Atmospheric layers that sit on top of content via mix-blend-screen, but
 * with intentionally-tiny alphas so they don't visibly tint text or images.
 * The goal is "you can't tell what's making the page feel deeper, but it
 * does feel deeper" — anything stronger reads as a colored overlay rather
 * than a background mood.
 */
const BackgroundLayers: FC = () => {
  return (
    <>
      {/* Layer 1 — slow ambient color drift, very faint.
          Cool top-left, warm bottom-right. Alphas dropped from 0.18/0.14
          down to 0.06/0.05 so the tint reads as "in the air" rather than
          "on the content". */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[55] mix-blend-screen"
        initial={{ y: "-1%" }}
        animate={{ y: ["-1%", "1%", "-1%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `
            radial-gradient(ellipse 65% 50% at 22% 28%, rgba(40, 100, 200, 0.11), transparent 70%),
            radial-gradient(ellipse 65% 50% at 78% 72%, rgba(180, 70, 30, 0.09), transparent 70%)
          `,
        }}
      />

      {/* Layer 2 — center accent drift. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[55] mix-blend-screen"
        initial={{ y: "1%" }}
        animate={{ y: ["1%", "-1.2%", "1%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 50%, rgba(180, 190, 220, 0.05), transparent 75%)",
        }}
      />

      {/* Layer 3 — film grain. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[58] opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage: NOISE_DATA_URL,
          backgroundSize: "200px 200px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Layer 4 — viewport vignette. Pulled back to 0.5 so the corners
          read as in-shadow, framing the page like a film still. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[57]"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </>
  );
};

export default BackgroundLayers;
