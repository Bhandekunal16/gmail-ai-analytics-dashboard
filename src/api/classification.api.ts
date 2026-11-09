import { apiClient, isDemoModeEnabled } from './axios';
import { ClassificationSummaryResponse, CategoryMetric } from '../types/classification.types';
import { getMockClassificationSummary } from './mockData';

export const classificationApi = {
  async getClassificationSummary(
    date: string,
    accountId?: string
  ): Promise<ClassificationSummaryResponse> {
    if (isDemoModeEnabled()) {
      return getMockClassificationSummary(date, accountId);
    }

    try {
      const response = await apiClient.get(`/emails/classificationSummary/${date}`, {
        params: accountId ? { accountId } : undefined,
      });

      const raw = response.data?.data || response.data;

      // Normalize categories in case backend returns an object map instead of an array
      let normalizedCategories: CategoryMetric[] = [];
      if (Array.isArray(raw?.categories)) {
        normalizedCategories = raw.categories;
      } else if (raw?.categories && typeof raw.categories === 'object') {
        normalizedCategories = Object.entries(raw.categories).map(([catName, val]: [string, any]) => {
          const count = typeof val === 'number' ? val : val?.count || 0;
          const subcategories = Array.isArray(val?.subcategories)
            ? val.subcategories
            : val?.subcategories && typeof val.subcategories === 'object'
            ? Object.entries(val.subcategories).map(([subName, subCount]) => ({
                name: subName,
                count: Number(subCount) || 0,
              }))
            : [];
          return {
            category: catName,
            count,
            subcategories,
          };
        });
      }

      // Calculate percentages if missing
      const total = raw?.totalClassified ?? normalizedCategories.reduce((acc, c) => acc + c.count, 0);
      if (total > 0) {
        normalizedCategories = normalizedCategories.map((c) => ({
          ...c,
          percentage: c.percentage ?? Math.round((c.count / total) * 100),
          subcategories: c.subcategories.map((sub) => ({
            ...sub,
            percentage: sub.percentage ?? (c.count > 0 ? Math.round((sub.count / c.count) * 100) : 0),
          })),
        }));
      }

      return {
        date: raw?.date || date,
        accountId: raw?.accountId || accountId,
        totalClassified: total,
        categories: normalizedCategories,
        emailReferences: raw?.emailReferences || raw?.references || [],
        generatedAt: raw?.generatedAt,
      };
    } catch (err) {
      console.warn('Classification summary fetch failed, using fallback mock summary for', date, err);
      return getMockClassificationSummary(date, accountId);
    }
  },
};
