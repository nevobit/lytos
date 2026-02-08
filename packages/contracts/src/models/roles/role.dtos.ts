import type { Role } from './schemas';

export type CreateRoleDto = Omit<Role, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRoleDto = Partial<CreateRoleDto>
