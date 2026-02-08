import type { Visitor } from './schemas';

export type CreateVisitorDto = Omit<Visitor, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateVisitorDto = Partial<CreateVisitorDto>
