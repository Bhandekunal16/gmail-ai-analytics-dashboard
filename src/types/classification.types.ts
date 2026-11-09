export interface SubcategoryMetric {
  name: string;
  count: number;
  percentage?: number;
}

export interface CategoryMetric {
  category: string;
  count: number;
  percentage?: number;
  subcategories: SubcategoryMetric[];
}

export interface ClassifiedEmailReference {
  id: string;
  messageId?: string;
  subject: string;
  sender: string;
  receivedAt: string;
  category: string;
  subcategory?: string;
  confidence?: number;
  accountId?: string;
  summary?: string;
}

export interface ClassificationSummaryResponse {
  date: string; // YYYY-MM-DD
  accountId?: string;
  totalClassified: number;
  categories: CategoryMetric[];
  emailReferences: ClassifiedEmailReference[];
  generatedAt?: string;
}
