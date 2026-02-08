import type { Attachment } from './schemas';

export type CreateAttachmentDto = Omit<Attachment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAttachmentDto = Partial<CreateAttachmentDto>
