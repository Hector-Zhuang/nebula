import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { createMcpHandler } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { createRoutes } from './routes';
import { createMcpServer } from './mcp-server';
import type { ServerConfig } from './types';

const config: ServerConfig = {
  port: Number(process.env.PORT || 3100),
  projectsDir:
    process.env.PROJECTS_DIR || path.join(__dirname, '..', 'projects'),
  cloudBaseUrl: process.env.CLOUD_BASE_URL || 'http://localhost:3001/api',
};

// Ensure projects directory exists
fs.mkdirSync(config.projectsDir, { recursive: true });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes (REST, proxy to Nebula Cloud)
const routes = createRoutes(config);
app.use('/api', routes);

// MCP Streamable HTTP endpoint
const mcpServer = createMcpServer(config);
const mcpHandler = createMcpHandler(() => mcpServer, { legacy: 'stateless' });
const nodeHandler = toNodeHandler(mcpHandler);

app.all('/mcp', (req, res) => {
  void nodeHandler(req, res, req.body);
});

// Start server
app.listen(config.port, () => {
  console.log(`\n🚀 Coding Agent Server running on port ${config.port}`);
  console.log(`   Projects dir: ${config.projectsDir}`);
  console.log(`   Cloud API:    ${config.cloudBaseUrl}`);
  console.log(`   Health:       http://localhost:${config.port}/api/health`);
  console.log(`   MCP endpoint: http://localhost:${config.port}/mcp\n`);
});

export default app;
