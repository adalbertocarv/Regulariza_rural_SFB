import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/faqs — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.faq.findMany({ orderBy: { orderNum: 'asc' } });
  res.json(items);
});

// POST /api/faqs — protected
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.faq.create({ data: req.body });
  res.status(201).json(item);
});

// PUT /api/faqs/:id — protected
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.faq.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(item);
});

// DELETE /api/faqs/:id — protected
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  await prisma.faq.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'FAQ removida com sucesso' });
});

export default router;
