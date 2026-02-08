import type { TicketTask } from './schemas';

export type CreateTicketTaskDto = Omit<TicketTask, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTicketTaskDto = Partial<CreateTicketTaskDto>
