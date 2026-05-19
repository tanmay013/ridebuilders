"use client";

import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import siteData from "@/data/site.json";
import type { CarsFilterValues } from "./CarsFilterBar";

interface Car {
  id: string;
  brand: string;
  name: string;
  image: string;
  price?: string;
  hp?: string;
  zero?: string;
  topSpeed?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  drivetrain?: string;
  modelYear?: number;
}

type PageKey = "carsPage" | "bikesPage";

const ease = [0.16, 1, 0.3, 1] as const;

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 1,
  },
  rest: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

const bgVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08, transition: { duration: 0.9, ease } },
};

const titleVariants = {
  rest: { y: 0 },
  hover: { y: -4, transition: { duration: 0.5, ease } },
};

const detailsBtnVariants = {
  rest: { width: 40, transition: { duration: 0.4, ease } },
  hover: { width: 142, transition: { duration: 0.45, ease } },
};

const labelVariants = {
  rest: {
    maxWidth: 0,
    opacity: 0,
    x: -4,
    paddingLeft: 0,
    paddingRight: 0,
    transition: { duration: 0.18, ease },
  },
  hover: {
    maxWidth: 96,
    opacity: 1,
    x: 0,
    paddingLeft: 14,
    paddingRight: 6,
    transition: { duration: 0.28, ease, delay: 0.06 },
  },
};

const arrowVariants = {
  rest: { x: 0, transition: { duration: 0.2, ease } },
  hover: {
    x: 0,
    transition: { duration: 0.2, ease },
  },
};

const BrandLogo: FC<{ brand: string }> = ({ brand }) => {
  if (brand.toLowerCase() === "bmw") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true" className="h-full w-full">
        <circle cx="50" cy="50" r="48" fill="#000" />
        <circle cx="50" cy="50" r="40" fill="#fff" />
        <path d="M50 10 A40 40 0 0 1 90 50 L50 50 Z" fill="#0066B1" />
        <path d="M50 50 L50 90 A40 40 0 0 1 10 50 Z" fill="#0066B1" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#000" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <span className="text-[11px] font-bold uppercase text-black">
      {brand.slice(0, 2)}
    </span>
  );
};

const PowerIcon: FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c1 3-1 4-1 7a4 4 0 0 0 8 0c0-2-1-3-1-3 0 1-1 2-2 2 0-2 1-4-4-6Z" />
    <path d="M6 12c0 1 1 2 2 2-1 2 0 4 1 5a4 4 0 1 1-3-7Z" />
  </svg>
);

const ZeroIcon: FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const SpeedIcon: FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 18 0" />
    <path d="M12 12 16 9" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const CarCard: FC<{ car: Car; index: number; basePath: string; isBikesPage: boolean }> = ({
  car,
  index,
  basePath,
  isBikesPage,
}) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const bgYRaw = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const contentYRaw = useTransform(scrollYProgress, [0, 1], ["12px", "-12px"]);
  const bgY = useSpring(bgYRaw, { stiffness: 90, damping: 22, mass: 0.5 });
  const contentY = useSpring(contentYRaw, { stiffness: 90, damping: 22, mass: 0.5 });

  const specs = [
    { value: car.hp ?? "--", label: "Power", icon: <PowerIcon /> },
    { value: car.zero ?? "--", label: "0-100", icon: <ZeroIcon /> },
    { value: car.topSpeed ?? "--", label: "Top Speed", icon: <SpeedIcon /> },
  ];

  return (
    <motion.a
      ref={cardRef}
      href={`${basePath}/${car.id}`}
      className="group relative block w-full overflow-hidden rounded-[22px] bg-[#0a0a0a] text-slate-100 ring-1 ring-white/10 transition-all duration-300 hover:ring-2 hover:ring-white hover:shadow-[0_0_40px_10px_rgba(255,255,255,0.4),0_0_80px_20px_rgba(255,255,255,0.2)]"
      variants={cardVariants}
      initial="hidden"
      whileInView="rest"
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.04 * (index % 4),
      }}
    >
      <div className={`relative ${isBikesPage ? "aspect-[4/5]" : "aspect-[16/9.4]"}`}>
        <motion.img
          src={car.image}
          alt={car.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
          variants={bgVariants}
          style={{ y: bgY }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />

        {/* Dark cinematic overlays */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,12,20,0.92) 0%, rgba(8,12,20,0.55) 38%, rgba(8,12,20,0.15) 65%, rgba(8,12,20,0.55) 100%), linear-gradient(180deg, rgba(8,12,20,0.4) 0%, transparent 30%, transparent 65%, rgba(8,12,20,0.6) 100%)",
          }}
        />

        <motion.div
          className="absolute inset-0 z-[2] flex flex-col justify-between p-4 md:p-[18px]"
          style={{ y: contentY }}
        >
          {/* Top row */}
          <div className="flex items-start justify-between">
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]">
              FEATURED
            </span>
            <span className="flex h-7 w-7 items-center justify-center text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
              </svg>
            </span>
          </div>

          {/* Middle */}
          <motion.div variants={titleVariants} className="mb-1 mt-[-6px] flex flex-1 flex-col justify-center">
            <div className="mb-2.5 flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                <BrandLogo brand={car.brand} />
              </div>
              <p className="text-[13px] font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {car.brand}
              </p>
            </div>

            <h3
              className="mb-2 max-w-[72%] text-[22px] font-extrabold leading-[1.05] tracking-[0.005em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] md:text-[24px]"
            >
              {car.name}
            </h3>

            <p className="text-base font-bold tracking-[0.01em] text-red-500 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {car.price ?? "Price on request"}
            </p>
          </motion.div>

          {/* Bottom */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center text-slate-200">
                    {spec.icon}
                  </div>
                  <div className="flex flex-col leading-[1.1]">
                    <span className="whitespace-nowrap text-[11px] font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] md:text-xs">
                      {spec.value}
                    </span>
                    <span className="mt-0.5 whitespace-nowrap text-[9px] font-normal text-slate-300 md:text-[10px]">
                      {spec.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <motion.span
              variants={detailsBtnVariants}
              className="flex h-10 shrink-0 items-center overflow-hidden rounded-full bg-white p-0 text-xs font-bold tracking-[0.02em] text-slate-900 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
              aria-hidden="true"
            >
              <motion.span
                variants={labelVariants}
                className="flex items-center overflow-hidden whitespace-nowrap"
              >
                View Details
              </motion.span>
              <motion.span variants={arrowVariants} className="flex h-10 w-10 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </motion.span>
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.a>
  );
};

const GridIcon: FC<{ active?: boolean }> = ({ active }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
    <rect x="4" y="4" width="7" height="7" rx="1" />
    <rect x="13" y="4" width="7" height="7" rx="1" />
    <rect x="4" y="13" width="7" height="7" rx="1" />
    <rect x="13" y="13" width="7" height="7" rx="1" />
  </svg>
);

const ListIcon: FC<{ active?: boolean }> = ({ active }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

interface CarsGridProps {
  pageKey?: PageKey;
  basePath?: string;
  sectionTitle?: string;
  filterValues: CarsFilterValues;
}

const parsePriceToRupees = (price?: string): number | null => {
  if (!price) return null;
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return null;
  return Number(digits);
};

const matchesPriceBucket = (priceRupees: number | null, selected: string): boolean => {
  if (!priceRupees || selected === "Any" || selected === "All") return true;
  const L = 100_000;
  const CR = 10_000_000;
  if (selected === "< ₹20L") return priceRupees < 20 * L;
  if (selected === "₹20L - ₹50L") return priceRupees >= 20 * L && priceRupees <= 50 * L;
  if (selected === "₹50L - ₹1Cr") return priceRupees > 50 * L && priceRupees <= CR;
  if (selected === "> ₹1Cr") return priceRupees > CR;
  return true;
};

const matchesModelYearBucket = (year: number | undefined, selected: string): boolean => {
  if (!year || selected === "Any" || selected === "All") return true;
  if (selected === "2025+") return year >= 2025;
  if (selected === "2020 - 2024") return year >= 2020 && year <= 2024;
  if (selected === "2015 - 2019") return year >= 2015 && year <= 2019;
  if (selected === "< 2015") return year < 2015;
  return true;
};

const CarsGrid: FC<CarsGridProps> = ({
  pageKey = "carsPage",
  basePath = "/cars",
  sectionTitle = "All Cars",
  filterValues,
}) => {
  const isBikesPage = pageKey === "bikesPage";
  const allCars = (
    siteData as typeof siteData & Record<PageKey, { all: Car[] }>
  )[pageKey].all;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sectionY = useTransform(sectionProgress, [0, 1], ["36px", "-28px"]);
  const sectionOpacity = useTransform(sectionProgress, [0, 0.22, 0.9, 1], [0.82, 1, 1, 0.95]);
  const headerY = useTransform(sectionProgress, [0, 1], ["18px", "-14px"]);
  const cardsY = useTransform(sectionProgress, [0, 1], ["28px", "-10px"]);

  const [view, setView] = useState<"grid" | "list">("grid");
  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      const selectedBrand = filterValues.brand ?? "All";
      if (selectedBrand !== "All" && car.brand !== selectedBrand) return false;

      const selectedPrice = filterValues.price ?? "Any";
      if (!matchesPriceBucket(parsePriceToRupees(car.price), selectedPrice)) return false;

      const selectedFuel = filterValues.fuelType ?? "All";
      if (
        selectedFuel !== "All" &&
        car.fuelType &&
        car.fuelType.toLowerCase() !== selectedFuel.toLowerCase()
      ) {
        return false;
      }

      const selectedTransmission = filterValues.transmission ?? "All";
      if (
        selectedTransmission !== "All" &&
        car.transmission &&
        car.transmission.toLowerCase() !== selectedTransmission.toLowerCase()
      ) {
        return false;
      }

      const selectedBodyType = filterValues.bodyType ?? "All";
      if (
        selectedBodyType !== "All" &&
        car.bodyType &&
        car.bodyType.toLowerCase() !== selectedBodyType.toLowerCase()
      ) {
        return false;
      }

      const selectedDrivetrain = filterValues.drivetrain ?? "All";
      if (
        selectedDrivetrain !== "All" &&
        car.drivetrain &&
        car.drivetrain.toLowerCase() !== selectedDrivetrain.toLowerCase()
      ) {
        return false;
      }

      const selectedModelYear = filterValues.modelYear ?? "Any";
      if (!matchesModelYearBucket(car.modelYear, selectedModelYear)) return false;

      return true;
    });
  }, [allCars, filterValues]);

  return (
    <motion.section
      ref={sectionRef}
      className="mt-12 px-4 md:mt-16"
      style={{ y: sectionY, opacity: sectionOpacity }}
    >
      <div className="w-full">
        {/* Header row */}
        <motion.div
          className="mb-5 flex items-end justify-between gap-4 md:mb-6"
          style={{ y: headerY }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-white" style={{ letterSpacing: "-0.02em" }}>
              {sectionTitle}
            </h2>
            <p className="text-xs md:text-sm text-white/50">
              {filteredCars.length} results found
            </p>
          </div>

          {/* View toggle — red active state */}
          <div className="inline-flex items-center gap-1 rounded-xl bg-white/[0.04] ring-1 ring-white/10 p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                view === "grid"
                  ? "bg-red-500/20 ring-1 ring-red-500/60 text-red-400"
                  : "text-white/55 hover:text-white"
              }`}
            >
              <GridIcon active={view === "grid"} />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                view === "list"
                  ? "bg-red-500/20 ring-1 ring-red-500/60 text-red-400"
                  : "text-white/55 hover:text-white"
              }`}
            >
              <ListIcon active={view === "list"} />
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          layout
          style={{ y: cardsY }}
          className={
            view === "grid"
              ? `grid grid-cols-1 gap-5 sm:grid-cols-2 ${isBikesPage ? "lg:grid-cols-4" : "lg:grid-cols-3"} md:gap-6`
              : "flex flex-col gap-4"
          }
        >
          {filteredCars.map((car, i) => (
            <CarCard
              key={car.id}
              car={car}
              index={i}
              basePath={basePath}
              isBikesPage={isBikesPage}
            />
          ))}
        </motion.div>

        {/* Load more */}
        <motion.div
          className="mt-10 md:mt-12 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            className="group inline-flex items-center gap-2.5 px-6 py-3 text-sm md:text-base text-white/85 hover:text-white transition-colors"
          >
            Load More
            <motion.span
              aria-hidden
              className="text-red-500"
              initial={{ y: 0 }}
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </motion.span>
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CarsGrid;
