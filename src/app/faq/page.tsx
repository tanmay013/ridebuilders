"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import PageHero from "@/components/shared/PageHero";
import siteData from "@/data/site.json";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

interface FaqContent {
  hero: { eyebrow: string; headline: string; description: string };
  categories: FaqCategory[];
}

const faqPage = siteData.faqPage as FaqContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const allItems = useMemo(
    () =>
      faqPage.categories.flatMap((cat) =>
        cat.items.map((item, idx) => ({
          key: `${cat.id}-${idx}`,
          categoryId: cat.id,
          categoryTitle: cat.title,
          ...item,
        }))
      ),
    []
  );

  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;

  const searchMatches = useMemo(() => {
    if (!q) return [];
    return allItems.filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [allItems, q]);

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="about" />

      <PageHero
        eyebrow={faqPage.hero.eyebrow}
        headline={faqPage.hero.headline}
        description={faqPage.hero.description}
      />

      {/* Search */}
      <section className="relative bg-black px-6 pt-12 md:px-10 md:pt-16 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <div
            className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 backdrop-blur-xl md:px-5 md:py-4"
            style={{
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.55)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] text-white/55"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the FAQ…"
              className="min-w-0 flex-1 bg-transparent text-base font-medium text-white placeholder:text-white/40 focus:outline-none md:text-lg"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {isSearching && (
            <p className="mt-3 px-1 text-[11px] uppercase tracking-[0.16em] text-white/45">
              {searchMatches.length}{" "}
              {searchMatches.length === 1 ? "answer" : "answers"} for “{query.trim()}”
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="relative bg-black px-6 pb-24 pt-10 md:px-10 md:pb-32 md:pt-14 lg:px-16">
        <div className="mx-auto max-w-3xl">
          {isSearching ? (
            // Search results list (flat)
            <ul className="space-y-3 md:space-y-4">
              <AnimatePresence initial={false}>
                {searchMatches.map((item, i) => (
                  <motion.li
                    key={item.key}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.04 + i * 0.04,
                      ease: easeOut,
                    }}
                  >
                    <FaqRow
                      itemKey={item.key}
                      category={item.categoryTitle}
                      question={item.q}
                      answer={item.a}
                      open={openKey === item.key}
                      onToggle={() =>
                        setOpenKey(openKey === item.key ? null : item.key)
                      }
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
              {searchMatches.length === 0 && (
                <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/60">
                  No answers match “{query.trim()}”. Try a different phrase or{" "}
                  <a href="/contact" className="text-red-400 hover:text-red-300">
                    drop us a line
                  </a>
                  .
                </li>
              )}
            </ul>
          ) : (
            // Grouped view
            <div className="space-y-14 md:space-y-20">
              {faqPage.categories.map((cat, ci) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.05 + ci * 0.06, ease: easeOut }}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-[11px] font-bold text-red-300">
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                    <h2
                      className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {cat.title}
                    </h2>
                  </div>

                  <ul className="mt-5 space-y-3 md:space-y-4">
                    {cat.items.map((item, i) => {
                      const key = `${cat.id}-${i}`;
                      return (
                        <li key={key}>
                          <FaqRow
                            itemKey={key}
                            question={item.q}
                            answer={item.a}
                            open={openKey === key}
                            onToggle={() =>
                              setOpenKey(openKey === key ? null : key)
                            }
                          />
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="mt-16 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
              Still stuck?
            </p>
            <h3
              className="mt-3 text-xl font-semibold tracking-tight text-white md:text-2xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Talk to a real human.
            </h3>
            <a
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Contact us
              <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ----- Row component (open/close accordion) --------------------------------

interface FaqRowProps {
  itemKey: string;
  category?: string;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}

const FaqRow = ({
  category,
  question,
  answer,
  open,
  onToggle,
}: FaqRowProps) => (
  <div
    className={`overflow-hidden rounded-2xl border transition-colors ${
      open
        ? "border-red-500/30 bg-red-500/[0.05]"
        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
    }`}
  >
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6 md:py-6"
    >
      <span className="flex-1">
        {category && (
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">
            {category}
          </span>
        )}
        <span className="block text-base font-semibold tracking-tight text-white md:text-lg">
          {question}
        </span>
      </span>
      <motion.span
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.3, ease: easeOut }}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          open ? "text-red-400" : "text-white/65"
        }`}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </motion.span>
    </button>

    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="overflow-hidden"
        >
          <div className="border-t border-white/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-white/70 md:px-6 md:pb-6 md:pt-5 md:text-[15px]">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
