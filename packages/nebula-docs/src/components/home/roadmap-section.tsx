import {
  ArrowUpRight,
  Lock,
  Monitor,
  Radar,
  Server,
  WandSparkles,
} from 'lucide-react';
import { Animate } from '@/components/animate';
import { SectionHeading } from './section-heading';

const roadmapItems = [
  {
    icon: Monitor,
    title: 'Web support',
    description: 'Run both the Nebula host and miniapps on the web.',
    span: 'sm:col-span-2 lg:col-span-2',
  },
  {
    icon: Lock,
    title: 'JavaScript sandbox',
    description:
      'Restrict direct access to arbitrary native modules and make the host boundary more auditable.',
    span: 'sm:col-span-2 lg:col-span-2',
  },
  {
    icon: Server,
    title: 'MCP server',
    description:
      'Expose host, miniapp, API, and capability context to AI tooling and automation workflows.',
    span: '',
  },
  {
    icon: WandSparkles,
    title: 'Documentation automation',
    description:
      'Generate and validate reference docs from structured API metadata so docs and code drift less often.',
    span: '',
  },
  {
    icon: Radar,
    title: 'Host API guard',
    description:
      'Add fine-grained policy controls for API exposure, runtime validation, and access restrictions.',
    span: 'sm:col-span-2 lg:col-span-2',
  },
];

export function RoadmapSection() {
  return (
    <section className="border-b border-black/10 bg-[#ededeb] px-6 py-24 text-[#202020]">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Roadmap"
          title="What's next"
          description="Capabilities we are designing toward. They reflect current plans, not committed timelines."
          centered
          spacing="mt-36 mb-16"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roadmapItems.map((item, index) => (
            <Animate key={item.title} delay={index * 90} className={item.span}>
              <article className="group relative flex h-full min-h-70 flex-col overflow-hidden rounded-xl border border-black/12 bg-[#f7f7f4] p-7 shadow-[0_10px_24px_rgba(0,0,0,0.05)] transition duration-300 ease-out hover:-translate-y-1.5 hover:border-black/40 hover:shadow-[0_20px_36px_rgba(0,0,0,0.14)]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-3 right-5 select-none text-7xl font-semibold leading-none tracking-tighter text-black/5 transition-colors duration-300 group-hover:text-black/8"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-black/15 bg-white/70 text-[#2d2d2d]">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>

                <div className="mt-auto pt-10">
                  <h3 className="text-xl tracking-tight text-[#2d2d2d]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#666]">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#777]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/30" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#555]" />
                      </span>
                      Planned
                    </span>
                    <ArrowUpRight className="h-4 w-4 -translate-x-1 text-[#999] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-[#2d2d2d] group-hover:opacity-100" />
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
