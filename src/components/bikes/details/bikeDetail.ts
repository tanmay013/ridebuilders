import siteData from "@/data/site.json";
import type {
  CarBasic,
  CarColor,
  CarDetail,
  CarFaq,
  CarRatings,
  CarSpec,
  CarVariant,
  ExpertReview,
} from "@/components/cars/details/carDetail";
import {
  filterFilledSpecs,
  isFilledSpecValue,
} from "@/components/cars/details/carDetail";

/**
 * The bike detail resolver is structurally identical to {@link carDetail}.
 * Bikes reuse the same `CarDetail` shape (renaming would just shuffle types
 * without changing semantics), but data comes from `bikesPage` and the
 * auto-derived variants use bike-appropriate transmission defaults.
 */

export type BikeBasic = CarBasic;
export type BikeColor = CarColor;
export type BikeSpec = CarSpec;
export type BikeVariant = CarVariant;
export type BikeRatings = CarRatings;
export type BikeFaq = CarFaq;
export type BikeDetail = CarDetail;

type AnyRecord = Record<string, unknown>;

const bikesPage = (
  siteData as typeof siteData & {
    bikesPage: {
      all: BikeBasic[];
      featured?: BikeBasic[];
      detailDefaults?: AnyRecord;
      bikeDetails?: Record<string, AnyRecord>;
    };
  }
).bikesPage;

const allBasics: BikeBasic[] = [
  ...(bikesPage.all ?? []),
  ...(bikesPage.featured ?? []),
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

const deriveDefaultPrices = (basic: BikeBasic) => {
  const showroomRupees = parsePriceToRupees(basic.price);
  if (!showroomRupees) {
    return {
      showroomPrice: basic.price ?? "Price on request",
      onRoadPrice: basic.price ?? "Price on request",
      priceRangeMin: basic.price ?? "—",
      priceRangeMax: basic.price ?? "—",
    };
  }
  // Bike on-road typically ~12% over ex-showroom in India.
  const onRoad = Math.round(showroomRupees * 1.12);
  const minR = Math.round(showroomRupees * 0.95);
  const maxR = Math.round(showroomRupees * 1.18);
  return {
    showroomPrice: basic.price as string,
    onRoadPrice: RUPEE(onRoad),
    priceRangeMin: RUPEE(minR),
    priceRangeMax: RUPEE(maxR),
  };
};

const buildDefaultVariants = (basic: BikeBasic): BikeVariant[] => {
  const showroomRupees = parsePriceToRupees(basic.price) ?? 0;
  const make = (mult: number, label: string): BikeVariant => {
    const sr = Math.round(showroomRupees * mult);
    const or = Math.round(sr * 1.12);
    return {
      name: `${basic.name} ${label}`.trim(),
      transmission: basic.transmission ?? "Manual",
      fuel: basic.fuelType ?? "Petrol",
      showroomPrice: RUPEE(sr),
      onRoadPrice: RUPEE(or),
    };
  };
  return [
    make(0.96, "Standard"),
    { ...make(1.0, "Pro"), highlight: true },
    make(1.1, "Race"),
  ];
};

const deriveSpecsFromBasic = (basic: BikeBasic): BikeSpec[] => [
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

const mergeSpecs = (defaultSpecs: BikeSpec[], basicSpecs: BikeSpec[]): BikeSpec[] =>
  filterFilledSpecs(
    defaultSpecs.map((spec) => {
      if (isFilledSpecValue(spec.value)) return spec;
      const fromBasic = basicSpecs.find((s) => s.label === spec.label);
      return fromBasic && isFilledSpecValue(fromBasic.value) ? fromBasic : spec;
    })
  );

const resolveBasic = (bikemodel: string): BikeBasic | null => {
  const found = allBasics.find((b) => b.id === bikemodel);
  if (found) return found;
  if (bikemodel.endsWith("-featured")) {
    const stripped = bikemodel.replace(/-featured$/, "");
    const fallback = allBasics.find((b) => b.id === stripped);
    if (fallback) return { ...fallback, id: bikemodel };
  }
  return null;
};

export const getBikeDetail = (bikemodel: string): BikeDetail | null => {
  const basic = resolveBasic(bikemodel);
  if (!basic) return null;

  const defaults = (bikesPage.detailDefaults ?? {}) as AnyRecord;
  const overrideId = bikemodel.endsWith("-featured")
    ? bikemodel.replace(/-featured$/, "")
    : bikemodel;
  const override = (bikesPage.bikeDetails?.[overrideId] ?? {}) as AnyRecord;

  const derivedPrices = deriveDefaultPrices(basic);
  const derivedSpecs = deriveSpecsFromBasic(basic);
  const defaultSpecs = (defaults.keySpecs as BikeSpec[] | undefined) ?? derivedSpecs;
  const overrideSpecs = override.keySpecs as BikeSpec[] | undefined;

  const detail: BikeDetail = {
    basic,
    tagline:
      (override.tagline as string) ??
      (defaults.tagline as string) ??
      "Built to ride, refined to thrill.",
    about:
      (override.about as string) ??
      (defaults.about as string) ??
      "A meticulously engineered motorcycle that balances performance, comfort and craft.",
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
      (override.colors as BikeColor[]) ??
      (defaults.colors as BikeColor[]) ??
      [],
    keySpecs: filterFilledSpecs(
      overrideSpecs ?? mergeSpecs(defaultSpecs, derivedSpecs)
    ),
    variants: (override.variants as BikeVariant[]) ?? buildDefaultVariants(basic),
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
      (override.ratings as BikeRatings) ??
      (defaults.ratings as BikeRatings),
    faqs: (override.faqs as BikeFaq[]) ?? (defaults.faqs as BikeFaq[]) ?? [],
  };

  return detail;
};

export const getSimilarBikes = (bikemodel: string, limit = 3): BikeBasic[] => {
  const current = resolveBasic(bikemodel);
  if (!current) return [];
  const pool = (bikesPage.all ?? []).filter((b) => b.id !== bikemodel);
  const sameBody = pool.filter(
    (b) => current.bodyType && b.bodyType === current.bodyType
  );
  const others = pool.filter((b) => !sameBody.includes(b));
  const ordered = [...sameBody, ...others];
  return ordered.slice(0, limit);
};
