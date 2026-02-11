import { Base } from '../../../common';

interface Profile {
    displayName?: string;
    signature?: string;
    avatar?: string;
    locale?: string;
}

interface Preferences {
    notifications: {
        email: boolean;
        inApp: boolean;
    }
}

export interface Membership extends Base {
    workspaceId: string;
    userId: string;
    roleId: string;
    departmentIds: string[];
    primaryDepartmentId?: string;
    title: string;
    status: "invited" | "active" | "suspended";
    profile?: Profile;
    preferences?: Preferences;
    invitedBy?: string;
    invitedAt?: Date;
    joinedAt?: Date;
}
