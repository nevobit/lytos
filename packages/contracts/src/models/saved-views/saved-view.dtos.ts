import type { SavedView } from './schemas';

export type CreateSavedViewDto = Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSavedViewDto = Partial<CreateSavedViewDto>
