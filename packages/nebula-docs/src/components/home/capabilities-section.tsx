import {
  Activity,
  Boxes,
  CirclePlay,
  Cloud,
  LayoutGrid,
  Plug,
  Shield,
  Terminal,
  Upload,
} from 'lucide-react';
import { Animate } from '@/components/animate';
import { SectionHeading } from './section-heading';

const platformFeatures = [
  {
    icon: Shield,
    title: 'Sandbox isolation',
    eyebrow: 'Runtime boundary',
    description:
      'Each miniapp gets its own storage namespace, file root, and runtime state, and can only call capabilities the host has explicitly registered.',
    span: 'lg:col-span-2',
  },
  {
    icon: Boxes,
    title: 'Base library',
    eyebrow: 'Capability APIs',
    description:
      'Device, network, media, and storage capabilities ship as standard async APIs, implemented once by the host and shared across miniapps.',
    span: 'lg:col-span-1',
  },
  {
    icon: LayoutGrid,
    title: 'Cross-platform components',
    eyebrow: '@nebula-rn/components',
    description:
      'Swiper, Video, Map, Camera, WebView and more ship as a separate package, installed on demand instead of bundled into the base library.',
    span: 'lg:col-span-1',
  },
  {
    icon: Activity,
    title: 'Page lifecycle',
    eyebrow: 'Lifecycle hooks',
    description:
      'onLoad, onShow, onReady, onHide and onUnload map native page callbacks to hooks, from cold start to cached revisit.',
    span: 'lg:col-span-1',
  },
  {
    icon: Plug,
    title: 'Extensible Host APIs',
    eyebrow: 'Capability model',
    description:
      'Hosts register business capabilities such as payments or membership through versioned contracts; miniapps detect support and degrade gracefully.',
    span: 'lg:col-span-1',
  },
  {
    icon: Upload,
    title: 'OTA delivery',
    eyebrow: 'Distribution',
    description:
      'Complete bundles are downloaded, cached, and opened offline. Updates land without an app-store release, on automatic or manual strategies.',
    span: 'lg:col-span-1',
  },
  {
    icon: CirclePlay,
    title: 'Dev Runner',
    eyebrow: 'Developer experience',
    description:
      'A universal debug host in the spirit of Expo Go: develop and hot-reload miniapps without the full host app, with simulated capabilities.',
    span: 'lg:col-span-1',
  },
  {
    icon: Terminal,
    title: 'CLI & templates',
    eyebrow: 'Toolchain',
    description:
      'Scaffold hosts and miniapps from built-in templates, then run dev, build, and upload from one command line — @nebula-rn/cli.',
    span: 'lg:col-span-2',
  },
  {
    icon: Cloud,
    title: 'Nebula Cloud',
    eyebrow: 'Control plane',
    description:
      'Self-hostable backend for uploads, experience and production channels, and one-click rollback to any published version — Docker included.',
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
  'justify-start md:pl-0 lg:pl-10',
  'justify-end md:pr-10 lg:pr-24',
  'justify-start md:pl-16 lg:pl-36',
];

export function CapabilitiesSection() {
  return (
    <section className="relative overflow-x-clip border-b border-black/10 bg-[#e4e4e2] px-6 py-24 text-[#202020]">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.045)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="pointer-events-none sticky top-1/2 z-20 -translate-y-1/2">
          <SectionHeading
            eyebrow="Capabilities"
            centered
            spacing="mt-36 mb-10"
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
                className={`relative flex min-h-[70svh] items-center py-14 md:min-h-[80svh] md:py-20 ${capabilityPositions[index]}`}
              >
                <div className="w-full max-w-[460px] drop-shadow-[0_18px_28px_rgba(0,0,0,0.28)]">
                  <div className="flex h-10 w-[80%] items-center rounded-tl-xl bg-black px-5 [clip-path:polygon(0_0,88%_0,100%_100%,0_100%)]">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                      {feature.eyebrow}
                    </p>
                  </div>
                  <div className="flex min-h-[330px] flex-col rounded-b-xl rounded-r-xl bg-black pt-0">
                    <div className="border-t border-white/35" />
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex items-center justify-center text-white">
                        <feature.icon className="h-24 w-24" strokeWidth={1.5} />
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
