import type { TicketEvent } from './schemas';

export type CreateTicketEventDto = Omit<TicketEvent, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTicketEventDto = Partial<CreateTicketEventDto>
