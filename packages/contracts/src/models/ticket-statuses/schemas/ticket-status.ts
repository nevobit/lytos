import { type Base } from '../../../common';

export interface TicketStatus extends Base {
    workspaceId: string;
    name: string;
    description?: string;
    isDefault: boolean;
}
