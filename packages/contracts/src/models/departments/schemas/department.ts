import { type Base } from '../../../common';
import type { User } from '../../users';

export interface Department extends Base {
    workspaceId: string;
    name: string;
    slug: string;
    description: string;
    isDefault: boolean;
    leadMembershipIds: string[];
    primaryLeadMembershipId?: User | string;
}
