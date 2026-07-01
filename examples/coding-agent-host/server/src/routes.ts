import { Router, Request, Response } from 'express';
import type { Project, ServerConfig } from './types';
import { createProject, getProjectDir } from './project-manager';
import { buildProject } from './builder';
import { Deployer } from './deployer';

// In-memory project store (for MVP; could be replaced with DB)
const projects = new Map<string, Project>();

export function createRoutes(config: ServerConfig): Router {
  const router = Router();
  const deployer = new Deployer(config.cloudBaseUrl);

  // --- Auth: proxy to Nebula Cloud ---

  router.post('/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'email and password are required' });
        return;
      }
      const result = await deployer.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  router.post('/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, displayName, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'email and password are required' });
        return;
      }
      const result = await deployer.register(
        email,
        displayName || email.split('@')[0],
        password,
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // --- Projects ---

  router.post('/projects', async (req: Request, res: Response) => {
    try {
      const token = extractToken(req);
      if (!token) {
        res.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const { spec, codeFiles } = req.body;
      if (!spec || !codeFiles || codeFiles.length === 0) {
        res.status(400).json({ error: 'spec and codeFiles are required' });
        return;
      }

      const project = createProject(config.projectsDir, spec, codeFiles, token);
      projects.set(project.id, project);

      console.log(`[routes] Project created: ${project.id} (${spec.appId})`);
      res.json({ projectId: project.id, status: project.status });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/projects/:id/build', async (req: Request, res: Response) => {
    try {
      const token = extractToken(req);
      if (!token) {
        res.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const project = projects.get(req.params.id);
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      project.status = 'building';
      project.updatedAt = Date.now();

      // Start build asynchronously
      const projectDir = getProjectDir(config.projectsDir, project.id);

      // Respond immediately, build runs in background
      res.json({ buildId: project.id, status: 'building' });

      // Run build in background
      buildProject(projectDir)
        .then(artifacts => {
          project.artifacts = artifacts;
          project.status = 'built';
          project.updatedAt = Date.now();
          console.log(`[routes] Build complete: ${project.id}`);
        })
        .catch(error => {
          project.status = 'build_failed';
          project.buildError = error.message;
          project.updatedAt = Date.now();
          console.error(`[routes] Build failed: ${project.id}`, error.message);
        });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/projects/:id/status', (req: Request, res: Response) => {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({ error: 'Authorization token required' });
      return;
    }

    const project = projects.get(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const response: {
      status: string;
      error?: string;
      artifacts?: {
        iosBundlePath: string;
        androidBundlePath: string;
        manifestPath: string;
      };
    } = { status: project.status };

    if (project.buildError) {
      response.error = project.buildError;
    }

    if (project.artifacts) {
      response.artifacts = {
        iosBundlePath: project.artifacts.iosBundlePath,
        androidBundlePath: project.artifacts.androidBundlePath,
        manifestPath: project.artifacts.manifestPath,
      };
    }

    res.json(response);
  });

  router.post('/projects/:id/deploy', async (req: Request, res: Response) => {
    try {
      const token = extractToken(req);
      if (!token) {
        res.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const project = projects.get(req.params.id);
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      if (project.status !== 'built' || !project.artifacts) {
        res.status(400).json({
          error: `Cannot deploy: project status is "${project.status}". Build must complete first.`,
        });
        return;
      }

      project.status = 'deploying';
      project.updatedAt = Date.now();

      const result = await deployer.deploy(
        token,
        project.spec,
        project.artifacts,
      );

      project.deployResult = result;
      project.status = 'deployed';
      project.updatedAt = Date.now();

      console.log(
        `[routes] Deployed: ${project.id} → ${result.miniAppId}@${result.version}`,
      );

      res.json({
        success: true,
        miniAppId: result.miniAppId,
        versionId: result.versionId,
        version: result.version,
        status: 'deployed',
      });
    } catch (error: any) {
      const project = projects.get(req.params.id);
      if (project) {
        project.status = 'deploy_failed';
        project.deployError = error.message;
        project.updatedAt = Date.now();
      }
      res.status(500).json({ error: error.message });
    }
  });

  // --- MiniApps ---

  router.get('/miniapps', async (req: Request, res: Response) => {
    try {
      const token = extractToken(req);
      if (!token) {
        res.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const miniApps = await deployer.listMiniApps(token);
      res.json(miniApps);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  return null;
}
