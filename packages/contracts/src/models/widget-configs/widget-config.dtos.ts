import type { WidgetConfig } from './schemas';

export type CreateWidgetConfigDto = Omit<WidgetConfig, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWidgetConfigDto = Partial<CreateWidgetConfigDto>
