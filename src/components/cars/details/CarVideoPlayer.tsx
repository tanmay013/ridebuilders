"use client";

import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getYouTubeId } from "./carDetail";

interface CarVideoPlayerProps {
  videoUrl: string;
  /** Used only when `videoUrl` is missing or invalid. */
  posterUrl: string;
  title: string;
  controlsTopClass?: string;
}

const LoadingSpinner: FC = () => (
  <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/20 border-t-white" />
);

const CarVideoPlayer: FC<CarVideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  title,
}) => {
  const videoId = useMemo(() => getYouTubeId(videoUrl), [videoUrl]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const embedSrc = useMemo(() => {
    if (!videoId) return null;
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: videoId,
      controls: "0",
      autohide: "1",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
      iv_load_policy: "3",
      disablekb: "1",
      fs: "0",
      enablejsapi: "1",
    });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  }, [videoId]);

  const handleIframeLoad = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({ event: "command", func: "mute", args: "" }),
      "*"
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {embedSrc ? (
        <iframe
          ref={iframeRef}
          src={embedSrc}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={handleIframeLoad}
          className="pointer-events-none absolute left-1/2 top-1/2 border-0"
          style={{
            width: "max(100%, 177.78vh)",
            height: "max(100%, 56.25vw)",
            transform: "translate(-50%, -50%) scale(1.12)",
          }}
        />
      ) : (
        <img
          src={posterUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
      )}

      {/* Blurred loading overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-700 ${
          isLoading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <LoadingSpinner />
      </div>
    </div>
  );
};

export default CarVideoPlayer;
