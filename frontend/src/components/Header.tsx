import Image from "next/image";
import { branding } from "@/lib/branding";

export function Header() {
  if (branding.headerBannerSrc) {
    return (
      <header className="relative z-10 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Image
            src={branding.headerBannerSrc}
            alt="Kawn"
            width={1200}
            height={200}
            priority
            className="h-auto w-full rounded-xl object-cover ring-1 ring-white/[0.06]"
          />
        </div>
      </header>
    );
  }

  return (
    <header className="relative z-10 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Image
            src={branding.logoSrc}
            alt="Kawn"
            width={200}
            height={48}
            priority
            className="h-9 w-auto max-h-11 max-w-[160px] shrink-0 object-contain object-left shadow-[0_0_20px_-4px_rgba(249,115,22,0.35)] sm:h-11 sm:max-w-[220px]"
          />
          <div className="min-w-0 flex flex-col justify-center">
            <p className="truncate text-[0.9375rem] font-semibold tracking-tight text-white sm:text-lg sm:whitespace-normal">
              Kawn Sentiment Analysis
            </p>
            <p className="hidden text-xs text-zinc-500 sm:block">
              Real-time comment intelligence
            </p>
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-400">
            Demo preview
          </span>
        </div>
      </div>
    </header>
  );
}
