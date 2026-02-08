import type { CustomerNote } from './schemas';

export type CreateCustomerNoteDto = Omit<CustomerNote, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerNoteDto = Partial<CreateCustomerNoteDto>
