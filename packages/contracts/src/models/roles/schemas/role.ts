import { Scopes } from '@lytos/contracts';
import { type Base } from '../../../common';

export interface Role extends Base {
    workspaceId: string;
    name: string;
    description?: string;
    permissions: string[];
    scopes: Scopes;
    isSystem: boolean;
}
