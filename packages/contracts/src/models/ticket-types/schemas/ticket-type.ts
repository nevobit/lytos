import { type Base } from '../../../common';

export interface TicketType extends Base {
    workspaceId: string;
    name: string;
    description?: string;
    isDefault: boolean;
}
