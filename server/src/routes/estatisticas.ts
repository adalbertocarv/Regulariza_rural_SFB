import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/estatisticas — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.estatisticaDashboard.findMany({ orderBy: { nomeChave: 'asc' } });
  res.json(items);
});

// PUT /api/estatisticas/:nomeChave — protected
router.put('/:nomeChave', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.estatisticaDashboard.upsert({
    where: { nomeChave: req.params.nomeChave },
    update: req.body,
    create: { nomeChave: req.params.nomeChave, ...req.body },
  });
  res.json(item);
});

export default router;
