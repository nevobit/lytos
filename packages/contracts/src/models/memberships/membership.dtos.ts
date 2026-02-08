import type { Membership } from './schemas';

export type CreateMembershipDto = Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMembershipDto = Partial<CreateMembershipDto>
