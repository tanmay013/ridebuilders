"use client";

import type { FC, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import siteData from "@/data/site.json";

interface FilterEntry {
  id: string;
  label: string;
  value?: string;
  options?: string[];
  icon?: string;
}

type PageKey = "carsPage" | "bikesPage";
export type CarsFilterValues = Record<string, string>;

const filterIcons: Record<string, ReactNode> = {
  shield: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6Z" />
    </svg>
  ),
  price: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 14a3 3 0 0 0 3 1c2 0 3-1 3-2.5S14 11 12 11s-3-1-3-2.5S10 6 12 6a3 3 0 0 1 3 1" />
      <path d="M12 5v2M12 17v2" />
    </svg>
  ),
  fuel: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M3 18h12" />
      <path d="M15 8h2a3 3 0 0 1 3 3v6a2 2 0 0 0 2 2v-9l-3-3" />
    </svg>
  ),
  gears: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M6 8v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8M12 14v2" />
    </svg>
  ),
  body: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14h18l-2-5a2 2 0 0 0-1.8-1H6.8A2 2 0 0 0 5 9l-2 5Z" />
      <path d="M5 14v4M19 14v4M7 17h2M15 17h2" />
    </svg>
  ),
};

const FallbackIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const Chevron: FC = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

interface CarsFilterBarProps {
  pageKey?: PageKey;
  values: CarsFilterValues;
  onChange: (id: string, value: string) => void;
  onReset: () => void;
}

const CarsFilterBar: FC<CarsFilterBarProps> = ({
  pageKey = "carsPage",
  values,
  onChange,
  onReset,
}) => {
  const filters = (
    siteData as typeof siteData & Record<PageKey, { filters: FilterEntry[] }>
  )[pageKey].filters;
  const rootRef = useRef<HTMLDivElement>(null);
  const getDisplayValue = (filter: FilterEntry): string =>
    filter.value ?? filter.options?.[0] ?? "All";
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);

  useEffect(() => {
    const onDocPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpenFilterId(null);
      }
    };

    document.addEventListener("mousedown", onDocPointerDown);
    return () => document.removeEventListener("mousedown", onDocPointerDown);
  }, []);

  return (
    <section className="px-6 md:px-10 lg:px-16">
      <div
        ref={rootRef}
        className="max-w-7xl mx-auto animate-fade-in"
      >
        <div className="flex flex-wrap items-stretch gap-2 md:gap-0 rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.07] p-2 md:p-1.5">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="relative flex-1 min-w-[140px]"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenFilterId((prev) => (prev === filter.id ? null : filter.id))
                }
                className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/[0.05]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-white/75 ring-1 ring-white/10 transition-colors group-hover:text-white">
                  {filterIcons[filter.icon ?? ""] ?? <FallbackIcon />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-white/45">
                    {filter.label}
                  </span>
                  <span className="block truncate text-sm tabular-nums text-white">
                    {values[filter.id] ?? getDisplayValue(filter)}
                  </span>
                </span>
                <span
                  className={`transition-transform duration-200 ${
                    openFilterId === filter.id ? "rotate-180" : ""
                  }`}
                >
                  <Chevron />
                </span>
              </button>

              {openFilterId === filter.id && (filter.options?.length ?? 0) > 0 && (
                <div
                  className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-white/10 bg-black/90 p-1.5 shadow-[0_14px_38px_rgba(0,0,0,0.55)] backdrop-blur-xl animate-fade-in"
                >
                  {filter.options?.map((option) => {
                    const active = values[filter.id] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          onChange(filter.id, option);
                          setOpenFilterId(null);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/75 hover:bg-white/6 hover:text-white"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              onReset();
              setOpenFilterId(null);
            }}
            className="flex items-center gap-2 px-4 md:px-5 py-3 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 4v5h-5" />
            </svg>
            Reset All
          </button>
        </div>
      </div>
    </section>
  );
};

export default CarsFilterBar;
