import type { Sentiment } from "@/types/comment";

const config: Record<
  Sentiment,
  { label: string; emoji: string; className: string }
> = {
  positive: {
    label: "Positive vibes",
    emoji: "\u{1F60A}",
    className:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-200 shadow-[0_0_20px_-8px_rgba(52,211,153,0.5)]",
  },
  neutral: {
    label: "Neutral",
    emoji: "\u{1F610}",
    className:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-300 shadow-[0_0_16px_-8px_rgba(161,161,170,0.35)]",
  },
  negative: {
    label: "Negative vibes",
    emoji: "\u{1F615}",
    className:
      "border-rose-500/25 bg-rose-500/10 text-rose-200 shadow-[0_0_20px_-8px_rgba(244,63,94,0.45)]",
  },
};

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const c = config[sentiment];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${c.className}`}
    >
      <span aria-hidden>{c.emoji}</span>
      <span className="hidden sm:inline">{c.label}</span>
    </span>
  );
}
