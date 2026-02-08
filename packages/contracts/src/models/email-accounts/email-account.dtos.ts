import type { EmailAccount } from './schemas';

export type CreateEmailAccountDto = Omit<EmailAccount, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmailAccountDto = Partial<CreateEmailAccountDto> 
