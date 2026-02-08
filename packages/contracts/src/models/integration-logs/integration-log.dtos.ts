import type { IntegrationLog } from './schemas';

export type CreateIntegrationLogDto = Omit<IntegrationLog, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateIntegrationLogDto = Partial<CreateIntegrationLogDto> 
