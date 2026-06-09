import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/stats — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.dashboardStat.findMany({ orderBy: { keyName: 'asc' } });
  res.json(items);
});

// PUT /api/stats/:keyName — protected
router.put('/:keyName', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.dashboardStat.upsert({
    where: { keyName: req.params.keyName },
    update: req.body,
    create: { keyName: req.params.keyName, ...req.body },
  });
  res.json(item);
});

export default router;
