import type { KbCategorie } from './schemas';

export type CreateKbCategorieDto = Omit<KbCategorie, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateKbCategorieDto = Partial<CreateKbCategorieDto> 
