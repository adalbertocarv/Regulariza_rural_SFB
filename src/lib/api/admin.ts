import { request, API_BASE_URL, getToken } from './client';
import { Noticia, Atividade, Depoimento, DocumentoRepositorio, EstatisticaDashboard, PerguntaFrequente } from './types';

export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: number; email: string; nome: string | null } }>(
      '/autenticacao/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
  getMe: () => request<{ id: number; email: string; nome: string | null }>('/autenticacao/me', { auth: true }),

  // News
  createNews: (data: Partial<Noticia>) =>
    request<Noticia>('/noticias', { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateNews: (id: number, data: Partial<Noticia>) =>
    request<Noticia>(`/noticias/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
  deleteNews: (id: number) =>
    request<{ message: string }>(`/noticias/${id}`, { method: 'DELETE', auth: true }),

  // Activities
  createActivity: (data: Partial<Atividade>) =>
    request<Atividade>('/atividades', { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateActivity: (id: number, data: Partial<Atividade>) =>
    request<Atividade>(`/atividades/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
  deleteActivity: (id: number) =>
    request<{ message: string }>(`/atividades/${id}`, { method: 'DELETE', auth: true }),

  // Testimonials
  createTestimonial: (data: Partial<Depoimento>) =>
    request<Depoimento>('/depoimentos', { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateTestimonial: (id: number, data: Partial<Depoimento>) =>
    request<Depoimento>(`/depoimentos/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
  deleteTestimonial: (id: number) =>
    request<{ message: string }>(`/depoimentos/${id}`, { method: 'DELETE', auth: true }),

  // Documents
  createDocument: (data: Partial<DocumentoRepositorio>) =>
    request<DocumentoRepositorio>('/documentos', { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateDocument: (id: number, data: Partial<DocumentoRepositorio>) =>
    request<DocumentoRepositorio>(`/documentos/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
  deleteDocument: (id: number) =>
    request<{ message: string }>(`/documentos/${id}`, { method: 'DELETE', auth: true }),

  // Stats
  updateStat: (nomeChave: string, data: Partial<EstatisticaDashboard>) =>
    request<EstatisticaDashboard>(`/estatisticas/${nomeChave}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),

  // FAQs
  createFaq: (data: Partial<PerguntaFrequente>) =>
    request<PerguntaFrequente>('/perguntas', { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateFaq: (id: number, data: Partial<PerguntaFrequente>) =>
    request<PerguntaFrequente>(`/perguntas/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
  deleteFaq: (id: number) =>
    request<{ message: string }>(`/perguntas/${id}`, { method: 'DELETE', auth: true }),

  // Upload
  uploadFile: (file: File, onProgress?: (pct: number) => void): Promise<{ url: string; filename: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload falhou: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Erro de rede no upload'));
      xhr.open('POST', `${API_BASE_URL}/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
      xhr.send(formData);
    });
  },
};
