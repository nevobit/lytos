import type { AuditLog } from './schemas';

export type CreateAuditLogDto = Omit<AuditLog, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAuditLogDto = Partial<CreateAuditLogDto>
