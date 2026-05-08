"use client";

import { useMemo, useState } from "react";
import SubPageNav from "@/components/SubPageNav";
import CarsHero from "@/components/cars/CarsHero";
import CarsFilterBar from "@/components/cars/CarsFilterBar";
import CarsGrid from "@/components/cars/CarsGrid";
import Footer from "@/components/Footer";
import siteData from "@/data/site.json";
import CTASection from "@/components/CTASection";

export default function BikesPage() {
  const initialFilterValues = useMemo(
    () =>
      (siteData.bikesPage.filters as Array<{
        id: string;
        value?: string;
        options?: string[];
      }>).reduce<Record<string, string>>((acc, filter) => {
        acc[filter.id] = filter.value ?? filter.options?.[0] ?? "All";
        return acc;
      }, {}),
    []
  );

  const [filterValues, setFilterValues] =
    useState<Record<string, string>>(initialFilterValues);

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="bikes" />
      <CarsHero pageKey="bikesPage" />
      <div className="relative z-20 -mt-24 md:-mt-12 lg:-mt-[-24px]">
        <CarsFilterBar
          pageKey="bikesPage"
          values={filterValues}
          onChange={(id, value) =>
            setFilterValues((prev) => ({ ...prev, [id]: value }))
          }
          onReset={() => setFilterValues(initialFilterValues)}
        />
      </div>
      <CarsGrid
        pageKey="bikesPage"
        basePath="/bikes"
        sectionTitle="All Bikes"
        filterValues={filterValues}
      />
      <div className="mt-20 pb-0 md:mt-28 md:pb-0">
      <CTASection />
        <Footer />
      </div>
    </main>
  );
}

