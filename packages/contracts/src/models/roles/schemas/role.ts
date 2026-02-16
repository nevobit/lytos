import { type Base } from '../../../common';
import { type Scopes } from './scopes';

export interface Role extends Base {
    workspaceId: string;
    name: string;
    description?: string;
    permissions: string[];
    scopes: Scopes;
    isSystem: boolean;
}
