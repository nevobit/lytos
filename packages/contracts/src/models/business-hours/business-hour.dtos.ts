import type { BusinessHour } from './schemas';

export type CreateBusinessHourDto = Omit<BusinessHour, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBusinessHourDto = Partial<CreateBusinessHourDto>
