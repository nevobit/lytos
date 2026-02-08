import type { Tenant } from './schemas';

export type CreateTenantDto = Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTenantDto = Partial<CreateTenantDto> 
