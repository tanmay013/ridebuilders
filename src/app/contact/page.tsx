"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SubPageNav from "@/components/SubPageNav";
import Footer from "@/components/Footer";
import PageHero from "@/components/shared/PageHero";
import siteData from "@/data/site.json";

interface Channel {
  label: string;
  value: string;
  href: string;
  note: string;
}

interface Topic {
  id: string;
  label: string;
}

interface ContactContent {
  hero: { eyebrow: string; headline: string; description: string; image: string };
  topics: Topic[];
  channels: Channel[];
}

const contact = siteData.contactPage as ContactContent;

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: contact.topics[0]?.id ?? "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(true);
  };

  return (
    <main className="relative min-h-screen bg-black">
      <SubPageNav active="about" />

      <PageHero
        eyebrow={contact.hero.eyebrow}
        headline={contact.hero.headline}
        description={contact.hero.description}
        image={contact.hero.image}
      />

      <section className="relative bg-black px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Channels (left) */}
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
              Direct lines
            </p>
            <h2
              className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
              style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
            >
              Pick whatever works.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/65 md:text-lg">
              Whichever channel you pick, you&apos;ll talk to a real person —
              not a chatbot — within one business day.
            </p>

            <ul className="mt-10 space-y-4">
              {contact.channels.map((ch, i) => (
                <motion.li
                  key={ch.label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.07,
                    ease: easeOut,
                  }}
                >
                  <a
                    href={ch.href}
                    className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-red-500/40 hover:bg-red-500/[0.06]"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white/80 group-hover:text-white"
                    >
                      <ChannelIcon kind={ch.label} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                        {ch.label}
                      </p>
                      <p className="mt-1 text-base font-semibold tracking-tight text-white">
                        {ch.value}
                      </p>
                      <p className="mt-1 text-[12px] text-white/55">
                        {ch.note}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="self-center text-white/35 transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Form (right) */}
          <motion.div
            className="md:col-span-7"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
          >
            <div
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl md:p-8"
              style={{
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.55)",
              }}
            >
              {!submitted ? (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    Write to us
                  </p>
                  <h3
                    className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Tell us what you need.
                  </h3>

                  <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Your name">
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Tanmay Pandey"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-red-500/60 focus:outline-none"
                      />
                    </Field>
                    <Field label="Email">
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-red-500/60 focus:outline-none"
                      />
                    </Field>

                    <Field label="Topic" className="sm:col-span-2">
                      <div className="flex flex-wrap gap-2">
                        {contact.topics.map((t) => {
                          const active = form.topic === t.id;
                          return (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => update("topic", t.id)}
                              className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                                active
                                  ? "border-red-500/60 bg-red-500/15 text-red-300"
                                  : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white"
                              }`}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    </Field>

                    <Field label="Message" className="sm:col-span-2">
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        placeholder="A short paragraph — the more context the faster we can help."
                        className="w-full resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-red-500/60 focus:outline-none"
                      />
                    </Field>

                    <div className="sm:col-span-2 mt-2 flex items-center justify-between gap-3">
                      <p className="text-[11px] text-white/45">
                        By submitting you agree to our{" "}
                        <a href="/privacy" className="text-white/70 hover:text-white">
                          privacy policy
                        </a>
                        .
                      </p>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                      >
                        Send message
                        <span aria-hidden>→</span>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: easeOut }}
                  className="flex flex-col items-center py-10 text-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12l4 4 10-10" />
                    </svg>
                  </span>
                  <h3
                    className="mt-5 text-2xl font-semibold tracking-tight text-white"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Thanks, {form.name.split(" ")[0] || "friend"}.
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-white/65">
                    Your message is in. We&apos;ll reply to{" "}
                    <span className="text-white/85">{form.email}</span> within one
                    business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        topic: contact.topics[0]?.id ?? "general",
                        message: "",
                      });
                    }}
                    className="mt-6 text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const Field = ({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <label className={`flex flex-col gap-2 ${className}`}>
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
      {label}
    </span>
    {children}
  </label>
);

const ChannelIcon = ({ kind }: { kind: string }) => {
  const props = {
    viewBox: "0 0 24 24",
    className: "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind.toLowerCase() === "phone") {
    return (
      <svg {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }
  if (kind.toLowerCase() === "email") {
    return (
      <svg {...props}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M12 21s-7-7.1-7-12a7 7 0 1 1 14 0c0 4.9-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
};
