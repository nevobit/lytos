import type { Integration } from './schemas';

export type CreateIntegrationDto = Omit<Integration, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateIntegrationDto = Partial<CreateIntegrationDto>
