"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import BackgroundVideo from "./BackgroundVideo";
import siteData from "@/data/site.json";

interface CTAContent {
  headline: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  videoSrc: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

const cta = siteData.cta as CTAContent;
const contact = siteData.contact as ContactInfo;

const ContactRow: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm text-white/55">{label}</p>
    <p className="mt-1 text-base md:text-lg font-semibold text-white tracking-tight">
      {value}
    </p>
  </div>
);

const CTASection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Section-scoped scroll progress drives a subtle glass-card parallax —
  // card drifts up + scales slightly as you scroll past it.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const cardY = useTransform(smoothProgress, [0, 1], [60, -60]);
  const cardScale = useTransform(smoothProgress, [0, 0.5, 1], [0.97, 1, 0.99]);

  return (
    <section
      ref={sectionRef}
      id="explore"
      className="relative min-h-[640px] md:min-h-[720px] w-full overflow-hidden bg-black"
    >
      {/* Background video */}
      <BackgroundVideo src={cta.videoSrc} />

      {/* Slight dim so the glass card has contrast against bright footage */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* Top fog — fades section into the dark vehicles section above. */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-1/3 md:h-2/5 z-[5] bg-gradient-to-b from-black via-black/75 to-transparent"
        aria-hidden="true"
      />

      {/* Bottom fog — fades section into whatever sits below (footer or page edge). */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 md:h-2/5 z-[5] bg-gradient-to-t from-black via-black/75 to-transparent"
        aria-hidden="true"
      />

      {/* Subtle smoke wisps — soft radial puffs at the corners to break the
          gradient's straight horizontal banding and give an atmospheric feel. */}
      <div
        className="pointer-events-none absolute -top-10 -left-10 w-[40vw] h-[40vw] z-[6] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,0,0,0.85), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-10 -right-10 w-[40vw] h-[40vw] z-[6] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,0,0,0.85), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Centered glass card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: cardY, scale: cardScale }}
        className="relative z-10 flex items-center justify-center min-h-[640px] md:min-h-[720px] px-6 md:px-10 py-20"
      >
        <div
          className="w-full max-w-4xl rounded-3xl bg-white/[0.07] backdrop-blur-2xl ring-1 ring-white/15 shadow-2xl shadow-black/40 p-8 md:p-12 lg:p-14"
          style={{
            // A subtle inner highlight gives the frosted glass a believable
            // edge — like light catching the rim.
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 30px 80px -20px rgba(0,0,0,0.55)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
            {/* Left — headline + description + CTA */}
            <div>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight"
                style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
              >
                {cta.headline}
              </h2>
              <p className="mt-4 text-white/70 text-sm md:text-base leading-relaxed max-w-sm">
                {cta.description}
              </p>
            </div>

            {/* Right — contact info */}
            <div className="space-y-6 md:space-y-7">
              <ContactRow label="Phone" value={contact.phone} />
              <ContactRow label="Email" value={contact.email} />
              <ContactRow label="Address" value={contact.address} />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
