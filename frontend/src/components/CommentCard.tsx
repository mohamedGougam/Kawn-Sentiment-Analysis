"use client";

import { motion } from "framer-motion";
import type { Comment } from "@/types/comment";
import { SentimentBadge } from "@/components/SentimentBadge";
import { formatCommentTime } from "@/lib/format-time";

export function CommentCard({
  comment,
  index,
}: {
  comment: Comment;
  index: number;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-transparent p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset,0_20px_50px_-28px_rgba(0,0,0,0.85)] transition-[box-shadow,border-color] hover:border-white/[0.12] hover:shadow-[0_0_0_1px_rgba(249,115,22,0.12)_inset,0_24px_60px_-24px_rgba(249,115,22,0.12)] sm:p-5"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-kawn/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-xs font-semibold text-white ring-1 ring-white/10"
            aria-hidden
          >
            {comment.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-medium text-zinc-100">
                {comment.username}
              </span>
              <time
                className="text-xs text-zinc-500"
                dateTime={new Date(comment.timestamp).toISOString()}
              >
                {formatCommentTime(comment.timestamp)}
              </time>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {comment.text}
            </p>
            {typeof comment.confidence === "number" ? (
              <p className="mt-3 text-xs text-zinc-500">
                Confidence {Math.round(comment.confidence * 100)}%
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 sm:justify-end">
          <SentimentBadge sentiment={comment.sentiment} />
        </div>
      </div>
    </motion.article>
  );
}
