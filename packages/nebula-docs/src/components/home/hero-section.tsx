import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section
      data-device-showcase="hero"
      className="hero-viewport-height hero-surface relative overflow-hidden border-b border-black/10 text-[#202020]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="hero-shape hero-shape-glow" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-svh max-w-[1440px] items-center px-5 py-24 md:px-10">
        <div className="max-w-xl">
          <h1 className="max-w-2xl text-balance text-[3.5rem] leading-[1.02] tracking-[-0.06em] text-[#202020] sm:text-[4.25rem] md:text-[5.25rem] lg:text-[6.25rem]">
            <span className="whitespace-nowrap">
              Run <strong className="font-semibold">Miniapps</strong>
            </span>
            <br />
            <span className="whitespace-nowrap">
              with{' '}
              <strong className="hero-title-selection font-semibold">
                React Native
              </strong>
            </span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-6 text-[#555] md:text-xl md:leading-7">
            A React Native-powered solution for running mini-apps, with host
            runtime, isolated containers, preloading, and extensible
            base-library APIs.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/docs/getting-started/quickstart-demo"
              className="inline-flex items-center gap-3 rounded-full bg-[#202020] px-6 py-4 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-black"
            >
              Start building
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/Hector-Zhuang/nebula"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border-2 border-black px-5 py-4 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-black/5"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.05.13 3.01.4c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58A12.01 12.01 0 0 0 24 12C24 5.37 18.63 0 12 0Z" />
              </svg>
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
