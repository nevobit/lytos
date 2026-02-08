import type { Call } from './schemas';

export type CreateCallDto = Omit<Call, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCallDto = Partial<CreateCallDto> 
