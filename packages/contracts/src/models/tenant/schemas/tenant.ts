import { type Base } from '../../../common';

type TenantMode = 'host' | 'path';

export interface Tenant extends Base {
    workspaceId: string;
    slug: string;
    mode: TenantMode;
}
