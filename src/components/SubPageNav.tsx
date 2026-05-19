"use client";

import type { FC } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import RideBuildersLogo from "./RideBuildersLogo";
import siteData from "@/data/site.json";

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

const easeOut = [0.16, 1, 0.3, 1] as const;

// ----- Search index ---------------------------------------------------------

interface SearchItem {
  id: string;
  brand: string;
  name: string;
  image: string;
  price?: string;
  kind: "car" | "bike";
  href: string;
}

const buildSearchIndex = (): SearchItem[] => {
  type RawVehicle = {
    id: string;
    brand: string;
    name: string;
    image: string;
    price?: string;
  };
  const cars = (siteData.carsPage?.all ?? []) as RawVehicle[];
  const bikes = (siteData.bikesPage?.all ?? []) as RawVehicle[];
  return [
    ...cars.map(
      (v): SearchItem => ({
        id: v.id,
        brand: v.brand,
        name: v.name,
        image: v.image,
        price: v.price,
        kind: "car",
        href: `/cars/${v.id}`,
      })
    ),
    ...bikes.map(
      (v): SearchItem => ({
        id: v.id,
        brand: v.brand,
        name: v.name,
        image: v.image,
        price: v.price,
        kind: "bike",
        href: `/bikes/${v.id}`,
      })
    ),
  ];
};

/**
 * Hook: locks `document.body` scroll while `locked` is true.
 * Restores the original overflow on cleanup so it composes with other
 * overlays without leaving the body permanently locked.
 */
const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
};

// ----- Icons ---------------------------------------------------------------

const SearchIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-[18px] w-[18px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const HeartIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-[18px] w-[18px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
  </svg>
);

const MenuIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-[18px] w-[18px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    aria-hidden
  >
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const CloseIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-[18px] w-[18px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

// ----- Search overlay ------------------------------------------------------

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SearchOverlay: FC<SearchOverlayProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(buildSearchIndex, []);

  // Autofocus input when opened
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(t);
    }
    setQuery("");
  }, [open]);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useBodyScrollLock(open);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 6); // popular suggestions when empty
    return index
      .filter(
        (item) =>
          item.brand.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          `${item.brand} ${item.name}`.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [index, query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Search vehicles"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: easeOut }}
          className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-2xl"
        >
          {/* Backdrop click area */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="absolute inset-0 cursor-default"
            tabIndex={-1}
          />

          {/* Top bar */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="relative z-[1] mx-auto w-full max-w-3xl px-6 pt-24 md:px-10 md:pt-32"
          >
            <div
              className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 backdrop-blur-xl md:px-5 md:py-4"
              style={{
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 30px 80px -20px rgba(0,0,0,0.55)",
              }}
            >
              <span className="text-white/55">
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cars, bikes, brands…"
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-white placeholder:text-white/40 focus:outline-none md:text-lg"
                autoComplete="off"
              />
              <span className="hidden rounded-md border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:inline">
                Esc
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/65 hover:bg-white/[0.06] hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Meta line */}
            <p className="mt-3 px-1 text-[11px] uppercase tracking-[0.16em] text-white/45">
              {query.trim()
                ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query.trim()}”`
                : "Popular machines"}
            </p>
          </motion.div>

          {/* Results */}
          <div className="relative z-[1] mx-auto mt-5 w-full max-w-3xl flex-1 overflow-y-auto px-6 pb-10 md:px-10">
            {results.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <p className="text-base font-semibold text-white">
                  No matches.
                </p>
                <p className="mt-2 max-w-xs text-sm text-white/55">
                  Try a brand (BMW, KTM), a model name, or browse{" "}
                  <a href="/cars" className="text-red-400 hover:text-red-300">
                    all cars
                  </a>{" "}
                  or{" "}
                  <a href="/bikes" className="text-red-400 hover:text-red-300">
                    bikes
                  </a>
                  .
                </p>
              </motion.div>
            ) : (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {results.map((item, i) => (
                  <motion.li
                    key={`${item.kind}-${item.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(0.04 * i, 0.32),
                      ease: easeOut,
                    }}
                  >
                    <a
                      href={item.href}
                      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 transition-colors hover:border-red-500/40 hover:bg-red-500/[0.06]"
                    >
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[#0a0a0a]">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.opacity =
                              "0";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                          {item.brand} • {item.kind}
                        </p>
                        <p className="truncate text-sm font-semibold tracking-tight text-white">
                          {item.name}
                        </p>
                      </div>
                      {item.price && (
                        <p className="shrink-0 text-xs font-semibold text-red-400">
                          {item.price}
                        </p>
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ----- Mobile menu drawer --------------------------------------------------

interface MobileMenuProps {
  open: boolean;
  active: SubPageNavProps["active"];
  onClose: () => void;
  onOpenSearch: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({
  open,
  active,
  onClose,
  onOpenSearch,
}) => {
  useBodyScrollLock(open);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: easeOut }}
          className="fixed inset-0 z-[90] flex flex-col bg-black/85 backdrop-blur-2xl md:hidden"
        >
          {/* Backdrop click area (closes menu) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="absolute inset-0 cursor-default"
            tabIndex={-1}
          />

          {/* Menu content */}
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="relative z-[1] flex h-full flex-col px-6 pt-24 pb-10"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
              Menu
            </p>

            <nav className="mt-6 flex flex-col">
              {navLinks.map((link, i) => {
                const isActive = link.slug === active;
                return (
                  <motion.a
                    key={link.slug}
                    href={link.href}
                    onClick={onClose}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.05 + i * 0.05,
                      ease: easeOut,
                    }}
                    className={`group flex items-center justify-between border-b border-white/[0.08] py-5 text-3xl font-medium tracking-tight transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                    }`}
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    <span className="flex items-center gap-3">
                      {isActive && (
                        <span
                          aria-hidden
                          className="h-2 w-2 rounded-full bg-red-500"
                        />
                      )}
                      {link.label}
                    </span>
                    <span
                      aria-hidden
                      className="text-white/35 transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </motion.a>
                );
              })}
            </nav>

            <div className="mt-auto flex items-center justify-between gap-3 pt-8">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/85 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <SearchIcon />
                Search vehicles
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ----- Main nav ------------------------------------------------------------

const SubPageNav: FC<SubPageNavProps> = ({ active = "cars" }) => {
  const pathname = usePathname();
  const [isGlass, setIsGlass] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close overlays on route change (including browser back) so they never
  // leave an invisible fullscreen layer blocking the page.
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useLayoutEffect(() => {
    const onScroll = () => setIsGlass(window.scrollY > NAV_GLASS_SCROLL_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cmd/Ctrl + K opens search (nice-to-have shortcut)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: easeOut }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-b px-6 md:px-10 lg:px-12 transition-all duration-300 ease-out ${
          isGlass
            ? "pt-3 pb-2 bg-white/6 border-white/12 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            : "pt-6 pb-3 bg-transparent border-transparent backdrop-blur-none shadow-none"
        }`}
      >
        {/* Brand */}
        <a href="/" className="flex shrink-0 items-center gap-2">
          <RideBuildersLogo />
          <span className="text-base font-medium tracking-tight text-white">
            ridebuilders
          </span>
        </a>

        {/* Center links — desktop only */}
        <div className="hidden items-center gap-9 md:flex">
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
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-red-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Right action icons */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search vehicles"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <SearchIcon />
          </button>

          {/* <button
            type="button"
            aria-label="Favourites"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white sm:flex"
          >
            <HeartIcon />
          </button> */}

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white md:hidden"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu drawer */}
      <MobileMenu
        open={mobileOpen}
        active={active}
        onClose={closeMobile}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
};

export default SubPageNav;
