import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/documents — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.repositoryDocument.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(items);
});

// POST /api/documents — protected
router.post(
  '/',
  requireAuth,
  [body('title').notEmpty().withMessage('Título obrigatório')],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }
    const item = await prisma.repositoryDocument.create({ data: req.body });
    res.status(201).json(item);
  }
);

// PUT /api/documents/:id — protected
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.repositoryDocument.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(item);
});

// DELETE /api/documents/:id — protected
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  await prisma.repositoryDocument.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Documento removido com sucesso' });
});

export default router;
