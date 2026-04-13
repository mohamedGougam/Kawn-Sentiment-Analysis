"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  onAnalyze: (text: string) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
};

export function CommentComposer({ onAnalyze, isLoading = false, error }: Props) {
  const [text, setText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    try {
      await onAnalyze(trimmed);
      setText("");
    } catch {
      // Keep the text so the user can retry after an API error.
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_24px_80px_-40px_rgba(249,115,22,0.25)] backdrop-blur-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-zinc-200">
            Try a comment
          </h2>
          <span className="text-xs text-zinc-500">
            Live AI analysis via Hugging Face
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="comment-input" className="sr-only">
            Comment text
          </label>
          <textarea
            id="comment-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            placeholder="Write something you’d post on social…"
            rows={3}
            className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#050505] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none ring-kawn/30 transition-[border,box-shadow,opacity] focus:border-kawn/40 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {error ? (
            <p className="text-sm text-rose-300">{error}</p>
          ) : (
            <p className="text-xs text-zinc-500">
              Try something like “This feature is amazing” or “I hate how slow
              this feels.”
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-kawn to-orange-500 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_24px_-6px_rgba(249,115,22,0.65)] transition-[opacity,box-shadow] hover:shadow-[0_0_32px_-4px_rgba(249,115,22,0.75)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  Analyzing...
                </>
              ) : (
                "Analyze vibe"
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.section>
  );
}
