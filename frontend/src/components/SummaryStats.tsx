"use client";

import { motion } from "framer-motion";
import type { Comment } from "@/types/comment";

function countBy(
  comments: Comment[],
  sentiment: Comment["sentiment"],
): number {
  return comments.filter((c) => c.sentiment === sentiment).length;
}

const statMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export function SummaryStats({ comments }: { comments: Comment[] }) {
  const total = comments.length;
  const positive = countBy(comments, "positive");
  const neutral = countBy(comments, "neutral");
  const negative = countBy(comments, "negative");

  const items = [
    {
      label: "Analyzed",
      value: total,
      sub: "comments",
      accent: "text-white",
      border: "border-white/[0.08]",
      glow: "shadow-[0_0_40px_-16px_rgba(255,255,255,0.15)]",
    },
    {
      label: "Positive",
      value: positive,
      sub: "vibes",
      accent: "text-emerald-300",
      border: "border-emerald-500/20",
      glow: "shadow-[0_0_40px_-12px_rgba(52,211,153,0.35)]",
    },
    {
      label: "Neutral",
      value: neutral,
      sub: "balanced",
      accent: "text-zinc-300",
      border: "border-zinc-500/25",
      glow: "shadow-[0_0_36px_-14px_rgba(161,161,170,0.25)]",
    },
    {
      label: "Negative",
      value: negative,
      sub: "flagged",
      accent: "text-rose-300",
      border: "border-rose-500/20",
      glow: "shadow-[0_0_40px_-12px_rgba(244,63,94,0.35)]",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <h2 className="mb-4 text-sm font-medium text-zinc-200">Summary</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            {...statMotion}
            transition={{
              duration: 0.35,
              delay: 0.05 * i,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -2 }}
            className={`rounded-2xl border ${item.border} bg-gradient-to-b from-white/[0.04] to-transparent p-4 ${item.glow}`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {item.label}
            </p>
            <p className={`mt-2 text-3xl font-semibold tabular-nums ${item.accent}`}>
              {item.value}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{item.sub}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
