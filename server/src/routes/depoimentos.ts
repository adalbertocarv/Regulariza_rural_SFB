import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/depoimentos — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.depoimento.findMany({ orderBy: { criadoEm: 'desc' } });
  res.json(items);
});

// POST /api/depoimentos — protected
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.depoimento.create({ data: req.body });
  res.status(201).json(item);
});

// PUT /api/depoimentos/:id — protected
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.depoimento.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(item);
});

// DELETE /api/depoimentos/:id — protected
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  await prisma.depoimento.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Depoimento removido com sucesso' });
});

export default router;
