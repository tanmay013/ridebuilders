"use client";

import type { FC } from "react";
import { motion } from "framer-motion";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import PageHero from "@/components/shared/PageHero";

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalDoc {
  title: string;
  eyebrow: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
}

interface LegalLayoutProps {
  doc: LegalDoc;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const LegalLayout: FC<LegalLayoutProps> = ({ doc }) => (
  <main className="relative min-h-screen bg-black">
    <SubPageNav active="about" />

    <PageHero
      eyebrow={doc.eyebrow}
      headline={doc.title}
      description={doc.subtitle}
      meta={doc.lastUpdated}
      compact
    />

    <section className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* Table of contents — desktop sticky sidebar */}
        <aside className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
              Contents
            </p>
            <nav aria-label="Document sections" className="mt-4">
              <ul className="space-y-2">
                {doc.sections.map((s, i) => (
                  <li key={s.heading}>
                    <a
                      href={`#${slugify(s.heading)}`}
                      className="group flex items-start gap-2 text-sm text-white/60 transition-colors hover:text-white"
                    >
                      <span className="mt-0.5 inline-block w-6 shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 group-hover:text-red-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Questions?
              </p>
              <p className="mt-2 text-white/65">
                Anything here unclear? Email{" "}
                <a
                  href="mailto:privacy@ridebuilders.in"
                  className="text-white/85 hover:text-red-300"
                >
                  privacy@ridebuilders.in
                </a>{" "}
                — we&apos;ll explain in plain English.
              </p>
            </div>
          </div>
        </aside>

        {/* Body */}
        <article className="md:col-span-8">
          <div className="space-y-12">
            {doc.sections.map((s, i) => (
              <motion.section
                key={s.heading}
                id={slugify(s.heading)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: 0.04 + i * 0.04,
                  ease: easeOut,
                }}
                className="scroll-mt-28"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">
                  Section {String(i + 1).padStart(2, "0")}
                </p>
                <h2
                  className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {s.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/70 md:text-[17px]">
                  {s.body}
                </p>
              </motion.section>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/65">
            <span>{doc.lastUpdated}</span>
            <a
              href="/sitemap"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white"
            >
              All legal pages
              <span aria-hidden>→</span>
            </a>
          </div>
        </article>
      </div>
    </section>

    <Footer />
  </main>
);

export default LegalLayout;
