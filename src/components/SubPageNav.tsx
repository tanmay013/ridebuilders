"use client";

import type { FC } from "react";
import { useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import RideBuildersLogo from "./RideBuildersLogo";

interface SubPageNavProps {
  /** Slug of the currently-active link, e.g. "cars". Renders the red underline. */
  active?: "home" | "cars" | "bikes" | "compare" | "about";
}

const navLinks = [
  { label: "Home", href: "/", slug: "home" },
  { label: "Cars", href: "/cars", slug: "cars" },
  { label: "Bikes", href: "/bikes", slug: "bikes" },
  { label: "Compare", href: "/compare", slug: "compare" },
  { label: "About", href: "/about", slug: "about" },
] as const;

const NAV_GLASS_SCROLL_PX = 24;

const SubPageNav: FC<SubPageNavProps> = ({ active = "cars" }) => {
  const [isGlass, setIsGlass] = useState(false);

  useLayoutEffect(() => {
    const onScroll = () => setIsGlass(window.scrollY > NAV_GLASS_SCROLL_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-b px-6 md:px-10 lg:px-12 transition-all duration-300 ease-out ${
        isGlass
          ? "pt-3 pb-2 bg-white/6 border-white/12 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          : "pt-6 pb-3 bg-transparent border-transparent backdrop-blur-none shadow-none"
      }`}
    >
      {/* Brand */}
      <a href="/" className="flex items-center gap-2 shrink-0">
        <RideBuildersLogo />
        <span className="text-white text-base font-medium tracking-tight">
          ridebuilders
        </span>
      </a>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-9">
        {navLinks.map((link) => {
          const isActive = link.slug === active;
          return (
            <a
              key={link.slug}
              href={link.href}
              className={`relative text-[15px] transition-colors ${
                isActive ? "text-white" : "text-white/65 hover:text-white"
              }`}
            >
              {link.label}
              {isActive && (
                <motion.span
                  layoutId="subnav-underline"
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </div>

      {/* Right action icons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Favourites"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Menu"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
};

export default SubPageNav;
