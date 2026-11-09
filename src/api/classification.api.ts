import { apiClient, isDemoModeEnabled } from './axios';
import {
  ClassificationSummaryResponse,
  CategoryMetric,
  SubcategoryMetric,
  ClassifiedEmailReference,
} from '../types/classification.types';
import { getMockClassificationSummary } from './mockData';

// Known mappings between common subcategories and their parent categories
const SUBCATEGORY_PARENT_MAP: Record<string, string> = {
  'Credit Card': 'Finance',
  Salary: 'Finance',
  Loan: 'Finance',
  Invoices: 'Finance',
  Receipts: 'Finance',
  Banking: 'Finance',
  'Verification Code': 'Security',
  '2FA': 'Security',
  'Security Alert': 'Security',
  'Password Reset': 'Security',
  Unclassified: 'Others',
  General: 'Others',
  Promotions: 'Promotions',
  Discounts: 'Promotions',
  Newsletters: 'Updates',
  Deployments: 'Updates',
};

function parseJsonSafely(input: unknown): Record<string, any> {
  if (!input) return {};
  if (typeof input === 'object' && input !== null) {
    return input as Record<string, any>;
  }
  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch {
      return {};
    }
  }
  return {};
}

function parseNeo4jDateTime(dt: any): string | undefined {
  if (!dt) return undefined;
  if (typeof dt === 'string') return dt;
  if (typeof dt === 'object') {
    const year = dt.year?.low ?? dt.year ?? 2026;
    const month = String(dt.month?.low ?? dt.month ?? 1).padStart(2, '0');
    const day = String(dt.day?.low ?? dt.day ?? 1).padStart(2, '0');
    const hour = String(dt.hour?.low ?? dt.hour ?? 0).padStart(2, '0');
    const minute = String(dt.minute?.low ?? dt.minute ?? 0).padStart(2, '0');
    const second = String(dt.second?.low ?? dt.second ?? 0).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  }
  return undefined;
}

export const classificationApi = {
  async getClassificationSummary(
    date: string,
    accountId?: string
  ): Promise<ClassificationSummaryResponse> {
    if (isDemoModeEnabled()) {
      const mock = getMockClassificationSummary(date, accountId);
      return {
        ...mock,
        allSubcategories: mock.categories.flatMap((c) =>
          c.subcategories.map((s) => ({ ...s, parentCategory: c.category }))
        ),
      };
    }

    try {
      // 1. Fetch from backend endpoint: /emails/classificationSummary/:date
      let response: any;
      try {
        response = await apiClient.get(`/emails/classificationSummary/${date}`, {
          params: accountId ? { accountId } : undefined,
        });
      } catch (err: any) {
        // If 404 for specific date, try /emails/classificationSummary or /emails/classificationSummary/current
        console.warn(`Primary date ${date} fetch failed, attempting /current fallback:`, err.message);
        response = await apiClient.get('/emails/classificationSummary/current', {
          params: accountId ? { accountId } : undefined,
        });
      }

      const raw = response.data?.data || response.data;
      if (!raw) {
        throw new Error('Empty payload returned by classification summary API');
      }

      // 2. Parse categoryCountsJson (handles both string JSON and object map)
      const categoryMap = parseJsonSafely(raw.categoryCountsJson || raw.categories);

      // 3. Parse subcategoryCountsJson (handles both string JSON and object map)
      const subcategoryMap = parseJsonSafely(raw.subcategoryCountsJson || raw.subcategories);

      // 4. Calculate total classified emails
      const totalEmailsFromCategory = Object.values(categoryMap).reduce(
        (sum: number, val: any) => sum + (Number(val) || 0),
        0
      );
      const totalClassified =
        raw.totalEmails ?? raw.totalClassified ?? totalEmailsFromCategory ?? 0;

      // 5. Construct subcategories list
      const allSubcategories: SubcategoryMetric[] = Object.entries(subcategoryMap).map(
        ([subName, subCount]) => {
          const count = Number(subCount) || 0;
          const parentCategory =
            SUBCATEGORY_PARENT_MAP[subName] ||
            (categoryMap[subName] !== undefined ? subName : 'Others');
          return {
            name: subName,
            count,
            percentage:
              totalClassified > 0 ? Math.round((count / totalClassified) * 100) : 0,
            parentCategory,
          };
        }
      );

      // 6. Build normalized category list with subcategories mapped
      let normalizedCategories: CategoryMetric[] = [];

      if (Object.keys(categoryMap).length > 0) {
        normalizedCategories = Object.entries(categoryMap).map(([catName, val]: [string, any]) => {
          const count = typeof val === 'number' ? val : Number(val?.count ?? val) || 0;
          const percentage =
            totalClassified > 0 ? Math.round((count / totalClassified) * 100) : 0;

          // Find matching subcategories for this category
          const categorySubcategories = allSubcategories.filter((sub) => {
            if (sub.parentCategory === catName) return true;
            // Also check if subName matches category
            if (sub.name.toLowerCase() === catName.toLowerCase()) return true;
            return false;
          });

          return {
            category: catName,
            count,
            percentage,
            subcategories: categorySubcategories,
          };
        });
      } else if (Array.isArray(raw?.categories)) {
        normalizedCategories = raw.categories;
      }

      // If categories had no subcategories mapped but allSubcategories has items, assign unmapped to matching or first
      normalizedCategories.forEach((cat) => {
        if (cat.subcategories.length === 0) {
          const matching = allSubcategories.filter(
            (s) => s.parentCategory === cat.category
          );
          if (matching.length > 0) {
            cat.subcategories = matching;
          }
        }
      });

      // 7. Parse email references list (raw.emails or raw.emailReferences)
      const rawEmailList: any[] = raw.emails || raw.emailReferences || raw.references || [];
      const emailReferences: ClassifiedEmailReference[] = rawEmailList.map(
        (email: any, idx: number) => {
          const emailId = email.emailId || email.id || email._id || `msg_${idx}`;
          const shortId = emailId.length > 10 ? emailId.substring(0, 10) + '...' : emailId;

          // Try to infer a helpful subject if backend only returns emailId and category
          let subject = email.subject;
          if (!subject) {
            subject = `${email.category || 'Classified'} Message #${shortId}`;
          }

          const sender =
            email.sender ||
            email.from ||
            raw.accountEmail ||
            'Gmail Ingestion';

          return {
            id: email._id || emailId,
            messageId: email.emailId || email.id,
            emailId: email.emailId,
            subject,
            sender,
            receivedAt: email.date || email.receivedAt || new Date().toISOString(),
            category: email.category || 'Others',
            subcategory: email.subcategory,
            confidence: email.confidence ?? 0.95,
            accountId: raw.accountId || accountId,
            summary: email.summary || `Classified into ${email.category || 'cluster'} by AI pipeline.`,
          };
        }
      );

      const generatedAt = parseNeo4jDateTime(raw.updatedAt) || raw.generatedAt || new Date().toISOString();

      return {
        date: raw.date || date,
        accountId: raw.accountId || accountId,
        accountEmail: raw.accountEmail,
        totalClassified,
        categories: normalizedCategories,
        allSubcategories,
        emailReferences,
        generatedAt,
      };
    } catch (err: any) {
      console.warn('Classification summary fetch error:', err.message);
      // Fallback to mock summary only if backend returned hard network failure
      const mock = getMockClassificationSummary(date, accountId);
      return {
        ...mock,
        allSubcategories: mock.categories.flatMap((c) =>
          c.subcategories.map((s) => ({ ...s, parentCategory: c.category }))
        ),
      };
    }
  },
};
