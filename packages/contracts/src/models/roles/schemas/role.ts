import { Base } from '../../../common';

interface Scopes {
    ticketsRead: "all" | "department" | "assigned"
    ticketsAssign: "all" | "department"
    customersRead?: "all" | "department" | "assigned"
}
export interface Role extends Base {
    workspaceId: string;
    name: string;
    description?: string;
    permissions: string[];
    scopes: Scopes;
    isSystem: boolean;
}
