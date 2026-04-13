"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { branding } from "@/lib/branding";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-16 lg:pb-12">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-kawn/20 blur-[100px]" />
        <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-orange-600/10 blur-[90px]" />
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-0 max-w-xl lg:max-w-none"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-kawn/25 bg-kawn/10 px-3 py-1 text-xs font-medium text-kawn-soft shadow-[0_0_20px_-6px_rgba(249,115,22,0.5)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kawn opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-kawn" />
            </span>
            AI-powered comment vibes
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Kawn Sentiment Analysis
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            See how Kawn reads the vibe of every comment—live, clear, and ready
            for your team to trust.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Powered by a real sentiment endpoint using Hugging Face Transformers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-900/50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_24px_80px_-40px_rgba(249,115,22,0.2)] ring-1 ring-white/10"
        >
          <Image
            src={branding.heroSrc}
            alt={branding.heroAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
