import { type Base } from '../../../common';

export interface KbCategory extends Base {
    workspaceId: string;
    title: string;
    description?: string;
    slug?: string;
    parentId?: string;
}

export type KbCategorie = KbCategory;
