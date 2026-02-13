import { type Base } from '../../../common';

export type MessageKind = "reply" | "note" | "system";
export type MessageVisibility = "public" | "internal";
export type MessageDirection = "inbound" | "outbound" | "internal";
export type MessageChannel =
    | "email"
    | "widget"
    | "webchat"
    | "whatsapp"
    | "internal";

export type AuthorType = "agent" | "customer" | "visitor" | "system";

export type DeliveryStatus = "queued" | "sent" | "delivered" | "failed";

export interface Message extends Base {
    workspaceId: string;
    ticketId: string;
    conversationId?: string;

    kind: MessageKind;
    visibility: MessageVisibility;
    direction: MessageDirection;
    channel: MessageChannel;

    author: {
        type: AuthorType;
        membershipId?: string;
        customerId?: string;
        visitorId?: string;
    };

    body: {
        text: string;
        html?: string;
    };

    attachments?: {
        attachmentId: string;
        name: string;
    }[];

    emailMeta?: {
        messageId?: string;
        inReplyTo?: string;
        references?: string[];
        subject?: string;
        from?: string;
        to?: string[];
    };

    delivery?: {
        status: DeliveryStatus;
        provider?: string;
        providerMessageId?: string;
        error?: {
            code?: string;
            message?: string;
        };
        sentAt?: Date;
        deliveredAt?: Date;
    };

    createdAt: Date;
}
