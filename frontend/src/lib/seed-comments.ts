import type { Comment } from "@/types/comment";

const SEED: Array<
  Pick<Comment, "username" | "text" | "sentiment"> & {
    rawLabel?: string;
    confidence?: number;
  }
> = [
  {
    username: "Alex Rivera",
    text: "This feature is amazing, I really like it.",
    sentiment: "positive",
    rawLabel: "POSITIVE",
    confidence: 0.98,
  },
  {
    username: "Jordan Lee",
    text: "Not bad, but I think it can be improved.",
    sentiment: "neutral",
    rawLabel: "NEUTRAL",
    confidence: 0.61,
  },
  {
    username: "Sam Okonkwo",
    text: "I hate how slow this feels.",
    sentiment: "negative",
    rawLabel: "NEGATIVE",
    confidence: 0.99,
  },
  {
    username: "Taylor Chen",
    text: "Looks clean and professional.",
    sentiment: "positive",
    rawLabel: "POSITIVE",
    confidence: 0.94,
  },
  {
    username: "Riley Morgan",
    text: "Okay, this is fine.",
    sentiment: "neutral",
    rawLabel: "NEUTRAL",
    confidence: 0.58,
  },
  {
    username: "Casey Brooks",
    text: "This is terrible honestly.",
    sentiment: "negative",
    rawLabel: "NEGATIVE",
    confidence: 0.99,
  },
  {
    username: "Morgan Blake",
    text: "Love this update.",
    sentiment: "positive",
    rawLabel: "POSITIVE",
    confidence: 0.99,
  },
  {
    username: "Jamie Fox",
    text: "It works.",
    sentiment: "neutral",
    rawLabel: "NEUTRAL",
    confidence: 0.55,
  },
  {
    username: "Devon Singh",
    text: "Pretty nice polish on the new layout!",
    sentiment: "positive",
    rawLabel: "POSITIVE",
    confidence: 0.95,
  },
  {
    username: "Avery Kim",
    text: "The onboarding flow is annoying today.",
    sentiment: "negative",
    rawLabel: "NEGATIVE",
    confidence: 0.96,
  },
] as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const HOUR_MS = 60 * 60 * 1000;

export function getInitialComments(): Comment[] {
  const now = Date.now();
  return SEED.map((row, i) => ({
    id: `seed-${i + 1}`,
    username: row.username,
    avatar: initials(row.username),
    text: row.text,
    timestamp: now - (SEED.length - i) * HOUR_MS - i * 120000,
    sentiment: row.sentiment,
    rawLabel: row.rawLabel,
    confidence: row.confidence,
  }));
}
