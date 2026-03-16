import { type Base } from '../../../common';

export const KbVisibility = {
    PUBLIC: 'public',
    INTERNAL: 'internal',
} as const;

export type KbVisibility = (typeof KbVisibility)[keyof typeof KbVisibility];

export interface KbArticleContent {
    text?: string;
    html?: string;
    json?: unknown;
}

export interface KbArticle extends Base {
    workspaceId: string;
    categoryId: string;
    title: string;
    slug?: string;
    visibility: KbVisibility;
    content: KbArticleContent;
    createdByMembershipId?: string;
}
