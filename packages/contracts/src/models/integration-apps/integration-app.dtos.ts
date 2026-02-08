import type { IntegrationApp } from './schemas';

export type CreateIntegrationAppDto = Omit<IntegrationApp, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateIntegrationAppDto = Partial<CreateIntegrationAppDto>
