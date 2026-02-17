import { type Base } from '../../../common';

export type MessageKind = "message" | "note" | "system";
export type MessageDirection = "inbound" | "outbound" | "internal";

export interface Message extends Base {
    workspaceId: string;
    ticketId: string;
    conversationId: string;
    direction: MessageDirection;
    kind: MessageKind;

    body: {
        text?: string;
        html?: string;
    };

    authorMembershipId?: string;
    customerId?: string;

    createdAt: Date;
}
