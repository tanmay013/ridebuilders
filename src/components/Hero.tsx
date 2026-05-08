"use client";

import type { FC } from "react";
import { useLayoutEffect, useState } from "react";
import BackgroundVideo from "./BackgroundVideo";
import BrandsCarousel from "./BrandsCarousel";
import RideBuildersLogo from "./RideBuildersLogo";

// Models routes to the dedicated /cars listing page; the rest are still
// in-page anchors on the home page.
const navLinks: { label: string; href: string }[] = [
  { label: "Home", href: "#home" },
  { label: "Models", href: "/cars" },
  { label: "Specs", href: "#specs" },
  { label: "About", href: "/about" },
];

const NAV_GLASS_SCROLL_PX = 24;

const Hero: FC = () => {
  const [isGlass, setIsGlass] = useState(false);

  useLayoutEffect(() => {
    const onScroll = () => setIsGlass(window.scrollY > NAV_GLASS_SCROLL_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background video — streams via HTTP byte-range chunks; fades in
          once the first frame is decoded so the screen is never blank.
          Pass an array of paths to play multiple clips in sequence (the
          first clip starts faster, others preload during playback):
            src={["/hero-1.webm", "/hero-2.webm", "/hero-3.webm"]}
          A single string still works for a single looping clip. */}
      <BackgroundVideo src="/hero.webm" />

      {/* Very light vignette — keeps text readable but lets the video breathe */}
      <div className="pointer-events-none absolute inset-0 bg-black/15" />

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 md:px-10 border-b transition-all duration-300 ease-out ${
          isGlass
            ? "pt-3 pb-2 bg-white/6 border-white/12 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            : "pt-6 pb-3 bg-transparent border-transparent backdrop-blur-none shadow-none"
        }`}
      >
        {/* Brand */}
        <a href="#home" className="flex items-center gap-2">
          <RideBuildersLogo />
          <span className="text-white text-base font-medium tracking-tight">
            ridebuilders
          </span>
        </a>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="/compare"
          className="bg-white text-black text-sm font-normal rounded-full px-5 py-2.5 hover:bg-neutral-200 transition-colors"
        >
          start comparing
        </a>
      </nav>

      {/* Soft gradient anchored to the bottom-left so the tucked text reads
          without darkening the rest of the frame. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/70 via-black/0 to-transparent" />

      {/* Minimal hero text — bottom-left quadrant, slightly lifted.
          Layout: left 24/96px, bottom 112/128px, max-width 420px,
          left-aligned, tight vertical stack. */}
      <div className="absolute left-6 md:left-24 bottom-28 md:bottom-32 z-10 max-w-[420px] text-left">
        <h1
          className="hero-title text-white font-medium text-2xl md:text-3xl"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
        >
          Cars. Bikes. Decoded.
        </h1>
        <p
          className="text-white/80 text-xs md:text-sm leading-relaxed mt-2"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
        >
          Compare performance, specs, and features across every machine —
          built for people who don&rsquo;t guess.
        </p>
        <a
          href="/compare"
          className="mt-3 inline-flex items-center gap-2 text-white text-xs md:text-sm font-medium pb-1 border-b-2 border-red-600 hover:gap-3 transition-all"
        >
          Start Comparing
          <span aria-hidden>→</span>
        </a>
      </div>

      {/* Bottom gradient — extended to pure black so the seam into the
          dark Categories section below disappears. */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 md:h-60 bg-gradient-to-b from-transparent via-black/65 to-black" />

      {/* Soft smoke wisp at the seam — a wide blurred horizontal bar of
          near-black that softens the bottom edge so it doesn't look like
          a hard horizontal line where the video footage ends. */}
      <div
        className="pointer-events-none absolute -bottom-6 left-0 right-0 h-24 md:h-28 z-[6] opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(0,0,0,0.95), transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom brand carousel */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-10 pb-6">
        <BrandsCarousel />
      </div>

    </section>
  );
};

export default Hero;
