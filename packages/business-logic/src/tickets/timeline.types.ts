import type { Conversation } from "@lytos/contracts";

export type TimelineItemType = "message" | "note" | "event";
export type TimelineActorType = "agent" | "customer" | "system";

export interface TimelineItem {
    id: string;
    type: TimelineItemType;
    createdAt: Date | string;
    actor: {
        type: TimelineActorType;
        id?: string;
        name: string;
    };
    channel?: Conversation["channel"];
    body?: {
        text?: string;
        html?: string;
    };
    event?: {
        code: string;
        title: string;
        metadata?: Record<string, unknown>;
    };
}

export interface TimelineCursor {
    createdAt: string;
    id: string;
}

export interface GetTicketTimelineParams {
    workspaceId: string;
    ticketId: string;
    includeInternal: boolean;
    limit?: number;
    cursor?: TimelineCursor;
}

export interface GetTicketTimelineResult {
    items: TimelineItem[];
    pageInfo: {
        hasMore: boolean;
        nextCursor: TimelineCursor | null;
    };
}
