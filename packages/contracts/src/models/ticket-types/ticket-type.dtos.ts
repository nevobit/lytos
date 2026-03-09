import type { TicketType } from './schemas';

export type CreateTicketTypeDto = Omit<TicketType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateTicketTypeDto = Partial<CreateTicketTypeDto>;
