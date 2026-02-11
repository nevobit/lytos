import type { Customer } from './schemas';

export type CreateCustomerDto = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateCustomerDto = Partial<CreateCustomerDto>
