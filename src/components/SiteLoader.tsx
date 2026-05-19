"use client";

import type { FC } from "react";
import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WORDMARK = "ridebuilders";

// Tunable timings.
const MIN_DURATION_MS = 1800; // ensure the entrance animation has time to finish
const SAFETY_TIMEOUT_MS = 6000; // never block forever, even if the video stalls

const Logo: FC = () => (
  <svg
    viewBox="0 0 256 256"
    className="h-12 w-12 md:h-14 md:w-14"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z"
      fill="#ffffff"
    />
  </svg>
);

const SESSION_KEY = "rb-site-loaded";

const SiteLoader: FC = () => {
  // Always true on first render so SSR and hydration match. Session check runs in useEffect.
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setIsLoading(false);
      }
    } catch {
      /* private mode */
    }
  }, []);

  // Never strand the user behind the loader after bfcache back/forward.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsLoading(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      /* private mode */
    }

    const startTime = Date.now();

    const dismiss = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_DURATION_MS - elapsed);
      window.setTimeout(() => {
        setIsLoading(false);
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* private mode */
        }
      }, remaining);
    };

    // Look for the hero <video> in the DOM. We give the page a tick to mount
    // first so BackgroundVideo has had a chance to render its element.
    const findAndAttach = () => {
      const video = document.querySelector(
        "video",
      ) as HTMLVideoElement | null;

      if (!video) {
        // No video element yet — fall back to window.load.
        if (document.readyState === "complete") {
          dismiss();
        } else {
          window.addEventListener("load", dismiss, { once: true });
        }
        return () => window.removeEventListener("load", dismiss);
      }

      // readyState >= 2 (HAVE_CURRENT_DATA) means at least one frame is decoded.
      if (video.readyState >= 2) {
        dismiss();
        return undefined;
      }

      const onReady = () => {
        dismiss();
        video.removeEventListener("loadeddata", onReady);
        video.removeEventListener("canplay", onReady);
      };
      video.addEventListener("loadeddata", onReady);
      video.addEventListener("canplay", onReady);

      return () => {
        video.removeEventListener("loadeddata", onReady);
        video.removeEventListener("canplay", onReady);
      };
    };

    const attachTimer = window.setTimeout(() => {
      cleanup = findAndAttach();
    }, 50);

    let cleanup: (() => void) | undefined;

    // Hard safety: never strand the user on the loader.
    const safetyTimer = window.setTimeout(() => {
      setIsLoading(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* private mode */
      }
    }, SAFETY_TIMEOUT_MS);

    return () => {
      window.clearTimeout(attachTimer);
      window.clearTimeout(safetyTimer);
      cleanup?.();
    };
  }, [isLoading]);

  // Lock background scroll while the loader is up.
  useEffect(() => {
    if (isLoading) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="site-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          {/* Soft radial backdrop so the logo doesn't sit on a flat field */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.04), transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center gap-7">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
                transition: {
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              exit={{
                scale: 1.08,
                opacity: 0,
                transition: {
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
            >
              <Logo />
            </motion.div>

            {/* Wordmark — letters stagger in */}
            <div className="flex items-baseline overflow-hidden">
              {WORDMARK.split("").map((letter, i) => (
                <motion.span
                  key={`${letter}-${i}`}
                  className="text-white text-xl md:text-2xl font-medium tracking-tight"
                  initial={{ y: 24, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.55,
                      delay: 0.45 + i * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }}
                  exit={{
                    y: -10,
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      delay: i * 0.015,
                      ease: "easeIn",
                    },
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Indeterminate progress sweep */}
            <motion.div
              className="relative mt-2 h-px w-40 overflow-hidden bg-white/10"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.6, delay: 1.0 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="absolute inset-y-0 w-1/2 bg-white"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SiteLoader;
