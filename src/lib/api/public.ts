import { request } from './client';
import { Noticia, Atividade, Depoimento, DocumentoRepositorio, EstatisticaDashboard, PerguntaFrequente } from './types';

export const api = {
  // News
  getNews: (params?: { page?: number; limit?: number; category?: string }) => {
    const qs = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request<{ items: Noticia[]; total: number; page: number; totalPages: number }>(
      `/noticias${qs ? `?${qs}` : ''}`
    );
  },
  getNewsById: (id: number) => request<Noticia>(`/noticias/${id}`),

  // Activities
  getActivities: (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request<{ items: Atividade[]; total: number; page: number; totalPages: number }>(
      `/atividades${qs ? `?${qs}` : ''}`
    );
  },

  // Testimonials
  getTestimonials: () => request<Depoimento[]>('/depoimentos'),

  // Documents
  getDocuments: () => request<DocumentoRepositorio[]>('/documentos'),

  // Stats
  getStats: () => request<EstatisticaDashboard[]>('/estatisticas'),

  // FAQs
  getFaqs: () => request<PerguntaFrequente[]>('/perguntas'),
};
