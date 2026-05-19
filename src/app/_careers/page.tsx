"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/shared/PageHero";
import siteData from "@/data/site.json";

interface Perk {
  title: string;
  description: string;
}

interface Role {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
}

interface CareersContent {
  hero: { eyebrow: string; headline: string; description: string; image: string };
  perks: Perk[];
  roles: Role[];
}

const careers = siteData.careersPage as CareersContent;

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function CareersPage() {
  const departments = useMemo(
    () => ["All", ...Array.from(new Set(careers.roles.map((r) => r.department)))],
    []
  );
  const [filter, setFilter] = useState<string>("All");
  const visible = useMemo(
    () =>
      filter === "All"
        ? careers.roles
        : careers.roles.filter((r) => r.department === filter),
    [filter]
  );

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="about" />

      <PageHero
        eyebrow={careers.hero.eyebrow}
        headline={careers.hero.headline}
        description={careers.hero.description}
        image={careers.hero.image}
      >
        <a
          href="#roles"
          className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
        >
          See open roles
          <span aria-hidden>→</span>
        </a>
        <a
          href="mailto:careers@ridebuilders.in"
          className="text-sm text-white/75 underline-offset-4 hover:text-white hover:underline"
        >
          careers@ridebuilders.in
        </a>
      </PageHero>

      {/* Perks */}
      <section className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
              Why us
            </p>
            <h2
              className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
            >
              The good stuff.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              We try to keep the perks meaningful, not gimmicky. Here&apos;s
              what actually shows up in your inbox and your bank account.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 md:gap-6">
            {careers.perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  delay: 0.05 + i * 0.08,
                  ease: easeOut,
                }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/10 transition-colors hover:bg-white/[0.05] hover:ring-white/20 md:p-7"
              >
                <div
                  className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(180px circle at 30% 0%, rgba(239,68,68,0.18), transparent 70%)",
                  }}
                  aria-hidden
                />
                <p
                  className="relative text-3xl font-semibold tracking-tight text-white"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  0{i + 1}
                </p>
                <h3 className="relative mt-5 text-lg font-semibold tracking-tight text-white md:text-xl">
                  {perk.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/60 md:text-[15px]">
                  {perk.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section
        id="roles"
        className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
                Open roles
              </p>
              <h2
                className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
                style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
              >
                Come build with us.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
                {careers.roles.length} positions across {departments.length - 1}{" "}
                teams.
              </p>
            </div>

            <div className="inline-flex flex-wrap gap-1 rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/10">
              {departments.map((d) => {
                const active = d === filter;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFilter(d)}
                    aria-pressed={active}
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
                      active
                        ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/60"
                        : "text-white/55 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <ul className="mt-10 space-y-3 md:mt-14">
            {visible.map((role, i) => (
              <motion.li
                key={role.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.04 + i * 0.05,
                  ease: easeOut,
                }}
              >
                <a
                  href={`mailto:careers@ridebuilders.in?subject=Application: ${role.title}`}
                  className="group grid grid-cols-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 transition-colors hover:border-red-500/40 hover:bg-red-500/[0.06] md:px-6"
                >
                  <div className="col-span-12 md:col-span-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">
                      {role.department}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold tracking-tight text-white md:text-xl">
                      {role.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {role.summary}
                    </p>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/85">
                      {role.location}
                    </p>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                      Type
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/85">
                      {role.type}
                    </p>
                  </div>
                  <div className="col-span-12 mt-3 flex items-center justify-end md:col-span-2 md:mt-0">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 group-hover:text-white">
                      Apply
                      <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
            {visible.length === 0 && (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/60">
                No open roles in this team right now. Try another team or email
                us — we&apos;re always open to talking to great people.
              </p>
            )}
          </ul>

          <p className="mt-10 text-center text-sm text-white/55">
            Don&apos;t see the right role?{" "}
            <a
              href="mailto:careers@ridebuilders.in"
              className="text-white underline-offset-4 hover:text-red-300 hover:underline"
            >
              Write to us anyway →
            </a>
          </p>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
