import type { Sentiment } from "@/types/comment";

export interface AnalyzeResponse {
  text: string;
  raw_label: string;
  confidence: number;
  kawn_label: string;
  emoji: string;
}

function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".local");
    if (!isLocal) {
      return "/_/backend";
    }
  }

  return "http://127.0.0.1:8000";
}

export async function analyzeComment(text: string): Promise<{
  sentiment: Sentiment;
  rawLabel: string;
  confidence: number;
}> {
  const response = await fetch(`${getApiBaseUrl()}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Unable to analyze comment right now.");
  }

  const data = (await response.json()) as AnalyzeResponse;

  return {
    sentiment: mapKawnLabelToSentiment(data.kawn_label),
    rawLabel: data.raw_label,
    confidence: data.confidence,
  };
}

function mapKawnLabelToSentiment(label: string): Sentiment {
  switch (label) {
    case "Positive vibes":
      return "positive";
    case "Negative vibes":
      return "negative";
    default:
      return "neutral";
  }
}
