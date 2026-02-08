import type { IntegrationAction } from './schemas';

export type CreateIntegrationActionDto = Omit<IntegrationAction, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateIntegrationActionDto = Partial<CreateIntegrationActionDto> 
