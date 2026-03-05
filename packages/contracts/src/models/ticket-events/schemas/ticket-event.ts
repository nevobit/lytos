import { type Base } from '../../../common';

export interface TicketEvent extends Base {
    workspaceId: string;
    ticketId: string;
    type: string;
    title: string;
    actorMembershipId?: string;
    actorCustomerId?: string;
    visibility?: "public" | "internal";
    metadata?: Record<string, unknown>;
}
