'use client';

import { useEffect, useRef, useState } from 'react';
import { DemoVideo } from './demo-video';

export function SharedDeviceFrame() {
  const [scenarioVisible, setScenarioVisible] = useState(false);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [lineBounds, setLineBounds] = useState({ top: 0, height: 0 });
  const [isAbsolute, setIsAbsolute] = useState(false);
  const [frameTop, setFrameTop] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const isAbsoluteRef = useRef(false);

  useEffect(() => {
    const showcase = document.querySelector(
      '[data-device-showcase="scenarios"]',
    );
    if (!showcase) return;

    const updateScenarioVisibility = () => {
      const { top, bottom } = showcase.getBoundingClientRect();
      const visibleTop = Math.max(0, top);
      const visibleBottom = Math.min(window.innerHeight, bottom);
      const viewportCenter = window.innerHeight / 2;
      const isVisible = top <= viewportCenter && bottom > viewportCenter;
      setScenarioVisible(isVisible);

      const frameHeight = frameRef.current?.offsetHeight ?? 0;
      const frameBottom = viewportCenter + frameHeight / 2;
      const shouldUseAbsolutePosition = bottom <= frameBottom + 200;
      if (shouldUseAbsolutePosition !== isAbsoluteRef.current) {
        if (shouldUseAbsolutePosition) {
          setFrameTop(window.scrollY + (window.innerHeight - frameHeight) / 2);
        }
        isAbsoluteRef.current = shouldUseAbsolutePosition;
        setIsAbsolute(shouldUseAbsolutePosition);
      }

      const scenarios = Array.from(
        showcase.querySelectorAll<HTMLElement>('[data-scenario-index]'),
      );
      const activeScenario = scenarios.find(scenario => {
        const bounds = scenario.getBoundingClientRect();
        return bounds.top <= viewportCenter && bounds.bottom > viewportCenter;
      });
      if (activeScenario) {
        setActiveScenarioIndex(
          Number(activeScenario.dataset.scenarioIndex ?? 0),
        );
      }

      setLineBounds({
        top: visibleTop,
        height: Math.max(0, visibleBottom - visibleTop),
      });
    };

    updateScenarioVisibility();
    window.addEventListener('scroll', updateScenarioVisibility, {
      passive: true,
    });
    window.addEventListener('resize', updateScenarioVisibility);

    return () => {
      window.removeEventListener('scroll', updateScenarioVisibility);
      window.removeEventListener('resize', updateScenarioVisibility);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={`pointer-events-none right-[max(40px,calc((100vw-1440px)/2+40px))] z-30 hidden w-[min(24vw,360px)] -translate-y-1/2 drop-shadow-[18px_24px_28px_rgba(0,0,0,0.22)] lg:block ${
        isAbsolute ? 'absolute translate-y-0' : 'fixed top-1/2'
      }`}
      style={isAbsolute ? { top: frameTop } : undefined}
    >
      {scenarioVisible && lineBounds.height > 0 ? (
        <div
          className="fixed right-[calc(max(40px,calc((100vw-1440px)/2+40px))+min(24vw,360px))] w-px bg-black/20"
          style={{ top: lineBounds.top, height: lineBounds.height }}
        />
      ) : null}
      <DemoVideo
        src={
          activeScenarioIndex === 1
            ? '/demo/coding-agent-demo.mp4'
            : activeScenarioIndex === 2
              ? '/demo/native-app-embed-demo.mp4'
              : '/demo/nebula-demo.mp4'
        }
      />
    </div>
  );
}
