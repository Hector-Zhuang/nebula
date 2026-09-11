import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  ChevronRight,
  Cloud,
  Gauge,
  Lock,
  Monitor,
  Radar,
  Server,
  Shield,
  Upload,
  WandSparkles,
} from 'lucide-react';
import { Animate } from '@/components/animate';
import { NebulaLogo } from '@/components/nebula-logo';
import { ScenarioShowcase } from '@/components/scenario-showcase';
import { SharedDeviceFrame } from '@/components/shared-device-frame';

const platformFeatures = [
  {
    icon: Shield,
    title: 'Sandbox isolation',
    eyebrow: 'Runtime boundary',
    description:
      'Each miniapp keeps its own files, storage, and runtime state so modules do not leak into one another.',
    span: 'lg:col-span-2',
  },
  {
    icon: Blocks,
    title: 'Typed Host APIs',
    eyebrow: 'Capability model',
    description:
      'Expose native capabilities through registered contracts instead of ad hoc native module access.',
    span: 'lg:col-span-1',
  },
  {
    icon: Upload,
    title: 'OTA delivery',
    eyebrow: 'Distribution',
    description:
      'Build, upload, review, and publish miniapp bundles independently from the host release cycle.',
    span: 'lg:col-span-1',
  },
  {
    icon: Gauge,
    title: 'Preloading',
    eyebrow: 'Startup strategy',
    description:
      'Warm the runtime and attach content intentionally so miniapps feel faster without sacrificing host control.',
    span: 'lg:col-span-1',
  },
  {
    icon: Cloud,
    title: 'Nebula Cloud',
    eyebrow: 'Control plane',
    description:
      'Manage install metadata, version channels, update strategy, and release governance from one backend.',
    span: 'lg:col-span-2',
  },
  {
    icon: Radar,
    title: 'Host-managed lifecycle',
    eyebrow: 'Runtime orchestration',
    description:
      'Preload, open, restore, close, and update miniapps from a host-owned runtime instead of a fragile plugin layer.',
    span: 'lg:col-span-2',
  },
];

const capabilityPositions = [
  'justify-start md:pl-0 lg:pl-0',
  'justify-end md:pr-10 lg:pr-24',
  'justify-start md:pl-16 lg:pl-36',
  'justify-end md:pr-0 lg:pr-8',
  'justify-start md:pl-8 lg:pl-20',
  'justify-end md:pr-16 lg:pr-40',
];

const roadmapItems = [
  {
    icon: Monitor,
    title: 'Web support',
    description: 'Run both the Nebula host and miniapps on the web.',
    span: 'lg:col-span-2',
  },
  {
    icon: Lock,
    title: 'JavaScript sandbox',
    description:
      'Restrict direct access to arbitrary native modules and make the host boundary more auditable.',
    span: 'lg:col-span-2',
  },
  {
    icon: Server,
    title: 'MCP server',
    description:
      'Expose host, miniapp, API, and capability context to AI tooling and automation workflows.',
    span: 'lg:col-span-1',
  },
  {
    icon: WandSparkles,
    title: 'Documentation automation',
    description:
      'Generate and validate reference docs from structured API metadata so docs and code drift less often.',
    span: 'lg:col-span-1',
  },
  {
    icon: Radar,
    title: 'Host API guard',
    description:
      'Add fine-grained policy controls for API exposure, runtime validation, and access restrictions.',
    span: 'lg:col-span-2',
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  cta,
  centered = false,
  spacing = 'my-36',
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  href?: string;
  cta?: string;
  centered?: boolean;
  spacing?: string;
}) {
  return (
    <div
      className={`${spacing} flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between ${
        centered ? 'text-center' : ''
      }`}
    >
      <div className={centered ? 'mx-auto max-w-[900px]' : 'max-w-6xl'}>
        {eyebrow ? (
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#777]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-balance text-4xl leading-[1.2] tracking-tighter text-[#202020] md:text-6xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-5 max-w-4xl text-base leading-8 text-[#666] md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {href && cta ? (
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#555] transition hover:text-black"
        >
          {cta}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

function CustomHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto max-w-[1440px] px-5 pt-5 md:px-10">
        <div className="pointer-events-auto flex items-center justify-between gap-6 rounded-full border border-black/10 bg-white/60 px-5 py-3 text-[#202020] shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl md:px-6">
          <Link href="/" className="shrink-0">
            <NebulaLogo />
          </Link>
          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.16em] text-[#555] md:flex">
            <Link
              className="border-l border-black/15 pl-8 transition hover:text-black first:border-0 first:pl-0"
              href="/docs/getting-started/overview"
            >
              Getting started
            </Link>
            <Link
              className="border-l border-black/15 pl-8 transition hover:text-black first:border-0 first:pl-0"
              href="/docs/scenarios"
            >
              Scenarios
            </Link>
            <Link
              className="border-l border-black/15 pl-8 transition hover:text-black first:border-0 first:pl-0"
              href="/docs/roadmap"
            >
              Roadmap
            </Link>
            <Link
              className="border-l border-black/15 pl-8 transition hover:text-black first:border-0 first:pl-0"
              href="/docs/reference/nebula-sdk"
            >
              Reference
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="hidden rounded-full border border-black px-4 py-2 text-xs uppercase tracking-[0.16em] text-black transition hover:bg-black/5 sm:inline-flex"
            >
              View docs
            </Link>
            <Link
              href="/docs/getting-started/quickstart-demo"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#202020] bg-[#202020] px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-black"
            >
              Quickstart
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      data-device-showcase="hero"
      className="hero-viewport-height hero-surface relative overflow-hidden border-b border-black/10 text-[#202020]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="hero-shape hero-shape-glow" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] items-center px-5 py-24 md:px-10">
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

function FeatureBentoSection() {
  return (
    <section className="relative overflow-x-clip border-b border-black/10 bg-[#e4e4e2] px-6 py-24 text-[#202020]">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.045)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="pointer-events-none sticky top-1/2 z-20 -translate-y-1/2">
          <SectionHeading
            eyebrow="Capabilities"
            title={
              <>
                Everything you need to run, update, and manage{' '}
                <span className="hero-title-selection inline-block whitespace-nowrap font-semibold">
                  Miniapps
                </span>{' '}
                in a{' '}
                <span className="hero-title-selection inline-block whitespace-nowrap font-semibold">
                  React Native
                </span>{' '}
                application.
              </>
            }
            centered
          />
        </div>

        <div className="mx-auto flex max-w-6xl flex-col">
          {platformFeatures.map((feature, index) => (
            <Animate
              key={feature.title}
              direction="up"
              blur
              scrollProgress
              className="relative z-30"
            >
              <article
                className={`relative flex min-h-[78svh] items-center py-16 md:min-h-[88svh] md:py-24 ${capabilityPositions[index]}`}
              >
                <div className="w-full max-w-[460px] drop-shadow-[0_18px_28px_rgba(0,0,0,0.28)]">
                  <div className="flex h-10 w-[80%] items-center rounded-tl-xl bg-black px-5 [clip-path:polygon(0_0,88%_0,100%_100%,0_100%)]">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                      {feature.eyebrow}
                    </p>
                  </div>
                  <div className="flex min-h-[350px] flex-col rounded-b-xl rounded-r-xl bg-black pt-0">
                    <div className="border-t border-white/35" />
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex items-center justify-center text-white">
                        <feature.icon className="h-28 w-28" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="border-t border-white/35 p-4">
                      <h3 className="mb-3 text-xl font-medium tracking-tight text-white">
                        {feature.title}
                      </h3>
                      <p className="text-base leading-7 text-white/60">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadmapBentoSection() {
  return (
    <section className="border-b border-black/10 bg-[#ededeb] px-6 py-24 text-[#202020]">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="What's next" centered spacing="mt-36 mb-10" />
      </div>

      <div className="-mx-6 overflow-x-auto py-10 pl-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-5">
          {roadmapItems.map((item, index) => (
            <Animate
              key={item.title}
              delay={index * 90}
              className="w-[300px] shrink-0 md:w-[360px]"
            >
              <article className="flex min-h-[300px] flex-col rounded-lg border border-black/15 bg-[#f7f7f4] p-6 shadow-[0_10px_24px_rgba(0,0,0,0.05)] transition duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_36px_rgba(0,0,0,0.14)] md:p-7">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center text-[#333]">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="mb-3 text-xl text-[#2d2d2d]">{item.title}</h3>
                  <p className="text-sm leading-6 text-[#666]">
                    {item.description}
                  </p>
                </div>
              </article>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScenarioBentoSection() {
  return <ScenarioShowcase />;
}

function CTASection() {
  return (
    <section className="bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl border border-white/20 px-8 py-14 text-center md:px-14">
        <Animate>
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-white/55">
            Start shipping
          </p>
          <h2 className="mx-auto max-w-3xl text-balance text-4xl tracking-tighter md:text-6xl">
            Build miniapps that feel like part of your app.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Create a miniapp, add it to your app, and update it when you are
            ready.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/docs/getting-started/quickstart-demo"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-white/85"
            >
              Open quickstart
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/reference/cli"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-xs uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10"
            >
              CLI reference
            </Link>
          </div>
        </Animate>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#ededeb] text-[#202020]">
      <CustomHeader />
      <SharedDeviceFrame />
      <HeroSection />
      <ScenarioBentoSection />
      <FeatureBentoSection />
      <RoadmapBentoSection />
      <CTASection />
    </main>
  );
}
