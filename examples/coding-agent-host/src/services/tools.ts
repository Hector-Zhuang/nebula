import type {
  ToolDefinition,
  ToolCall,
  ToolResult,
  CodeFile,
  MiniappSpec,
} from '../types';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'create_project',
      description:
        'Create a new Nebula miniapp project on the server. Provide the complete app metadata and source code files. After creating, you should call build_project to compile it.',
      parameters: {
        type: 'object',
        properties: {
          appId: {
            type: 'string',
            description:
              'Unique app identifier, lowercase alphanumeric with hyphens only (e.g., "my-todo-app")',
          },
          name: {
            type: 'string',
            description: 'Human-readable display name for the miniapp',
          },
          description: {
            type: 'string',
            description: 'One-sentence description of the miniapp',
          },
          codeFiles: {
            type: 'array',
            description:
              'Array of source code files. Each file must have path, language, and content. Include app.json, page components, page configs, and styles.',
            items: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description:
                    'File path relative to project root (e.g., "src/pages/home/index.tsx", "app.json")',
                },
                language: {
                  type: 'string',
                  description: 'File language (tsx, ts, json)',
                },
                content: {
                  type: 'string',
                  description: 'Complete file content',
                },
              },
              required: ['path', 'language', 'content'],
            },
          },
        },
        required: ['appId', 'name', 'description', 'codeFiles'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'build_project',
      description:
        'Build a miniapp project (npm install + nebula miniapp build). This compiles iOS and Android bundles. May take a few minutes. Returns the build status.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID returned by create_project',
          },
        },
        required: ['projectId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_build_status',
      description:
        'Check the current build status of a project. Returns "building", "built", or "failed".',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID to check',
          },
        },
        required: ['projectId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'deploy_project',
      description:
        'Deploy a built project to Nebula Cloud. Uploads the bundles and publishes a new version. The project must be built first.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID to deploy',
          },
        },
        required: ['projectId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_miniapps',
      description:
        'List all miniapps the user has created on Nebula Cloud. Use this when the user asks about their existing apps or deployment history.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
];

// ---------- Tool executor ----------

interface ServerClientLike {
  createProject(
    token: string,
    input: { spec: MiniappSpec; codeFiles: CodeFile[] },
  ): Promise<{ projectId: string; status: string }>;
  buildProject(
    token: string,
    projectId: string,
  ): Promise<{ buildId: string; status: string }>;
  waitForBuild(
    token: string,
    projectId: string,
    options?: { intervalMs?: number; timeoutMs?: number },
  ): Promise<{ status: string; error?: string; artifacts?: unknown }>;
  getBuildStatus(
    token: string,
    projectId: string,
  ): Promise<{ status: string; error?: string }>;
  deployProject(
    token: string,
    projectId: string,
  ): Promise<{
    success: boolean;
    miniAppId: string;
    versionId: string;
    version: string;
  }>;
  listMiniApps(token: string): Promise<unknown[]>;
}

export function createToolExecutor(
  serverClient: ServerClientLike,
  token: string,
) {
  async function execute(toolCall: ToolCall): Promise<ToolResult> {
    const { id, function: fn } = toolCall;
    const name = fn.name;

    try {
      const args = fn.arguments ? JSON.parse(fn.arguments) : {};

      switch (name) {
        case 'create_project': {
          const codeFiles: CodeFile[] = (args.codeFiles || []).map(
            (f: { path: string; language?: string; content: string }) => ({
              path: f.path,
              language: f.language || guessLanguage(f.path),
              content: f.content,
            }),
          );

          const pages = extractPageNames(codeFiles);
          const spec: MiniappSpec = {
            appId: args.appId,
            name: args.name,
            description: args.description || '',
            pages: pages.map((pageName, idx) => ({
              name: pageName,
              description: `Page: ${pageName}`,
              components: [],
            })),
            features: [],
            apis: [],
          };

          const result = await serverClient.createProject(token, {
            spec,
            codeFiles,
          });
          return makeResult(id, name, result);
        }

        case 'build_project': {
          const result = await serverClient.waitForBuild(
            token,
            args.projectId,
            { intervalMs: 3000, timeoutMs: 300000 },
          );
          return makeResult(id, name, result);
        }

        case 'get_build_status': {
          const result = await serverClient.getBuildStatus(
            token,
            args.projectId,
          );
          return makeResult(id, name, result);
        }

        case 'deploy_project': {
          const result = await serverClient.deployProject(
            token,
            args.projectId,
          );
          return makeResult(id, name, result);
        }

        case 'list_miniapps': {
          const result = await serverClient.listMiniApps(token);
          return makeResult(id, name, result);
        }

        default:
          return makeResult(id, name, {
            error: `Unknown tool: ${name}`,
          });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return makeResult(id, name, { error: message });
    }
  }

  return { execute };
}

// ---------- Helpers ----------

function makeResult(
  toolCallId: string,
  name: string,
  data: unknown,
): ToolResult {
  return {
    tool_call_id: toolCallId,
    role: 'tool',
    name,
    content: JSON.stringify(data),
  };
}

function guessLanguage(filePath: string): string {
  if (filePath.endsWith('.tsx')) return 'tsx';
  if (filePath.endsWith('.ts')) return 'ts';
  if (filePath.endsWith('.json')) return 'json';
  if (filePath.endsWith('.js')) return 'js';
  return 'text';
}

function extractPageNames(codeFiles: CodeFile[]): string[] {
  const pageNames = new Set<string>();
  for (const file of codeFiles) {
    const match = file.path.match(/src\/pages\/([^/]+)\/index\.tsx?$/);
    if (match) {
      pageNames.add(match[1]);
    }
  }
  return Array.from(pageNames);
}

/** Human-readable label for a tool name */
export function getToolLabel(name: string): string {
  const labels: Record<string, string> = {
    create_project: 'Creating project',
    build_project: 'Building project',
    get_build_status: 'Checking build status',
    deploy_project: 'Deploying to Cloud',
    list_miniapps: 'Listing miniapps',
  };
  return labels[name] || name;
}
