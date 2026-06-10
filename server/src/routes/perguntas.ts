import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/perguntas — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.perguntaFrequente.findMany({ orderBy: { ordem: 'asc' } });
  res.json(items);
});

// POST /api/perguntas — protected
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.perguntaFrequente.create({ data: req.body });
  res.status(201).json(item);
});

// PUT /api/perguntas/:id — protected
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.perguntaFrequente.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(item);
});

// DELETE /api/perguntas/:id — protected
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  await prisma.perguntaFrequente.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'FAQ removida com sucesso' });
});

export default router;
