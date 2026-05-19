"use client";

import type { FC, ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Wraps route content so browser back/forward (especially bfcache restores)
 * never leaves the app in a broken state: stuck body scroll-lock, or Framer
 * Motion elements frozen at initial opacity: 0.
 */
const NavigationRecovery: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [bfcacheKey, setBfcacheKey] = useState(0);

  // Clear scroll locks on every client navigation (including history back).
  useEffect(() => {
    document.body.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("overflow");
  }, [pathname]);

  // bfcache restores the old DOM/React tree without remounting — replay entrance
  // animations and drop any stale overlay locks.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
      setBfcacheKey((k) => k + 1);
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <Fragment key={`${pathname}-${bfcacheKey}`}>{children}</Fragment>
  );
};

export default NavigationRecovery;
