import Link from 'next/link';
import {
  ArrowRight,
  Blocks,
  ChevronRight,
  Cloud,
  Gauge,
  Lock,
  Palette,
  Radar,
  Server,
  Shield,
  Upload,
  WandSparkles,
} from 'lucide-react';
import { Animate } from '@/components/animate';
import { NebulaLogo } from '@/components/nebula-logo';
import { redirect } from 'next/navigation';

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

const roadmapItems = [
  {
    icon: Lock,
    title: 'JavaScript sandbox',
    status: 'In progress',
    description:
      'Restrict direct access to arbitrary native modules and make the host boundary more auditable.',
    detail:
      'Future runtime guardrail for third-party npm packages and unapproved native access.',
    span: 'lg:col-span-2',
  },
  {
    icon: Server,
    title: 'MCP server',
    status: 'Exploration',
    description:
      'Expose host, miniapp, API, and capability context to AI tooling and automation workflows.',
    detail:
      'A unified entry point for tooling, diagnostics, structured capability discovery, and AI-assisted workflows.',
    span: 'lg:col-span-1',
  },
  {
    icon: WandSparkles,
    title: 'Documentation automation',
    status: 'Planned',
    description:
      'Generate and validate reference docs from structured API metadata so docs and code drift less often.',
    detail:
      'Especially relevant for Host APIs, components, and compatibility data.',
    span: 'lg:col-span-1',
  },
  {
    icon: Palette,
    title: 'Branding system',
    status: 'Planned',
    description:
      'Support branded runners, loading states, error surfaces, and container experiences.',
    detail:
      'Keep a shared runtime while letting hosts preserve their own product identity.',
    span: 'lg:col-span-2',
  },
  {
    icon: Radar,
    title: 'Host API guard',
    status: 'Planned',
    description:
      'Add fine-grained policy controls for API exposure, runtime validation, and access restrictions.',
    detail:
      'This is the governance layer that will complement sandboxes, capability registration, and compliance controls.',
    span: 'lg:col-span-2',
  },
];

const heroScenarios = [
  {
    title: 'Super App',
    label: 'Consumer host',
    examples: ['Payments', 'Ride hailing', 'Food delivery', 'Shopping'],
    note: 'One host, many consumer modules, shared account and shared payments.',
    active: true,
  },
  {
    title: 'Enterprise Platform',
    label: 'Internal operations',
    examples: ['Warehouse', 'Audit', 'Sales CRM', 'HR'],
    note: 'Independent internal teams ship modules without blocking each other.',
  },
  {
    title: 'AI-generated apps',
    label: 'Generation to deployment',
    examples: ['Generate', 'Build', 'Upload', 'OTA install'],
    note: 'Generated code becomes a governed runtime artifact instead of a fragile web shell.',
  },
];

const scenarios = [
  {
    title: 'Super App',
    eyebrow: 'Consumer host',
    description:
      'One host app, many independently shipped modules, shared login, shared payments, and shared device capabilities.',
    examples: [
      'Payments',
      'Ride hailing',
      'Food delivery',
      'Shopping',
      'Travel',
    ],
    why: [
      'Independent releases',
      'Unified user account',
      'Governed permissions',
      'Native performance',
    ],
    span: 'lg:col-span-2',
  },
  {
    title: 'Enterprise Platform',
    eyebrow: 'Internal operations',
    description:
      'A governed internal host where multiple business teams ship modules without blocking each other.',
    examples: [
      'Warehouse',
      'Audit',
      'Sales CRM',
      'Finance',
      'HR',
      'Field inspection',
    ],
    why: [
      'One app for employees',
      'Team-level ownership',
      'Hardware access via Host APIs',
    ],
    span: 'lg:col-span-1',
  },
  {
    title: 'AI-generated apps',
    eyebrow: 'Generation to deployment',
    description:
      'Generated UI becomes a real miniapp runtime artifact instead of staying trapped in a throwaway web shell.',
    examples: [
      'Generate code',
      'Build bundle',
      'Upload version',
      'OTA install',
      'Iterate',
    ],
    why: ['Runtime model', 'Update flow', 'Native capability bridge'],
    span: 'lg:col-span-1',
  },
  {
    title: 'Operational rollout model',
    eyebrow: 'Release discipline',
    description:
      'Nebula is for teams that need a host-governed module runtime, not an uncontrolled hot-update framework.',
    examples: ['Review', 'Publish', 'Channel', 'Rollback', 'Observe'],
    why: ['Release governance', 'Safer iteration', 'Controlled rollout'],
    span: 'lg:col-span-2',
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-white/42">
          {eyebrow}
        </p>
        <h2
          className="text-balance text-4xl tracking-[-0.05em] text-white md:text-6xl"
          style={{
            fontFamily:
              'Iowan Old Style, Palatino Linotype, URW Palladio L, Book Antiqua, Georgia, serif',
          }}
        >
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
          {description}
        </p>
      </div>
      {href && cta ? (
        <Link
          href={href}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-white/68 transition hover:text-white"
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
      <div className="mx-auto max-w-7xl px-6 pt-5">
        <div className="pointer-events-auto flex items-center justify-between gap-6 rounded-full border border-white/10 bg-black/35 px-4 py-3 text-white backdrop-blur-xl">
          <Link href="/" className="shrink-0 text-white">
            <NebulaLogo />
          </Link>
          <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.16em] text-white/64 md:flex">
            <Link
              className="transition hover:text-white"
              href="/docs/getting-started/overview"
            >
              Getting started
            </Link>
            <Link
              className="transition hover:text-white"
              href="/docs/scenarios"
            >
              Scenarios
            </Link>
            <Link className="transition hover:text-white" href="/docs/roadmap">
              Roadmap
            </Link>
            <Link
              className="transition hover:text-white"
              href="/docs/reference/nebula-sdk"
            >
              Reference
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="hidden rounded-full border border-white/14 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-white/78 transition hover:bg-white/6 sm:inline-flex"
            >
              View docs
            </Link>
            <Link
              href="/docs/getting-started/quickstart-demo"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-black transition hover:bg-white/90"
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
    <section className="relative overflow-hidden border-b border-white/10 bg-[#09090b] text-white">
      <div className="absolute inset-y-0 left-0 w-[18vw] opacity-70">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(62,55,255,0.95) 0 2px, transparent 2px 14px)',
            maskImage:
              'linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.4), transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.4), transparent)',
          }}
        />
      </div>
      <div className="absolute inset-y-0 right-0 w-[18vw] opacity-70">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(62,55,255,0.95) 0 2px, transparent 2px 14px)',
            maskImage:
              'linear-gradient(to left, rgba(0,0,0,0.95), rgba(0,0,0,0.4), transparent)',
            WebkitMaskImage:
              'linear-gradient(to left, rgba(0,0,0,0.95), rgba(0,0,0,0.4), transparent)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="h-14 md:h-16" />
        <div className="rounded-[2rem] border border-white/10 bg-[#0b0b0d] px-6 py-8 shadow-[0_16px_120px_rgba(9,9,11,0.28)] md:px-10 md:py-12">
          <div className="mx-auto max-w-5xl text-center">
            <Animate>
              <Link
                href="https://github.com/Hector-Zhuang/nebula"
                target="_blank"
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/68 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Star on GitHub
              </Link>
            </Animate>

            <Animate delay={80}>
              <h1
                className="text-balance text-[3.35rem] leading-[0.92] tracking-[-0.07em] text-white md:text-[5.4rem] lg:text-[7rem]"
                style={{
                  fontFamily:
                    'Iowan Old Style, Palatino Linotype, URW Palladio L, Book Antiqua, Georgia, serif',
                }}
              >
                Build modular apps
                <br />
                inside your host.
              </h1>
            </Animate>

            <Animate delay={160}>
              <p className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-8 text-white/68 md:text-xl">
                Nebula gives teams a governed miniapp runtime with native
                rendering, typed Host APIs, OTA delivery, and host-owned
                lifecycle control.
              </p>
            </Animate>

            <Animate delay={240}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/docs/getting-started/quickstart-demo"
                  className="inline-flex items-center gap-2 bg-white px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
                >
                  Start with quickstart
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 border border-white/15 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-white/6"
                >
                  View docs
                </Link>
              </div>
            </Animate>
          </div>

          <Animate delay={420}>
            <div className="mt-16 overflow-hidden rounded-[2rem] border border-white/12 bg-[#111114] shadow-[0_18px_80px_rgba(0,0,0,0.28)]">
              <div className="grid border-b border-white/10 md:grid-cols-3">
                {heroScenarios.map(scenario => (
                  <div
                    key={scenario.title}
                    className={`border-white/10 px-6 py-5 text-center font-mono text-sm uppercase tracking-[0.16em] ${
                      scenario.active
                        ? 'bg-white/[0.04] text-white'
                        : 'text-white/46'
                    } ${scenario.title === heroScenarios[2].title ? '' : 'md:border-r'}`}
                  >
                    {scenario.title}
                  </div>
                ))}
              </div>

              <div className="grid min-h-[420px] md:grid-cols-[280px_minmax(0,1fr)]">
                <div className="border-b border-white/10 bg-white/[0.03] p-5 md:border-b-0 md:border-r md:border-white/10">
                  <div className="mb-4 flex items-center justify-between border border-white/10 bg-black/10 px-4 py-3">
                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/72">
                      Scenario examples
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/34">
                      Host
                    </div>
                  </div>
                  <div className="space-y-2">
                    {heroScenarios.map(scenario => (
                      <div
                        key={scenario.title}
                        className={`rounded-[1.1rem] border px-4 py-3 ${
                          scenario.active
                            ? 'border-white/10 bg-white/[0.08] text-white'
                            : 'border-transparent text-white/58'
                        }`}
                      >
                        <div className="font-mono text-[11px] uppercase tracking-[0.16em]">
                          {scenario.title}
                        </div>
                        <div className="mt-2 text-sm text-white/54">
                          {scenario.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/42">
                        Example
                      </div>
                      <h3 className="mt-3 text-3xl tracking-[-0.04em] text-white md:text-4xl">
                        Open one host, ship many products.
                      </h3>
                    </div>
                    <div className="rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/58">
                      Super App
                    </div>
                  </div>

                  <p className="mt-6 max-w-2xl text-base leading-8 text-white/62">
                    Use Nebula when your host needs multiple independently
                    shipped business surfaces without turning the app into one
                    giant release train.
                  </p>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/18 p-5">
                      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/42">
                        Modules
                      </div>
                      <div className="space-y-3">
                        {heroScenarios[0].examples.map(entry => (
                          <div
                            key={entry}
                            className="rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/78"
                          >
                            {entry}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/18 p-5">
                      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/42">
                        Why Nebula
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/78">
                          Shared login, payments, and device capabilities
                        </div>
                        <div className="rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/78">
                          Independent releases without waiting for host rollout
                        </div>
                        <div className="rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/78">
                          Governed capability surface instead of arbitrary
                          native access
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Animate>
        </div>
      </div>
    </section>
  );
}

function FeatureBentoSection() {
  return (
    <section className="border-b border-white/10 bg-[#09090b] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Capabilities"
          title="Core platform features"
          description="Nebula is not just a bundle loader. It combines a runtime boundary, a capability model, a release layer, and a host-controlled lifecycle."
          href="/docs/getting-started/overview"
          cta="Read overview"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {platformFeatures.map((feature, index) => (
            <Animate key={feature.title} delay={index * 80}>
              <article
                className={`flex h-full min-h-[280px] flex-col justify-between border border-white/12 bg-white/[0.03] p-7 ${feature.span}`}
              >
                <div>
                  <div className="mb-8 flex h-11 w-11 items-center justify-center border border-white/12 text-white/84">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/42">
                    {feature.eyebrow}
                  </p>
                  <h3 className="mb-3 font-mono text-sm uppercase tracking-[0.18em] text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-7 text-white/62">
                    {feature.description}
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

function RoadmapBentoSection() {
  return (
    <section className="border-b border-white/10 bg-[#09090b] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="In progress"
          title="What Nebula is building next"
          description="These directions come from 技术路线 and show where Nebula is getting stricter, safer, and more automation-friendly."
          href="/docs/roadmap"
          cta="Open 技术路线"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {roadmapItems.map((item, index) => (
            <Animate key={item.title} delay={index * 90}>
              <article
                className={`flex h-full min-h-[280px] flex-col border border-white/12 bg-white/[0.03] p-7 ${item.span}`}
              >
                <div className="mb-8 flex h-11 w-11 items-center justify-center border border-white/12 text-white/84">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="mb-4 inline-flex w-fit items-center gap-2 border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/58">
                  {item.status}
                </div>
                <h3 className="mb-3 font-mono text-sm uppercase tracking-[0.18em] text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-white/62">
                  {item.description}
                </p>
                <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-7 text-white/48">
                  {item.detail}
                </p>
              </article>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScenarioBentoSection() {
  return (
    <section className="border-b border-white/10 bg-[#09090b] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Scenario examples"
          title="Different products, one runtime model"
          description="Nebula is most useful when many product surfaces need to ship independently while still staying inside one governed host."
          href="/docs/scenarios"
          cta="Explore scenarios"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {scenarios.map((scenario, index) => (
            <Animate key={scenario.title} delay={index * 100}>
              <article
                className={`flex h-full min-h-[320px] flex-col border border-white/12 bg-white/[0.03] p-7 ${scenario.span}`}
              >
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/42">
                    {scenario.eyebrow}
                  </p>
                  <h3 className="mb-3 font-mono text-sm uppercase tracking-[0.18em] text-white">
                    {scenario.title}
                  </h3>
                  <p className="text-sm leading-7 text-white/62">
                    {scenario.description}
                  </p>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="border border-white/12 bg-black/20 p-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/76">
                    <div className="mb-3 text-white/42">Examples</div>
                    {scenario.examples.map(entry => (
                      <div key={entry} className="mb-2 last:mb-0">
                        ├── {entry}
                      </div>
                    ))}
                  </div>
                  <div className="border border-white/12 bg-black/20 p-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/76">
                    <div className="mb-3 text-white/42">Why Nebula</div>
                    {scenario.why.map(entry => (
                      <div key={entry} className="mb-2 last:mb-0">
                        ├── {entry}
                      </div>
                    ))}
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

function CTASection() {
  return (
    <section className="bg-[#09090b] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl border border-white/12 px-8 py-14 text-center md:px-14">
        <Animate>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-white/42">
            Start shipping
          </p>
          <h2
            className="mx-auto max-w-3xl text-balance text-4xl tracking-[-0.05em] md:text-6xl"
            style={{
              fontFamily:
                'Iowan Old Style, Palatino Linotype, URW Palladio L, Book Antiqua, Georgia, serif',
            }}
          >
            Build a governed miniapp runtime, not another hot-update shortcut.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/64">
            Create a host, create a miniapp, and experience the full Nebula loop
            from development to runtime governance.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/docs/getting-started/quickstart-demo"
              className="inline-flex items-center gap-2 bg-white px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
            >
              Open quickstart
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/reference/cli"
              className="inline-flex items-center gap-2 border border-white/15 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-white/6"
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
  return redirect('/docs');
  // return (
  //   <main className="min-h-screen bg-[#09090b] text-white">
  //     <CustomHeader />
  //     <HeroSection />
  //     <FeatureBentoSection />
  //     <ScenarioBentoSection />
  //     <RoadmapBentoSection />
  //     <CTASection />
  //   </main>
  // );
}
