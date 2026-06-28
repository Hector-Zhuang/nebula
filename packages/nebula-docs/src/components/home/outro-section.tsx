import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function OutroSection() {
  return (
    <section
      className="flex w-full flex-col items-center gap-12 overflow-hidden bg-black px-8 py-8 md:flex-row md:items-center md:justify-between md:gap-10 md:px-12 lg:gap-16"
      aria-label="Nebula"
    >
      <h2 className="m-0 shrink-0 italic select-none whitespace-nowrap text-left font-mono text-[clamp(7rem,14vw,18rem)] font-bold leading-[0.84] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.9)]">
        NEBULA
      </h2>

      <div className="flex max-w-sm flex-col items-start gap-6 md:max-w-xs lg:max-w-sm">
        <p className="text-sm leading-7 text-white/60">
          A React Native-powered solution for running mini-apps, with host
          runtime, isolated containers, preloading, and extensible base-library
          APIs.
        </p>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-white/90 transition hover:border-white hover:bg-white hover:text-black"
        >
          View docs
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
