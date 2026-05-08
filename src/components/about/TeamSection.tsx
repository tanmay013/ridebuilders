"use client";

import type { FC } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import siteData from "@/data/site.json";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface TeamContent {
  eyebrow: string;
  headline: string;
  description: string;
  members: TeamMember[];
}

const team = siteData.aboutPage.team as TeamContent;
const easeOut = [0.16, 1, 0.3, 1] as const;

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

const TeamCard: FC<TeamCardProps> = ({ member, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
      duration: 0.75,
      delay: (index % 4) * 0.08,
      ease: easeOut,
    }}
    whileHover={{ y: -6 }}
    className="group relative"
  >
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
      <motion.img
        src={member.image}
        alt={member.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.6, ease: easeOut }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

      {/* Hover light sweep */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        whileHover={{ x: "320%" }}
        transition={{ duration: 0.7, ease: easeOut }}
      />

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
          {member.role}
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-white md:text-xl">
          {member.name}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-white/70 md:text-sm">
          {member.bio}
        </p>
      </div>
    </div>
  </motion.div>
);

const SOLO_TAGS = ["Design", "Engineering", "Product", "Data"] as const;

const SoloMemberCard: FC<{ member: TeamMember }> = ({ member }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.85, ease: easeOut }}
    whileHover={{ y: -6 }}
    className="group relative w-full max-w-[560px]"
  >
    {/* Soft red ambient glow behind card */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-3xl"
      style={{
        background:
          "radial-gradient(closest-side, rgba(239,68,68,0.18), transparent 70%)",
      }}
    />

    {/* <div
      className="relative grid grid-cols-[200px_1fr] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:grid-cols-[220px_1fr]"
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.55)",
      }}
    > */}
      {/* Image side */}
      {/* <div className="relative min-h-[300px] overflow-hidden sm:min-h-[340px]"> */}
        {/* <motion.img
          src={member.image}
          alt={member.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: easeOut }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        /> */}
        {/* Soft right-edge fade so portrait blends into copy panel */}
        {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/55" /> */}

        {/* Hover light sweep */}
        {/* <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          whileHover={{ x: "320%" }}
          transition={{ duration: 0.7, ease: easeOut }}
        /> */}
      {/* </div> */}

      {/* Copy side */}
      <div className="flex min-w-0 flex-col justify-center gap-3 p-5 sm:p-6 md:p-7">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          {member.role}
        </span>
        <h3
          className="truncate text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          {member.name}
        </h3>
        <p className="text-sm leading-relaxed text-white/65">{member.bio}</p>

        {/* Tag row — single horizontal scroll-safe row */}
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {SOLO_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/65"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    {/* </div> */}
  </motion.div>
);

const TeamSection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const headingY = useTransform(smooth, [0, 1], [25, -25]);
  const gridY = useTransform(smooth, [0, 1], [12, -12]);

  const isSolo = team.members.length === 1;

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        {isSolo ? (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
            <motion.div
              className="max-w-xl"
              style={{ y: headingY }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
                {team.eyebrow}
              </p>
              <h2
                className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
                style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
              >
                {team.headline}
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
                {team.description}
              </p>
            </motion.div>

            <motion.div style={{ y: gridY }} className="w-full lg:justify-self-end">
              <SoloMemberCard member={team.members[0]} />
            </motion.div>
          </div>
        ) : (
          <>
            <motion.div
              className="max-w-2xl"
              style={{ y: headingY }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">
                {team.eyebrow}
              </p>
              <h2
                className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
                style={{ letterSpacing: "-0.03em", lineHeight: "1.05" }}
              >
                {team.headline}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
                {team.description}
              </p>
            </motion.div>

            <motion.div style={{ y: gridY }} className="mt-12 md:mt-16">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {team.members.map((m, i) => (
                  <TeamCard key={m.name} member={m} index={i} />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
