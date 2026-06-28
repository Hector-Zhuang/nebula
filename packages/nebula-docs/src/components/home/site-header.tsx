import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NebulaLogo } from '@/components/nebula-logo';

const navItems = [
  { href: '/docs/getting-started/overview', label: 'Getting started' },
  { href: '/docs/scenarios', label: 'Scenarios' },
  { href: '/docs/roadmap', label: 'Roadmap' },
  { href: '/docs/reference/nebula-sdk', label: 'Reference' },
];

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto max-w-[1440px] px-5 pt-5 md:px-10">
        <div className="pointer-events-auto flex items-center justify-between gap-6 rounded-full border border-black/10 bg-white/60 px-5 py-3 text-[#202020] shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl md:px-6">
          <Link href="/" className="shrink-0">
            <NebulaLogo />
          </Link>
          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.16em] text-[#555] md:flex">
            {navItems.map(item => (
              <Link
                key={item.href}
                className="border-l border-black/15 pl-8 transition hover:text-black first:border-0 first:pl-0"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
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
