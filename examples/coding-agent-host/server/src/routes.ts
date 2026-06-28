import { Router, Request, Response } from 'express';
import type { ServerConfig } from './types';
import { Deployer } from './deployer';

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

  return router;
}
