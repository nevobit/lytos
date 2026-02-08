import type { Conversation } from './schemas';

export type CreateConversationDto = Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateConversationDto = Partial<CreateConversationDto> 
