"use client";

import { motion } from "framer-motion";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import PageHero from "@/components/shared/PageHero";
import siteData from "@/data/site.json";

interface SitemapLink {
  label: string;
  href: string;
}

interface SitemapGroup {
  title: string;
  links: SitemapLink[];
}

interface SitemapContent {
  hero: { eyebrow: string; headline: string; description: string };
  groups: SitemapGroup[];
}

interface VehicleBasic {
  id: string;
  brand: string;
  name: string;
}

const sitemap = siteData.sitemapPage as SitemapContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

const carIndex = (siteData.carsPage.all ?? []) as VehicleBasic[];
const bikeIndex = (siteData.bikesPage.all ?? []) as VehicleBasic[];

export default function SitemapPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="about" />

      <PageHero
        eyebrow={sitemap.hero.eyebrow}
        headline={sitemap.hero.headline}
        description={sitemap.hero.description}
        compact
      />

      {/* Top-level groups */}
      <section className="relative bg-black px-6 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {sitemap.groups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: 0.05 + gi * 0.06,
                ease: easeOut,
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
                {group.title}
              </p>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-white/25 transition-colors group-hover:bg-red-500"
                      />
                      {link.label}
                      <span
                        aria-hidden
                        className="text-white/35 transition-all group-hover:translate-x-0.5 group-hover:text-white"
                      >
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All vehicles index */}
      <section className="relative bg-black px-6 pb-24 md:px-10 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="max-w-2xl"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
              Vehicle index
            </p>
            <h2
              className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
              style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
            >
              Every machine, listed.
            </h2>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            <VehicleColumn
              title={`Cars (${carIndex.length})`}
              base="/cars"
              items={carIndex}
            />
            <VehicleColumn
              title={`Bikes (${bikeIndex.length})`}
              base="/bikes"
              items={bikeIndex}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const VehicleColumn = ({
  title,
  base,
  items,
}: {
  title: string;
  base: string;
  items: VehicleBasic[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: easeOut }}
    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
  >
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
      {title}
    </p>
    <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((v) => (
        <li key={v.id}>
          <a
            href={`${base}/${v.id}`}
            className="group flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white"
          >
            <span className="truncate">
              <span className="text-white/45">{v.brand}</span> {v.name}
            </span>
            <span
              aria-hidden
              className="text-white/30 transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  </motion.div>
);
