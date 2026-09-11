'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type AnimateDirection = 'up' | 'left' | 'right' | 'scale';

export function Animate({
  children,
  direction = 'up',
  delay = 0,
  blur = false,
  replay = false,
  scrollProgress = false,
  className = '',
}: {
  children: ReactNode;
  direction?: AnimateDirection;
  delay?: number;
  blur?: boolean;
  replay?: boolean;
  scrollProgress?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (scrollProgress) {
      let frame: number | undefined;
      el.classList.remove('animate-visible', 'animate-exit-up');
      el.style.transition = 'none';
      const updateProgress = () => {
        frame = undefined;
        const bounds = el.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(
            1,
            (window.innerHeight - bounds.top) /
              (window.innerHeight + bounds.height),
          ),
        );
        const visibility = Math.sin(Math.PI * progress);
        const verticalOffset = (0.5 - progress) * 96;

        el.style.opacity = String(visibility);
        el.style.transform = `translateY(${verticalOffset}px)`;
        el.style.filter = `blur(${(1 - visibility) * 14}px)`;
      };
      const onScroll = () => {
        if (frame === undefined) frame = requestAnimationFrame(updateProgress);
      };

      updateProgress();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      return () => {
        if (frame !== undefined) cancelAnimationFrame(frame);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        el.style.removeProperty('transition');
        el.style.removeProperty('opacity');
        el.style.removeProperty('transform');
        el.style.removeProperty('filter');
      };
    }

    let hasEntered = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove('animate-exit-up');
          timer = setTimeout(() => {
            el.classList.add('animate-visible');
          }, delay);
          hasEntered = true;
          if (!replay) observer.unobserve(el);
        } else if (replay && hasEntered) {
          if (timer) clearTimeout(timer);
          el.classList.remove('animate-visible');
          el.classList.add('animate-exit-up');
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay, replay, scrollProgress]);

  const dirClass =
    direction === 'left'
      ? 'animate-from-left'
      : direction === 'right'
        ? 'animate-from-right'
        : direction === 'scale'
          ? 'animate-from-scale'
          : 'animate-from-up';

  return (
    <div
      ref={ref}
      className={`animate-init ${dirClass} ${blur ? 'animate-from-blur' : ''} ${scrollProgress ? 'animate-scroll' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
