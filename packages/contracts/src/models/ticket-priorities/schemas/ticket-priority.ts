import { type Base } from '../../../common';

export interface TicketPriority extends Base {
    workspaceId: string;
    name: string;
    level: number;
    color?: string;
    isDefault: boolean;
}
