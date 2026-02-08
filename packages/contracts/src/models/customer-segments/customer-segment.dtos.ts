import type { CustomerSegment } from './schemas';

export type CreateCustomerSegmentDto = Omit<CustomerSegment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerSegmentDto = Partial<CreateCustomerSegmentDto>
