export interface SubcategoryMetric {
  name: string;
  count: number;
  percentage?: number;
  parentCategory?: string;
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
  emailId?: string;
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
  accountEmail?: string;
  totalClassified: number;
  categories: CategoryMetric[];
  allSubcategories?: SubcategoryMetric[];
  emailReferences: ClassifiedEmailReference[];
  generatedAt?: string;
}
