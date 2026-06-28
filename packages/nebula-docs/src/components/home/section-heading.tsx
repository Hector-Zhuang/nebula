import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  href?: string;
  cta?: string;
  centered?: boolean;
  spacing?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  cta,
  centered = false,
  spacing = 'my-36',
}: SectionHeadingProps) {
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
