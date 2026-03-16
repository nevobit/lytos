import type { KbRevision } from './schemas';

export type CreateKbRevisionDto = Omit<KbRevision, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateKbRevisionDto = Partial<CreateKbRevisionDto>;
