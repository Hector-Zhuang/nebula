import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { createRoutes } from './routes';
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

// API routes
const routes = createRoutes(config);
app.use('/api', routes);

// Start server
app.listen(config.port, () => {
  console.log(`\n🚀 Coding Agent Server running on port ${config.port}`);
  console.log(`   Projects dir: ${config.projectsDir}`);
  console.log(`   Cloud API:    ${config.cloudBaseUrl}`);
  console.log(`   Health:       http://localhost:${config.port}/api/health\n`);
});

export default app;
