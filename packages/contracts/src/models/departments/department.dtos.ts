import type { Department } from './schemas';

export type CreateDepartmentDto = Omit<Department, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDepartmentDto = Partial<CreateDepartmentDto>
