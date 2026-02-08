import type { TicketLink } from './schemas';

export type CreateTicketLinkDto = Omit<TicketLink, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTicketLinkDto = Partial<CreateTicketLinkDto> 
