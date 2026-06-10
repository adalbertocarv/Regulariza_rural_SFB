import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/autenticacao';
import newsRoutes from './routes/noticias';
import activitiesRoutes from './routes/atividades';
import testimonialsRoutes from './routes/depoimentos';
import documentsRoutes from './routes/documentos';
import statsRoutes from './routes/estatisticas';
import faqsRoutes from './routes/perguntas';
import uploadRoutes from './routes/upload';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/autenticacao', authRoutes);
app.use('/api/noticias', newsRoutes);
app.use('/api/atividades', activitiesRoutes);
app.use('/api/depoimentos', testimonialsRoutes);
app.use('/api/documentos', documentsRoutes);
app.use('/api/estatisticas', statsRoutes);
app.use('/api/perguntas', faqsRoutes);
app.use('/api/upload', uploadRoutes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ── Error Handler ──────────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Erro interno:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📁 Uploads em http://localhost:${PORT}/uploads`);
});

export default app;
