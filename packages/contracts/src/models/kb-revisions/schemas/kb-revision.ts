import { type Base } from '../../../common';
import type { KbArticleContent, KbVisibility } from '../../kb-articles';

export interface KbRevision extends Base {
    workspaceId: string;
    articleId: string;
    categoryId: string;
    version: number;
    title: string;
    slug?: string;
    visibility: KbVisibility;
    content: KbArticleContent;
    createdByMembershipId?: string;
}
