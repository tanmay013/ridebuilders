"use client";

import { useMemo, useState } from "react";
import type { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/shared/PageHero";
import siteData from "@/data/site.json";

// ----- Types ---------------------------------------------------------------

type MetricField = "hp" | "zero" | "topSpeed" | "price";
type Direction = "asc" | "desc";

interface Metric {
  id: string;
  label: string;
  shortLabel: string;
  field: MetricField;
  unit: string;
  direction: Direction;
  icon: string;
  description: string;
}

interface GlossaryEntry {
  term: string;
  icon: string;
  definition: string;
}

interface SpecsContent {
  hero: { eyebrow: string; headline: string; description: string; image: string };
  metrics: Metric[];
  glossary: GlossaryEntry[];
}

interface VehicleBasic {
  id: string;
  brand: string;
  name: string;
  image: string;
  price?: string;
  hp?: string;
  zero?: string;
  topSpeed?: string;
}

const specs = siteData.specsPage as SpecsContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

const carBasics = (siteData.carsPage.all ?? []) as VehicleBasic[];
const bikeBasics = (siteData.bikesPage.all ?? []) as VehicleBasic[];

// ----- Helpers --------------------------------------------------------------

const parseLeadingNumber = (value?: string): number | null => {
  if (!value) return null;
  const m = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};

const parsePriceToRupees = (price?: string): number | null => {
  if (!price) return null;
  const digits = price.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
};

const extractMetric = (
  vehicle: VehicleBasic,
  field: MetricField
): number | null => {
  if (field === "price") return parsePriceToRupees(vehicle.price);
  const raw = vehicle[field];
  return parseLeadingNumber(raw);
};

const formatMetric = (n: number | null, unit: string): string => {
  if (n === null) return "—";
  if (unit === "₹") {
    if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${Math.round(n / 1_00_000)} L`;
    return `₹${n.toLocaleString("en-IN")}`;
  }
  // Strip needless trailing .0 from numbers like "3.0"
  const pretty = Number.isInteger(n) ? n.toString() : n.toFixed(n < 10 ? 1 : 0);
  return `${pretty} ${unit}`;
};

interface RankedVehicle {
  vehicle: VehicleBasic;
  kind: "car" | "bike";
  raw: number;
  display: string;
}

const buildRanking = (
  list: VehicleBasic[],
  kind: "car" | "bike",
  metric: Metric,
  limit: number
): RankedVehicle[] => {
  const rows = list
    .map((v): RankedVehicle | null => {
      const raw = extractMetric(v, metric.field);
      if (raw === null) return null;
      return {
        vehicle: v,
        kind,
        raw,
        display: formatMetric(raw, metric.unit),
      };
    })
    .filter((r): r is RankedVehicle => r !== null);

  rows.sort((a, b) =>
    metric.direction === "asc" ? a.raw - b.raw : b.raw - a.raw
  );
  return rows.slice(0, limit);
};

// ----- Icons (mirrors the icon set used on detail pages) -------------------

const SpecIcon: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "h-[18px] w-[18px]",
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

const specIcons: Record<string, ReactNode> = {
  engine: (
    <SpecIcon>
      <path d="M4 9h3l2-2h6l2 2h3v6h-3l-2 2H9l-2-2H4z" />
      <path d="M12 9v6" />
    </SpecIcon>
  ),
  power: (
    <SpecIcon>
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </SpecIcon>
  ),
  torque: (
    <SpecIcon>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
      <path d="M12 8v4l3 2" />
    </SpecIcon>
  ),
  zero: (
    <SpecIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </SpecIcon>
  ),
  speed: (
    <SpecIcon>
      <path d="M3 13a9 9 0 0 1 18 0" />
      <path d="M12 13l4-3" />
      <circle cx="12" cy="13" r="1.4" fill="currentColor" stroke="none" />
    </SpecIcon>
  ),
  fuel: (
    <SpecIcon>
      <path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />
      <path d="M4 21h11" />
      <path d="M15 9h2l2 2v6a2 2 0 0 1-2 2" />
    </SpecIcon>
  ),
  fueltype: (
    <SpecIcon>
      <path d="M12 2 4 12h5v8h6v-8h5z" />
    </SpecIcon>
  ),
  gears: (
    <SpecIcon>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <path d="M6 8v4M6 16v0M6 12h6M18 8v8" />
    </SpecIcon>
  ),
};

const iconFor = (key: string, className?: string): ReactNode => {
  const base = specIcons[key] ?? specIcons.engine;
  if (className) {
    // Re-wrap with a custom size by cloning the children
    return (
      <SpecIcon className={className}>
        {(base as React.ReactElement<{ children: ReactNode }>).props.children}
      </SpecIcon>
    );
  }
  return base;
};

// ----- Leaderboard row -----------------------------------------------------

interface RankRowProps {
  rank: number;
  row: RankedVehicle;
  unit: string;
  topRaw: number;
  direction: Direction;
}

const RankRow: FC<RankRowProps> = ({ rank, row, unit, topRaw, direction }) => {
  // Bar width is normalised to the best (or worst, depending on direction) value.
  const ratio =
    direction === "desc"
      ? Math.min(1, row.raw / topRaw)
      : Math.min(1, topRaw / row.raw);
  const widthPct = Math.max(8, Math.round(ratio * 100));
  const href = `/${row.kind === "car" ? "cars" : "bikes"}/${row.vehicle.id}`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.03 * rank, ease: easeOut }}
    >
      <a
        href={href}
        className={`group grid grid-cols-12 items-center gap-3 rounded-2xl border px-4 py-3.5 transition-colors md:px-5 ${
          rank === 1
            ? "border-red-500/40 bg-red-500/[0.06]"
            : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
        }`}
      >
        {/* Rank chip */}
        <span
          className={`col-span-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
            rank === 1
              ? "bg-red-500 text-white"
              : "bg-white/[0.06] text-white/75"
          }`}
        >
          {rank}
        </span>

        {/* Thumb */}
        <span className="col-span-2 sm:col-span-2">
          <span className="relative block h-10 w-14 overflow-hidden rounded-lg bg-[#0a0a0a]">
            <img
              src={row.vehicle.image}
              alt={row.vehicle.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0";
              }}
            />
          </span>
        </span>

        {/* Name + bar */}
        <div className="col-span-6 sm:col-span-6 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
            {row.vehicle.brand}
          </p>
          <p className="truncate text-sm font-semibold text-white sm:text-[15px]">
            {row.vehicle.name}
          </p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <motion.span
              className="block h-full rounded-full bg-gradient-to-r from-red-500 via-red-400 to-red-500/70"
              initial={{ width: 0 }}
              animate={{ width: `${widthPct}%` }}
              transition={{
                duration: 0.9,
                delay: 0.08 + 0.04 * rank,
                ease: easeOut,
              }}
            />
          </div>
        </div>

        {/* Metric value */}
        <div className="col-span-3 sm:col-span-3 text-right">
          <p
            className={`text-base font-semibold tabular-nums ${
              rank === 1 ? "text-red-300" : "text-white"
            } sm:text-lg`}
            style={{ letterSpacing: "-0.01em" }}
          >
            {row.display}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/40">
            {unit}
          </p>
        </div>
      </a>
    </motion.li>
  );
};

// ----- Page ---------------------------------------------------------------

export default function SpecsPage() {
  const [activeId, setActiveId] = useState<string>(specs.metrics[0].id);
  const activeMetric = useMemo(
    () => specs.metrics.find((m) => m.id === activeId) ?? specs.metrics[0],
    [activeId]
  );

  const carRanking = useMemo(
    () => buildRanking(carBasics, "car", activeMetric, 5),
    [activeMetric]
  );
  const bikeRanking = useMemo(
    () => buildRanking(bikeBasics, "bike", activeMetric, 5),
    [activeMetric]
  );

  const topRaw =
    activeMetric.direction === "desc"
      ? Math.max(
          carRanking[0]?.raw ?? 1,
          bikeRanking[0]?.raw ?? 1
        )
      : Math.min(
          carRanking[0]?.raw ?? 1,
          bikeRanking[0]?.raw ?? 1
        );

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="about" />

      <PageHero
        eyebrow={specs.hero.eyebrow}
        headline={specs.hero.headline}
        description={specs.hero.description}
        image={specs.hero.image}
      >
        <a
          href="#leaderboards"
          className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
        >
          Explore leaderboards
          <span aria-hidden>→</span>
        </a>
        <a
          href="/compare"
          className="text-sm text-white/75 underline-offset-4 hover:text-white hover:underline"
        >
          Compare side by side
        </a>
      </PageHero>

      {/* Leaderboards */}
      <section
        id="leaderboards"
        className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
                Leaderboards
              </p>
              <h2
                className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
                style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
              >
                {activeMetric.label}.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
                {activeMetric.description}
              </p>
            </div>

            {/* Metric switcher */}
            <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
              {specs.metrics.map((m) => {
                const active = m.id === activeId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveId(m.id)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      active
                        ? "bg-red-500/15 text-red-300 ring-1 ring-red-500/60"
                        : "text-white/55 hover:text-white"
                    }`}
                  >
                    <span className={active ? "text-red-400" : "text-white/55"}>
                      {iconFor(m.icon, "h-4 w-4")}
                    </span>
                    {m.shortLabel}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Two columns: cars + bikes */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
            {/* Cars */}
            <div>
              <div className="flex items-end justify-between">
                <h3
                  className="text-xl font-semibold tracking-tight text-white md:text-2xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Top cars
                </h3>
                <a
                  href="/cars"
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55 hover:text-white"
                >
                  All cars →
                </a>
              </div>
              <ul className="mt-5 space-y-2.5">
                {carRanking.map((row, i) => (
                  <RankRow
                    key={`car-${row.vehicle.id}`}
                    rank={i + 1}
                    row={row}
                    unit={activeMetric.unit}
                    topRaw={topRaw}
                    direction={activeMetric.direction}
                  />
                ))}
                {carRanking.length === 0 && (
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/55">
                    No data available for this metric yet.
                  </p>
                )}
              </ul>
            </div>

            {/* Bikes */}
            <div>
              <div className="flex items-end justify-between">
                <h3
                  className="text-xl font-semibold tracking-tight text-white md:text-2xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Top bikes
                </h3>
                <a
                  href="/bikes"
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55 hover:text-white"
                >
                  All bikes →
                </a>
              </div>
              <ul className="mt-5 space-y-2.5">
                {bikeRanking.map((row, i) => (
                  <RankRow
                    key={`bike-${row.vehicle.id}`}
                    rank={i + 1}
                    row={row}
                    unit={activeMetric.unit}
                    topRaw={topRaw}
                    direction={activeMetric.direction}
                  />
                ))}
                {bikeRanking.length === 0 && (
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/55">
                    No data available for this metric yet.
                  </p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Glossary */}
      <section className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
              Speak the language
            </p>
            <h2
              className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
            >
              Spec glossary.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              Every spec on a RideBuilders detail page explained in plain
              English — without the marketing fluff.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 md:gap-6">
            {specs.glossary.map((g, i) => (
              <motion.div
                key={g.term}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: 0.04 + (i % 6) * 0.05,
                  ease: easeOut,
                }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5 transition-colors hover:bg-white/[0.05] hover:ring-white/15 md:p-6"
              >
                <div
                  className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(180px circle at 30% 0%, rgba(239,68,68,0.16), transparent 70%)",
                  }}
                  aria-hidden
                />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-red-400 ring-1 ring-white/10">
                    {iconFor(g.icon)}
                  </span>
                  <h3
                    className="mt-1 text-lg font-semibold tracking-tight text-white"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {g.term}
                  </h3>
                </div>
                <p className="relative mt-4 text-sm leading-relaxed text-white/65 md:text-[14.5px]">
                  {g.definition}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: side-by-side compare */}
      <section className="relative bg-black px-6 pb-24 md:px-10 md:pb-32 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md md:p-12"
          style={{
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.55)",
          }}
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
                Compare
              </p>
              <h3
                className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                See specs side by side.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
                Drop any two vehicles on the comparison board and see every
                number lined up — with the best value in each row called out.
              </p>
            </div>
            <a
              href="/compare"
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Open compare
              <span aria-hidden>→</span>
            </a>
          </div>
        </motion.div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
