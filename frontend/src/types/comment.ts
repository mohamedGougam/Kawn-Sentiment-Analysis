export type Sentiment = "positive" | "neutral" | "negative";

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: number;
  sentiment: Sentiment;
  rawLabel?: string;
  confidence?: number;
}
