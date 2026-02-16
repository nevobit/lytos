import { type User } from '../users';
import type { Department } from './schemas';

export type CreateDepartmentDto = Omit<Department, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDepartmentDto = Partial<CreateDepartmentDto>

export interface DepartmentDto extends Department {
    responsible?: User
}
