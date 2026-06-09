import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/testimonials — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(items);
});

// POST /api/testimonials — protected
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.testimonial.create({ data: req.body });
  res.status(201).json(item);
});

// PUT /api/testimonials/:id — protected
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.testimonial.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(item);
});

// DELETE /api/testimonials/:id — protected
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  await prisma.testimonial.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Depoimento removido com sucesso' });
});

export default router;
