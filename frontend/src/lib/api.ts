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

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: unknown };
    const d = body.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d) && d[0] && typeof d[0] === "object" && d[0] !== null && "msg" in d[0]) {
      return String((d[0] as { msg: string }).msg);
    }
  } catch {
    /* ignore */
  }
  return `Request failed (${response.status}).`;
}

export async function analyzeComment(text: string): Promise<{
  sentiment: Sentiment;
  rawLabel: string;
  confidence: number;
}> {
  const base = getApiBaseUrl();
  let response: Response;
  try {
    response = await fetch(`${base}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
  } catch {
    throw new Error(
      `Cannot reach the API at ${base}. Start the backend (uvicorn) and check the port matches NEXT_PUBLIC_API_BASE_URL if you use a non-default port.`,
    );
  }

  if (!response.ok) {
    const detail = await readErrorMessage(response);
    throw new Error(
      detail ||
        "Unable to analyze comment right now. For local runs, set HF_API_TOKEN on the backend and open /health to verify.",
    );
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
