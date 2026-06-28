import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Info } from './info';
import { Mermaid } from './mermaid';
import { Warning } from './warning';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Info,
    Mermaid,
    Warning,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
