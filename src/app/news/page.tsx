"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import PageHero from "@/components/shared/PageHero";
import siteData from "@/data/site.json";

interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
}

interface NewsContent {
  hero: { eyebrow: string; headline: string; description: string; image: string };
  categories: string[];
  featured: Article;
  articles: Article[];
}

const news = siteData.newsPage as NewsContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

export default function NewsPage() {
  const [filter, setFilter] = useState<string>("All");

  const allArticles = useMemo(
    () => [news.featured, ...news.articles],
    []
  );
  const filtered = useMemo(
    () =>
      filter === "All"
        ? allArticles
        : allArticles.filter((a) => a.category === filter),
    [filter, allArticles]
  );

  const [featured, ...rest] =
    filter === "All" ? [news.featured, ...news.articles] : filtered;

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="about" />

      <PageHero
        eyebrow={news.hero.eyebrow}
        headline={news.hero.headline}
        description={news.hero.description}
        image={news.hero.image}
      />

      {/* Filter strip */}
      <section className="relative bg-black px-6 pt-16 md:px-10 md:pt-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          {news.categories.map((c) => {
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
            {filtered.length} {filtered.length === 1 ? "story" : "stories"}
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="relative bg-black px-6 pt-10 md:px-10 md:pt-14 lg:px-16">
          <motion.a
            href={`#${featured.id}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="group relative mx-auto block max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] ring-1 ring-white/5 transition-all hover:ring-white/20"
          >
            <div className="relative aspect-[16/9] md:aspect-[16/7]">
              <motion.img
                src={featured.image}
                alt={featured.title}
                className="absolute inset-0 h-full w-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8, ease: easeOut }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.9) 100%)",
                }}
              />
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Featured • {featured.category}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <h2
                  className="max-w-3xl text-2xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl"
                  style={{ letterSpacing: "-0.02em", lineHeight: "1.05" }}
                >
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                  {featured.excerpt}
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-white/55">
                  By {featured.author} • {featured.date} • {featured.readTime}
                </p>
              </div>
            </div>
          </motion.a>
        </section>
      )}

      {/* Grid */}
      <section className="relative bg-black px-6 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article, i) => (
              <motion.a
                key={article.id}
                href={`#${article.id}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: 0.05 + (i % 3) * 0.06,
                  ease: easeOut,
                }}
                whileHover={{ y: -4 }}
                className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] ring-1 ring-white/5 transition-colors hover:ring-white/20"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <motion.img
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.7, ease: easeOut }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                    {article.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3
                    className="text-lg font-semibold tracking-tight text-white md:text-xl"
                    style={{ letterSpacing: "-0.01em", lineHeight: "1.15" }}
                  >
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-white/60">
                    {article.excerpt}
                  </p>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-white/45">
                    {article.date} • {article.readTime}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/60">
              No stories in this category yet — try another tab.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
