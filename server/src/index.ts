import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth';
import newsRoutes from './routes/news';
import activitiesRoutes from './routes/activities';
import testimonialsRoutes from './routes/testimonials';
import documentsRoutes from './routes/documents';
import statsRoutes from './routes/stats';
import faqsRoutes from './routes/faqs';
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
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/faqs', faqsRoutes);
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
