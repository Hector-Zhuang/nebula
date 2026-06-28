'use client';

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

type AnimateDirection = 'up' | 'left' | 'right' | 'scale';

export function Animate({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  direction?: AnimateDirection;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('animate-visible');
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const dirClass =
    direction === 'left'
      ? 'animate-from-left'
      : direction === 'right'
        ? 'animate-from-right'
        : direction === 'scale'
          ? 'animate-from-scale'
          : 'animate-from-up';

  return (
    <div ref={ref} className={`animate-init ${dirClass} ${className}`}>
      {children}
    </div>
  );
}
