import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const includeRelations = {
  imagens: { orderBy: { ordem: 'asc' as const } },
  pontos:  { orderBy: { ordem: 'asc' as const } },
};

// ── GET /api/atividades — public, paginated with filters ──────────────────────
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page  = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 100;
  const skip  = (page - 1) * limit;

  const componenteId = req.query.componenteId ? Number(req.query.componenteId) : undefined;
  const demandante   = req.query.demandante   as string | undefined;
  const tipoAcao     = req.query.tipoAcao     as string | undefined;
  const estado       = req.query.estado       as string | undefined;
  // Admin pode passar ?status=rascunho; público sempre vê apenas publicado
  const statusParam = req.query.status as string | undefined;
  const status      = statusParam ?? 'publicado';

  const where: Record<string, any> = { status };
  if (componenteId) where.componenteId = componenteId;
  if (demandante)   where.demandante   = demandante;
  if (tipoAcao)     where.tipoAcao     = tipoAcao;
  if (estado)       where.estados      = { has: estado };

  const [items, total] = await Promise.all([
    prisma.atividade.findMany({ where, skip, take: limit, orderBy: { criadoEm: 'desc' }, include: includeRelations }),
    prisma.atividade.count({ where }),
  ]);

  res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
});

// ── GET /api/atividades/todos — admin, retorna published + rascunhos ──────────
router.get('/todos', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const page  = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 100;
  const skip  = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.atividade.findMany({ skip, take: limit, orderBy: { criadoEm: 'desc' }, include: includeRelations }),
    prisma.atividade.count(),
  ]);

  res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
});

// ── GET /api/atividades/:id — public ─────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.atividade.findUnique({
    where: { id: Number(req.params.id) },
    include: includeRelations,
  });
  if (!item) { res.status(404).json({ error: 'Atividade não encontrada' }); return; }
  res.json(item);
});

// ── POST /api/atividades — protected ─────────────────────────────────────────
router.post(
  '/',
  requireAuth,
  [body('titulo').notEmpty().withMessage('Título obrigatório')],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { id: _, imagens, pontos, ...campos } = req.body;

    const item = await prisma.$transaction(async (tx) => {
      const criado = await tx.atividade.create({ data: campos });

      if (Array.isArray(imagens) && imagens.length > 0) {
        await tx.atividadeImagem.createMany({
          data: imagens.map((img: { url: string; ordem?: number; legenda?: string }, i: number) => ({
            atividadeId: criado.id,
            url:    img.url,
            ordem:  img.ordem ?? i,
            legenda: img.legenda ?? null,
          })),
        });
      }

      if (Array.isArray(pontos) && pontos.length > 0) {
        await tx.atividadePonto.createMany({
          data: pontos.map((p: { lat: number; lng: number; rotulo?: string; ordem?: number }, i: number) => ({
            atividadeId: criado.id,
            lat:    p.lat,
            lng:    p.lng,
            rotulo: p.rotulo ?? null,
            ordem:  p.ordem ?? i,
          })),
        });
      }

      return tx.atividade.findUnique({ where: { id: criado.id }, include: includeRelations });
    });

    res.status(201).json(item);
  }
);

// ── PUT /api/atividades/:id — protected ──────────────────────────────────────
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { id: _, imagens, pontos, ...campos } = req.body;

  const item = await prisma.$transaction(async (tx) => {
    await tx.atividade.update({ where: { id }, data: campos });

    if (Array.isArray(imagens)) {
      await tx.atividadeImagem.deleteMany({ where: { atividadeId: id } });
      if (imagens.length > 0) {
        await tx.atividadeImagem.createMany({
          data: imagens.map((img: { url: string; ordem?: number; legenda?: string }, i: number) => ({
            atividadeId: id,
            url:    img.url,
            ordem:  img.ordem ?? i,
            legenda: img.legenda ?? null,
          })),
        });
      }
    }

    if (Array.isArray(pontos)) {
      await tx.atividadePonto.deleteMany({ where: { atividadeId: id } });
      if (pontos.length > 0) {
        await tx.atividadePonto.createMany({
          data: pontos.map((p: { lat: number; lng: number; rotulo?: string; ordem?: number }, i: number) => ({
            atividadeId: id,
            lat:    p.lat,
            lng:    p.lng,
            rotulo: p.rotulo ?? null,
            ordem:  p.ordem ?? i,
          })),
        });
      }
    }

    return tx.atividade.findUnique({ where: { id }, include: includeRelations });
  });

  res.json(item);
});

// ── DELETE /api/atividades/:id — protected ────────────────────────────────────
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  await prisma.atividade.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Atividade removida com sucesso' });
});

export default router;
