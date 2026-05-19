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

interface BackgroundVideoProps {
  /**
   * Path to the video file in /public, OR an array of paths.
   *
   * - Single string → behaves as before (one looping video).
   * - Array → playlist mode. Videos play one after another, then loop
   *   back to the first. Splitting a long hero into smaller clips lets
   *   the first one start playing faster while later clips stream in.
   */
  src?: string | string[];
  /** Optional poster image shown by the browser before the first frame loads. */
  poster?: string;
  /** Optional className passthrough for the <video> element. */
  className?: string;
}

const inferType = (path: string): string => {
  if (path.endsWith(".webm")) return "video/webm";
  if (path.endsWith(".mp4") || path.endsWith(".m4v")) return "video/mp4";
  if (path.endsWith(".mov")) return "video/quicktime";
  return "video/mp4";
};

const BackgroundVideo: FC<BackgroundVideoProps> = ({
  src = "/hero.webm",
  poster,
  className = "",
}) => {
  // Normalize to a stable array shape so the rest of the component doesn't
  // care whether the caller passed a single path or many.
  const playlist = useMemo(
    () => (Array.isArray(src) ? src : [src]),
    [src],
  );
  const isPlaylist = playlist.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  // Defensive: if the array shrinks, snap back into bounds.
  const safeIndex = currentIndex % playlist.length;
  const currentSrc = playlist[safeIndex] ?? "/hero.webm";
  const nextSrc = isPlaylist
    ? playlist[(safeIndex + 1) % playlist.length]
    : null;

  // We start with the video at opacity-0 and only fade it in when at least
  // one frame is decoded. Until then, the dark fallback shows immediately —
  // the user never sees a blank/white flash.
  const [hasFrame, setHasFrame] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reveal = useCallback(() => {
    setHasFrame(true);
  }, []);

  // Reset the fade-in whenever the *current* clip changes (either because
  // the prop changed or because the playlist advanced). Otherwise the new
  // clip would be visible during its load instead of fading in like the
  // first one.
  useEffect(() => {
    setHasFrame(false);
  }, [currentSrc]);

  const nudgePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    void el.play().catch(() => {});
  }, []);

  // When the current clip ends, advance to the next one in the playlist.
  // Single-video case still uses native `loop`, no handler needed.
  const handleEnded = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, [playlist.length]);

  // Run as soon as the <video> node exists (before paint). A single effect tick
  // after mount can be too early for slow caches — we retry on media events too.
  useLayoutEffect(() => {
    const el = videoRef.current;
    if (el) el.defaultMuted = true;
    nudgePlay();
  }, [currentSrc, nudgePlay]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onMediaProgress = () => nudgePlay();

    el.addEventListener("loadedmetadata", onMediaProgress);
    el.addEventListener("loadeddata", onMediaProgress);
    el.addEventListener("canplay", onMediaProgress);
    el.addEventListener("canplaythrough", onMediaProgress);

    const onVisible = () => {
      if (document.visibilityState === "visible") nudgePlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        reveal();
        nudgePlay();
      }
    };
    window.addEventListener("pageshow", onPageShow);

    const raf = requestAnimationFrame(() => nudgePlay());

    return () => {
      el.removeEventListener("loadedmetadata", onMediaProgress);
      el.removeEventListener("loadeddata", onMediaProgress);
      el.removeEventListener("canplay", onMediaProgress);
      el.removeEventListener("canplaythrough", onMediaProgress);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
      cancelAnimationFrame(raf);
    };
  }, [currentSrc, nudgePlay, reveal]);

  return (
    <>
      {/* Solid instant fallback. Stays in place under the video forever; the
          video covers it once it can render a frame. */}
      <div
        className="absolute inset-0 bg-neutral-950"
        aria-hidden="true"
      />

      <video
        key={currentSrc}
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
          hasFrame ? "opacity-100" : "opacity-0"
        } ${className}`}
        autoPlay
        // Native loop only when there's a single clip — otherwise we manage
        // looping manually by advancing the playlist on `ended`.
        loop={!isPlaylist}
        muted
        playsInline
        /* Start buffering immediately; the file still loads progressively via
           HTTP range requests (Next serves /public with Accept-Ranges). */
        preload="auto"
        poster={poster}
        onLoadedData={reveal}
        onCanPlay={reveal}
        onPlaying={reveal}
        onEnded={isPlaylist ? handleEnded : undefined}
      >
        <source src={currentSrc} type={inferType(currentSrc)} />
      </video>

      {/* Pre-warm the NEXT clip while the current one is playing. Hidden,
          1×1, opacity 0 — purely a cache-warm so the hand-off feels seamless.
          Browsers honour preload="auto" + autoplay+muted to start fetching. */}
      {nextSrc && (
        <video
          key={`preload-${nextSrc}`}
          src={nextSrc}
          preload="auto"
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      )}
    </>
  );
};

export default BackgroundVideo;
