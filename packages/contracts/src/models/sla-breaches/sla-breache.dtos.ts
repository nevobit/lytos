import type { SlaBreache } from './schemas';

export type CreateSlaBreacheDto = Omit<SlaBreache, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSlaBreacheDto = Partial<CreateSlaBreacheDto>
