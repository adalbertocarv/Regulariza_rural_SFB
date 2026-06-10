import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/atividades — public, paginated
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.atividade.findMany({ skip, take: limit, orderBy: { criadoEm: 'desc' } }),
    prisma.atividade.count(),
  ]);

  res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
});

// GET /api/atividades/:id — public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.atividade.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) { res.status(404).json({ error: 'Atividade não encontrada' }); return; }
  res.json(item);
});

// POST /api/atividades — protected
router.post(
  '/',
  requireAuth,
  [body('titulo').notEmpty().withMessage('Título obrigatório')],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }
    const item = await prisma.atividade.create({ data: req.body });
    res.status(201).json(item);
  }
);

// PUT /api/atividades/:id — protected
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.atividade.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(item);
});

// DELETE /api/atividades/:id — protected
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  await prisma.atividade.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Atividade removida com sucesso' });
});

export default router;
