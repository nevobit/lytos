import type { Message } from './schemas';

export type CreateMessageDto = Omit<Message, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMessageDto = Partial<CreateMessageDto>
