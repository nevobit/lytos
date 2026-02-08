import type { KbArticle } from './schemas';

export type CreateKbArticleDto = Omit<KbArticle, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateKbArticleDto = Partial<CreateKbArticleDto>
