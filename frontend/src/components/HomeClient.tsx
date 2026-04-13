"use client";

import { useMemo, useState } from "react";
import type { Comment } from "@/types/comment";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CommentComposer } from "@/components/CommentComposer";
import { CommentCard } from "@/components/CommentCard";
import { SummaryStats } from "@/components/SummaryStats";
import { analyzeComment } from "@/lib/api";
import { getInitialComments } from "@/lib/seed-comments";

function randomUsername() {
  const names = [
    "You",
    "Guest",
    "Demo User",
    "New Voice",
    "Community",
  ];
  return names[Math.floor(Math.random() * names.length)]!;
}

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function HomeClient() {
  const initial = useMemo(() => getInitialComments(), []);
  const [comments, setComments] = useState<Comment[]>(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(text: string) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeComment(text);
      const username = randomUsername();
      const next: Comment = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `new-${Date.now()}`,
        username,
        avatar: initialsFrom(username),
        text,
        timestamp: Date.now(),
        sentiment: result.sentiment,
        rawLabel: result.rawLabel,
        confidence: result.confidence,
      };
      setComments((prev) => [next, ...prev]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while analyzing the comment.",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#050505] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.14),transparent)]" />
      <Header />
      <Hero />
      <main className="flex flex-1 flex-col gap-12 pb-20">
        <CommentComposer
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
        />
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-medium text-zinc-200">
                Live comments
              </h2>
              <p className="text-xs text-zinc-500">
                Social-style feed with vibe labels
              </p>
            </div>
          </div>
          <ul className="flex flex-col gap-3">
            {comments.map((c, index) => (
              <li key={c.id} className="list-none">
                <CommentCard comment={c} index={index} />
              </li>
            ))}
          </ul>
        </section>
        <SummaryStats comments={comments} />
      </main>
    </div>
  );
}
