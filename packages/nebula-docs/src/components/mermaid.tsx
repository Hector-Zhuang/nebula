'use client';

import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';

type MermaidProps = {
  chart: string;
};

let initialized = false;

export function Mermaid({ chart }: MermaidProps) {
  const id = useId().replace(/:/g, '');
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!initialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
        });
        initialized = true;
      }

      const result = await mermaid.render(`mermaid-${id}`, chart);

      if (!cancelled) {
        setSvg(result.svg);
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div
        className="flex justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
