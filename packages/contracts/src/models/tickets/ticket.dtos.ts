import type { Ticket } from './schemas';

export type CreateTicketDto = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTicketDto = Partial<CreateTicketDto>
