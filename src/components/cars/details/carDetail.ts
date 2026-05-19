import siteData from "@/data/site.json";

export interface CarBasic {
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

/**
 * A car colour swatch.
 *
 * Two display modes are supported:
 *  1. `image` is provided → render that image directly in the stage
 *     (the recommended way; ignores tint fields).
 *  2. `image` is omitted → render the base car image and apply
 *     `tint` / `blend` / `tintOpacity` as a CSS overlay.
 *
 * Both modes can co-exist within the same car's colour list.
 */
export interface CarColor {
  name: string;
  hex: string;
  image?: string;
  tint?: string;
  blend?: string;
  tintOpacity?: number;
}

export interface CarSpec {
  label: string;
  value: string;
  icon: string;
}

export interface CarVariant {
  name: string;
  transmission: string;
  fuel: string;
  showroomPrice: string;
  onRoadPrice: string;
  highlight?: boolean;
}

export interface ExpertReview {
  reviewer: string;
  title: string;
  avatar: string;
  rating: number;
  verdict: string;
  highlights: string[];
}

export interface RatingBreakdown {
  label: string;
  value: number;
}

export interface OwnerReview {
  name: string;
  city: string;
  date: string;
  rating: number;
  title: string;
  body: string;
  owned: string;
}

export interface CarRatings {
  overall: number;
  totalReviews: number;
  breakdown: RatingBreakdown[];
  reviews: OwnerReview[];
}

export interface CarFaq {
  q: string;
  a: string;
}

export interface CarDetail {
  basic: CarBasic;
  tagline: string;
  about: string;
  showroomPrice: string;
  onRoadPrice: string;
  priceRangeMin: string;
  priceRangeMax: string;
  highlights: string[];
  priceNote: string;
  videoUrl: string;
  videoLabel: string;
  colors: CarColor[];
  keySpecs: CarSpec[];
  variants: CarVariant[];
  expertReview: ExpertReview;
  pros: string[];
  cons: string[];
  ratings: CarRatings;
  faqs: CarFaq[];
}

type AnyRecord = Record<string, unknown>;

const carsPage = (
  siteData as typeof siteData & {
    carsPage: {
      featured: CarBasic[];
      all: CarBasic[];
      detailDefaults: AnyRecord;
      carDetails: Record<string, AnyRecord>;
    };
  }
).carsPage;

const allBasics: CarBasic[] = [
  ...(carsPage.all ?? []),
  ...(carsPage.featured ?? []),
];

const RUPEE = (n: number) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `₹${Math.round(n / 1_00_000)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

const parsePriceToRupees = (price?: string): number | null => {
  if (!price) return null;
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return null;
  return Number(digits);
};

const deriveDefaultPrices = (basic: CarBasic) => {
  const showroomRupees = parsePriceToRupees(basic.price);
  if (!showroomRupees) {
    return {
      showroomPrice: basic.price ?? "Price on request",
      onRoadPrice: basic.price ?? "Price on request",
      priceRangeMin: basic.price ?? "—",
      priceRangeMax: basic.price ?? "—",
    };
  }
  const onRoad = Math.round(showroomRupees * 1.155);
  const minR = Math.round(showroomRupees * 0.92);
  const maxR = Math.round(showroomRupees * 1.18);
  return {
    showroomPrice: basic.price as string,
    onRoadPrice: RUPEE(onRoad),
    priceRangeMin: RUPEE(minR),
    priceRangeMax: RUPEE(maxR),
  };
};

const buildDefaultVariants = (basic: CarBasic): CarVariant[] => {
  const showroomRupees = parsePriceToRupees(basic.price) ?? 0;
  const make = (mult: number, label: string, tx: string): CarVariant => {
    const sr = Math.round(showroomRupees * mult);
    const or = Math.round(sr * 1.155);
    return {
      name: `${basic.name} ${label}`.trim(),
      transmission: tx,
      fuel: basic.fuelType ?? "Petrol",
      showroomPrice: RUPEE(sr),
      onRoadPrice: RUPEE(or),
    };
  };
  return [
    make(0.94, "Base", basic.transmission ?? "Manual"),
    { ...make(1.0, "Mid", basic.transmission ?? "Automatic"), highlight: true },
    make(1.12, "Top", basic.transmission ?? "Automatic"),
  ];
};

const deriveSpecsFromBasic = (basic: CarBasic): CarSpec[] => [
  { label: "Engine",       value: "—",                   icon: "engine" },
  { label: "Power",        value: basic.hp ?? "—",       icon: "power" },
  { label: "Torque",       value: "—",                   icon: "torque" },
  { label: "0 - 100 km/h", value: basic.zero ?? "—",     icon: "zero" },
  { label: "Top Speed",    value: basic.topSpeed ?? "—", icon: "speed" },
  { label: "Mileage",      value: "—",                   icon: "fuel" },
  { label: "Fuel Type",    value: basic.fuelType ?? "—", icon: "fueltype" },
  { label: "Transmission", value: basic.transmission ?? "—", icon: "gears" },
  { label: "Owner Rating", value: "4.4 / 5",             icon: "star" },
];

const mergeSpecs = (defaultSpecs: CarSpec[], basicSpecs: CarSpec[]): CarSpec[] =>
  defaultSpecs.map((spec) => {
    if (spec.value && spec.value !== "—") return spec;
    const fromBasic = basicSpecs.find((s) => s.label === spec.label);
    return fromBasic && fromBasic.value !== "—" ? fromBasic : spec;
  });

const resolveBasic = (carmodel: string): CarBasic | null => {
  const found = allBasics.find((c) => c.id === carmodel);
  if (found) return found;
  if (carmodel.endsWith("-featured")) {
    const stripped = carmodel.replace(/-featured$/, "");
    const fallback = allBasics.find((c) => c.id === stripped);
    if (fallback) return { ...fallback, id: carmodel };
  }
  return null;
};

export const getCarDetail = (carmodel: string): CarDetail | null => {
  const basic = resolveBasic(carmodel);
  if (!basic) return null;

  const defaults = (carsPage.detailDefaults ?? {}) as AnyRecord;
  const overrideId = carmodel.endsWith("-featured")
    ? carmodel.replace(/-featured$/, "")
    : carmodel;
  const override = (carsPage.carDetails?.[overrideId] ?? {}) as AnyRecord;

  const derivedPrices = deriveDefaultPrices(basic);
  const derivedSpecs = deriveSpecsFromBasic(basic);
  const defaultSpecs = (defaults.keySpecs as CarSpec[] | undefined) ?? derivedSpecs;
  const overrideSpecs = override.keySpecs as CarSpec[] | undefined;

  const detail: CarDetail = {
    basic,
    tagline:
      (override.tagline as string) ??
      (defaults.tagline as string) ??
      "Engineered to be unforgettable.",
    about:
      (override.about as string) ??
      (defaults.about as string) ??
      "A meticulous fusion of design, performance and craft.",
    showroomPrice:
      (override.showroomPrice as string) ?? derivedPrices.showroomPrice,
    onRoadPrice: (override.onRoadPrice as string) ?? derivedPrices.onRoadPrice,
    priceRangeMin:
      (override.priceRangeMin as string) ?? derivedPrices.priceRangeMin,
    priceRangeMax:
      (override.priceRangeMax as string) ?? derivedPrices.priceRangeMax,
    highlights:
      (override.highlights as string[]) ??
      (defaults.highlights as string[]) ??
      [],
    priceNote:
      (override.priceNote as string) ??
      (defaults.priceNote as string) ??
      "",
    videoUrl:
      (override.videoUrl as string) ??
      (defaults.videoUrl as string) ??
      "",
    videoLabel:
      (override.videoLabel as string) ??
      (defaults.videoLabel as string) ??
      "Watch the walkaround",
    colors:
      (override.colors as CarColor[]) ??
      (defaults.colors as CarColor[]) ??
      [],
    keySpecs: overrideSpecs ?? mergeSpecs(defaultSpecs, derivedSpecs),
    variants: (override.variants as CarVariant[]) ?? buildDefaultVariants(basic),
    expertReview:
      (override.expertReview as ExpertReview) ??
      (defaults.expertReview as ExpertReview),
    pros:
      (override.pros as string[]) ??
      (defaults.pros as string[]) ??
      [],
    cons:
      (override.cons as string[]) ??
      (defaults.cons as string[]) ??
      [],
    ratings:
      (override.ratings as CarRatings) ??
      (defaults.ratings as CarRatings),
    faqs: (override.faqs as CarFaq[]) ?? (defaults.faqs as CarFaq[]) ?? [],
  };

  return detail;
};

/**
 * Extracts the 11-character YouTube video id from any common YouTube URL
 * format (watch, shorts, embed, youtu.be, with or without query params).
 * Returns null if no id can be derived.
 */
export const getYouTubeId = (url: string | undefined): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Already an 11-char id pasted bare
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns: RegExp[] = [
    /youtube\.com\/watch\?(?:[^#]*&)?v=([a-zA-Z0-9_-]{11})/i,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/i,
    /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
  ];

  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match) return match[1];
  }
  return null;
};

export const getSimilarCars = (carmodel: string, limit = 3): CarBasic[] => {
  const current = resolveBasic(carmodel);
  if (!current) return [];
  const pool = (carsPage.all ?? []).filter((c) => c.id !== carmodel);
  const sameBody = pool.filter(
    (c) => current.bodyType && c.bodyType === current.bodyType
  );
  const others = pool.filter((c) => !sameBody.includes(c));
  const ordered = [...sameBody, ...others];
  return ordered.slice(0, limit);
};
