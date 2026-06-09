const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  return localStorage.getItem('rr_admin_token');
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro de rede' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ── Public API calls ────────────────────────────────────────────────────────────
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

// ── Admin API calls (require JWT) ───────────────────────────────────────────────
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: number; email: string; name: string | null } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
  getMe: () => request<{ id: number; email: string; name: string | null }>('/auth/me', { auth: true }),

  // News
  createNews: (data: Partial<News>) =>
    request<News>('/news', { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateNews: (id: number, data: Partial<News>) =>
    request<News>(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
  deleteNews: (id: number) =>
    request<{ message: string }>(`/news/${id}`, { method: 'DELETE', auth: true }),

  // Activities
  createActivity: (data: Partial<Activity>) =>
    request<Activity>('/activities', { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateActivity: (id: number, data: Partial<Activity>) =>
    request<Activity>(`/activities/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
  deleteActivity: (id: number) =>
    request<{ message: string }>(`/activities/${id}`, { method: 'DELETE', auth: true }),

  // Testimonials
  createTestimonial: (data: Partial<Testimonial>) =>
    request<Testimonial>('/testimonials', { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateTestimonial: (id: number, data: Partial<Testimonial>) =>
    request<Testimonial>(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
  deleteTestimonial: (id: number) =>
    request<{ message: string }>(`/testimonials/${id}`, { method: 'DELETE', auth: true }),

  // Documents
  createDocument: (data: Partial<RepositoryDocument>) =>
    request<RepositoryDocument>('/documents', { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateDocument: (id: number, data: Partial<RepositoryDocument>) =>
    request<RepositoryDocument>(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
  deleteDocument: (id: number) =>
    request<{ message: string }>(`/documents/${id}`, { method: 'DELETE', auth: true }),

  // Stats
  updateStat: (keyName: string, data: Partial<DashboardStat>) =>
    request<DashboardStat>(`/stats/${keyName}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),

  // FAQs
  createFaq: (data: Partial<Faq>) =>
    request<Faq>('/faqs', { method: 'POST', body: JSON.stringify(data), auth: true }),
  updateFaq: (id: number, data: Partial<Faq>) =>
    request<Faq>(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data), auth: true }),
  deleteFaq: (id: number) =>
    request<{ message: string }>(`/faqs/${id}`, { method: 'DELETE', auth: true }),

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

// ── Types ───────────────────────────────────────────────────────────────────────
export interface News {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  categoryColor?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Activity {
  id: number;
  title: string;
  description?: string;
  badges: string[];
  targetValue?: string;
  targetLabel?: string;
  objective?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Testimonial {
  id: number;
  quote?: string;
  name?: string;
  role?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface RepositoryDocument {
  id: number;
  title: string;
  description?: string;
  iconType?: string;
  fileSize?: string;
  docType?: string;
  fileUrl?: string;
  createdAt: string;
}

export interface DashboardStat {
  id: number;
  keyName: string;
  value?: string;
  unit?: string;
  colorClass?: string;
}

export interface Faq {
  id: number;
  question?: string;
  answer?: string;
  orderNum?: number;
}
