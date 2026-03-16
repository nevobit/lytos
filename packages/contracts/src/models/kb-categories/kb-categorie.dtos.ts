import type { KbCategory } from './schemas';

export type CreateKbCategoryDto = Omit<KbCategory, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateKbCategoryDto = Partial<CreateKbCategoryDto>;

export type CreateKbCategorieDto = CreateKbCategoryDto;
export type UpdateKbCategorieDto = UpdateKbCategoryDto;
