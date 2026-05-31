"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import siteData from "@/data/site.json";
import CTASection from "@/components/CTASection";

interface VehicleEntry {
  id: string;
  brand: string;
  name: string;
  price: string;
  hp: string;
  zero: string;
  topSpeed: string;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  bodyType?: string;
  modelYear?: number;
  image: string;
}

const cars = siteData.carsPage.all as VehicleEntry[];
const bikes = siteData.bikesPage.all as VehicleEntry[];
type CompareKind = "cars" | "bikes";

type ExtraSpec = {
  engine: string;
  power?: string;
  zeroToHundred?: string;
  topSpeed?: string;
  transmission?: string;
  torque: string;
  driveType: string;
  mileage: string;
  tankCapacity: string;
  exShowroom?: string;
  wheelbase?: string;
  emission: string;
  kerbWeight: string;
  groundClearance: string;
  length: string;
  width: string;
};

type CarDetailData = {
  showroomPrice?: string;
  keySpecs?: Array<{ label: string; value: string }>;
};

type CompareSpecsPartial = Partial<
  Omit<ExtraSpec, "power" | "zeroToHundred" | "topSpeed" | "transmission" | "exShowroom">
>;

const specValue = (
  detail: CarDetailData | undefined,
  labels: string | string[]
) => {
  const list = Array.isArray(labels) ? labels : [labels];
  for (const label of list) {
    const value = detail?.keySpecs?.find((spec) => spec.label === label)?.value;
    if (value && value !== "—") return value;
  }
  return undefined;
};

const carDetails = siteData.carsPage.carDetails as Record<string, CarDetailData>;
const bikeDetails = siteData.bikesPage.bikeDetails as Record<string, CarDetailData>;
const bikeCompareSpecs = (siteData.bikesPage as { compareSpecs?: Record<string, CompareSpecsPartial> })
  .compareSpecs ?? {};

const buildExtras = (
  vehicle: VehicleEntry,
  detail: CarDetailData | undefined,
  compare: CompareSpecsPartial | undefined
): ExtraSpec => ({
  engine:
    specValue(detail, ["Engine", "Motor"]) ??
    compare?.engine ??
    "—",
  power: specValue(detail, "Power") ?? vehicle.hp,
  zeroToHundred:
    specValue(detail, ["0 - 100 km/h", "0 - 40 km/h"]) ?? vehicle.zero,
  topSpeed: specValue(detail, "Top Speed") ?? vehicle.topSpeed,
  transmission:
    specValue(detail, "Transmission") ?? vehicle.transmission ?? "—",
  torque: specValue(detail, "Torque") ?? compare?.torque ?? "—",
  driveType: vehicle.drivetrain ?? compare?.driveType ?? "—",
  mileage:
    specValue(detail, ["Mileage", "Range"]) ?? compare?.mileage ?? "—",
  tankCapacity:
    compare?.tankCapacity ??
    (vehicle.fuelType === "Electric" ? "—" : "See specs"),
  exShowroom: detail?.showroomPrice ?? vehicle.price,
  wheelbase: compare?.wheelbase ?? "See specs",
  emission:
    compare?.emission ??
    (vehicle.fuelType === "Electric"
      ? "Zero Tailpipe Emission"
      : "BS6 Phase 2"),
  kerbWeight: compare?.kerbWeight ?? "See specs",
  groundClearance: compare?.groundClearance ?? "See specs",
  length: compare?.length ?? "See specs",
  width: compare?.width ?? "See specs",
});

const carExtrasById = cars.reduce<Record<string, ExtraSpec>>((acc, car) => {
  acc[car.id] = buildExtras(car, carDetails[car.id], undefined);
  return acc;
}, {});

const bikeExtrasById = bikes.reduce<Record<string, ExtraSpec>>((acc, bike) => {
  acc[bike.id] = buildExtras(
    bike,
    bikeDetails[bike.id],
    bikeCompareSpecs[bike.id]
  );
  return acc;
}, {});
const fallbackExtras: ExtraSpec = {
  engine: "—",
  power: "—",
  zeroToHundred: "—",
  topSpeed: "—",
  transmission: "—",
  torque: "—",
  driveType: "—",
  mileage: "—",
  tankCapacity: "—",
  exShowroom: "—",
  wheelbase: "—",
  emission: "—",
  kerbWeight: "—",
  groundClearance: "—",
  length: "—",
  width: "—",
};

const getExtras = (
  vehicle: VehicleEntry | null,
  kind: CompareKind
): ExtraSpec | null => {
  if (!vehicle) return null;
  const byId = kind === "cars" ? carExtrasById : bikeExtrasById;
  return byId[vehicle.id] ?? fallbackExtras;
};

const parseNumber = (value?: string): number | null => {
  if (!value) return null;
  const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  return Number(match[0]);
};

type Direction = "higher" | "lower";

const findBestIndex = (
  values: (string | undefined)[],
  direction: Direction
): number => {
  let bestIdx = -1;
  let bestNum: number | null = null;
  values.forEach((v, idx) => {
    const n = parseNumber(v);
    if (n === null) return;
    if (bestNum === null) {
      bestIdx = idx;
      bestNum = n;
      return;
    }
    if (direction === "higher" && n > bestNum) {
      bestIdx = idx;
      bestNum = n;
    }
    if (direction === "lower" && n < bestNum) {
      bestIdx = idx;
      bestNum = n;
    }
  });
  return bestIdx;
};

/** Returns 0..1 representing how good this value is given a comparison direction. */
const computeFraction = (
  value: string | undefined,
  values: (string | undefined)[],
  direction?: Direction
): number => {
  if (!direction || !value) return 0;
  const nums = values
    .map((v) => parseNumber(v))
    .filter((n): n is number => n !== null && n > 0);
  const num = parseNumber(value);
  if (!num || nums.length === 0) return 0;
  if (direction === "higher") {
    const max = Math.max(...nums);
    return max > 0 ? num / max : 0;
  }
  // lower-is-better → invert proportion
  const min = Math.min(...nums);
  return num > 0 ? min / num : 0;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

/* ---------- Icons ---------- */

const StarIcon = () => (
  <motion.svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="ml-1.5 inline-block h-3 w-3 text-red-500"
    fill="currentColor"
    initial={{ scale: 0, rotate: -45, opacity: 0 }}
    animate={{ scale: 1, rotate: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 380, damping: 18 }}
  >
    <path d="M12 2.5l2.9 6.6 7.1.7-5.4 4.9 1.7 7L12 17.9 5.7 21.7l1.7-7L2 9.8l7.1-.7L12 2.5z" />
  </motion.svg>
);

const PerformanceIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 0 1 18 0" />
    <path d="M12 12 16 9" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <path d="M5 18h14" />
  </svg>
);

const EngineIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="9" width="10" height="8" rx="1" />
    <path d="M15 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
    <path d="M5 9V7M9 9V7M13 9V7" />
    <path d="M3 13h2M3 16h2" />
  </svg>
);

const DimensionsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7h18M3 7l3-3M3 7l3 3" />
    <path d="M21 7l-3-3M21 7l-3 3" />
    <rect x="5" y="13" width="14" height="6" rx="1" />
  </svg>
);

const EfficiencyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 14c0 3.3 2.7 6 6 6 4.2 0 6.4-3.9 8.5-8.3.4-.9.9-1.9 1.5-2.9-3.2 0-5.6.8-7.5 2.1C10.6 8 8.7 6.9 6 6.9 4.9 6.9 4 7.8 4 8.9V14Z" />
    <path d="M10 20v-5.5" />
    <path d="M12.5 12.2c1.5.3 3.1.2 4.8-.3" />
  </svg>
);

const PricingIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 3h12l3 5-9 13L3 8l3-5Z" />
    <path d="M9.5 10.5c0 1.3 1.1 2.3 2.5 2.3s2.5 1 2.5 2.3-1.1 2.3-2.5 2.3-2.5-1-2.5-2.3" />
    <path d="M12 9v9" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8h.01" />
    <path d="M11 12h1v4h1" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const BrandBadge = ({ brand }: { brand: string }) => (
  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
    {brand.charAt(0).toUpperCase()}
  </span>
);

/* ---------- Reusable pieces ---------- */

const useOutsideClose = (
  ref: React.RefObject<HTMLElement | null>,
  setOpen: (v: boolean) => void
) => {
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [ref, setOpen]);
};

/** A dropdown panel — callers control positioning by wrapping it in an absolute div. */
const CarPickerDropdown = ({
  options,
  activeId,
  onPick,
}: {
  options: VehicleEntry[];
  activeId?: string;
  onPick: (id: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -6, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -6, scale: 0.98 }}
    transition={{ duration: 0.18, ease: easeOut }}
    className="max-h-60 w-64 overflow-auto rounded-lg border border-white/10 bg-[#0e1116] py-1.5 shadow-xl"
  >
    {options.map((c) => {
      const active = c.id === activeId;
      return (
        <button
          key={c.id}
          type="button"
          onClick={() => onPick(c.id)}
          className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
            active
              ? "bg-red-500/10 text-red-400"
              : "text-white/85 hover:bg-white/[0.06]"
          }`}
        >
          <span className="truncate">
            {c.brand} {c.name}
          </span>
          <span className="ml-3 text-[11px] text-white/45">{c.price}</span>
        </button>
      );
    })}
  </motion.div>
);

/* ---------- Hero compare card ---------- */

const HeroCarCard = ({
  car,
  carIndex,
  itemLabel,
  options,
  onChange,
  onRemove,
}: {
  car: VehicleEntry;
  carIndex: number;
  itemLabel: string;
  options: VehicleEntry[];
  onChange: (id: string) => void;
  onRemove?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClose(ref, setOpen);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.45, ease: easeOut }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`relative ${open ? "z-50" : "z-10"}`}
    >
      {/* Card with overflow hidden — image, overlays and footer live here */}
      <motion.div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e1116] to-[#08090c] shadow-[0_20px_60px_-34px_rgba(0,0,0,0.75)]"
        whileHover={{
          boxShadow: "0 26px 70px -30px rgba(0,0,0,0.82)",
          borderColor: "rgba(255,255,255,0.2)",
        }}
        transition={{ duration: 0.28, ease: easeOut }}
      >
        {/* Background image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={car.id}
            src={car.image}
            alt={`${car.brand} ${car.name}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.06 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0";
            }}
          />
        </AnimatePresence>

        {/* Vignette + bottom fade */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent"
          whileHover={{ x: "320%" }}
          transition={{ duration: 0.7, ease: easeOut }}
        />

        {/* CAR badge */}
        <span className="absolute left-4 top-4 rounded-full bg-red-500/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_4px_14px_rgba(239,68,68,0.35)]">
          {itemLabel} {carIndex + 1}
        </span>

        {/* Remove button (only when removable) */}
        {onRemove && (
          <motion.button
            type="button"
            onClick={onRemove}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Remove vehicle"
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/85 transition-colors hover:bg-black/80 hover:text-white"
          >
            <CloseIcon />
          </motion.button>
        )}

        {/* Footer */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="truncate text-base font-semibold text-white">
            {car.brand} {car.name}
          </p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-1 inline-flex items-center gap-1.5 border-b border-red-500/70 pb-1 text-sm font-medium text-red-500 transition-colors hover:text-red-400"
          >
            <span>Change vehicle</span>
            <SearchIcon />
          </button>
        </div>
      </motion.div>

      {/* Dropdown rendered OUTSIDE the overflow-hidden card so it isn't clipped */}
      <AnimatePresence>
        {open && (
          <div className="absolute left-4 top-full z-[60] mt-2">
            <CarPickerDropdown
              options={options}
              activeId={car.id}
              onPick={(id) => {
                onChange(id);
                setOpen(false);
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ---------- Hero add card ---------- */

const HeroAddCard = ({
  carIndex,
  itemLabel,
  options,
  onPick,
}: {
  carIndex: number;
  itemLabel: string;
  options: VehicleEntry[];
  onPick: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClose(ref, setOpen);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className={`relative ${open ? "z-50" : "z-10"}`}
    >
      <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-[#0a0d12]">
        <span className="absolute left-4 top-4 rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
          {itemLabel} {carIndex + 1}
        </span>

        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="flex flex-col items-center gap-3 px-6 text-center text-white"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/55 text-red-500">
            <PlusIcon />
          </span>
          <span className="text-base font-semibold text-white">Add vehicle</span>
          <span className="text-xs text-white/55">Add up to 3 vehicles to compare</span>
        </motion.button>
      </div>

      {/* Dropdown rendered outside overflow-hidden so it isn't clipped */}
      <AnimatePresence>
        {open && (
          <div className="absolute left-1/2 top-full z-[60] mt-2 -translate-x-1/2">
            <CarPickerDropdown
              options={options}
              onPick={(id) => {
                onPick(id);
                setOpen(false);
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ---------- VS Divider ---------- */

const VsDivider = () => (
  <div className="relative hidden items-center justify-center md:flex">
    <div className="absolute inset-y-6 w-px bg-gradient-to-b from-transparent via-red-500/55 to-transparent" />
    <span className="relative z-10 rounded-full border border-red-500/40 bg-black px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-red-500">
      VS
    </span>
  </div>
);

/* ---------- Spec table value cell ---------- */

const ValueBar = ({
  fraction,
  isBest,
}: {
  fraction: number;
  isBest: boolean;
}) => {
  const pct = Math.max(8, Math.min(100, Math.round(fraction * 100)));
  return (
    <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: easeOut }}
        className={`h-full rounded-full ${
          isBest ? "bg-red-500" : "bg-white/30"
        }`}
        style={
          isBest
            ? { boxShadow: "0 0 12px rgba(239,68,68,0.6)" }
            : undefined
        }
      />
    </div>
  );
};

const SpecValueCell = ({
  car,
  value,
  isBest,
  fraction,
  showBar,
  isEmpty,
}: {
  car: VehicleEntry | null;
  value: string | undefined;
  isBest: boolean;
  fraction: number;
  showBar: boolean;
  isEmpty: boolean;
}) => {
  return (
    <div className="min-w-0">
      <div className="flex items-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={`${car?.id ?? "empty"}-${value ?? "—"}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: easeOut }}
            className={`truncate text-sm ${
              isBest
                ? "font-semibold text-white"
                : isEmpty
                ? "text-white/35"
                : "text-white/85"
            }`}
          >
            {value ?? "—"}
          </motion.span>
        </AnimatePresence>
        {isBest && <StarIcon />}
      </div>
      {showBar && !isEmpty && (
        <ValueBar fraction={fraction} isBest={isBest} />
      )}
    </div>
  );
};

/* ---------- Spec table column header ---------- */

const ColumnHeader = ({
  car,
  carIndex,
  itemLabel,
  options,
  onChange,
  isEmpty,
  onPick,
}: {
  car: VehicleEntry | null;
  carIndex: number;
  itemLabel: string;
  options: VehicleEntry[];
  onChange: (id: string) => void;
  isEmpty: boolean;
  onPick: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClose(ref, setOpen);

  return (
    <div ref={ref} className="relative flex min-w-0 items-center gap-2.5">
      {isEmpty ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-white/55">
            <PlusIcon />
          </span>
          Add vehicle
        </button>
      ) : car ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 items-center gap-2 text-left transition-colors hover:text-white"
        >
          <BrandBadge brand={car.brand} />
          <span className="truncate text-sm font-semibold text-white">
            {car.brand} {car.name}
          </span>
          <ChevronDownIcon />
        </button>
      ) : null}

      <AnimatePresence>
        {open && (
          <div className="absolute left-0 top-full z-40 mt-2">
            <CarPickerDropdown
              options={options}
              activeId={car?.id}
              onPick={(id) => {
                if (isEmpty) onPick(id);
                else onChange(id);
                setOpen(false);
              }}
            />
          </div>
        )}
      </AnimatePresence>
      <span className="sr-only">
        {itemLabel} {carIndex + 1}
      </span>
    </div>
  );
};

/* ---------- Spec section ---------- */

type Row = {
  label: string;
  values: (string | undefined)[];
  direction?: Direction;
};

const SpecSection = ({
  title,
  Icon,
  rows,
  selected,
  sectionIndex,
}: {
  title: string;
  Icon: React.ComponentType;
  rows: Row[];
  selected: (VehicleEntry | null)[];
  sectionIndex: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: 0.05 + sectionIndex * 0.05,
        ease: easeOut,
      }}
      className="grid grid-cols-[110px_1fr] border-t border-white/[0.06]"
    >
      {/* Section icon column */}
      <div className="flex flex-col items-center justify-center gap-2 border-r border-white/[0.06] bg-[#0a0d12] px-3 py-6 text-red-500">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/35 bg-red-500/[0.06]">
          <Icon />
        </span>
        <span className="text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-red-500/90">
          {title}
        </span>
      </div>

      {/* Rows */}
      <div>
        {rows.map((row, rIdx) => {
          const bestIdx = row.direction
            ? findBestIndex(row.values, row.direction)
            : -1;
          return (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.4,
                delay: 0.05 + rIdx * 0.04,
                ease: easeOut,
              }}
              className="grid grid-cols-[170px_repeat(3,minmax(0,1fr))] gap-6 border-b border-white/[0.05] px-6 py-3.5 last:border-b-0"
            >
              <span className="self-center text-[13px] text-white/55">
                {row.label}
              </span>
              {row.values.map((value, vi) => {
                const isBest = vi === bestIdx;
                const car = selected[vi];
                const fraction = computeFraction(value, row.values, row.direction);
                return (
                  <SpecValueCell
                    key={vi}
                    car={car}
                    value={value}
                    isBest={isBest}
                    fraction={fraction}
                    showBar={!!row.direction}
                    isEmpty={!car}
                  />
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ---------- Page ---------- */

export default function ComparePage() {
  const [compareKind, setCompareKind] = useState<CompareKind>("cars");
  const options = compareKind === "cars" ? cars : bikes;
  const itemLabel = compareKind === "cars" ? "Car" : "Bike";

  const [ids, setIds] = useState<(string | null)[]>([
    cars[0]?.id ?? null,
    cars[1]?.id ?? cars[0]?.id ?? null,
    null,
  ]);

  useEffect(() => {
    setIds([options[0]?.id ?? null, options[1]?.id ?? options[0]?.id ?? null, null]);
  }, [compareKind, options]);

  const selected = useMemo<(VehicleEntry | null)[]>(
    () =>
      ids.map((id) => (id ? options.find((entry) => entry.id === id) ?? null : null)),
    [ids, options]
  );

  const setIdAt = (idx: number, id: string | null) => {
    setIds((prev) => {
      const next = [...prev];
      next[idx] = id;
      return next;
    });
  };

  const extras = selected.map((vehicle) => getExtras(vehicle, compareKind));

  const sections: {
    title: string;
    Icon: React.ComponentType;
    rows: Row[];
  }[] = [
    {
      title: "PERFORMANCE",
      Icon: PerformanceIcon,
      rows: [
        {
          label: "Power",
          values: selected.map((c, idx) => extras[idx]?.power ?? c?.hp),
          direction: "higher",
        },
        {
          label: "Peak Torque",
          values: extras.map((e) => e?.torque),
          direction: "higher",
        },
        {
          label: "0-100 kph",
          values: selected.map((c, idx) => extras[idx]?.zeroToHundred ?? c?.zero),
          direction: "lower",
        },
        {
          label: "Top Speed",
          values: selected.map((c, idx) => extras[idx]?.topSpeed ?? c?.topSpeed),
          direction: "higher",
        },
      ],
    },
    {
      title: "ENGINE & DRIVETRAIN",
      Icon: EngineIcon,
      rows: [
        { label: "Engine", values: extras.map((e) => e?.engine) },
        {
          label: "Transmission",
          values: selected.map(
            (c, idx) => extras[idx]?.transmission ?? c?.transmission
          ),
        },
        { label: "Drive Type", values: extras.map((e) => e?.driveType) },
        { label: "Fuel Type", values: selected.map((c) => c?.fuelType) },
        { label: "Body Type", values: selected.map((c) => c?.bodyType) },
      ],
    },
    {
      title: "EFFICIENCY & CAPACITY",
      Icon: EfficiencyIcon,
      rows: [
        {
          label: "Mileage",
          values: extras.map((e) => e?.mileage),
          direction: "higher",
        },
        {
          label: "Fuel Tank",
          values: extras.map((e) => e?.tankCapacity),
          direction: "higher",
        },
        { label: "Emission", values: extras.map((e) => e?.emission) },
        {
          label: "Ground Clearance",
          values: extras.map((e) => e?.groundClearance),
          direction: "higher",
        },
      ],
    },
    {
      title: "DIMENSIONS & WEIGHT",
      Icon: DimensionsIcon,
      rows: [
        {
          label: "Kerb Weight",
          values: extras.map((e) => e?.kerbWeight),
          direction: "lower",
        },
        {
          label: "Length",
          values: extras.map((e) => e?.length),
          direction: "higher",
        },
        {
          label: "Width",
          values: extras.map((e) => e?.width),
          direction: "higher",
        },
        {
          label: "Wheelbase",
          values: extras.map((e) => e?.wheelbase),
          direction: "higher",
        },
      ],
    },
    {
      title: "PRICING",
      Icon: PricingIcon,
      rows: [
        {
          label: "Ex-Showroom",
          values: selected.map((c, idx) => extras[idx]?.exShowroom ?? c?.price),
          direction: "lower",
        },
        {
          label: "Model Year",
          values: selected.map((c) =>
            typeof c?.modelYear === "number" ? String(c.modelYear) : undefined
          ),
          direction: "higher",
        },
      ],
    },
  ];

  // First two slots are required; third is removable / addable.
  const isRemovable = (idx: number) => idx >= 2;

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="compare" />

      <section className="px-6 pb-16 pt-28 md:px-10 lg:px-12">
        <div className="mx-auto max-w-[1480px]">
          {/* Intro */}
          <motion.div
            className="mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easeOut }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
              Compare Vehicles
            </p>
            <div className="mt-4 inline-flex rounded-full border border-white/15 bg-white/5 p-1">
              {(["cars", "bikes"] as const).map((kind) => {
                const active = compareKind === kind;
                return (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => setCompareKind(kind)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                      active
                        ? "bg-red-500 text-white"
                        : "text-white/65 hover:text-white"
                    }`}
                  >
                    {kind}
                  </button>
                );
              })}
            </div>
            <h1 className="mt-2 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl">
              Compare. Choose the best
              <span className="text-red-500">.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
              Pick up to three {compareKind === "cars" ? "cars" : "bikes"} and
              compare specifications side by side.
            </p>
          </motion.div>

          {/* Hero compare cards row */}
          <motion.div
            className="relative z-30 mb-6 grid items-stretch gap-3 md:grid-cols-[1fr_56px_1fr_56px_1fr]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: easeOut }}
          >
            {selected.map((car, idx) => (
              <div key={`hero-wrap-${idx}`} className="contents">
                <AnimatePresence mode="wait">
                  {car ? (
                    <HeroCarCard
                      key={`car-${idx}-${car.id}`}
                      car={car}
                      carIndex={idx}
                      itemLabel={itemLabel}
                      options={options}
                      onChange={(id) => setIdAt(idx, id)}
                      onRemove={
                        isRemovable(idx) ? () => setIdAt(idx, null) : undefined
                      }
                    />
                  ) : (
                    <HeroAddCard
                      key={`add-${idx}`}
                      carIndex={idx}
                      itemLabel={itemLabel}
                      options={options}
                      onPick={(id) => setIdAt(idx, id)}
                    />
                  )}
                </AnimatePresence>
                {idx < selected.length - 1 && <VsDivider />}
              </div>
            ))}
          </motion.div>

          {/* Spec table */}
          <motion.div
            className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d12]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          >
            {/* Top header row */}
            <div className="grid grid-cols-[110px_1fr] bg-[#0a0d12]">
              <div className="border-r border-white/[0.06] px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                Specifications
              </div>
              <div className="grid grid-cols-[170px_repeat(3,minmax(0,1fr))] gap-6 px-6 py-4">
                <span /> {/* spacer to align with row label column */}
                {selected.map((car, idx) => (
                  <ColumnHeader
                    key={`col-${idx}`}
                    car={car}
                    carIndex={idx}
                    itemLabel={itemLabel}
                    options={options}
                    onChange={(id) => setIdAt(idx, id)}
                    isEmpty={!car}
                    onPick={(id) => setIdAt(idx, id)}
                  />
                ))}
              </div>
            </div>

            {/* Sections */}
            {sections.map((section, sIdx) => (
              <SpecSection
                key={section.title}
                title={section.title}
                Icon={section.Icon}
                rows={section.rows}
                selected={selected}
                sectionIndex={sIdx}
              />
            ))}

            {/* Footer note */}
            <div className="flex items-center justify-center gap-2 border-t border-white/[0.06] px-6 py-3 text-xs text-white/55">
              <span className="text-red-500/85">
                <InfoIcon />
              </span>
              <span>Red indicates the best value in each category.</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mt-20 pb-0 md:mt-28 md:pb-0">
      <CTASection />
        <Footer />
      </div>
    </main>
  );
}
