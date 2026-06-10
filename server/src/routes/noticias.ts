import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/noticias — public, paginated, with optional category filter
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9;
  const category = req.query.category as string | undefined;

  const where = category ? { categoria: category } : {};
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.noticia.findMany({ where, skip, take: limit, orderBy: { criadoEm: 'desc' } }),
    prisma.noticia.count({ where }),
  ]);

  res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
});

// GET /api/noticias/:id — public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.noticia.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) { res.status(404).json({ error: 'Notícia não encontrada' }); return; }
  res.json(item);
});

// POST /api/noticias — protected
router.post(
  '/',
  requireAuth,
  [body('titulo').notEmpty().withMessage('Título obrigatório')],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const item = await prisma.noticia.create({ data: req.body });
    res.status(201).json(item);
  }
);

// PUT /api/noticias/:id — protected
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.noticia.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(item);
});

// DELETE /api/noticias/:id — protected
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  await prisma.noticia.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Notícia removida com sucesso' });
});

export default router;
