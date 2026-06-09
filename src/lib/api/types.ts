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
