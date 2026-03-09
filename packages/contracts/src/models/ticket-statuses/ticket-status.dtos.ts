import type { TicketStatus } from './schemas';

export type CreateTicketStatusDto = Omit<TicketStatus, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateTicketStatusDto = Partial<CreateTicketStatusDto>;
