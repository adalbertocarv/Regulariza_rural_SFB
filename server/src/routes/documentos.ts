import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/documentos — public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.documentoRepositorio.findMany({ orderBy: { criadoEm: 'desc' } });
  res.json(items);
});

// POST /api/documentos — protected
router.post(
  '/',
  requireAuth,
  [body('titulo').notEmpty().withMessage('Título obrigatório')],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }
    const item = await prisma.documentoRepositorio.create({ data: req.body });
    res.status(201).json(item);
  }
);

// PUT /api/documentos/:id — protected
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.documentoRepositorio.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(item);
});

// DELETE /api/documentos/:id — protected
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  await prisma.documentoRepositorio.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Documento removido com sucesso' });
});

export default router;
