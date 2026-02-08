import type { Invitation } from './schemas';

export type CreateInvitationDto = Omit<Invitation, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInvitationDto = Partial<CreateInvitationDto>
