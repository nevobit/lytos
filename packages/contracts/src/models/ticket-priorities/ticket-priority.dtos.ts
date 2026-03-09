import type { TicketPriority } from './schemas';

export type CreateTicketPripertyDto = Omit<TicketPriority, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateTicketPripertyDto = Partial<CreateTicketPripertyDto>
