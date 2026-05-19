"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import PageHero from "@/components/shared/PageHero";
import siteData from "@/data/site.json";

interface Guide {
  id: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
}

interface GuidesContent {
  hero: { eyebrow: string; headline: string; description: string; image: string };
  guides: Guide[];
}

const guidesData = siteData.guidesPage as GuidesContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

const levelColor: Record<Guide["level"], string> = {
  Beginner: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
  Intermediate: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  Advanced: "text-red-300 border-red-500/30 bg-red-500/10",
};

export default function GuidesPage() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(guidesData.guides.map((g) => g.category)))],
    []
  );
  const [filter, setFilter] = useState<string>("All");
  const visible = useMemo(
    () =>
      filter === "All"
        ? guidesData.guides
        : guidesData.guides.filter((g) => g.category === filter),
    [filter]
  );

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="about" />

      <PageHero
        eyebrow={guidesData.hero.eyebrow}
        headline={guidesData.hero.headline}
        description={guidesData.hero.description}
        image={guidesData.hero.image}
      />

      <section className="relative bg-black px-6 pt-16 md:px-10 md:pt-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          {categories.map((c) => {
            const active = c === filter;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-red-500/60 bg-red-500/15 text-red-300"
                    : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white"
                }`}
              >
                {c}
              </button>
            );
          })}
          <p className="ml-auto text-[11px] uppercase tracking-[0.18em] text-white/45">
            {visible.length} {visible.length === 1 ? "guide" : "guides"}
          </p>
        </div>
      </section>

      <section className="relative bg-black px-6 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((g, i) => (
            <motion.a
              key={g.id}
              href={`#${g.id}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.65,
                delay: 0.05 + (i % 3) * 0.06,
                ease: easeOut,
              }}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] ring-1 ring-white/5 transition-all hover:ring-white/20"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <motion.img
                  src={g.image}
                  alt={g.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.7, ease: easeOut }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0";
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.7) 100%)",
                  }}
                />
                <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                  {g.category}
                </span>
                <span
                  className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md ${
                    levelColor[g.level]
                  }`}
                >
                  {g.level}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3
                  className="text-lg font-semibold tracking-tight text-white md:text-xl"
                  style={{ letterSpacing: "-0.01em", lineHeight: "1.15" }}
                >
                  {g.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-white/60">
                  {g.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-white/45">
                    {g.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 group-hover:text-white">
                    Read guide
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/60">
            No guides in this category yet — try another tab.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="mx-auto mt-16 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center md:p-10"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
            Suggest a guide
          </p>
          <h3
            className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            What should we write next?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
            Got a question we haven&apos;t covered? Drop us a note — we
            prioritise reader requests for the next batch of guides.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Send a request
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
