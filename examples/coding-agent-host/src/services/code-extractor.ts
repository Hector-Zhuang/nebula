import type { CodeFile, MiniappSpec } from '../types';

/**
 * Extract code files from LLM response.
 *
 * Supports fenced code blocks where the first line is a file path comment:
 *   ```language
 *   // path/to/file.ext
 *   code content
 *   ```
 */
export function extractCodeFiles(response: string): CodeFile[] {
  const files: CodeFile[] = [];

  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(response)) !== null) {
    const language = match[1] || 'text';
    const blockContent = match[2];

    // Try to extract file path from first line comment
    const firstLineMatch = blockContent.match(
      /^(?:\/\/|#|\/\*|<!--)\s*([\w./-]+(?:\.[\w]+)+)\s*(?:\*\/|-->)?\n([\s\S]*)$/,
    );

    if (firstLineMatch) {
      const filePath = firstLineMatch[1].trim();
      const content = firstLineMatch[2];
      files.push({
        path: filePath,
        language: detectLanguage(filePath, language),
        content: content.trim(),
      });
    }
  }

  return files;
}

/**
 * Infer language from file extension.
 */
function detectLanguage(filePath: string, fallback: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    tsx: 'tsx',
    ts: 'typescript',
    jsx: 'jsx',
    js: 'javascript',
    json: 'json',
    css: 'css',
    md: 'markdown',
  };
  return langMap[ext || ''] || fallback;
}

/**
 * Extract JSON spec from LLM response.
 * Tries direct JSON.parse first, then tries extracting from markdown code block.
 */
export function extractSpec(response: string): MiniappSpec | null {
  // Try direct parse
  try {
    const parsed = JSON.parse(response);
    if (parsed && typeof parsed === 'object' && 'appId' in parsed) {
      return parsed as MiniappSpec;
    }
  } catch {
    // Fall through to next strategy
  }

  // Try extracting from ```json ... ``` block
  const jsonBlockMatch = response.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
  if (jsonBlockMatch) {
    try {
      const parsed = JSON.parse(jsonBlockMatch[1]);
      if (parsed && typeof parsed === 'object' && 'appId' in parsed) {
        return parsed as MiniappSpec;
      }
    } catch {
      // Fall through
    }
  }

  // Try to find JSON object anywhere in the response
  const jsonObjectMatch = response.match(/\{[\s\S]*"appId"[\s\S]*\}/);
  if (jsonObjectMatch) {
    try {
      const parsed = JSON.parse(jsonObjectMatch[0]);
      if (parsed && typeof parsed === 'object' && 'appId' in parsed) {
        return parsed as MiniappSpec;
      }
    } catch {
      // Fall through
    }
  }

  return null;
}
