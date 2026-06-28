type NebulaLogoProps = {
  withWordmark?: boolean;
  className?: string;
};

export function NebulaLogo({
  withWordmark = true,
  className,
}: NebulaLogoProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.72rem',
      }}
    >
      <img
        src="/nebula-logo.svg"
        alt="Nebula"
        width={36}
        height={36}
        style={{ display: 'block', width: 36, height: 36 }}
      />
      {withWordmark ? (
        <span
          style={{
            fontSize: '1.08rem',
            fontWeight: 700,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace',
            letterSpacing: '-0.04em',
            color: 'currentColor',
            lineHeight: 1,
          }}
        >
          Nebula
        </span>
      ) : null}
    </span>
  );
}
