import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/activities — public, paginated
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.activity.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.activity.count(),
  ]);

  res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
});

// GET /api/activities/:id — public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.activity.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) { res.status(404).json({ error: 'Atividade não encontrada' }); return; }
  res.json(item);
});

// POST /api/activities — protected
router.post(
  '/',
  requireAuth,
  [body('title').notEmpty().withMessage('Título obrigatório')],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }
    const item = await prisma.activity.create({ data: req.body });
    res.status(201).json(item);
  }
);

// PUT /api/activities/:id — protected
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.activity.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(item);
});

// DELETE /api/activities/:id — protected
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  await prisma.activity.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Atividade removida com sucesso' });
});

export default router;
