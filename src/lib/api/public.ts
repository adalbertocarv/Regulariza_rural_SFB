import { request } from './client';
import { News, Activity, Testimonial, RepositoryDocument, DashboardStat, Faq } from './types';

export const api = {
  // News
  getNews: (params?: { page?: number; limit?: number; category?: string }) => {
    const qs = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request<{ items: News[]; total: number; page: number; totalPages: number }>(
      `/news${qs ? `?${qs}` : ''}`
    );
  },
  getNewsById: (id: number) => request<News>(`/news/${id}`),

  // Activities
  getActivities: (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request<{ items: Activity[]; total: number; page: number; totalPages: number }>(
      `/activities${qs ? `?${qs}` : ''}`
    );
  },

  // Testimonials
  getTestimonials: () => request<Testimonial[]>('/testimonials'),

  // Documents
  getDocuments: () => request<RepositoryDocument[]>('/documents'),

  // Stats
  getStats: () => request<DashboardStat[]>('/stats'),

  // FAQs
  getFaqs: () => request<Faq[]>('/faqs'),
};
