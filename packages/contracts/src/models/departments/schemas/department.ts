import { type Base } from '../../../common';

export interface Department extends Base {
    workspaceId: string;
    name: string;
    slug: string;
    description: string;
    isDefault: boolean;
    leadMembershipIds: string[];
    primaryLeadMembershipId?: string;
}
