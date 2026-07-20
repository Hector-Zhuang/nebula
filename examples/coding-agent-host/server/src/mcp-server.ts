import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import type { ServerConfig, Project } from './types';
import { createProject, getProjectDir } from './project-manager';
import { buildProject } from './builder';
import { Deployer } from './deployer';

// In-memory project store (shared with routes for backward compat)
export const projects = new Map<string, Project>();

// Docs base path — resolve relative to monorepo root
const DOCS_BASE = path.resolve(
  __dirname,
  '../../../../packages/nebula-docs/content/docs/reference',
);

/**
 * Create and configure the MCP server with tools and resources.
 */
export function createMcpServer(config: ServerConfig): McpServer {
  const server = new McpServer({
    name: 'nebula-coding-agent',
    version: '1.0.0',
  });

  const deployer = new Deployer(config.cloudBaseUrl);

  registerTools(server, config, deployer);
  registerResources(server);

  return server;
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

function registerTools(
  server: McpServer,
  config: ServerConfig,
  deployer: Deployer,
) {
  // --- create_project ---
  server.registerTool(
    'create_project',
    {
      title: 'Create Project',
      description:
        'Create a new Nebula miniapp project on the server. Provide the complete app metadata and source code files. After creating, call build_project to compile it.',
      inputSchema: z.object({
        cloudToken: z
          .string()
          .describe('User auth token for Nebula Cloud'),
        appId: z
          .string()
          .describe(
            'Unique app identifier, lowercase alphanumeric with hyphens only (e.g., "my-todo-app")',
          ),
        name: z
          .string()
          .describe('Human-readable display name for the miniapp'),
        description: z
          .string()
          .describe('One-sentence description of the miniapp'),
        codeFiles: z
          .array(
            z.object({
              path: z
                .string()
                .describe(
                  'File path relative to project root (e.g., "src/pages/home/index.tsx")',
                ),
              language: z
                .string()
                .optional()
                .describe('File language (tsx, ts, json)'),
              content: z.string().describe('Complete file content'),
            }),
          )
          .describe(
            'Array of source code files. Include page components, page configs, styles, and app.json.',
          ),
      }),
    },
    async ({ cloudToken, appId, name, description, codeFiles }) => {
      const pages = extractPageNames(codeFiles);
      const spec = {
        appId,
        name,
        description,
        pages: pages.map(pageName => ({
          name: pageName,
          description: `Page: ${pageName}`,
          components: [],
        })),
        features: [],
        apis: [],
      };

      const files = codeFiles.map(f => ({
        path: f.path,
        language: f.language || guessLanguage(f.path),
        content: f.content,
      }));

      const project = createProject(
        config.projectsDir,
        spec,
        files,
        cloudToken,
      );
      projects.set(project.id, project);

      console.log(`[mcp] Project created: ${project.id} (${appId})`);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              projectId: project.id,
              status: project.status,
            }),
          },
        ],
      };
    },
  );

  // --- build_project ---
  server.registerTool(
    'build_project',
    {
      title: 'Build Project',
      description:
        'Build a miniapp project (npm install + nebula miniapp build). This compiles iOS and Android bundles. May take a few minutes. Polls until build completes or fails.',
      inputSchema: z.object({
        cloudToken: z
          .string()
          .describe('User auth token for Nebula Cloud'),
        projectId: z
          .string()
          .describe('The project ID returned by create_project'),
      }),
    },
    async ({ projectId }) => {
      const project = projects.get(projectId);
      if (!project) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({ error: 'Project not found' }),
            },
          ],
        };
      }

      project.status = 'building';
      project.updatedAt = Date.now();

      const projectDir = getProjectDir(config.projectsDir, project.id);

      try {
        const artifacts = await buildProject(projectDir);
        project.artifacts = artifacts;
        project.status = 'built';
        project.updatedAt = Date.now();
        console.log(`[mcp] Build complete: ${project.id}`);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                status: 'built',
                projectId: project.id,
              }),
            },
          ],
        };
      } catch (error: any) {
        project.status = 'build_failed';
        project.buildError = error.message;
        project.updatedAt = Date.now();
        console.error(`[mcp] Build failed: ${project.id}`, error.message);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                status: 'build_failed',
                error: error.message,
              }),
            },
          ],
        };
      }
    },
  );

  // --- get_build_status ---
  server.registerTool(
    'get_build_status',
    {
      title: 'Get Build Status',
      description:
        'Check the current build status of a project. Returns "building", "built", or "build_failed".',
      inputSchema: z.object({
        cloudToken: z
          .string()
          .describe('User auth token for Nebula Cloud'),
        projectId: z
          .string()
          .describe('The project ID to check'),
      }),
    },
    async ({ projectId }) => {
      const project = projects.get(projectId);
      if (!project) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({ error: 'Project not found' }),
            },
          ],
        };
      }

      const result: { status: string; error?: string } = {
        status: project.status,
      };
      if (project.buildError) result.error = project.buildError;

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result) }],
      };
    },
  );

  // --- deploy_project ---
  server.registerTool(
    'deploy_project',
    {
      title: 'Deploy Project',
      description:
        'Deploy a built project to Nebula Cloud. Uploads the bundles and publishes a new version. The project must be built first.',
      inputSchema: z.object({
        cloudToken: z
          .string()
          .describe('User auth token for Nebula Cloud'),
        projectId: z
          .string()
          .describe('The project ID to deploy'),
      }),
    },
    async ({ cloudToken, projectId }) => {
      const project = projects.get(projectId);
      if (!project) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({ error: 'Project not found' }),
            },
          ],
        };
      }

      if (project.status !== 'built' || !project.artifacts) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                error: `Cannot deploy: project status is "${project.status}". Build must complete first.`,
              }),
            },
          ],
        };
      }

      project.status = 'deploying';
      project.updatedAt = Date.now();

      try {
        const result = await deployer.deploy(
          cloudToken,
          project.spec,
          project.artifacts,
        );
        project.deployResult = result;
        project.status = 'deployed';
        project.updatedAt = Date.now();

        console.log(
          `[mcp] Deployed: ${project.id} → ${result.miniAppId}@${result.version}`,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                success: true,
                miniAppId: result.miniAppId,
                versionId: result.versionId,
                version: result.version,
                status: 'deployed',
              }),
            },
          ],
        };
      } catch (error: any) {
        project.status = 'deploy_failed';
        project.deployError = error.message;
        project.updatedAt = Date.now();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({ error: error.message }),
            },
          ],
        };
      }
    },
  );

  // --- list_miniapps ---
  server.registerTool(
    'list_miniapps',
    {
      title: 'List MiniApps',
      description:
        'List all miniapps the user has created on Nebula Cloud. Use this when the user asks about their existing apps or deployment history.',
      inputSchema: z.object({
        cloudToken: z
          .string()
          .describe('User auth token for Nebula Cloud'),
      }),
    },
    async ({ cloudToken }) => {
      const miniApps = await deployer.listMiniApps(cloudToken);
      return {
        content: [
          { type: 'text' as const, text: JSON.stringify(miniApps) },
        ],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// Resources — Nebula API documentation
// ---------------------------------------------------------------------------

interface DocResource {
  name: string;
  uri: string;
  title: string;
  filename: string;
}

const DOC_RESOURCES: DocResource[] = [
  {
    name: 'nebula-cloud-api',
    uri: 'nebula://docs/cloud-api',
    title: 'Nebula Cloud REST API Reference',
    filename: 'nebula-cloud-api.mdx',
  },
  {
    name: 'nebula-sdk',
    uri: 'nebula://docs/sdk',
    title: 'Nebula SDK Reference',
    filename: 'nebula-sdk.mdx',
  },
  {
    name: 'nebula-host-apis',
    uri: 'nebula://docs/host-apis',
    title: 'Nebula Host API Reference',
    filename: 'nebula-host-apis.mdx',
  },
  {
    name: 'nebula-components',
    uri: 'nebula://docs/components',
    title: 'Nebula Component Library Reference',
    filename: 'nebula-components.mdx',
  },
  {
    name: 'nebula-client',
    uri: 'nebula://docs/client',
    title: 'Nebula Client Reference',
    filename: 'nebula-client.mdx',
  },
  {
    name: 'nebula-cli',
    uri: 'nebula://docs/cli',
    title: 'Nebula CLI Reference',
    filename: 'cli.mdx',
  },
];

function registerResources(server: McpServer) {
  for (const doc of DOC_RESOURCES) {
    const filePath = path.join(DOCS_BASE, doc.filename);

    // Read the doc file — if it doesn't exist, skip
    let content: string;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      console.warn(`[mcp] Doc file not found: ${filePath}, skipping`);
      continue;
    }

    server.registerResource(
      doc.name,
      doc.uri,
      {
        title: doc.title,
        mimeType: 'text/markdown',
      },
      async uri => ({
        contents: [
          {
            uri: uri.href,
            text: content,
            mimeType: 'text/markdown',
          },
        ],
      }),
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function guessLanguage(filePath: string): string {
  if (filePath.endsWith('.tsx')) return 'tsx';
  if (filePath.endsWith('.ts')) return 'ts';
  if (filePath.endsWith('.json')) return 'json';
  if (filePath.endsWith('.js')) return 'js';
  return 'text';
}

function extractPageNames(
  codeFiles: { path: string; content: string }[],
): string[] {
  const pageNames = new Set<string>();
  for (const file of codeFiles) {
    const match = file.path.match(/src\/pages\/([^/]+)\/index\.tsx?$/);
    if (match) {
      pageNames.add(match[1]);
    }
  }
  return Array.from(pageNames);
}
