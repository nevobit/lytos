import type { TicketProperty } from './schemas';

export type CreateTicketPropertyDto = Omit<TicketProperty, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTicketPropertyDto = Partial<CreateTicketPropertyDto>
