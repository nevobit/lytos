import type { TicketCategory } from './schemas';

export type CreateTicketCategoryDto = Omit<TicketCategory, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateTicketCategoryDto = Partial<CreateTicketCategoryDto>;
