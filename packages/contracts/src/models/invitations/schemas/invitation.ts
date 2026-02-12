import { type Base } from '../../../common';

export interface Invitation extends Base {
    workspaceId: string;
    email: string;
    roleId: string;
    departmentsIds?: string[];
    tokenHash: string;
    status: 'pending' | "accepted" | "expired" | "revoked";
    invitedByMembershipId: string;
    expiresAt: Date;
}
