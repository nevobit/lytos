import { type Base } from '../../../common';

export interface TicketCategory extends Base {
    workspaceId: string;
    name: string;
    description?: string;
    isDefault: boolean;
}