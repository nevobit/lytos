import type { KbArticle } from './schemas';

export type CreateKbArticleDto = Omit<KbArticle, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateKbArticleDto = Partial<CreateKbArticleDto>;
