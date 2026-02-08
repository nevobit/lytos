import type { AnalyticsDaily } from './schemas';

export type CreateAnalyticsDailyDto = Omit<AnalyticsDaily, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAnalyticsDailyDto = Partial<CreateAnalyticsDailyDto> 
