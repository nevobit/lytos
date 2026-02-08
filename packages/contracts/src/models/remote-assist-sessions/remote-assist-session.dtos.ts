import type { RemoteAssistSession } from './schemas';

export type CreateRemoteAssistSessionDto = Omit<RemoteAssistSession, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRemoteAssistSessionDto = Partial<CreateRemoteAssistSessionDto>
