import type { SlaPolicie } from './schemas';

export type CreateSlaPolicieDto = Omit<SlaPolicie, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSlaPolicieDto = Partial<CreateSlaPolicieDto>
