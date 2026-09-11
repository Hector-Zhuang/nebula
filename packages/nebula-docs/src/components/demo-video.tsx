'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function DemoVideo({ src = '/demo/nebula-demo.mp4' }: { src?: string }) {
  const [displaySrc, setDisplaySrc] = useState(src);
  const [ended, setEnded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (src === displaySrc) return;

    setEnded(false);
    setIsTransitioning(true);
    const swapSource = window.setTimeout(() => {
      setDisplaySrc(src);
      requestAnimationFrame(() => setIsTransitioning(false));
    }, 180);

    return () => window.clearTimeout(swapSource);
  }, [displaySrc, src]);

  useEffect(() => {
    setEnded(false);
    videoRef.current?.play();
  }, [displaySrc]);

  const replay = () => {
    setEnded(false);
    videoRef.current?.play();
  };

  return (
    <div className="relative w-[min(72vw,360px)]">
      <div className="relative aspect-[1350/2760]">
        <div className="absolute inset-[2.5%_5.33%] z-10 overflow-hidden rounded-[5%] bg-[#d7d7d5]">
          <video
            key={displaySrc}
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-300 ease-out ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            src={displaySrc}
            controls={false}
            muted
            autoPlay
            playsInline
            onEnded={() => setEnded(true)}
          />
        </div>
        <img
          src="/iphone-16-pro-frame.png"
          alt=""
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
          aria-hidden="true"
        />
      </div>
      {ended ? (
        <button
          type="button"
          onClick={replay}
          className="pointer-events-auto absolute left-1/2 top-[calc(100%+16px)] flex -translate-x-1/2 items-center gap-2 bg-transparent px-4 py-2 text-sm text-black"
        >
          <RotateCcw className="h-4 w-4" />
          Replay
        </button>
      ) : null}
    </div>
  );
}
