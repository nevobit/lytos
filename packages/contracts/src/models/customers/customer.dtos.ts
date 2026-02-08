import type { Customer } from './schemas';

export type CreateCustomerDto = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerDto = Partial<CreateCustomerDto>
