import { cn } from '@/lib/utils';

type NebulaLogoProps = {
  withWordmark?: boolean;
  className?: string;
  iconClassName?: string;
};

export function NebulaLogo({
  withWordmark = true,
  className,
  iconClassName,
}: NebulaLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <img
        src="/nebula-logo.svg"
        alt="Nebula"
        width={36}
        height={36}
        className={cn('block size-9', iconClassName)}
      />
      {withWordmark ? (
        <span className="text-[1.05rem] font-bold tracking-[-0.04em] text-current leading-none font-mono">
          Nebula
        </span>
      ) : null}
    </span>
  );
}
