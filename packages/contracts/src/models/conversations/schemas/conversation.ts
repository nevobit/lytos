import { type Base } from '../../../common';

export interface Conversation extends Base {
    workspaceId: string;
    ticketId: string;

    type: "main" | "side" | "widget";

    channel: "email" | "widget" | "webchat" | "whatsapp" | "internal";

    participants: {
        customers: string[];
        agents: string[];
        visitorId?: string;
    };

    subject?: string;

    status: "open" | "closed";
}
